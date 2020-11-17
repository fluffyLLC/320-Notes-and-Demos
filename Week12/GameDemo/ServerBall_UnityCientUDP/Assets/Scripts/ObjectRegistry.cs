using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.VFX;
using System.Reflection;




static public class ObjectRegistry 
{
    static private Dictionary<string, System.Type> registeredTypes = new Dictionary<string, Type>();

    static public void RegisterAll() {

        RegisterClass<Pawn>();
    
    }


    static public void RegisterClass<T>() where T : NetworkObject
    {
        //FieldInfo feild =;
        string classID = (string)typeof(T).GetField("classID").GetValue(null);

        registeredTypes.Add(classID, typeof(T)); 

    } 



    static public NetworkObject SpawnFrom(string classID) {

        if (registeredTypes.ContainsKey(classID)) {

            ConstructorInfo cinfo = registeredTypes[classID].GetConstructor(new Type[] { });

            return (NetworkObject)cinfo.Invoke(null);

        }

        return null;
    
    }


}
