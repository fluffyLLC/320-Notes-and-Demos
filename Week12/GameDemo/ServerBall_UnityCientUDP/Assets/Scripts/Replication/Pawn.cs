﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pawn : NetworkObject
{

    new public static string classID = "PAWN"; //new overrides property from Network object

    

    public override int Deserialize(Buffer packet)
    {
        return base.Deserialize(packet);
    }
}
