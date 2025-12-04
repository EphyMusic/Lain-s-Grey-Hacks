Meta = include_lib("lib/metaxploit.so")
Crypto = include_lib("lib/crypto.so")
exploitReport = ""
Exploit = {}
Exploit.make = function(address,tag = "failure")
    if address isa list then
        tag = address[1]
        address = address[0]
    end if
    x = new self
    x.address = address
    x.tag = tag
    return x
end function

getLib = function(ip,port)
    net = Meta.net_use(ip,port)
    if not net then return("net broken. pls fix it")
    metaLib = net.dump_lib
    return metaLib
end function

extractExploits = function(metaLib)
    libName = metaLib.lib_name
    libVersion = metaLib.version
    exploitReport = libName + " | Version:" + libVersion + char(10)
    startClock = time
    _memList = Meta.scan(metaLib)
    endClock = time
    TextLog.printLog("Library scanned in " + (endClock - startClock) + "s.")
    exploits = []
    for mem in _memList
        scan0 = Meta.scan_address(metaLib,mem)
        exploitReport = exploitReport +  char(10)*2 + "_"*10 + char(10) + mem + char(10) + scan0
        report = scan0.split("Unsafe check: ")[1:]
        for exploit in report

            _start = (exploit.indexOf("<b>")) + 3
            _end = exploit.indexOf("</b>")
            tag = exploit[_start:_end]
            newExploit = Exploit.make(mem,tag)
            exploits.push(newExploit)
        end for
    end for
    generateReport(exploitReport,metaLib)
    return exploits
end function

listExploits_Mem = function(exploits)
    if not exploits isa list then return("Error: it's not a list somehow. Fix it.")
    _memList = []
    for exploit in exploits
        _memList.push(exploit.address)
    end for
    _memList = _memList.clean()
    return _memList
end function

listExploits_Tag = function(memSelect, exploits)
    vulnList = []

    for exploit in exploits
        if exploit.indexOf(memSelect) then vulnList.push(exploit.tag)
    end for
    return vulnList
end function

selectMem = function(memList)
    TextLog.clearLog()
    TextLog.add("Vulnerable Addresses: ")
    x = 0
    for mem in memList
        TextLog.add("[" + str(x).color(255,150,50) + "] | " + mem.color(255,255,0,80,1))
        x = x + 1
    end for
    TextLog.printLog("Please choose an address (from index: " + str(0).color(255,150,50) + "-" + str(memList.len - 1).color(255,150,50) + ")")
    memSelect = ""
    while true
        select = to_int(user_input("Make a Selection: ".color(0,255,255)))
        if not memList.hasIndex(select) then
            TextLog.warnLog("Warning: Invalid Selection. Please try again.")
            continue
        end if
        memSelect = memList[select]
        break
    end while
    return memSelect
end function

selectTag = function(vulnList, memSelect)
    x = 0
    TextLog.clearLog()
    TextLog.add("Vulnerable Strings:")
    for tag in vulnList
        TextLog.add("["+str(x).color(0,255,0) +
        "]:[" + (address).color(255,255,50) +
        "] | " + (tag).color(0,255,255,80,1))
        x = x + 1
    end for
    TextLog.printLog()
    while true
        choice = to_int(user_input("Make a Selection: ".color(0,255,255)))
        if not choice isa number then
            TextLog.warnLog("Warning: Invalid Selection. Please try again.")
            continue
        end if
        attack = Exploit.make(memSelect, vulnList[choice])
        break
    end while
    return attack
end function

getRootFolder = function(obj)
    if typeof(obj) == "shell" then return obj.host_computer.File("/")
    if typeof(obj) == "computer" then return obj.File("/")
    if typeof(obj) == "file" then
        while true
            if obj.name() != "/" then
                obj = obj.parent()
            else
                return obj
            end if
        end while
    end if
end function

getPasswd = function(obj)
    rootFolder = getRootFolder(obj)
    for folder in rootFolder.get_folders()
        if folder.name() != "etc" then continue
        for file in folder.get_files()
            if file.name() != "passwd" then continue
            if not file.has_permission("r") then return
            passwd = file.get_content()
            return passwd
        end for
    end for
end function

crackPasswd = function(obj)
    deciphered = ""
    passwd = getPasswd(obj)
    if not passwd then return
    passList = passwd.split(char(10))
    passList.remove(-1)
    Timer.waitSec(1)
    TextLog.clearLog()
    Timer.waitSec(0.5)
    TextLog.printLog("passwd breached! Users: [" + str(passList.len).color(255,255,0) +"]")
    for pass in passList
        user = getUser(pass)
        TextLog.printLog(user)
        passHash = getHash(pass)
        startClock = time
        decipheredHash = Crypto.decipher(passHash)
        stopClock = time
        TextLog.printLog("deciphered in " + (stopClock - startClock) + "s.")
        deciphered = deciphered + user + ":" + decipheredHash
        if __pass_idx != passList.len() - 1 then deciphered = deciphered + char(10)
    end for
    return deciphered 
end function

getUser = function(stri)
    user = stri.split(":")[0]
    return user
end function

getHash = function(stri)
    passHash = stri.split(":")[1]
    return passHash
end function

savePasswd = function(passwd,ip)
    endResult = "["+ ip +"]" + char(10) + passwd
    destFolder = home + "/Reports"
    destFile = destFolder + "/" + ip + "_passwd.txt"
    if not checkReportFolder() then return
    if not computer.File(destFolder + "/" + ip + "_passwd.txt") then computer.touch(destFolder,ip + "_passwd.txt")
    endFile = computer.File(destFile)
    if not endFile then return
    endFile.set_content(endResult)
    return 1
end function

getShell = function(obj)
    if typeof(obj) == "shell" then return obj
    return
end function

checkReportFolder = function()
    destFolder = home + "/Reports"
    if not computer.File(destFolder) then 
        res = computer.create_folder(home,"Reports")
    else
        res = 1
    end if
    if res then return 1
    return
end function

checkReportLibsFolder = function()
    destFolder = home + "/Reports/Libs"
    if not computer.File(destFolder) then 
        res = computer.create_folder(home + "/Reports", "Libs")
    else
        res = 1
    end if
    if res then return 1
    return
end function

generateReport = function(expReport,metaLib)
    if not checkReportFolder() then return
    if not checkReportLibsFolder() then return
    destFolder = home + "/Reports/Libs"
    fileName = metaLib.lib_name + "_" + metaLib.version
    destFile = destFolder + "/" + fileName
    if not computer.File(destFile) then computer.touch(destFolder,fileName)
    res = computer.File(destFile).set_content(expReport)
    if res then
        TextLog.printLog("Library Exploit Report available in " + destFolder.color(0,150,255) + " as " + fileName.color(0,150,255))
        Timer.waitSec(3)
        return 1
    end if
    return 0
end function