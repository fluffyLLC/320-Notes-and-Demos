using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;




public enum Board { 
    Empty,
    X,
    O


}



public class GameplayController : MonoBehaviour
{

    public ButtonXO bttnPrefab;

    public Transform panelGameboard;

    private int coloms = 3;
    private int rows = 3;

    private Board whoseTurn = Board.X;

    private Board[,] boardData;// all the data of who owns what

    private ButtonXO[,] boardUI; // all the buttons


    // Start is called before the first frame update
    void Start()
    {
        BuildBoardUI();
        


    }

    private void BuildBoardUI() {
        boardUI = new ButtonXO[coloms, rows];

        for (int x = 0; x < coloms; x++) {

            for (int y = 0; y < rows; y++)
            {
                ButtonXO bttn = Instantiate(bttnPrefab, panelGameboard);
                bttn.init(new GridPOS(x, y), () => ButtonClicked(bttn));
                boardUI[x, y] = bttn;


            }

        }

        

        
    }



    void ButtonClicked(ButtonXO bttn) {

        //print($"a button was clicked {bttn.pos.X}, {bttn.pos.Y}");

        ControllerGameClient.singleton.SendPlayPacket(bttn.pos.X, bttn.pos.Y);
    }
   

    public void UpdateFromServer(byte gameStatus, byte whoseTurn, byte[] spaces)
    {
        print("update from server");

        //

        for (int i = 0; i < spaces.Length; i++) {

            byte b = spaces[i];


            int x = i % 3;
            int y = i / 3;


            boardUI[x, y].SetOwner(b);


            print(b);
        }



        //TODO: update all of the interface to reflect game state:
        // - whose turn
        // - 9 spaces on the board
        // - status
    }
}
