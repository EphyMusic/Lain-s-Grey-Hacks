/// Ports
#include "debug.gs"
openPorts = function(ip)
    router = get_router(ip)
    ports = [0]
    for port in router.used_ports
        if not port.is_closed then ports.push(port.port_number)
    end for
    return ports
end function

getIP = function()
    while true
        ip = user_input("Enter IP Address: ")
        if is_valid_ip(ip) then return ip
        print("Invalid IP.")
        wait(2)
    end while
end function

/// Network

Network = {"classID": "Network"}
Network.make = function(ip)
    x = new self
    x.ip = ip
    x.ports = openPorts(ip)
    return x
end function