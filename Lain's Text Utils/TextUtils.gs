string.align = function(alignment)
	if not (alignment == "left" or alignment == "right" or alignment == "center" or alignment == "justified" or alignment == "flush") then return self

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<align=""" + alignment + """>" + text + "</align>")
		end for
		return eList.join(char(10))
	end if

	return ("<align=""" + alignment + """>" + self + "</align>")
end function
string.altFont = function
	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<font=""LiberationSans SDF"">" + text + "</font>")
		end for
		return eList.join(char(10))
	end if

	return ("<font=""LiberationSans SDF"">" + self + "</font>")
end function
string.case = function(case)
	if not (case == "uppercase" or case == "lowercase" or case == "allcaps" or case == "smallcaps") then return self

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<" + case + ">" + text + "</" + case + ">")
		end for
		return eList.join(char(10))
	end if

	return ("<" + case + ">" + self + "</" + case + ">")
end function
string.format = function(format)
	if not (format == "i" or format == "b" or format == "u" or format == "s" or format == "sub" or format == "sup") then return self

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<" + format + ">" + text + "</" + format + ">")
		end for
		return eList.join(char(10))
	end if


	return ("<" + format + ">" + self + "</" + format + ">")
end function
string.cspace = function(cspace)
	if not cspace isa number then return self

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<cspace=+" + cspace + "em>" + text + "</cspace>")
		end for
		return eList.join(char(10))
	end if

	return ("<cspace=+" + cspace + "em>" + self + "</cspace>")
end function
string.indent = function(percent, line = 0)
	if not percent isa number then return self
	percent = clamp(percent, 0, 100)

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			if not line then
				eList.push("<indent=" + percent + "%>" + text + "</indent>")
			else
				eList.push("<line-indent=" + percent + "%>" + text + "</line-indent>")
			end if
		end for
		return eList.join(char(10))
	end if

	if not line then return ("<indent=" + percent + "%>" + self + "</indent>")
	return ("<line-indent=" + percent + "%>" + self + "</line-indent>")
end function
string.alpha = function(alpha)
	if not alpha isa number then return self
	alphaHex = alpha_to_hex(alpha)

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<alpha=" + alphaHex + ">" + text + "<alpha=#FF>")
		end for
		return eList.join(char(10))
	end if

	return ("<alpha=" + alphaHex + ">" + self + "<alpha=#FF>")
end function
string.color = function(r, g, b, a = 255, mark = 0)
	if not (r isa number and g isa number and b isa number and a isa number) then return self
	colorHex = rgb_to_hex(
		r,
		g,
		b,
		a)

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			if mark then
				eList.push("<mark=" + colorHex + ">" + text + "</mark>")
			else
				eList.push("<color=" + colorHex + ">" + text + "</color>")
			end if
		end for
		return eList.join(char(10))
	end if

	if mark then return ("<mark=" + colorHex + ">" + self + "</mark>")
	return ("<color=" + colorHex + ">" + self + "</color>")
end function
string.margin = function(percent, side = "")
	if not (percent isa number and side isa string) then return self
	if not (side == "left" or side == "right" or side == "") then return self
	percent = clamp(percent, 0, 100)

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			if side == "left" or side == "right" then
				eList.push("<margin-" + side + "=" + percent + "%>" + text + "</margin>")
			else
				eList.push("<margin=" + percent + "%>" + text + "</margin>")
			end if
		end for
		return eList.join(char(10))
	end if

	if side == "left" or side == "right" then return ("<margin-" + side + "=" + percent + "%>" + self + "</margin>")
	return ("<margin=" + percent + "%>" + self + "</margin>")
end function
string.mspace = function(spacing)
	if not spacing isa number then return self

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<mspace=" + spacing + "em>" + text + "</mspace>")
		end for
		return eList.join(char(10))
	end if

	return ("<mspace=" + spacing + "em>" + self + "</mspace>")
end function
string.nobr = function
	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<nobr>" + text + "</nobr>")
		end for
		return eList.join(char(10))
	end if

	return ("<nobr>" + self + "</nobr>")
end function
string.pos = function(percent)
	if not percent isa number then return self
	percent = clamp(percent, 0, 100)

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<pos=" + percent + "%>" + text)
		end for
		return eList.join(char(10))
	end if

	return ("<pos=" + percent + "%>" + self)
end function
string.rotate = function(degree)
	if not degree isa number then return self
	degree = clamp(degree, -180, 180)

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<rotate=""" + degree + """>" + text + "</rotate>")
		end for
		return eList.join(char(10))
	end if

	return ("<rotate=""" + degree + """>" + self + "</rotate>")
end function
string.csize = function(percent)
	if not percent isa number then return self
	percent = clamp(percent, 0, 100)

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<size=" + percent + "%>" + text + "</size>")
		end for
		return eList.join(char(10))
	end if

	return ("<size=" + percent + "%>" + self + "</size>")
end function
string.space = function(space)
	if not space isa number then return self

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<space=" + space + "em>" + text + "</voffset>")
		end for
		return eList.join(char(10))
	end if

	return ("<space=" + space + "em>" + self)
end function
string.voffset = function(offset, multiline = 0)
	if not offset isa number then return self

	if multiline then
		if self.indexOf(char(10)) then
			sList = self.split(char(10))
			eList = []
			for text in sList
				eList.push("<voffset=" + offset + "em>" + text + "</voffset>")
			end for
			return eList.join(char(10))
		end if
	end if

	return ("<voffset=" + offset + "em>" + self + "</voffset>")
end function
string.width = function(percent)
	if not percent isa number then return self
	percent = clamp(percent, 0, 100)

	if self.indexOf(char(10)) then
		sList = self.split(char(10))
		eList = []
		for text in sList
			eList.push("<width=" + percent + "%>" + text + "</width>")
		end for
		return eList.join(char(10))
	end if

	return ("<width=" + percent + "%>" + self + "</width>")
end function
max = function(a, b)
	if a > b then return a
	return b
end function
min = function(a, b)
	if a < b then return a
	return b
end function
clamp = function(num, lowClamp = 0, highClamp)
	if not highClamp then
		if num < lowClamp then return lowClamp
	end if
	return max(min(num, highClamp), lowClamp)
end function
_hexNibble = function(v)
	if v < 10 then return char(48 + v)
	return char(55 + v)
end function
_toHexByte = function(n)
	num = clamp(n, 0, 255)
	hi = floor(num / 16)
	lo = num - hi * 16
	return (_hexNibble(hi) + _hexNibble(lo))
end function
rgb_to_hex = function(r, g, b, a)
	return ("#" + _toHexByte(r) + _toHexByte(g) + _toHexByte(b) + _toHexByte(a))
end function
alpha_to_hex = function(a)
	return ("#" + _toHexByte(a))
end function