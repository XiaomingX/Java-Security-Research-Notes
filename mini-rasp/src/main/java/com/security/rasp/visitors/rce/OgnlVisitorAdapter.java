package com.security.rasp.visitors.rce;

import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.commons.AdviceAdapter;

/**
 * 
 */
public class OgnlVisitorAdapter extends AdviceAdapter {
    public OgnlVisitorAdapter(MethodVisitor mv, int access, String name, String desc) {
        super(Opcodes.ASM9, mv, access, name, desc);
    }

    @Override
    protected void onMethodEnter() {
        // Load the expression (assuming it's the first argument for the hooked method)
        mv.visitVarInsn(ALOAD, 0);

        // Call HookHandler.checkOgnl(Object expression)
        mv.visitMethodInsn(INVOKESTATIC, "com/security/rasp/HookHandler", "checkOgnl", "(Ljava/lang/Object;)Z", false);

        Label allowedLabel = new Label();
        mv.visitJumpInsn(IFNE, allowedLabel);

        // Block if check fails
        mv.visitTypeInsn(NEW, "ognl/OgnlException");
        mv.visitInsn(DUP);
        mv.visitLdcInsn("OGNL expression blocked by Mini-RASP policy");
        mv.visitMethodInsn(INVOKESPECIAL, "ognl/OgnlException", "<init>", "(Ljava/lang/String;)V", false);
        mv.visitInsn(ATHROW);

        mv.visitLabel(allowedLabel);
    }

    @Override
    public void visitMaxs(int maxStack, int maxLocals) {
        super.visitMaxs(maxStack, maxLocals);
    }
}

