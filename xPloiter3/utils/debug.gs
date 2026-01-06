Debug = {"classID": "Debug Tool"}
Debug.objType = function(obj)
    text = typeof(obj) + " """ + obj + """"
    print text.color(255,20,20)
    wait(5)
end function