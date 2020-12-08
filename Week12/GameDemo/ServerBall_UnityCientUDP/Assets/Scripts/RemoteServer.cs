using System.Collections;
using System.Collections.Generic;
using System.Net;
using UnityEngine;

public class RemoteServer 
{
    public IPEndPoint endPoint;
    public string servername;
    float timestamp;//remove servers if they have been silent for too long

    public RemoteServer(IPEndPoint ep, string name) {

        endPoint = ep;
        servername = name;

    }

    /*
    public bool IsSameServer(IPEndPoint ep) {
        return endPoint.Equals(ep);
    }*/

    public override bool Equals(object obj)
    {
        RemoteServer other = (RemoteServer)obj;
        if (other == null) return false;
        return (other.endPoint.Equals(endPoint));
    }

}
