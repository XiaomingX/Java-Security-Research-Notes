# openrasp-test Usage Guide

`openrasp-test` is a demonstration of a Java RASP (Runtime Application Self-Protection) agent. It intercepts class loading to inject security checks.

## Prerequisites

- Java 8 or higher
- Maven 3.x

## Building

To build the project and generate the agent JAR:

```bash
mvn clean package
```

The resulting agent JAR will be located at `target/javaopenrasp.jar`.

## Running

You can attach the agent to any Java application using the `-javaagent` flag.

### Basic Usage

```bash
java -javaagent:target/javaopenrasp.jar -jar your-application.jar
```

### Example: Spring Boot

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-javaagent:/path/to/openrasp-test/target/javaopenrasp.jar"
```

## Configuration

The agent configuration is located in `src/main/resources/main.config`. It defines which modules are enabled and their blacklists/whitelists.

Example configuration for ProcessBuilder interception:

```json
{
    "moudleName": "java/lang/ProcessBuilder",
    "loadClass": "com.security.rasp.visitors.rce.ProcessBuilderVisitor",
    "mode": "log", 
    "blackList": ["calc", "rm", "wget"]
}
```

## Project Structure

- `com.security.rasp.Agent`: The entry point (Premain-Class).
- `com.security.rasp.ClassTransformer`: Handles bytecode transformation.
- `com.security.rasp.visitors`: Contains ASM visitors that inject security logic.
- `com.security.rasp.config`: Handles configuration loading (using Gson).

## Extending

To add a new protection module:

1.  Create a new `ClassVisitor` in `com.security.rasp.visitors`.
2.  Add a configuration entry in `src/main/resources/main.config` pointing to your new visitor class.
