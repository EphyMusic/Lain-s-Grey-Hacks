openPorts = function(ip)
    router = get_router(ip)
    ports = [0]
    for port in router.used_ports
        if not port.is_closed then ports.push(port.port_number)
    end for
    return ports
end function

portSelect = function(ports)
    x = 0
    TextLog.add("Open ports at " + ip.color(255,255,0))
    for port in ports
        TextLog.add("["+ str(x).color(255,0,50) + "] " + port)
        x = x + 1
    end for
    TextLog.printLog()
    while true
        sel = to_int(user_input("Please choose port (from index): "))
        if ports.hasIndex(sel) then break
        TextLog.warnLog(sel.color(255,0,0) + " is not a valid selection. Please select an index between 0 and ".color(0,255,255) + str(ports.len - 1).color(0,255,255))
    end while
    return(ports[sel])
end function