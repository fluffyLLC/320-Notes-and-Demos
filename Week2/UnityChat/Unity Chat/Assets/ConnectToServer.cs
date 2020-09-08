using System.Collections;
using System;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using TMPro;
using System.Text;

public class ConnectToServer : MonoBehaviour
{

    public string host = "127.0.0.1";
    public ushort port = 321;

    public TextMeshProUGUI chatDisplay;
    public TMP_InputField inputDisplay;

    TcpClient socketToServer = new TcpClient();


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

            byte[] data = new byte[socketToServer.Available];

            await socketToServer.GetStream().ReadAsync(data, 0, data.Length);

            if(data.Length > 0) AddMessageToChatDisplay(Encoding.ASCII.GetString(data));

        }


    }

    public void AddMessageToChatDisplay(string txt) {
        
        chatDisplay.text += $"{txt}\n";
    
    
    }

    public void UserDonEditingMessage(string txt) {

        SendMessageToServer(txt);
        inputDisplay.text = "";
        inputDisplay.Select();
        inputDisplay.ActivateInputField();
    }

    private void SendMessageToServer(string txt)
    {
        if (socketToServer.Connected)
        {
            byte[] data = Encoding.ASCII.GetBytes(txt);
            socketToServer.GetStream().Write(data, 0, data.Length);
        }
    }
}
    


