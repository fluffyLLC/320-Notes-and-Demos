using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System;

public class ClientUDP : MonoBehaviour
{
    public string serverHOST = "127.0.0.1";
    public ushort serverPORT = 320; 


    static UdpClient sendingSocket = new UdpClient();
    static UdpClient receivingSocket = new UdpClient(321); //listen on port 321

    public List<RemoteServer> availableGameServers = new List<RemoteServer>();

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
        else
        {
            singleton = this;
            DontDestroyOnLoad(gameObject);

            ListenForPackets();

           // Buffer packet = ConnectToServer();
           // SendPacket(packet);


        }


    }

    public void ConnectToServer(string host, ushort port)
    {
        IPEndPoint ep = new IPEndPoint(IPAddress.Parse(serverHOST), serverPORT);
        sendingSocket = new UdpClient(ep.AddressFamily);
        sendingSocket.Connect(ep);

        //ListenForPackets();

        print($"attempt connect to {host}, at {port}");

        Buffer packet = Buffer.From("JOIN");
        SendPacket(packet);
        //return packet;
    }

    async void ListenForPackets() {

        //receivingSocket = new UdpClient(321);
        
        while (true)
        {
            UdpReceiveResult res;
            try
            {
                res = await receivingSocket.ReceiveAsync();

                ProcessPacket(res);
            }
            catch {
                print("FAIL");
                break;
            }

            
        }


    }

    private void ProcessPacket(UdpReceiveResult res)
    {

        Buffer packet = Buffer.From(res.Buffer);
       


        //print("packet recieved");
        if (packet.Length < 4) return;

        string id = packet.ReadString(0, 4);
        switch (id) {
            case "REPL":

                ProcessPacketREPL(packet);
                

                break;
            case "HOST":
                if (packet.Length < 7) return;

                ushort port = packet.ReadUInt16BE(4);
                ushort nameLength = packet.ReadUInt8(4);

                if (packet.Length < 7 + nameLength) return;

                string name = packet.ReadString(7, nameLength);

                AddToServerList(new RemoteServer(res.RemoteEndPoint, name));

                //availableGameServers.Add(new re)

                //available new RemoteServer


                break;

        }

        
    }


    private void AddToServerList(RemoteServer server) {
        if (!availableGameServers.Contains(server)) {
            availableGameServers.Add(server);
        
        }

       // print(availableGameServers.Count);
    
    }

    private void ProcessPacketREPL(Buffer packet)
    {
        if (packet.Length < 5) return;
       // print(packet);
        int replType = packet.ReadUInt8(4);

        if (replType != 1 && replType != 2 && replType != 3) return;
        //print("repl type" + replType);

        int offset = 5;

        //int loopCap = 0;
        while (offset <= packet.Length)
        {

            //print("offset: " + offset + "packetL: " + packet.Length); 

            //print("ID: "+ networkID);
            int networkID = 0;


            switch (replType)
            {

                case 1: // create:
                    if (packet.Length < offset + 5) return;
                    networkID = packet.ReadUInt8(offset + 4);
                    //print("REPL packet CREATE recived...");
                    string classID = packet.ReadString(offset, 4);


                    //check network ID

                    if (NetworkObject.GetObjectByNetworkID(networkID) != null) return;
                    
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
                    if (packet.Length < offset + 5) return;
                    networkID = packet.ReadUInt8(offset + 4);


                    NetworkObject obj2 = NetworkObject.GetObjectByNetworkID(networkID);
                    
                    if (obj2 == null) return;
                    //print("update recived");

                    offset += 4; //trim out ClassID off the beginning of packet data
                    offset += obj2.Deserialize(packet.Slice(offset));
                    
                    //lookup object, using network ID

                    //update it

                    break;
                case 3: // delete:
                    if (packet.Length < offset + 1) return;
                    networkID = packet.ReadUInt8(offset);

                    NetworkObject obj3 = NetworkObject.GetObjectByNetworkID(networkID);
                    if (obj3 == null) return;

                    //offset += 4;
                    NetworkObject.RemoveObject(networkID);//remove obj from list of network objects
                    Destroy(obj3.gameObject);// remove obj from game
                    //lookup object, using network ID
                    //update it

                    offset++;

                    break;

            }

            //print("offset: " + offset + "packetL: " + packet.Length);
            //loopCap++;
           // if(loopCap > 255)break;
            //break;
        }
    }

    async public void SendPacket(Buffer packet) {
        if (sendingSocket == null) return;
        if (packet == null) return;
        //Buffer packet = Buffer.From("Hello world!");
        if (!sendingSocket.Client.Connected) return;
        

        await sendingSocket.SendAsync(packet.bytes, packet.bytes.Length);

    }


    private void OnDestroy()
    {
        if (sendingSocket != null) sendingSocket.Close();
        if (receivingSocket != null) receivingSocket.Close();
    }

}
