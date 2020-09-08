using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleChat
{
    class Program
    {
        static TcpClient socket = new TcpClient();
        int portNum = 321;

        static void Main(string[] args)
        {

            /* outdated #1 not asyncrynous
             * 
             * TcpClient socket = new TcpClient();
             try
            {
                socket.Connect("127.0.0.1", 320);

            }
            catch (Exception e){
                
                Console.WriteLine("Error: " + e.Message);

            }
             */

            /* outdated #2 asyncronous v1 
            socket.BeginConnect("127.0.0.1", 320, new AsyncCallback(HandleConnection), null);
            */

            ConnectToServer(); //in seperate task connect to server and listen for input

            Console.WriteLine("Hello World!");
            //Console.WriteLine(DateTime.Now.Ticks); //tells us when this happens in terms of ticks

            //client side loop
            while (true) {

                string input = Console.ReadLine();

                byte[] data = Encoding.ASCII.GetBytes(input);

                socket.GetStream().Write(data, 0, data.Length);
            }
            
        }

        async static void ConnectToServer() {
            try
            {

                await socket.ConnectAsync("127.0.0.1", 321);
                Console.WriteLine("Now connected to the server...");

            }
            catch (Exception e)
            {
                Console.WriteLine("Error: " + e.Message);
                return;
            }
            
            // get data from server loop
            while (true) {

                byte[] data = new byte[socket.Available];

                await socket.GetStream().ReadAsync(data, 0, data.Length);//block until we recive data

                Console.WriteLine(Encoding.ASCII.GetString(data));//convert data to text
            
            }


        }


        /* outdated #2 asyncronous v1
        static void HandleConnection(IAsyncResult ar) {

            try
            {
                socket.EndConnect(ar);
                Console.WriteLine("Now connected to the server...");
            }
            catch (Exception e)
            {
                Console.WriteLine("Error: " + e.Message);
            }

        }
            */
    }
}
