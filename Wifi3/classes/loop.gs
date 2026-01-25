// Loop stuff
#include "network.gs"

_startMon = function()
    print("Checking devices...",1)
    devices = get_shell.host_computer.network_devices.split(char(10))
    for device in devices
        dev = device.split(" ")[0]
        if Crypto.airmon("start",dev) then
            return["Monitor started on " + dev + ".", dev]
        end if
    end for
    return["ERROR: No network device capable of monitor. No wifi device?",null]
end function

_startup = function(mon)
    wifiNetworks = []
    for network in get_shell.host_computer.wifi_networks(mon[1])
        wifiNetworks.push(WifiNet.make(network))
    end for
    return wifiNetworks
end function

_select = function(mon,skip)
// Get Wifi Networks
    wifiNetworks = _startup(mon)
    if wifiNetworks.len == 0 then
        return "ERROR: No networks available"
    end if
    choices = []
    wifiNetworks.sort("pwr")
    if skip then return wifiNetworks[-1]
    for wifi in wifiNetworks
        choices.push("[" + str(__wifi_idx).color(255,150,150) + "]  " + wifi.output())
    end for
// Choose Network
    tries = 0
    while true
        print choices.join(char(10))
        choice = user_input("Choose a network to connect to: ",0,1).to_int
        if choice isa number and (choice < choices.len and choice >= 0) then break
        if not tries then
            print("Not a choice. Try again.",1)
        else
            print("Still not a choice... " + str(4 - tries) + "...",1)
        end if
        tries += 1
        if tries == 5 then exit("You are bad at choosing. Goodbye.".color(255,0,0))
    end while
    return wifiNetworks[choice]
end function

run = function(skip)
// Grab Handshake
    mon = _startMon()
    if not mon[1] then exit(mon[0].color(255,25,25))
    network = _select(mon,skip)
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
        print("",1)
        exit("Success! Connected to " + network.essid + " with password " + pass)
    else if result isa string then
        Crypto.airmon("stop", mon[1])
        exit(result.color(255,50,50))
    end if
end function