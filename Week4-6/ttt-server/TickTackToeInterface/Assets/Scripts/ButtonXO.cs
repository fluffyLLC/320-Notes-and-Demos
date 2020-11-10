using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;


public struct GridPOS {
    public int X;
    public int Y;
    public GridPOS(int X, int Y) {
        this.X = X;
        this.Y = Y;
    }

    public override string ToString()
    {
        return $"Grid Position {X}, {Y}";
    }

}

public class ButtonXO : MonoBehaviour
{
    // Start is called before the first frame update

    public TextMeshProUGUI textFeild;

    public GridPOS pos;
    public void init(GridPOS pos,UnityAction callback)
    {
        this.pos = pos;
        Button bttn = GetComponent<Button>();

        bttn.onClick.AddListener( callback );

    }

    public void SetOwner(byte b) {

        if (b == 0) textFeild.text = "";
        if (b == 1) textFeild.text = "X";
        if (b == 2) textFeild.text = "O";


    }

    public void ButtonClicked()
    {
        print("I've been clicked");
    }

}
