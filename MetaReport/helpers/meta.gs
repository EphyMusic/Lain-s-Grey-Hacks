Meta = include_lib("lib/metaxploit.so")

getLib = function(ip,port)
    net = Meta.net_use(ip,port)
    if not net then return("net broken. pls fix it")
    metaLib = net.dump_lib
    return metaLib
end function

constructReport = function(metaLib)
    p = "No"
    if metaLib.is_patched then p = "Yes"
    fileName = metaLib.lib_name.remove(".so") + " " + metaLib.version + ".rpt"
    resFile = makeFile("MetaReports",fileName)

    if resFile isa string then return resFile
    text0 = "["+ metaLib.lib_name +"] | Ver." + metaLib.version + " | Patched: " + p
    scan0 = Meta.scan(metaLib)
    report = memScan(metaLib, scan0)
    if report isa number then return("Failed to write report. -Memory scan failure.")
    resWrite = writeFile(home + "/MetaReports/" + fileName,text0 + char(10) + report)
    if resWrite isa string then return resWrite else return 1
end function

memScan = function(metaLib, scan0)
    if (metaLib and scan0 isa list) then
        reports = ""
        for mem in scan0
            report = "["+ mem +"]" + char(10) + Meta.scan_address(metaLib,mem)
            if not report then return 0
            reports = reports + char(10) + report
        end for
        return reports
    else
        return 0
    end if
end function