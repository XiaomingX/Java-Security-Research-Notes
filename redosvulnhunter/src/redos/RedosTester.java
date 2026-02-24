package redos;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Scanner;

import com.alibaba.fastjson.JSONObject;

import redos.regex.Analyzer;
import redos.regex.Matcher;
import redos.regex.Pattern;

public class RedosTester {

    private static final int DEFAULT_MAX_LENGTH = 128;
    private static final double DEFAULT_THRESHOLD = 1e8;

    public static void main(String[] args) throws Exception {
        if (args.length == 0) {
            testDataset();
        } else if (args.length == 1) {
            testSingleRegex(args[0]);
        } else if (args.length == 2) {
            vulValidation(args[0], args[1]);
        } else {
            printUsage();
        }
    }

    private static void printUsage() {
        System.out.println("Usage:");
        System.out.println("  java -jar RedosVulnHunter.jar <regex>              # Test single regex");
        System.out.println("  java -jar RedosVulnHunter.jar                      # Test dataset in 'data/'");
        System.out.println("  java -jar RedosVulnHunter.jar <input> <output>     # Validate attack payloads");
    }

    public static void testSingleRegex(String regex) {
        System.out.println("[*] Testing single regex: " + regex);
        try {
            Pattern p = Pattern.compile(regex);
            Analyzer analyzer = new Analyzer(p, DEFAULT_MAX_LENGTH);
            analyzer.doStaticAnalysis();
            
            try (BufferedWriter log = new BufferedWriter(new OutputStreamWriter(System.out))) {
                analyzer.doDynamicAnalysis(log, -1, 1e5);
                log.flush();
            }

            if (!analyzer.isVulnerable()) {
                System.out.println("[-] No vulnerability detected.");
            }
        } catch (Exception e) {
            System.err.println("[!] Error testing regex: " + e.getMessage());
        }
    }

    public static void vulValidation(String inputPath, String outputPath) throws IOException {
        File inputFile = new File(inputPath);
        if (!inputFile.exists()) {
            System.err.println("[!] Input file not found: " + inputPath);
            return;
        }

        System.out.println("[*] Validating vulnerabilities from: " + inputPath);
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(inputFile)));
             BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {

            String line;
            while ((line = reader.readLine()) != null) {
                processValidationLine(line, writer);
            }
        }
        System.out.println("[+] Validation complete. Results saved to: " + outputPath);
    }

    private static void processValidationLine(String line, BufferedWriter writer) {
        try {
            JSONObject obj = JSONObject.parseObject(line);
            String regex = obj.getString("regex");
            String prefix = obj.getString("prefix");
            String pump = obj.getString("pump");
            String suffix = obj.getString("suffix");

            String attackString = generateAttackString(prefix, pump, suffix, DEFAULT_MAX_LENGTH);
            
            System.out.println("[*] Validating: " + regex);
            Pattern p = Pattern.compile(regex);
            Matcher m = p.matcher(attackString, new Trace(DEFAULT_THRESHOLD, false));
            Trace t = m.find();

            if (t.getMatchSteps() > 1e5) {
                writer.write(regex + "\n");
                System.out.println("[!] VULNERABLE: steps=" + t.getMatchSteps());
            }
        } catch (Exception e) {
            System.err.println("[!] Failed to process line: " + e.getMessage());
        }
    }

    private static String generateAttackString(String prefix, String pump, String suffix, int maxLength) {
        int repeatCnt = (maxLength - prefix.length() - suffix.length()) / pump.length();
        if (repeatCnt < 1) {
            String combined = prefix + suffix;
            return combined.length() > maxLength ? combined.substring(0, maxLength) : combined;
        }
        
        StringBuilder sb = new StringBuilder(prefix);
        for (int i = 0; i < repeatCnt; i++) {
            sb.append(pump);
        }
        sb.append(suffix);
        return sb.toString();
    }

    public static void testDataset() throws IOException {
        File dataDir = new File("data");
        if (!dataDir.exists() || !dataDir.isDirectory()) {
            System.err.println("[!] 'data/' directory not found.");
            return;
        }

        File[] files = dataDir.listFiles();
        if (files == null) return;

        for (File file : files) {
            if (file.isFile()) {
                processDatasetFile(file);
            }
        }
        System.out.println("[+] Dataset testing finished.");
    }

    private static void processDatasetFile(File file) throws IOException {
        String outputName = "result/vul-" + file.getName();
        new File("result").mkdirs();
        
        System.out.println("[*] Processing file: " + file.getName());
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
             BufferedWriter writer = new BufferedWriter(new FileWriter(outputName))) {

            String regex;
            int count = 0;
            while ((regex = reader.readLine()) != null) {
                testAndLogRegex(regex, count++, writer);
            }
        }
    }

    private static void testAndLogRegex(String regex, int index, BufferedWriter writer) {
        try {
            Pattern p = Pattern.compile(regex);
            Analyzer analyzer = new Analyzer(p, DEFAULT_MAX_LENGTH);
            analyzer.doStaticAnalysis();
            analyzer.doDynamicAnalysis(writer, index, 1e5);
        } catch (Exception e) {
            // Ignore syntax errors in datasets
        }
    }
}
