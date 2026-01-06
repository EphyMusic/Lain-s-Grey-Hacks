Debug = {"classID": "Debug Tool"}
Debug.objType = function(obj)
    text = typeof(obj) + " """ + obj + """"
    print text
    wait(5)
end function