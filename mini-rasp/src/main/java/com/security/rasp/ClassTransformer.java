package com.security.rasp;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import com.security.rasp.config.Config;
import com.security.rasp.util.Reflections;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.lang.reflect.InvocationTargetException;
import java.security.ProtectionDomain;

/**
 * 
 */
public class ClassTransformer implements ClassFileTransformer {

    @Override
    public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {
        
        if (className == null) return classfileBuffer;

        // Use a more standard RASP approach: match class names and apply visitors
        if (Config.moudleMap.containsKey(className)) {
            try {
                ClassReader reader = new ClassReader(classfileBuffer);
                ClassWriter writer = new ClassWriter(reader, ClassWriter.COMPUTE_FRAMES | ClassWriter.COMPUTE_MAXS);
                
                ClassVisitor visitor = createVisitor(className, writer);
                if (visitor != null) {
                    reader.accept(visitor, ClassReader.EXPAND_FRAMES);
                    return writer.toByteArray();
                }
            } catch (Throwable t) {
                // Ensure Agent never crashes the target application
                System.err.println("[Mini-RASP] Critical error transforming class " + className + ": " + t.getMessage());
                t.printStackTrace();
            }
        }
        return classfileBuffer;
    }

    private ClassVisitor createVisitor(String className, ClassWriter writer) {
        // Direct mapping is safer and faster than reflection in a RASP agent
        switch (className) {
            case "java/lang/ProcessBuilder":
                return new com.security.rasp.visitors.rce.ProcessBuilderVisitor(writer, className);
            case "ognl/Ognl":
                return new com.security.rasp.visitors.rce.OgnlVisitor(writer, className);
            case "java/io/ObjectInputStream":
                return new com.security.rasp.visitors.rce.DeserializationVisitor(writer, className);
            default:
                return null;
        }
    }
}
