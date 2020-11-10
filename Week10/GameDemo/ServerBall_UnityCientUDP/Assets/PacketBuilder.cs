using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class PacketBuilder
{

    static int hPrev = 0;
    public static Buffer CurrentInput() {

        int h = (int) Input.GetAxisRaw("Horizontal");

        if (h == hPrev) return null;

        hPrev = h;

        Buffer b = Buffer.Alloc(8);

        b.WriteString("INPT", 0);
        b.WriteInt8((sbyte)h, 4);

        return b;
    }





}
