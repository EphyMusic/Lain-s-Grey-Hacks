string.align=function(alignment)
if not (alignment=="left" or alignment=="right" or alignment=="center" or alignment=="justified" or alignment=="flush") then return self
return ("<align="""+alignment+""">"+self+"</align>")
end function
string.altFont=function
return ("<font=""LiberationSans SDF"">"+self+"</font>")
end function
string.case=function(case)
if not (case=="uppercase" or case=="lowercase" or case=="allcaps" or case=="smallcaps") then return self
return ("<"+case+">"+self+"</"+case+">")
end function
string.format=function(format)
if not (format=="i" or format=="b" or format=="u" or format=="s" or format=="sub" or format=="sup") then return self
return ("<"+format+">"+self+"</"+format+">")
end function
string.cspace=function(cspace)
if not cspace isa number then return self
return ("<cspace=+"+cspace+"em>"+self+"</cspace>")
end function
string.indent=function(percent,line=0)
if not percent isa number then return self
percent=clamp(percent,0,100)
if not line then return ("<indent="+percent+"%>"+self+"</indent>")
return ("<line-indent="+percent+"%>"+self+"</line-indent>")
end function
string.alpha=function(alpha)
if not alpha isa number then return self
alphaHex=alpha_to_hex(alpha)
return ("<alpha="+alphaHex+">"+self+"<alpha=#FF>")
end function
string.color=function(r,g,b,a=255,mark=0)
if not (r isa number and g isa number and b isa number and a isa number) then return self
colorHex=rgb_to_hex(r,g,b,a)
if mark then return ("<mark="+colorHex+">"+self+"</mark>")
return ("<color="+colorHex+">"+self+"</color>")
end function
string.margin=function(percent,side="")
if not (percent isa number and side isa string) then return self
if not (side=="left" or side=="right" or side=="") then return self
percent=clamp(percent,0,100)
if (side=="left" or side=="right") then return ("<margin-"+side+"="+percent+"%>"+self+"</margin>")
return ("<margin="+percent+"%>"+self+"</margin>")
end function
string.mspace=function(spacing)
if not spacing isa number then return self
return ("<mspace="+spacing+"em>"+self+"</mspace>")
end function
string.nobr=function
return ("<nobr>"+self+"</nobr>")
end function
string.pos=function(percent)
if not percent isa number then return self
percent=clamp(percent,0,100)
return ("<pos="+percent+"%>"+self)
end function
string.rotate=function(degree)
if not degree isa number then return self
degree=clamp(degree,-180,180)
return ("<rotate="""+degree+""">"+self+"</rotate>")
end function
string.csize=function(percent)
if not percent isa number then return self
return ("<size="+percent+"%>"+self+"</size>")
end function
string.space=function(space)
if not space isa number then return self
return ("<space="+space+"em>"+self)
end function
string.script=function(script)
if not script isa string then return self
if not (script=="sup" or script=="sub") then return self
return ("<"+script+">"+self+"</"+script+">")
end function
string.voffset=function(offset)
if not offset isa number then return self
return ("<voffset="+offset+"em>"+self+"</voffset>")
end function
string.width=function(percent)
if not percent isa number then return self
percent=clamp(percent,0,100)
return ("<width="+percent+"%>"+self+"</width>")
end function
max=function(a,b)
if a>b then return a
return b
end function
min=function(a,b)
if a<b then return a
return b
end function
clamp=function(num,lowClamp=0,highClamp)
if not highClamp then
if num<lowClamp then return lowClamp
end if
return max(min(num,highClamp),lowClamp)
end function
_hexNibble=function(v)
if v<10 then return char(48+v)
return char(55+v)
end function
_toHexByte=function(n)
num=clamp(n,0,255)
hi=floor(num/16)
lo=num-hi*16
return (_hexNibble(hi)+_hexNibble(lo))
end function
rgb_to_hex=function(r,g,b,a)
return ("#"+_toHexByte(r)+_toHexByte(g)+_toHexByte(b)+_toHexByte(a))
end function
alpha_to_hex=function(a)
return ("#"+_toHexByte(a))
end function