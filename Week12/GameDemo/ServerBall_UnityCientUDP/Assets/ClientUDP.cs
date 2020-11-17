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
            case "BALL":
                if (packet.Length < 20) return;

                uint packetNum = packet.ReadUInt32BE(4);

                if (packetNum < ackBallUpdate) {
                    return;
                }

                ackBallUpdate = packetNum;

                print(ackBallUpdate);

                float x = packet.ReadSingleBE(8);
                float y = packet.ReadSingleBE(12);
                float z = packet.ReadSingleBE(16);


                Ball.position = new Vector3(x, y, z);

                break;
        
        
        
        
        
        }

        
    }

    async public void SendPacket(Buffer packet) {
        if (sock == null) return;

        //Buffer packet = Buffer.From("Hello world!");
        await sock.SendAsync(packet.bytes, packet.bytes.Length, "127.0.0.1", 320);
    }

    void Update()
    {
        
    }
}
