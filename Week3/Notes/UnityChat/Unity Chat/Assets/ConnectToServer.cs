using System.Collections;
using System;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using TMPro;
using System.Text;
using System.Text.RegularExpressions;
using UnityEngine.SocialPlatforms;

public class ConnectToServer : MonoBehaviour
{

    public string host = "127.0.0.1";
    public ushort port = 321;

    public TextMeshProUGUI chatDisplay;
    public TMP_InputField inputDisplay;

    TcpClient socketToServer = new TcpClient();

    string buffer = "";


    static class Packet {
        public static string BuildChat(string message) {
            return $"CHAT\t{message}\n";
        }

        public static string BuildDM(string recipient, string message) {
            return $"DMSG\t{recipient}\t{message}\n";
        }

        public static string BuildName(string newname) {
            return $"NAME\t{newname}\n";
        }

        public static string BuildListRequest() {
            return "LIST\n";
        }

    }


    void Start()
    {
        DoConnect();
    }

    async void DoConnect()
    {

        try
        {
            await socketToServer.ConnectAsync(host, port);
            AddMessageToChatDisplay("Server connection sucessful...");

        }
        catch (Exception e)
        {
            AddMessageToChatDisplay($"ERROR: {e.Message}");
            return; //we don't want to set up our loop if we do not connect
        }

        while (true) {

            byte[] data = new byte[4096];
            int bytesRead = await socketToServer.GetStream().ReadAsync(data, 0, data.Length);


            //add data to buffer
            buffer += Encoding.ASCII.GetString(data).Substring(0,bytesRead);

            //split data into packets
            string[] packets = buffer.Split('\n');

            // set the buffer tot he last incomplete packet
            buffer = packets[packets.Length - 1];

            for (int i = 0; i < packets.Length-1; i++) {
                HandlePacket(packets[i]);

            }



            /*
            byte[] data = new byte[socketToServer.Available];

           

            if(data.Length > 0) AddMessageToChatDisplay(Encoding.ASCII.GetString(data));
            */
        }


    }

    private void HandlePacket(string packet) {
        string[] parts =  packet.Split('\t');

        switch (parts[0]) {
            case "CHAT":
                string user = parts[1];
                string messaage = parts[2];

                AddMessageToChatDisplay($"{user}: {messaage}");

                break;
            case "LIST":

                string users = "";

                for (int i = 1; i < parts.Length; i++) {
                    if (i > 1) users += ", ";
                    users += parts[i];
                
                }

                AddMessageToChatDisplay(users);

                break;

        
        
        
        }

    }


    public void AddMessageToChatDisplay(string txt) {
        
        chatDisplay.text += $"{txt}\n";
    
    
    }

    public void UserDonEditingMessage(string txt) {
        if (new Regex(@"^\\name ", RegexOptions.IgnoreCase).IsMatch(txt))//user wants to change their name
        {
            string name = txt.Substring(6);
            SendPacketToServer(Packet.BuildName(name));
        } 
        else if((new Regex(@"^\\list$", RegexOptions.IgnoreCase).IsMatch(txt)))
        {

            //string name = txt.Substring(6);
            SendPacketToServer(Packet.BuildListRequest());

        }
        else if (!new Regex(@"^(\s|\t)*$").IsMatch(txt))
        {

            SendPacketToServer(Packet.BuildChat(txt));

        }


        inputDisplay.text = "";
        inputDisplay.Select();
        inputDisplay.ActivateInputField();
    }

    private void SendPacketToServer(string Packet)
    {
        
        if (socketToServer.Connected)
        {
            byte[] data = Encoding.ASCII.GetBytes(Packet);
            socketToServer.GetStream().Write(data, 0, data.Length);
        }
    }
}
    


