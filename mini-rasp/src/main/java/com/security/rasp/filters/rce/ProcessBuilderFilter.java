package com.security.rasp.filters.rce;

import org.apache.commons.lang3.StringUtils;
import com.security.rasp.config.Config;
import com.security.rasp.filters.SecurityFilterI;
import com.security.rasp.util.Console;
import com.security.rasp.util.StackTrace;

import java.util.List;

/**
 * 
 */
public class ProcessBuilderFilter implements SecurityFilterI {

    @Override
    public boolean filter(Object forCheck) {
        String moudleName = "java/lang/ProcessBuilder";
        List<String> commandList = (List<String>) forCheck;
        String command = StringUtils.join(commandList, " ").trim().toLowerCase();
        Console.log("prepare to exec command:" + command);
        String mode = (String) Config.moudleMap.get(moudleName).get("mode");
        switch (mode) {
            case "block":
                Console.log("block" + command);
                return false;
            case "white":
                if (Config.isWhite(moudleName, command)) {
                    Console.log("exec command:" + command);
                    return true;
                }
                Console.log("block" + command);
                return false;
            case "black":
                if (Config.isBlack(moudleName, command)) {
                    Console.log("block command exec" + command);
                    return false;
                }
                Console.log("exec command:" + command);
                return true;
            case "log":
            default:
                Console.log("exc commond" + command);
                Console.log("log stack trace:\r\n" + StackTrace.getStackTrace());
                return true;
        }
    }

}
