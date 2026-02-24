package com.security.rasp.filters.rce;

import com.security.rasp.config.Config;
import com.security.rasp.filters.SecurityFilterI;
import com.security.rasp.util.Console;
import com.security.rasp.util.StackTrace;

/**
 * 
 */
public class OgnlFilter implements SecurityFilterI {

    @Override
    public boolean filter(Object forCheck) {
        String moudleName = "ognl/Ognl";
        String ognlExpression = (String) forCheck;
        Console.log("[Mini-RASP] prepare to parse ognlExpression:" + ognlExpression);
        String mode = (String) Config.moudleMap.get(moudleName).get("mode");
        switch (mode) {
            case "block":
                Console.log("[Mini-RASP] block OGNL: " + ognlExpression);
                return false;
            case "black":
                if (Config.isBlack(moudleName, ognlExpression)) {
                    Console.log("[Mini-RASP] blocked blacklisted OGNL: " + ognlExpression);
                    return false;
                }
                return true;
            case "log":
            default:
                Console.log("[Mini-RASP] OGNL observed: " + ognlExpression);
                // Heavy stack trace only on log/detect mode
                Console.log("[Mini-RASP] Stack trace:\n" + StackTrace.getStackTrace());
                return true;
        }
    }

}
