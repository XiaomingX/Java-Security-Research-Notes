package com.security.bug.feature;

import java.util.regex.Pattern;
import org.ho.yaml.Yaml;

/**
 */
public class JYAML {

  static Pattern pattern = Pattern.compile("![\\w\\.$]+?(( +?\\{\\})|( *?\\n+?))");

  public static void main(String[] args) {
    printAndMatch("--- !com.security.bug.feature.JYAML$A\n\n xx:threedr3am");
    printAndMatch("--- !com.security.bug.feature.JYAML$A\n xx:threedr3am\n");
    printAndMatch("--- !com.security.bug.feature.JYAML$A\n xx: threedr3am");
    printAndMatch("--- !com.security.bug.feature.JYAML$A\n xx: threedr3am\n");
    printAndMatch("--- !com.security.bug.feature.JYAML$A     \n xx:     threedr3am\n");
    printAndMatch("--- !com.security.bug.feature.JYAML$A {}");
    printAndMatch("--- !com.security.bug.feature.JYAML$A    {}");

    printAndMatch("foo !com.security.bug.feature.JYAML$A xx:threedr3am");
    printAndMatch("foo !com.security.bug.feature.JYAML$A xx:threedr3am\n");
    printAndMatch("foo !com.security.bug.feature.JYAML$A xx:   threedr3am\n");
    printAndMatch("foo !com.security.bug.feature.JYAML$A     xx:threedr3am    ");
    printAndMatch("foo !com.security.bug.feature.JYAML$A     xx:   threedr3am    ");
    printAndMatch("foo !com.security.bug.feature.JYAML$A     xx:\"threedr3am\"    ");
    printAndMatch("foo !com.security.bug.feature.JYAML$A     \"xx\":\"threedr3am\"    ");
    printAndMatch("foo !com.security.bug.feature.JYAML$A     'xx':\"threedr3am\"    ");
    printAndMatch("foo !com.security.bug.feature.JYAML$A     'xx':    \"threedr3am\"    ");
    printAndMatch("foo !com.security.bug.feature.JYAML$A     'xx':'threedr3am'    ");
    printAndMatch("foo !com.security.bug.feature.JYAML$A     'xx':   'threedr3am'    ");

    Yaml yaml = new Yaml();
    printAndMatch(yaml.dump(new JYAML()));
    printAndMatch(yaml.dump(new A("threedr3am")));

    //todo JYAML不支持参数构造，因此，gadget只能靠setter触发
    yaml.load("--- !com.security.bug.feature.JYAML$A\n\n xx:threedr3am");
    yaml.load("--- !com.security.bug.feature.JYAML$A\n xx:threedr3am\n");
    yaml.load("---axaaxa !com.security.bug.feature.JYAML$A\n xx: threedr3am");
    yaml.load("--- !com.security.bug.feature.JYAML$A\n xx: threedr3am\n");
    yaml.load("--- !com.security.bug.feature.JYAML$A     \n xx:     threedr3am\n");
    yaml.load("--- !com.security.bug.feature.JYAML$A {}");
    yaml.load("--- !com.security.bug.feature.JYAML$A    {}");

    yaml.load("foo !com.security.bug.feature.JYAML$A xx:threedr3am");
    yaml.load("xxxx !com.security.bug.feature.JYAML$A xx:threedr3am\n");
    yaml.load("foo !com.security.bug.feature.JYAML$A xx:   threedr3am\n");
    yaml.load("foo !com.security.bug.feature.JYAML$A     xx:threedr3am    ");
    yaml.load("foo !com.security.bug.feature.JYAML$A     xx:   threedr3am    ");
    yaml.load("foo !com.security.bug.feature.JYAML$A     xx:\"threedr3am\"    ");
    yaml.load("foo !com.security.bug.feature.JYAML$A     \"xx\":\"threedr3am\"    ");
    yaml.load("foo !com.security.bug.feature.JYAML$A     'xx':\"threedr3am\"    ");
    yaml.load("foo !com.security.bug.feature.JYAML$A     'xx':    \"threedr3am\"    ");
    yaml.load("foo !com.security.bug.feature.JYAML$A     'xx':'threedr3am'    ");
    yaml.load("foo !com.security.bug.feature.JYAML$A     'xx':   'threedr3am'    ");

  }

  private static void printAndMatch(String payload) {
    System.out.println(payload);
    System.out.println(pattern.matcher(payload).find());
    System.out.println("----------------------------------------------------------------------");
  }

  static class A {
    public String xx;

    public A() {
    }

    public A(String xx) {
      System.out.println("call A(String xx)");
      this.xx = xx;
    }

    public String getXx() {
      return xx;
    }

    public void setXx(String xx) {
      this.xx = xx;
    }
  }

}
