package xxx.javaopenrasp;

import xxx.javaopenrasp.config.Config;
import xxx.javaopenrasp.util.Console;

import java.lang.instrument.Instrumentation;
import java.lang.instrument.UnmodifiableClassException;

/**
 * 
 */
public class Agent {

    public static void premain(String agentArgs, Instrumentation inst)
            throws ClassNotFoundException, UnmodifiableClassException {
        Console.log("init");
        init();
        inst.addTransformer(new ClassTransformer());
    }

    private static boolean init() {
        Config.initConfig();
        return true;
    }
} 
