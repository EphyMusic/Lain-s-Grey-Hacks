#include "TextUtils-VS.gs"

// Functional Key Cheat Sheet
/// Up Key = 85
/// Down Key = 68
/// Left Key = 76
/// Right Key = 82
/// Enter Key = ""
/// Backspace = 66
/// choice is map with text:string and action:function()
Choice = {"classID": "Choice"}

Choice.make = function(text,action)
    x = new self
    x.text = text
    x.action = @action
    return x
end function

Menu = {"classID": "Menu"}

Menu.currentLine = 0
Menu.displayLimit = 5
Menu.selectFade = 0.5

Menu.make = function(choices,logo)
    x = new self
    x.logo = logo
    x.choices = choices
    x.lines = []
    x.format()
    return x
end function

Menu.setDisplayRange = function()
    total = self.lines.len
    limit = self.displayLimit
    line = self.currentLine

    if total <= limit then
        return [0,total]
    end if

    half = floor(limit / 2)
    start = line - half

    if start < 0 then start = 0
    maxStart = total - limit
    if start > maxStart then start = maxStart

    return [start, start + limit]
end function

Menu.format = function()
    lines = []
    for choice in self.choices
        line = ">~ " + __choice_idx + " " + choice.text + " ~<"
        lines.push(line)
    end for
    self.lines = lines
end function

Menu.changeLine = function(inc)
    self.currentLine = self.currentLine + inc
    if self.currentLine >= self.choices.len then self.currentLine = 0
    if self.currentLine < 0 then self.currentLine = self.choices.len - 1
end function

Menu.display = function()
    limit = self.setDisplayRange()
    line = self.currentLine - limit[0]
    lines = self.lines[limit[0]:limit[1]]
    lines[line] = lines[line].replace(lines[line][:],lines[line][:].color(0,50,255,80,1))
    print(self.logo + char(10),1)
    print(lines.join(char(10)))
end function

Menu.select = function(seconds)
    limit = self.setDisplayRange()
    line = self.currentLine - limit[0]
    start = time()
    while time() < start + seconds
        print(self.logo + char(10),1)
        lines = self.lines[limit[0]:limit[1]]
        t = (time() - start) / seconds
        if t > 1 then t = 1
        fade = (1-t)^3
        a = floor(255*fade)
        p = floor(5 * (1 - fade))
        for idx in lines.len - 1
            if idx == line then continue
            lines[idx] = lines[idx].replace(lines[idx][:],lines[idx][:].color(255,255,255,a))
        end for
        lines[line] = lines[line].replace(lines[line][:],lines[line][:].color(0,50,255,80,1)).pos(p,true)
        print(lines.join(char(10)))
        wait(0.1)
    end while
    return self.choices[self.currentLine].action()
end function

Menu.run = function()
    while true
        self.display()
        sel = user_input("up, down, enter",0,1)
        if sel == "" then return self.select(self.selectFade)
        if code(sel) == 66 then return null
        if code(sel) == 85 then self.changeLine(-1)
        if code(sel) == 68 then self.changeLine(1)
        wait(0.1)
    end while
end function