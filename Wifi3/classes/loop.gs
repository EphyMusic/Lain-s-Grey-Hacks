// Loop stuff
#include "network.gs"

_startMon = function()
    devices = get_shell.host_computer.network_devices.split(char(10))
    for device in devices
        dev = device.split(" ")[0]
        if Crypto.airmon("start",dev) then
            return["Monitor started on " + dev + ".", dev]
        end if
    end for
    return["ERROR: No network device capable on monitor. No wifi device?",null]
end function

_startup = function(mon)
    if not mon[1] then
        return(mon[0])
    end if
    wifiNetworks = []
    for network in get_shell.host_computer.wifi_networks(mon[1])
        wifiNetworks.push(WifiNet.make(network))
    end for
    return wifiNetworks
end function

_select = function(mon)
    wifiNetworks = _startup(mon)
    if wifiNetworks isa string then
        return wifiNetworks
    else if wifiNetworks.len == 0 then
        return "ERROR: No networks available"
    end if
    choices = []
    wifiNetworks.sort("pwr")
    for wifi in wifiNetworks
        choices.push("[" + __wifi_idx.color(255,150,150) + "]  " + wifi.output())
    end for

    tries = 0
    while true
        print choices.join(char(10))
        choice = user_input("Choose a network to connect to: ")
        if choice isa number and (choice < choices.len and choice >= 0) then break
        if not tries then
            print("Not a choice. Try again.")
        else
            print("Still not a choice... " + str(5 - tries) + "...")
        end if
        tries += 1
        if tries == 5 then exit("You are bad at choosing. Goodbye.".color(255,0,0))
    end while
    return wifiNetworks[choice]
end function

run = function()
// Grab Handshake
    mon = _startMon()
    network = _select(mon)
    if network isa string then exit(network.color(255,100,100))
    result = network.cap()
// Check Handshake
    if not result then
        capFile = get_shell.host_computer.File(current_path + "/file.cap")
        if not capFile then capFile = get_shell.host_computer.File(home_dir + "/file.cap")
        if not capFile then capFile = get_shell.host_computer.File("/home/" + active_user + "/file.cap")
        if not capFile then exit("Can't find file.cap.")
        pass = Crypto.aircrack(current_path + "/file.cap")
    else
        exit(result.color(255,50,50))
    end if
    if not pass then exit("ERROR: Something wrong with file.cap." + char(10) + typeof(capFile))
    capFile.delete()
    result = network.connect(mon[1],pass)
    if result isa number then
        get_shell.launch("usr/bin/Browser.exe")
        Crypto.airmon("stop", mon[1])
        exit("Success! Connected to " + network.bssid + " with password " + pass)
    else if result isa string then
        Crypto.airmon("stop", mon[1])
        exit(result.color(255,50,50))
    end if
end function