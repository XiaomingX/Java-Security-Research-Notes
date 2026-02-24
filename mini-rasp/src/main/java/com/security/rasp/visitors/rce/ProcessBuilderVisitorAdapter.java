package com.security.rasp.visitors.rce;

import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.commons.AdviceAdapter;

/**
 * 
 */
public class ProcessBuilderVisitorAdapter extends AdviceAdapter {
    public ProcessBuilderVisitorAdapter(MethodVisitor mv, int access, String name, String desc) {
        super(Opcodes.ASM9, mv, access, name, desc);
    }

    @Override
    protected void onMethodEnter() {
        // Load the 'command' field from 'this' (ProcessBuilder)
        mv.visitVarInsn(ALOAD, 0);
        mv.visitFieldInsn(GETFIELD, "java/lang/ProcessBuilder", "command", "Ljava/util/List;");

        // Call HookHandler.checkProcessBuilder(Object command)
        mv.visitMethodInsn(INVOKESTATIC, "com/security/rasp/HookHandler", "checkProcessBuilder", "(Ljava/lang/Object;)Z", false);

        Label allowedLabel = new Label();
        // If the result is true (1), jump to allowedLabel
        mv.visitJumpInsn(IFNE, allowedLabel);

        // Otherwise, throw SecurityException or IOException
        mv.visitTypeInsn(NEW, "java/io/IOException");
        mv.visitInsn(DUP);
        mv.visitLdcInsn("Execution blocked by Mini-RASP policy");
        mv.visitMethodInsn(INVOKESPECIAL, "java/io/IOException", "<init>", "(Ljava/lang/String;)V", false);
        mv.visitInsn(ATHROW);

        mv.visitLabel(allowedLabel);
    }

    @Override
    public void visitMaxs(int maxStack, int maxLocals) {
        super.visitMaxs(maxStack, maxLocals);
    }
}

