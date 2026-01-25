package com.security.bug.rmi.server.service;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

/**
 */
public class HelloServiceImpl extends UnicastRemoteObject implements HelloService {

  public HelloServiceImpl() throws RemoteException {
  }

  @Override
  public String sayHello() {
    System.out.println("hello!");
    return "hello!";
  }
}