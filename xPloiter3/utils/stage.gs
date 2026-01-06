//#include "debug.gs"
#include "utils/tmPro.gs"
#include "utils/debug.gs"
#include "utils/utils.gs"
#include "utils/network.gs"
#include "utils/meta.gs"

Stage = {"classID": "Stage"}

Stage.Network = function(networks)
    if networks.len < 1 then
        network = Network.make(getIP())
        networks.push(network)
        return network
    end if
    choices = []
    for network in networks
        text = network.ip + " " + char(8212) + " Ports: " + network.ports.len
        choices.push(text)
    end for
    choices.push("New")
    choices.push("Exit")
    menu = Menu.make(choices,Display.logoSmall.join(char(10)),"Up and Down to Scroll, Enter to Select".csize(50,true), "Networks")
    choice = menu.runMenu()
    if choice > networks.len - 1 then
        choice = choices[choice]
        if choice == "New" then
            network = Network.make(getIP())
            networks.push(network)
            return network
        else if choice == "Exit" then
            exit("Exiting...")
        end if
    end if
    return networks[choice]
end function

Stage.Port = function(network)
    choices = network.ports[:]
    choices.push("Back")
    choices.push("Exit")
    menu = Menu.make(choices, Display.logoSmall.join(char(10)),"Up and Down to Scroll, Enter to Select".csize(50,true), "Ports")
    choice = choices[menu.runMenu()]
    if choice == "Exit" then exit("Exiting...")
    return choice
end function

Stage.Memory = function(exploits)
    choices = listMem(exploits)
    choices.push("Back")
    choices.push("Exit")
    menu = Menu.make(choices, Display.logoSmall.join(char(10)), "Up and Down to Scroll, Enter to Select".csize(50,true), "Memory")
    choice = choices[menu.runMenu()]
    if choice == "Exit" then exit("Exiting...")
    return choice
end function

Stage.Tag = function(exploits, _mem)
    choices = listTag(exploits, _mem)
    choices.push("Back")
    choices.push("Exit")
    menu = Menu.make(choices, Display.logoSmall.join(char(10)), "Up and Down to Scroll, Enter to Select".csize(50,true), "Tag")
    choice = choices[menu.runMenu()]
    if choice == "Exit" then exit("Exiting...")
    return choice
end function

Stage.Summary = function(exploit)
    summary = exploit.summarize()
    choices = ["Confirm","Back","Exit"]
    menu = Menu.make(choices,summary,"Up and Down to Scroll, Enter to Select".csize(50,true),"Continue?")
    choice = choices[menu.runMenu()]
    if choice == "Exit" then exit("Exiting...")
    return choice
end function

Stage.preHack = function(obj)
    own = checkOwner(obj)
    if obj isa Type.Shell and own != "guest" then
        choices = ["Terminal","Passwd","Back","Exit"]
    else if obj isa Type.Shell then
        choices = ["Terminal", "Back", "Exit"]
    else if own != "guest" then
        choices = ["Passwd","Back","Exit"]
    else
        choices = ["Back","Exit"]
    end if
    yay = ""
    if own == "root" then 
        yay = " Yay!"
        own = own.color(255,20,20)
    else if own == "guest" then
        yay = " Bummer..."
        own = own.color(255,150,10)
    else
        own = own.color(20,70,255)
    end if
    header = "Success! Received " + typeof(obj).color(20,255,50) + " object from " + own + "." + yay + char(10) + "What would you like to do now?"
    menu = Menu.make(choices, header, "Up and Down to Scroll, Enter to Select".csize(50,true), "Get")
    choice = choices[menu.runMenu()]
    if choice == "Exit" then exit("Exiting...")
    return choice
end function

Stage.failedHack = function(obj)
    choices = ["Back", "Exit"]
    menu = Menu.make(choices,"Oops. Got " + obj + " of " + typeof(obj) + ". Not sure what to do with that." + char(10) + "Go back?",  "Up and Down to Scroll, Enter to Select".csize(50,true), "Err-Oops")
    choice = choices[menu.runMenu()]
    if choice == "Exit" then exit("Exiting...")
    return choice
end function

Stage.Hack = function(obj,network,vector)
    if vector == "Terminal" then
        adminMon = _find("/usr/bin", "AdminMonitor.exe").path()
        if adminMon then get_shell.launch(adminMon)
        obj.start_terminal()
    else if vector == "Passwd" then
        content = crackPasswd(obj)

        res = savePasswd(content, network.ip)
        print("Passwords stolen! Find them in " + home_dir + "/Credentials" + "/" + network.ip + "_passwd.txt")
    end if
end function

Stage.progress = 0
Stage.Loop = function()
    networks = []
    while true
        if self.progress == 0 then                  //stage 0 - Network Select
            network = self.Network(networks)
            self.progress += 1
        end if

        if self.progress == 1 then                  //stage 1 - Port Select
            port = self.Port(network)
            if port == "Back" then
                port = null
                self.progress += -1
            else
                metaLib = getLib(network.ip,port)       //stage 1-1 - Scan
                if not typeof(metaLib) == "MetaLib" then
                    print("Error: ".color(255,0,0) + metaLib.color(50,200,50).color(200,50,200,80,true))
                    metaLib = null
                    wait(2)
                    continue
                end if
                exploits = getExploits(metaLib)
                self.progress += 1
            end if
        end if

        if self.progress == 2 then                  //stage 2 - Memory Select
            memory = self.Memory(exploits)
            if memory == "Back" then
                memory = null
                self.progress += -1
            else
                self.progress += 1
            end if
        end if

        if self.progress == 3 then                  //stage 3 - Tag select
            tag = self.Tag(exploits, memory)
            if tag == "Back" then
                tag = null
                self.progress += -1
            else
                self.progress += 1
            end if
        end if

        if self.progress == 4 then                  //stage 4 - Print summary and conditions/Confirm attack
            exploit = null
            obj = null
            for item in exploits
                if (item.address == memory and item.tag == tag) then
                    exploit = item
                    break
                end if
            end for
            choice = self.Summary(exploit)
            if choice == "Back" then
                self.progress += -1
                exploit = null
            else
                self.progress += 1
            end if
        end if
        if self.progress == 5 then
                              //stage 5 - prehack
            if not obj then obj = getObj(metaLib, exploit)
            if obj then 
                choice = self.preHack(obj)          //stage 5-1 - known hacks
                if choice == "Back" then
                    self.progress += -1
                    obj = null
                else
                    vector = choice
                    self.progress += 1
                end if
            else
                choice = self.failedHack(obj)      //stage 5-2 - unknown/failed hacks
                if choice == "Back" then
                    self.progress += -1
                    obj = null
                end if
            end if
        end if

        if self.progress == 6 then                 //stage 6 - hack and restart
            self.Hack(obj, network, vector)
            self.progress = 0
        end if
    end while
end function