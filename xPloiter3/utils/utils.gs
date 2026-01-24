// Debug
Debug = {"classID": "Debug Tool"}
Debug.objType = function(obj)
    text = typeof(obj) + " """ + obj + """"
    print text.color(255,20,20)
    wait(2)
end function

/// Menu
Menu = {"classID": "Menu"}
Menu.limit = 30
Menu.entryLimit = 5
Menu.currentLine = 1

Menu.make = function(choices,header,msg,logo = "LainMenu-V0.1")
    x = new self
    x.choices = choices
    x.header = header
    x.msg = msg
    x.lines = []
    x.logo = logo
    x.format()
    return x
end function

Menu.format = function()
    logo = self.logo
    lastLen = false
    for choice in self.choices
        self.limit = max(self.limit,str(choice).len + 5)
    end for
    logoPadding = (self.limit - logo.len) - 2
    lines = ["|".voffset(-0.5) + (char(8212)*logoPadding/2) + logo + (char(8212)*logoPadding/2) + "|".voffset(-0.5)]
    for choice in self.choices
        padding = (self.limit - str(choice).len) -4
        if logo.len % 2 == 0 then padding +=1
        line = "| " + str(choice).color(25,255,50) + (" " * padding) + "|"
        lines.push(line)
    end for
    num = 3
    if logo.len % 2 == 0 then num += -1
    lines.push("|".voffset(0.5) + (char(8212) * (self.limit - num)) + "|".voffset(0.5))
    self.lines = lines
end function

Menu.display = function(line)
    lines = self.lines[:]
    endIdx = lines[line].lastIndexOf("|") - 1
    lines[line] = lines[line].replace(lines[line][1:endIdx], lines[line][1:endIdx].color(0,50,255,80,1))
    print(lines.join(char(10)))
end function

Menu.changeLine = function(inc)
    self.currentLine += inc
    if self.currentLine > self.choices.len then self.currentLine = 1
    if self.currentLine < 1 then self.currentLine = self.choices.len
end function

Menu.runMenu = function()
    while true
        print(self.header,1)
        self.display(self.currentLine)
        wait(0.15)
        sel = user_input(self.msg,0,1)
        if sel == "" then return self.currentLine - 1
        if code(sel) == 66 then return "back"
        if code(sel) == 85 then self.changeLine(-1)
        if code(sel) == 68 then self.changeLine(1)
    end while
end function

/// List util
list.clean = function()
    set = []
    _list = self
    for item in _list
        if set.indexOf(item) == null then set.push(item)
    end for
    _list = []
    for item in set 
        _list.push(item)
    end for
    return _list
end function

// Type utils
Type = {
    "Shell": get_shell.__isa,
    "Computer": get_shell.host_computer.__isa,
    "File": get_shell.host_computer.File("/").__isa
}

// Math utils
max = function(a, b)
    if a > b then return a
    return b
end function

min = function(a,b)
    if a < b then return a
    return b
end function

clamp = function(num, lowClamp = 0, highClamp)
    if not num isa number then return num
    if not highClamp then
        if num < lowClamp then return lowClamp
    end if
    return max(min(num,highClamp),lowClamp)
end function