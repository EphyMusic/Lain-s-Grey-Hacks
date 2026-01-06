#include "tmPro.gs"
#include "utils.gs"
#include "network.gs"
#include "meta.gs"

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
            exit("To Be Continued... Glad it works tho'.")
        end if
    end while
end function