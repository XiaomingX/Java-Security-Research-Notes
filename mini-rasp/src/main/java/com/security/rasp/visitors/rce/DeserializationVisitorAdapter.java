package com.security.rasp.visitors.rce;

import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.commons.AdviceAdapter;

/**
 * DeserializationVisitorAdapter class
 */
public class DeserializationVisitorAdapter extends AdviceAdapter {

    public DeserializationVisitorAdapter(MethodVisitor mv, int access, String name, String desc) {
        super(Opcodes.ASM9, mv, access, name, desc);
    }

    @Override
    protected void onMethodEnter() {
        // Load the class descriptor (assuming it's the first argument)
        mv.visitVarInsn(ALOAD, 1);

        // Call HookHandler.checkDeserialization(Object className)
        mv.visitMethodInsn(INVOKESTATIC, "com/security/rasp/HookHandler", "checkDeserialization", "(Ljava/lang/Object;)Z", false);

        Label allowedLabel = new Label();
        mv.visitJumpInsn(IFNE, allowedLabel);

        // Block if check fails
        mv.visitTypeInsn(NEW, "java/io/IOException");
        mv.visitInsn(DUP);
        mv.visitLdcInsn("Deserialization of blocked class by Mini-RASP policy");
        mv.visitMethodInsn(INVOKESPECIAL, "java/io/IOException", "<init>", "(Ljava/lang/String;)V", false);
        mv.visitInsn(ATHROW);

        mv.visitLabel(allowedLabel);
    }

    @Override
    public void visitMaxs(int maxStack, int maxLocals) {
        super.visitMaxs(maxStack, maxLocals);
    }
}
