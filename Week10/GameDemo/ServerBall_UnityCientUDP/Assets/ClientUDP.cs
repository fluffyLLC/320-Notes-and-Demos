using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System;

public class ClientUDP : MonoBehaviour
{
    UdpClient sock = new UdpClient();

    public Transform Ball;


    void Start()
    {
        ListenForPackets();

        Buffer packet = Buffer.From("JOIN");
        SendPacket(packet);
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
                if (packet.Length < 16) return;

                float x = packet.ReadSingleLE(4);
                float y = packet.ReadSingleLE(8);
                float z = packet.ReadSingleLE(12);


                Ball.position = new Vector3(x, y, z);

                break;
        
        
        
        
        
        }

        
    }

    async void SendPacket(Buffer packet) {

        //Buffer packet = Buffer.From("Hello world!");
        await sock.SendAsync(packet.bytes, packet.bytes.Length, "127.0.0.1", 320);
    }

    void Update()
    {
        
    }
}
