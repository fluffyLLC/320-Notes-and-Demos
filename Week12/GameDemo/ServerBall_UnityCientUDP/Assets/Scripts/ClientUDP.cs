using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System;

public class ClientUDP : MonoBehaviour
{
    UdpClient sock = new UdpClient();
    private static ClientUDP _singleton;
    public static ClientUDP singleton{
        get {
            return _singleton;
        }

        private set { _singleton = value; }
    
    }
    //ack = agknowlage // most recent ball update packet that has been recieved
    uint ackBallUpdate = 0;

    public Transform Ball;


    void Start()
    {
        ListenForPackets();

        if (singleton != null)
        {
            Destroy(gameObject);
            

        }
        else {
            singleton = this;
            DontDestroyOnLoad(gameObject);

            ListenForPackets();

            Buffer packet = Buffer.From("JOIN");
            SendPacket(packet);


        }

        
    }

    async void ListenForPackets() {
        UdpReceiveResult res;
        while (true)
        {
            try
            {
                 res = await sock.ReceiveAsync();
            }
            catch {
                break;
            }

            Buffer packet = Buffer.From(res.Buffer);


            ProcessPacket(packet);
        }


    }

    private void ProcessPacket(Buffer packet)
    {
        print("packet recieved");
        if (packet.Length < 4) return;

        string id = packet.ReadString(0, 4);
        switch (id) {
            case "REPL":

                ProcessPacketREPL(packet);
                

                break;





        }

        
    }

    private void ProcessPacketREPL(Buffer packet)
    {
        if (packet.Length < 5) return;

        int replType = packet.ReadUInt8(4);

        if (replType != 1 && replType != 2 && replType != 3) return;

        int offset = 5;

        int loopCap = 0;
        while (offset <= packet.Length)
        {
            
            //print("offset: " + offset + "packetL: " + packet.Length); 
            if (packet.Length < offset + 5) return;
            int networkID = packet.ReadUInt8(offset + 4);
            //print("ID: "+ networkID);


            switch (replType)
            {

                case 1: // create:
                    print("REPL packet CREATE recived...");
                    string classID = packet.ReadString(offset, 4);
                    
                    NetworkObject obj = ObjectRegistry.SpawnFrom(classID);

                    if (obj == null) return;//error class ID not found
                    //print(classID);
                    offset += 4; //trim out ClassID off the beginning of packet data

                    Buffer chunk = packet.Slice(offset);
                    //print(chunk);

                    offset += obj.Deserialize(chunk);
                    NetworkObject.AddObject(obj);


                    break;
                case 2: // update:

                    
                    NetworkObject obj2 = NetworkObject.GetObjectByNetworkID(networkID);
                    
                    if (obj2 == null) return;
                    //print("update recived");

                    offset += 4; //trim out ClassID off the beginning of packet data
                    offset += obj2.Deserialize(packet.Slice(offset));
                    
                    //lookup object, using network ID

                    //update it

                    break;
                case 3: // delete:
                   
                    NetworkObject obj3 = NetworkObject.GetObjectByNetworkID(networkID);
                    if (obj3 == null) return;

                    //offset += 4;
                    NetworkObject.RemoveObject(networkID);//remove obj from list of network objects
                    Destroy(obj3.gameObject);// remove obj from game
                    //lookup object, using network ID
                    //update it

                    break;

            }

            //print("offset: " + offset + "packetL: " + packet.Length);
            //loopCap++;
            //if(loopCap > 255)break;
            break;
        }
    }

    async public void SendPacket(Buffer packet) {
        if (sock == null) return;
        if (packet == null) return;
        //Buffer packet = Buffer.From("Hello world!");
        await sock.SendAsync(packet.bytes, packet.bytes.Length, "127.0.0.1", 320);
    }

    void Update()
    {
        
    }
}
