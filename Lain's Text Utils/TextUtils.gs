string.align=function(alignment)
if not (alignment=="left" or alignment=="right" or alignment=="center" or alignment=="justified" or alignment=="flush") then return self
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<align="""+alignment+""">"+text+"</align>")
end for
return eList.join(char(10))
end if
return ("<align="""+alignment+""">"+self+"</align>")
end function
string.altFont=function
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<font=""LiberationSans SDF"">"+text+"</font>")
end for
return eList.join(char(10))
end if
return ("<font=""LiberationSans SDF"">"+self+"</font>")
end function
string.case=function(case)
if not (case=="uppercase" or case=="lowercase" or case=="allcaps" or case=="smallcaps") then return self
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<"+case+">"+text+"</"+case+">")
end for
return eList.join(char(10))
end if
return ("<"+case+">"+self+"</"+case+">")
end function
string.format=function(format)
if not (format=="i" or format=="b" or format=="u" or format=="s" or format=="sub" or format=="sup") then return self
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<"+format+">"+text+"</"+format+">")
end for
return eList.join(char(10))
end if
return ("<"+format+">"+self+"</"+format+">")
end function
string.cspace=function(cspace)
if not cspace isa number then return self
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<cspace=+"+cspace+"em>"+text+"</cspace>")
end for
return eList.join(char(10))
end if
return ("<cspace=+"+cspace+"em>"+self+"</cspace>")
end function
string.indent=function(num,percent=0,line=0)
if not num isa number then return self
if percent then num=clamp(num,0,100)
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
if not line then
if percent then
eList.push("<indent="+num+"%>"+text+"</indent>")
else
eList.push("<indent="+num+"em>"+text+"</indent>")
end if
else
if percent then
eList.push("<line-indent="+num+"%>"+text+"</line-indent>")
else
eList.push("<line-indent="+num+"em>"+text+"</line-indent>")
end if
end if
end for
return eList.join(char(10))
end if
if not line then
if percent then
return "<indent="+num+"%>"+self+"</indent>"
else
return "<indent="+num+"em>"+self+"</indent>"
end if
else
if percent then
return "<line-indent="+num+"%>"+self+"</line-indent>"
else
return "<line-indent="+num+"em>"+self+"</line-indent>"
end if
end if
end function
string.alpha=function(alpha)
if not alpha isa number then return self
alphaHex=alpha_to_hex(alpha)
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<alpha="+alphaHex+">"+text+"<alpha=#FF>")
end for
return eList.join(char(10))
end if
return ("<alpha="+alphaHex+">"+self+"<alpha=#FF>")
end function
string.color=function(r,g,b,a=255,mark=0)
if not (r isa number and g isa number and b isa number and a isa number) then return self
colorHex=rgb_to_hex(r,g,b,a)
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
if mark then
eList.push("<mark="+colorHex+">"+text+"</mark>")
else
eList.push("<color="+colorHex+">"+text+"</color>")
end if
end for
return eList.join(char(10))
end if
if mark then return ("<mark="+colorHex+">"+self+"</mark>")
return ("<color="+colorHex+">"+self+"</color>")
end function
string.margin=function(num,percent=0,side="")
if not (num isa number and side isa string) then return self
if not (side=="left" or side=="right" or side=="") then return self
if percent then num=clamp(num,0,100)
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
if side then
if percent then
eList.push("<margin-"+side+"="+num+"%>"+text+"</margin>")
else
eList.push("<margin-"+side+"="+num+"em>"+text+"</margin>")
end if
else
if percent then
eList.push("<margin="+num+"%>"+text+"</margin>")
else
eList.push("<margin="+num+"em>"+text+"</margin>")
end if
end if
end for
return eList.join(char(10))
end if
if side then
if percent then return "<margin-"+side+"="+num+"%>"+self+"</margin>"
return "<margin-"+side+"="+num+"em>"+self+"</margin>"
else
if percent then return "<margin="+num+"%>"+self+"</margin>"
return "<margin="+num+"em>"+self+"</margin>"
end if
end function
string.mspace=function(spacing)
if not spacing isa number then return self
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<mspace="+spacing+"em>"+text+"</mspace>")
end for
return eList.join(char(10))
end if
return ("<mspace="+spacing+"em>"+self+"</mspace>")
end function
string.nobr=function
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<nobr>"+text+"</nobr>")
end for
return eList.join(char(10))
end if
return ("<nobr>"+self+"</nobr>")
end function
string.pos=function(num,percent=0)
if not num isa number then return self
if percent then num=clamp(num,0,100)
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
if percent then
eList.push("<pos="+num+"%>"+text)
else
eList.push("<pos="+num+"em>"+text)
end if
end for
return eList.join(char(10))
end if
if percent then return "<pos="+num+"%>"+self
return "<pos="+num+"em>"+self
end function
string.rotate=function(degree)
if not degree isa number then return self
degree=clamp(degree,-180,180)
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<rotate="""+degree+""">"+text+"</rotate>")
end for
return eList.join(char(10))
end if
return ("<rotate="""+degree+""">"+self+"</rotate>")
end function
string.csize=function(num,percent=0)
if not num isa number then return self
if percent then num=clamp(num,0,100)
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
if percent then
eList.push("<size="+num+"%>"+text+"</size>")
else
eList.push("<size="+num+"em>"+text+"</size>")
end if
end for
return eList.join(char(10))
end if
if percent then return "<size="+num+"%>"+self+"</size>"
return "<size="+num+"em>"+self+"</size>"
end function
string.space=function(space)
if not space isa number then return self
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<space="+space+"em>"+text+"</voffset>")
end for
return eList.join(char(10))
end if
return ("<space="+space+"em>"+self)
end function
string.voffset=function(offset)
if not offset isa number then return self
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
eList.push("<voffset="+offset+"em>"+text+"</voffset>")
end for
return eList.join(char(10))
end if
return ("<voffset="+offset+"em>"+self+"</voffset>")
end function
string.width=function(num,percent=0)
if not num isa number then return self
if percent then num=clamp(num,0,100)
if self.indexOf(char(10)) then
sList=self.split(char(10))
eList=[]
for text in sList
if percent then
eList.push("<width="+num+"%>"+text+"</width>")
else
eList.push("<width="+num+"px>"+text+"</width>")
end if
end for
return eList.join(char(10))
end if
if percent then return "<width="+num+"%>"+self+"</width>"
return "<width="+num+"px>"+self+"</width>"
end function
sprite=function(num)
clamp(num,0,2)
return "<sprite="+num+">"
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