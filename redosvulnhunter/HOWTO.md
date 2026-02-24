# How to Use RedosVulnHunter

RedosVulnHunter is a powerful tool for detecting Regular Expression Denial-of-Service (ReDoS) vulnerabilities using a hybrid approach: **Static Analysis** to find dangerous patterns and **Dynamic Validation** to verify the vulnerability with actual attack strings.

## Quick Start Guide

### 1. Installation
Ensure you have JDK 1.8 and Maven installed.
```bash
mvn clean package
```
The executable JAR will be located in `target/RedosVulnHunter-0.0.1-jar-with-dependencies.jar`.

### 2. Basic Usage Modes

#### A. Single Regex Test
Test a single regular expression directly from the command line:
```bash
java -jar redos-vuln-hunter.jar "your_regex_here"
```

#### B. Batch Processing
Place your regular expressions in a file inside a directory named `data` (one regex per line).
```bash
java -jar redos-vuln-hunter.jar
```
Results will be generated in the `result` directory.

#### C. Vulnerability Validation
Validate existing attack payloads (JSON format):
```bash
java -jar redos-vuln-hunter.jar attack_list.txt results.txt
```

## Understanding the Core Logic

### How it Works (Hybrid Analysis)
1. **Static Analysis**: The `Analyzer` parses the regex into a tree of `Node` objects. it looks for "Vulnerability Structures" like nested quantifiers (`(a+)+`) or overlapping loops.
2. **Path Generation**: The `DirectedEngine` explores the regex state machine to find a path that leads to the vulnerable structure.
3. **Attack String Generation**: The `Driver` and `MatchGenerator` work together to craft a `prefix`, a `pump` (the repeating part), and a `suffix` that causes catastrophic backtracking.

### Vulnerability Types Detected
- **Polynomial**: Backtracking increases polynomially with input length.
- **Exponential**: Backtracking increases exponentially (the most dangerous type).

## How to Extend RedosVulnHunter

### Adding New Vulnerability Patterns
The analysis logic is primarily contained in `redos.regex.Analyzer`. To add a new pattern:
1. Identify the structural properties of the new ReDoS pattern.
2. Extend the `doStaticAnalysis()` method in `Analyzer` to detect these properties.
3. Define how the `pump` should be generated for this specific structure.

### Improving Attack Payloads
If you want to generate more effective payloads:
1. Modify the `Driver` class to support different character sets or encoding schemes.
2. Adjust the `max_length` and `threshold` in `RedosTester` to fine-tune the validation process.

## Best Practices
- **Escaping**: Always double-escape backslashes when passing regex as a command-line argument.
- **Timeouts**: The tool uses a `threshold` to stop analysis if it takes too long. Adjust this based on your performance requirements.
- **Environment**: For best results, use the same JVM version as your target application, as regex engine implementations can vary.
