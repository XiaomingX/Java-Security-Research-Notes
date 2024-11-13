package xxx.javaopenrasp.util;

import java.io.PrintStream;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 
 */
public class Console {

    private static PrintStream ps = System.out;

    private static SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static void log(String msg) {
        if (msg != null && !msg.equals("")) {
            ps.println("[javaopenrasp][" + df.format(new Date()) + "]:" + msg);
        }
    }
}
