Display = {}

Display.logoStart = function()
    colorList = [[255,0,0],[255,175,0],[255,255,0],[175,255,0],[0,255,0],[0,255,175],[0,255,255],[0,175,255],[0,0,255],[175,0,255],[255,0,255],[255,0,175]]
    voff = -25
    x = 0
    while true
        logo = self.logoColorize(colorList[x])
        logo = logo.join(char(10))
        for _ in range(3)
            logo = logo.voffset(voff)
            print(logo,1)
            wait(0.01)
            voff = voff + 0.1
            if voff > 0 then break
        end for
        if voff > 0 then break
        x = x + 1
        if x == colorList.len then x = 0
    end while
    logoSize = 100
    sTime = time
    while true
        dt = time - sTime
        if dt > 3 then break
        logo = self.logoColorize(colorList[x])
        logo = logo.join(char(10))
        print(logo,1)
        wait(0.05)
        x = x + 1
        if x == colorList.len then x = 0
    end while
    print(self.logoText.join(char(10)).color(255,0,0),1)
end function

Display.logoText = [
    "   __       _       ",
    "  / /  __ _(_)_ __  ",
    " / /  / _` | | '_ \ ",
    "/ /__| (_| | | | | |",
    "\____/\__,_|_|_| |_|"
]

Display.logoColorize = function(colorGroup)
    logo = []
    for line in self.logoText
        logo.push(line.color(colorGroup[0],colorGroup[1],colorGroup[2]))
    end for
    return logo
end function

Display.logoSmall = [
" __        _     ",
"|  |   ___|_|___ ",
"|  |__| .'| |   |",
"|_____|__,|_|_|_|"
]