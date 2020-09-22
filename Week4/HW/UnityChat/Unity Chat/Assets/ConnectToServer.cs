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
using UnityEngine.UI;
using UnityEngine.UIElements;

public class ConnectToServer : MonoBehaviour
{

    public string host = "127.0.0.1";
    public ushort port = 321;




    public Dropdown NameDisplay;
    public TextMeshProUGUI chatDisplay;

    public TMP_InputField chatInputDisplay;
    public TMP_InputField iPInputDisplay;
    public TMP_InputField portInputDisplay;
    public TMP_InputField usermaneInputDisplay;

    public GameObject masterBackground;
    public GameObject usernameInputPanel;
    public GameObject portAndIPInputPanel;
    public GameObject connectingBackground;
    public GameObject conectingPanel;
    public GameObject connectedPanel;
    public GameObject connectionFailedPanel;
    public GameObject usernameAcceptingBackground;
    public GameObject usernameAcceptedPanel;
    public GameObject usernameRefusedPanel;
    


    TcpClient socketToServer = new TcpClient();

    bool listRequested = false;
    bool firstNameInput = true;

    string username;

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
       // DoConnect();
        
    }

    public async void DoConnect()
    {

        try
        {
            
            await socketToServer.ConnectAsync(host, port);
            //chatDisplay.ClearMesh();
            //AddMessageToChatDisplay("Server connection sucessful...");

        }
        catch (Exception e)
        {
            //print("retrying");
            AddMessageToChatDisplay($"ERROR: {e.Message}");
            return; //we don't want to set up our loop if we do not connect
        }

   
        portAndIPInputPanel.SetActive(false);

        chatDisplay.text = "";
        AddMessageToChatDisplay("Server connection sucessful...");
        


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

                UpdateNameDisplay(parts);

                HandleDisplayListInChat(parts);

                break;
            case "ANNC":

                AddMessageToChatDisplay($"Server: {parts[1]}");

                break;
            case "DMSG":

                user = parts[1];
                messaage = parts[2];

                AddMessageToChatDisplay($"(private) {user}: {messaage}");

                break;
            case "NBAD":

                if (firstNameInput) {
                    usernameRefusedPanel.SetActive(true);
                }
                AddMessageToChatDisplay($"Error on {username}: {parts[1]}");

                break;
            case "NOKY":

                if (firstNameInput)
                {
                    masterBackground.SetActive(false);
                    AddMessageToChatDisplay($"{username} accepted! Welcome!");
                    firstNameInput = false;
                }
                else {
                    AddMessageToChatDisplay($"{username} accepted!");
                }

                break;





        }

    }

    private void UpdateNameDisplay(string[] parts)
    {
        List<Dropdown.OptionData> userNames = new List<Dropdown.OptionData>();

        userNames.Add(new Dropdown.OptionData("All Users"));


        for (int i = 1; i < parts.Length; i++)
        {
            userNames.Add(new Dropdown.OptionData(parts[i]));

        }

        NameDisplay.ClearOptions();
        NameDisplay.AddOptions(userNames);

        NameDisplay.RefreshShownValue();
    }

    private void HandleDisplayListInChat(string[] parts)
    {
        if (listRequested)
        {
            string users = "";

            for (int i = 1; i < parts.Length; i++)
            {
                if (i > 1) users += ", ";
                users += parts[i];

            }

            AddMessageToChatDisplay(users);

            listRequested = false;
        }
    }

    public void AddMessageToChatDisplay(string txt) {
        print(txt);
        chatDisplay.text += $"{txt}\n";
    
    
    }

    public void UserDonEditingMessage(string txt) {

        if (new Regex(@"^\\name ", RegexOptions.IgnoreCase).IsMatch(txt))//user wants to change their name
        {
            string name = txt.Substring(6);
            username = name;
            SendPacketToServer(Packet.BuildName(name));
        }
        else if ((new Regex(@"^\\list$", RegexOptions.IgnoreCase).IsMatch(txt)))
        {

            //string name = txt.Substring(6);
            listRequested = true;
            SendPacketToServer(Packet.BuildListRequest());

        }
        else if (NameDisplay.value > 0 && !new Regex(@"^(\s|\t)*$").IsMatch(txt))
        {
            string recipient = NameDisplay.options[NameDisplay.value].text;

            SendPacketToServer(Packet.BuildDM(recipient,txt));
        }
        else if (!new Regex(@"^(\s|\t)*$").IsMatch(txt))
        {

            SendPacketToServer(Packet.BuildChat(txt));

        }


        ClearAndSelect(chatInputDisplay);

    }

    public void IPInputSubmitted(string txt) {
        if (!new Regex(@"^(\s|\t)*$").IsMatch(txt))
        {

            host = txt;

        }
        else
        {
         //   ClearAndSelect(iPInputDisplay);
        }

    }

    public void PortInputSubmitted(string txt) {

        if (!new Regex(@"^(\s|\t)*$").IsMatch(txt))
        {

            port = Convert.ToUInt16(txt);

        }
        else
        {
           // ClearAndSelect(portInputDisplay);
        }

    }

    public void UsernameInputSubmitted(string txt) {

        username = txt;
        SendPacketToServer(Packet.BuildName(txt));

    }

    void ClearAndSelect(TMP_InputField inputFeild) {
        inputFeild.text = "";
        inputFeild.Select();
        inputFeild.ActivateInputField();
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
    


