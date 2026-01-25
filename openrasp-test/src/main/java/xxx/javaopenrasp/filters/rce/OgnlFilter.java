package xxx.javaopenrasp.filters.rce;

import xxx.javaopenrasp.config.Config;
import xxx.javaopenrasp.filters.SecurityFilterI;
import xxx.javaopenrasp.util.Console;
import xxx.javaopenrasp.util.StackTrace;

/**
 * 
 */
public class OgnlFilter implements SecurityFilterI {

    public static boolean staticFilter(Object forCheck) {
        String moudleName = "ognl/Ognl";
        String ognlExpression = (String) forCheck;
        Console.log("prepare to parse ognlExpression:" + ognlExpression);
        String mode = (String) Config.moudleMap.get("ognl/Ognl").get("mode");
        switch (mode) {
            case "block":
                Console.log("block" + ognlExpression);
                return false;
            case "white":
                if (Config.isWhite(moudleName, ognlExpression)) {
                    Console.log("parse ognlExpression:" + ognlExpression);
                    return true;
                }
                Console.log("block" + ognlExpression);
                return false;
            case "black":
                if (Config.isBlack(moudleName, ognlExpression)) {
                    Console.log("block parse ognlExpression" + ognlExpression);
                    return false;
                }
                Console.log("exec command:" + ognlExpression);
                return true;
            case "log":
            default:
                Console.log("parse ognlExpression" + ognlExpression);
                Console.log("log stack trace:\r\n" + StackTrace.getStackTrace());
                return true;
        }
    }

    @Override
    public boolean filter(Object forCheck) {
        return true;
    }

}
