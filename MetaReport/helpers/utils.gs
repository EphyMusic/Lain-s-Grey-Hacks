///Generic Globals

shell = get_shell
computer = shell.host_computer
home = home_dir



///TextLog utils

TextLog = {}

TextLog.Log = []

TextLog.currentLimit = 10

TextLog.clearLog = function()
    self.Log.empty
end function

TextLog.add = function(entry)
    self.Log.push(entry)
    if self.Log.len > self.currentLimit then self.Log.remove(0)
end function

TextLog.printLog = function(entry)
    if entry then self.add(entry)
    print(self.Log.join(char(10)),1)
end function

TextLog.warnLog = function(warning)
    print(self.Log.join(char(10)) + char(10) + warning.color(255,0,100),1)
end function



///List utils

list.empty = function()
    while self.len > 0
        self.remove(0)
    end while
end function

list.clean = function()
    set = []
    for item in self
        if set.indexOf(item) == null then set.push(item)
    end for
    self.empty
    for item in set 
        self.push(item)
    end for
end function



///String utils

/*
Takes rgb(255,255,255) and optional alpha (255) and returns string with added color tags and correct hex.

@param {number} r
@param {number} g
@param {number} b
@param {number} a
@return {string}

@example print("Taco Bell".color(255,0,255))
@example print("Taco Bell but as a ghost".color(255,0,255,50))
@example tb = "Taco Bell but it was assigned to a variable"
@example print(tb.color(255,0,255,255))
*/
string.color = function(r,g,b,a=255)
    colorHex = rgb_to_hex(r,g,b,a)
    return ("<color=" + colorHex + ">" + self + "</color>")
end function



///Number/math utils

max = function(a, b)
    if a > b then return a
    return b
end function

min = function(a,b)
    if a < b then return a
    return b
end function

clamp = function(num, lowClamp = 0, highClamp)
    if not highClamp then
        if num < lowClamp then return lowClamp
    end if
    return max(min(num,highClamp),lowClamp)
end function

_hexNibble = function(v)
    if v< 10 then return char(48 + v)
    return char(55+v)
end function

_toHexByte = function(n)
    num = clamp(n,0,255)
    hi = floor(num/16)
    lo = num - hi * 16
    return (_hexNibble(hi) + _hexNibble(lo))
end function

rgb_to_hex = function(r,g,b,a)
    return ("#" + _toHexByte(r) + _toHexByte(g) + _toHexByte(b) + _toHexByte(a))
end function



///File utils

/*
Take a folder and file name (separate). Will create folder in home/{user}/, then create the file in that folder.
If the folder exists, only the file will be created. If the file exists, no file will be created. Folder and file names must be alphanumeric strings.
If file creation fails for any reason, a string will be returned, else 1. 

@param {string} folderPath
@param {string} fileName
return {string}
*/
makeFile = function(folderPath,fileName)
    filePath = home + "/" + folderPath
    file = computer.File(filePath + "/" + fileName)
    if file then return("File already exists.")
    file = computer.File(folderPath)
    if not file then
        resFolder = computer.create_folder(home,folderPath)
        if resFolder isa number then print("created folder at " + folderPath) else return(resFolder)
    end if
    resFile = computer.touch(filePath, fileName)
    if resFile isa string then return(resFile)
    return(1)
end function


/*
Takes a path to a file an a string for content. Writes content to file at the path, if the file exists.

@param {string} filePath
@param {string} content
@return {string}
@return {number}
*/
writeFile = function(filePath,content)
    file = computer.File(filePath)
    if not file then return("Could not write to file.")
    res = file.set_content(content)
    return(res)
end function
