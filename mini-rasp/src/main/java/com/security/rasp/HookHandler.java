package com.security.rasp;

import com.security.rasp.config.Config;
import com.security.rasp.filters.rce.ProcessBuilderFilter;
import com.security.rasp.filters.rce.OgnlFilter;
import com.security.rasp.filters.rce.DeserializationFilter;
import com.security.rasp.util.Console;

import java.util.List;

/**
 * Centralized hook entry point for the RASP agent.
 * Instrumented bytecode will call these static methods.
 */
public class HookHandler {

    private static final ProcessBuilderFilter PROCESS_BUILDER_FILTER = new ProcessBuilderFilter();
    private static final OgnlFilter OGNL_FILTER = new OgnlFilter();
    private static final DeserializationFilter DESERIALIZATION_FILTER = new DeserializationFilter();

    /**
     * Entry point for ProcessBuilder.start()
     * @param command The command list from ProcessBuilder
     * @return true if allowed, false if blocked
     */
    public static boolean checkProcessBuilder(Object command) {
        try {
            return PROCESS_BUILDER_FILTER.filter(command);
        } catch (Exception e) {
            Console.log("Error in ProcessBuilder filter: " + e.getMessage());
            return true; // Fail open in case of RASP error for stability
        }
    }

    /**
     * Entry point for OGNL expression evaluation
     * @param expression The OGNL expression
     * @return true if allowed, false if blocked
     */
    public static boolean checkOgnl(Object expression) {
        try {
            return OGNL_FILTER.filter(expression);
        } catch (Exception e) {
            Console.log("Error in OGNL filter: " + e.getMessage());
            return true;
        }
    }

    /**
     * Entry point for Deserialization checks
     * @param className Class name being deserialized
     * @return true if allowed, false if blocked
     */
    public static boolean checkDeserialization(Object className) {
        try {
            return DESERIALIZATION_FILTER.filter(className);
        } catch (Exception e) {
            Console.log("Error in Deserialization filter: " + e.getMessage());
            return true;
        }
    }
}
