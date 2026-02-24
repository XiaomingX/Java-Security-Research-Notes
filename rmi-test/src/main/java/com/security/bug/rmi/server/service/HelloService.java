package com.security.bug.rmi.server.service;

import java.rmi.Remote;
import java.rmi.RemoteException;

/**
 */
public interface HelloService extends Remote {

  String sayHello() throws RemoteException;
}
