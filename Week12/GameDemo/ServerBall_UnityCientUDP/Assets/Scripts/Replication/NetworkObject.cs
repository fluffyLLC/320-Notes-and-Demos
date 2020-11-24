using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NetworkObject : MonoBehaviour
{
    public int networkID;
    public static string classID = "NWOB";

    private static Dictionary<int, NetworkObject> currentObjects = new Dictionary<int, NetworkObject>();

    static public void AddObject(NetworkObject obj) {
       
        if(!currentObjects.ContainsKey(obj.networkID))
          //  print(obj.networkID);
        currentObjects.Add(obj.networkID, obj);
    
    }

    public static void RemoveObject(NetworkObject obj) {
        RemoveObject(obj.networkID);
    }
    public static void RemoveObject(int networkID) {
        if (currentObjects.ContainsKey(networkID)) 
            currentObjects.Remove(networkID);
    }

    public static NetworkObject GetObjectByNetworkID(int networkID) {
        
        if (!currentObjects.ContainsKey(networkID)) return null;
        //print("contains key");
        return  currentObjects[networkID];

    }


    public virtual void Serialize() { 
        //TODO: turn object into a byte array
    }

    public virtual int Deserialize(Buffer packet) {

        networkID = packet.ReadUInt8(0);

        float px = packet.ReadSingleBE(1);
        float py = packet.ReadSingleBE(5);
        float pz = packet.ReadSingleBE(9);

        float rx = packet.ReadSingleBE(13);
        float ry = packet.ReadSingleBE(17);
        float rz = packet.ReadSingleBE(21);

        float sx = packet.ReadSingleBE(25);
        float sy = packet.ReadSingleBE(29);
        float sz = packet.ReadSingleBE(33);

        transform.position = new Vector3(px, py, pz);
        transform.rotation = Quaternion.Euler(rx, ry, rz);
        transform.localScale = new Vector3(sx, sy, sz);

        //TODO: convert from a byte array
        return 37;
    }


    
}
