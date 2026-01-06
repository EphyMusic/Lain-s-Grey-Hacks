_getMeta = function()
    pathToMeta = "/lib/metaxploit.so"
    if not get_shell.host_computer.File(pathToMeta) then return
    return include_lib(pathToMeta)
end function

_getCrypto = function()
    pathToCrypto = "/lib/Crypto.so"
    if not get_shell.host_computer.File(pathToCrypto) then return
    return include_lib(pathToCrypto)
end function

Meta = _getMeta()
Crypto = _getCrypto()
Exploit = {"classID": "Exploit"}

Exploit.make = function(address,tag = "failure", conditions = "None", libInfo)
    x = new self
    x.address = address
    x.tag = tag
    x.conditions = conditions
    x.libName = libInfo[0]
    x.libVer = libInfo[1]
    return x
end function

Exploit.summarize = function()
    conditions = self.conditions.split(char(10))
    text = [
        char(8212)*10 + "Summary" + char(8212)*11,
        "[" + (self.libName - ".so" + " v") + self.libVer + "]",
        " ",
        char(8212)*9 + "Conditions" + char(8212)*9
    ]
    for condition in conditions
        if not condition == "" then
            text.push(">" + condition)
        end if
    end for
    return text.join(char(10))
end function

getLib = function(ip,port)
    net = Meta.net_use(ip,port)
    if not net then return "net broken. pls fix in getLib."
    lib = net.dump_lib
    if lib then return lib
    return "Broken lib. Fix in getLib."
end function

getExploits = function(metaLib)
    libInfo = [metaLib.lib_name,metaLib.version]
    _memList = Meta.scan(metaLib)
    exploits = []
    for mem in _memList
        scanMem = Meta.scan_address(metaLib,mem)
        sections = scanMem.split("Unsafe check: ")[1:]
        for exploit in sections
            _start = (exploit.indexOf("<b>")) + 3
            _end = exploit.indexOf("</b>")
            tag = exploit[_start:_end]
            conditions = exploit.split("\* ")[1:].join(char(10).trim)
            exploits.push(Exploit.make(mem,tag,conditions,libInfo))
        end for
    end for
    return exploits
end function

getObj = function(metaLib,exploit)
    obj = metaLib.overflow(exploit.address, exploit.tag)
    return obj
end function

_toRoot = function(obj)
    if obj isa Type.Shell then return obj.host_computer.File("/")
    if obj isa Type.Computer then return obj.File("/")
    if obj isa Type.File then
        while true
            if obj.name() != "/" then
                obj = obj.parent()
            else
                return obj
            end if
        end while
    end if
end function

_getUsers = function(obj)
    root = _toRoot(obj)
    users = []
    for folder in root.get_folders()
        if folder.name() == "home" then
            homeFolder = folder
            for user in homeFolder.get_folders
                users.push(user)
            end for
            continue
        else if folder.name() == "root" then
            users.push(folder)
        end if
    end for
    return users
end function

checkOwner = function(obj)
    own = ""
    users = _getUsers(obj)
    rootPerm = false
    for user in users
        write = user.has_permission("w")
        execute = user.has_permission("x")
        if user.name() == "root" and (write and execute) then
            rootPerm = true
        end if
        if write and execute then
            if user.name() != "guest" then own = user.name()
        end if
    end for

    if rootPerm then return "root"
    if not own then return "guest"
    return own
end function

listMem = function(exploits)
    if not exploits isa list then return("Error: not a list. Fix in listMem.")
    _memList = []
    for exploit in exploits
        _memList.push(exploit.address)
    end for
    _memList = _memList.clean()
    return _memList
end function

listTag = function(exploits, _mem)
    if not exploits isa list then return("Error: not a list. Fix in listTag.")
    _tagList = []
    for exploit in exploits
        if exploit.indexOf(_mem) then _tagList.push(exploit.tag)
    end for
    return _tagList
end function

_getPasswd = function(obj)
    root = _toRoot(obj)
    for folder in root.get_folders()
        if folder.name() != "etc" then continue
        for file in folder.get_files()
            if file.name() != "passwd" then continue
            passwd = file.get_content()
            return passwd
        end for
    end for
end function

crackPasswd = function(obj)
    content = _getPasswd(obj)
    deciphered = ""
    passList = content.split(char(10))
    passList.remove(-1)
    for pass in passList
        user = _getUser(pass)
        passHash = getHash(pass)
        decipheredHash = Crypto.decipher(passHash)
        deciphered += user + ":" + decipheredHash
        if __pass_idx != passList.len() -1 then deciphered += (char(10))
    end for
    return deciphered
end function

_getUser = function(stri)
    user = stri.split(":")[0]
    return user
end function

_getHash = function(stri)
    passHash = stri.split(":")[1]
    return passHash
end function

savePasswd = function(passwd,ip)
    endResult = "["+ ip +"]" + char(10) + passwd
    destFolder = home_dir + "/Credentials"
    destFile = destFolder + "/" + ip + "_passwd.txt"
    if not _checkReportFolder() then return
    if not get_shell.host_computer.File(destFolder + "/" + ip + "_passwd.txt") then get_shell.host_computer.touch(destFolder,ip + "_passwd.txt")
    endFile = get_shell.host_computer.File(destFile)
    if not endFile then return
    endFile.set_content(endResult)
    return 1
end function

_checkReportFolder = function()
    destFolder = home_dir + "/Credentials"
    if not get_shell.host_computer.File(destFolder) then 
        res = get_shell.host_computer.create_folder(home_dir,"Credentials")
    else
        res = 1
    end if
    if res then return 1
    return
end function

_find = function(folder,findfile)
    folder = get_shell.host_computer.File(folder)
    for file in folder.get_files()
        if file.name() == findfile then
            return file
        end if
    end for
    return null
end function