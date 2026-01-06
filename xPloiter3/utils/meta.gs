#include "utils.gs"
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