Crypto = include_lib("lib/crypto.so")
#include "../helpers/TextUtils-VS.gs"
WifiNet = {"classID": "wifi"}

WifiNet.make = function(wifi)
    x = new self
    wifi = wifi.split(" ")
    x.remove("make")
    x.bssid = wifi[0]
    x.essid = wifi[2]
    x.pwr = wifi[1][:-1].to_int
    x.acks = 300000/(x.pwr + 15)
    return x
end function

WifiNet.output = function()
    if self.pwr >= 70 then
        pwr = (str(self.pwr) + "%").color(25,255,25)
    else if self.pwr >=40 then
        pwr = (str(self.pwr) + "%").color(255,255,25)
    else
        pwr = (str(self.pwr) + "%").color(255,25,25)
    end if
    return self.bssid.color(255,25,255) + "     " + self.bssid + "     " + pwr 
end function

WifiNet.cap = function()
    res = Crypto.aireplay(self.bssid,self.essid,self.acks)
    return res
end function

WifiNet.connect = function(device,pass)
    res = get_shell.host_computer.connect_wifi(device,self.bssid,self.essid,pass)
    return res
end function