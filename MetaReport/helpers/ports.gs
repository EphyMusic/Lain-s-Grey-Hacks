openPorts = function(ip)
    router = get_router(ip)
    ports = [0]
    for port in router.used_ports
        if not port.is_closed then ports.push(port.port_number)
    end for
    return ports
end function