///Lain's TextMesh Pro utils

/*
    Covers \<align>. 
    Returns string encased in alignment tags. Value must be a string: "center", "left", "right", "justified", or "flush".
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {string} alignment
    @return {string}
    @example print("Taco Bell is great".align("left"))
    @example
    @example tb = "Taco Bell is around the corner"
    @example print(tb.align("right"))
*/
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

    return("<align=""" + alignment + """>" + self + "</align>")
end function

/*
    Covers \<font>, albeit barely. 
    Returns string with alternative font. Currently only one font is currently validated (LiberationSans SDF),
    thus this only returns the string in that one font. If GH adds other fonts or other fonts are validated,
    this function will be reworked to allow selection of other fonts or allow inserting string of Font Name.
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @return {string}
    @example print("We have access to a single alternate font.".altFont() + " -Kora")
*/
string.altFont = function()
    if self.indexOf(char(10)) then
        sList = self.split(char(10))
        eList = []
        for text in sList
            eList.push("<font=""LiberationSans SDF"">" + text + "</font>")
        end for
        return eList.join(char(10))
    end if

    return("<font=""LiberationSans SDF"">" + self + "</font>")
end function

/*
    Covers \<uppercase>, \<lowercase>, \<allcaps>, and \<smallcaps>. 
    Returns string encased in case tags. Must be a string: "uppercase", "lowercase", "allcaps", or "smallcaps".
    Only works for text displayed in terminal. In case of improper use, returns string unaltered. 
    Note: "uppercase" and "allcaps" are functionally the same, as noted in the TextMeshPro documentation.

    @param {string} case
    @return {string}
    @example print("Taco Bell".case("uppercase"))
    @example
    @example tb = ("Taco Bell takes ebt (at participating locations)"
    @example print(tb.case("smallcaps")))
*/
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

    return("<" + case + ">" + self + "</" + case + ">")
end function

/*
    Covers \<sup>, \<sub>, \<b>, \<i>, \<s>, and \<u>. 
    Returns string with applied formatting tags. Formats include superscript("sup"), subscript("sub"), bold("b"), italics("i"), underline("u"), and strikethrough("s"). 
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {string} style
    @return {string}
    @example print("Safeway".style("b"))
    @example
    @example store = "Saferway"
    @example print(store.style("i").style("b"))
*/
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


    return("<" + format + ">" + self + "</" + format + ">")
end function

/*
    Covers \<cspace>. 
    Returns string with applied character spacing (cspace) tags. Changes spacing between characters.
    Value is absolute to font units (em). Only works for text displayed in terminal.

    @param {number} cspace
    @param {number} relative
    @example print("Safeway is owned by Albertsons.".cspace(2))
    @example
    @example store = "There are very few Albertsons stores left."
    @example print(store.cspace(3,1))
*/
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

/*
    Covers \<indent> and \<line-indent>. 
    Returns string with applied indent or line indent tags. By default, performs regular indent. Value is a percentage (0-100).
    For line indent, set the optional line tag to anything other than 0 or null. Only works for text displayed in terminal.
    In case of improper use, returns string unaltered.

    @param {number} percent
    @return {string}
    @example print("It's an indent".indent(15))
    @example print("I don't really know /n how to show you what it does via example.".indent(15,1))
*/
string.indent = function(percent, line = 0)
    if not percent isa number then return self
    percent = clamp(percent,0,100)

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

    if not line then return("<indent=" + percent + "%>" + self + "</indent>")
    return("<line-indent=" + percent + "%>" + self + "</line-indent>")
end function

/*
    Covers \<alpha>. 
    Takes alpha value (0-255) and returns a string encased in alpha tags. Alpha value affects opacity (visibility) of text.
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {number} alpha
    @return {string}
    @example print("Subway is inferior to certain other sandwich shops.".alpha(255))
    @example print("Subway might disappear.".alpha(50))
*/
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

    return("<alpha=" + alphaHex + ">" + self + "<alpha=#FF>")
end function

/*
    Covers \<color>. 
    Takes rgb(255,255,255) and optional alpha (255) and returns string with added color tags and correct hex.
    Optional mark flag returns marked (highlighted) string instead of colored string when set to anything but 0 or null.
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {number} r
    @param {number} g
    @param {number} b
    @param {number} a
    @param {number} mark
    @return {string}

    @example print("Taco Bell".color(255,0,255))
    @example print("Taco Bell but as a ghost".color(255,0,255,50))
    @example print("Taco Bell but it's highlighted".color(255,0,255,100,1))
    @example tb = "Taco Bell but it was assigned to a variable"
    @example print(tb.color(255,0,255,255))
*/
string.color = function(r,g,b,a=255,mark = 0)
    if not (r isa number and g isa number and b isa number and a isa number) then return self
    colorHex = rgb_to_hex(r,g,b,a)

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

    if mark then return("<mark=" + colorHex + ">" + self + "</mark>")
    return("<color=" + colorHex + ">" + self + "</color>")
end function

/*
    Covers \<margin>, \<margin-left>, and \<margin-right>.
    Returns string with applied margin tags. Value is percentage (0-100). By default, calls the default <margin> tag. 
    The optional side flag can be used to choose the side the margin tag should affect ("left" or "right").
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {number} percent
    @param {string} side
    @return {string}
    @example print("The jack in the box /n is the best spot for curly fries.".margin(15,"left"))
*/
string.margin = function(percent,side = "")
    if not (percent isa number and side isa string) then return self
    if not (side == "left" or side == "right" or side == "") then return self
    percent = clamp(percent,0,100)

    if self.indexOf(char(10)) then
        sList = self.split(char(10))
        eList = []
        for text in sList
            if (side == "left" or side == "right") then
                eList.push("<margin-"+ side + "=" + percent + "%>" + text + "</margin>")
            else
                eList.push("<margin=" + percent + "%>" + text + "</margin>")
            end if
        end for
        return eList.join(char(10))
    end if

    if (side == "left" or side == "right") then return("<margin-"+ side + "=" + percent + "%>" + self + "</margin>")
    return("<margin=" + percent + "%>" + self + "</margin>")
end function

/*
    Covers \<mspace>.
    Returns string with applied monospacing tags. Spacing is absolute to font units (em).
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {number} spacing
    @return {string}
    @example print("Bass Pro Shop is the only Pro Shop allowing bass to shop for guns and fishing gear.".mspace(3))
    @example print("Every year during the fall season, bass all over America gear up to fish for humans in their local lakes.".mspace(1))
*/
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

    return("<mspace=" + spacing + "em>" + self + "</mspace>")
end function

/*
    Covers \<nobr>.
    Returns string with applied no break tags. encased string will not be broken by word wrap, unless the string is too long to display without breaking.
    Only works for text displayed in terminal.

    @return {string}
    @example print("Imagine a long diatribe here but " + "Super cali fragi listic expiali docious".nobr() + " will stay together when displayed.")
*/
string.nobr = function()
    if self.indexOf(char(10)) then
        sList = self.split(char(10))
        eList = []
        for text in sList
            eList.push("<nobr>" + text + "</nobr>")
        end for
        return eList.join(char(10))
    end if

    return("<nobr>" + self + "</nobr>")
end function

/*
    Covers \<pos>.
    Returns string at specified position in terminal (percentage value, 0-100). Only works for text displayed in terminal.
    In case of improper use, returns string unaltered.

    @param {number} percent
    @return {string}
    @example print("Foodmaxx is" + "<-- all the way over there".pos(50))
*/
string.pos = function(percent)
    if not percent isa number then return self
    percent = clamp(percent,0,100)

    if self.indexOf(char(10)) then
        sList = self.split(char(10))
        eList = []
        for text in sList
            eList.push("<pos=" + percent + "%>" + text)
        end for
        return eList.join(char(10))
    end if

    return("<pos=" + percent + "%>" + self)
end function

/*
    Covers \<rotate>. 
    Returns string with applied rotation tags, rotating each character to the specified degree. Value is rotational degrees (-180 to 180).
    Values lower than -180 or higher than 180 will be clamped to the range.
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {number} degree
    @return {string}
    @example print("Sideways text!".rotate(90))
*/
string.rotate = function(degree)
    if not degree isa number then return self
    degree = clamp(degree,-180,180)

    if self.indexOf(char(10)) then
        sList = self.split(char(10))
        eList = []
        for text in sList
            eList.push("<rotate=""" + degree + """>" + text + "</rotate>")
        end for
        return eList.join(char(10))
    end if

    return("<rotate=""" + degree + """>" + self + "</rotate>")
end function

/*
    Covers \<size>. 
    Returns string at target size. Value is percentage, can be more than 100%. 
    Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {number} percent
    @return {string}
    @example print("Ikea is " + "big".size(100))
*/
string.csize = function(percent)
    if not percent isa number then return self
    percent = clamp(percent,0,100)

    if self.indexOf(char(10)) then
        sList = self.split(char(10))
        eList = []
        for text in sList
            eList.push("<size=" + percent + "%>" + text + "</size>")
        end for
        return eList.join(char(10))
    end if

    return("<size=" + percent + "%>" + self + "</size>")
end function

/*
    Covers \<space>. 
    Returns string with added space. Value is in font units (em). Only works for text displayed in terminal.
    In case of improper use, returns string unaltered.

    @param {number} space
    @return {string}
    @example print("I need some " + "space.".space(5))
*/
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

    return("<space=" + space + "em>" + self)
end function

/*
    Covers \<voffset>.
    Returns string with specified vertical offset. Value is in font units (em). Value can be positive (up) or negative (down).
    Only works for text displayed in terminal. In case of improper use, returns string unaltered. Second argument applies voffset
    to each new line separately.

    @param {number} offset
    @param {number} multiline
    @return {string}
    @example print("I'm getting tired of writing these " + "dang".voffset(2) + " descriptions.")
*/
string.voffset = function(offset,multiline = 0)
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

/*
    Covers \<width>. 
    Returns string limited on right by width value. Word wrap will take place at set width value. Value is percentage (0-100).
    100% is max width. Only works for text displayed in terminal. In case of improper use, returns string unaltered.

    @param {number} percent
    @return {string}
    @example print("I am 100% done with this. Sincerely, writing descriptions for functions sucks.".width(50))
*/
string.width = function(percent)
    if not percent isa number then return self
    percent = clamp(percent,0,100)

    if self.indexOf(char(10)) then
        sList = self.split(char(10))
        eList = []
        for text in sList
            eList.push("<width=" + percent + "%>" + text + "</width>")
        end for
        return eList.join(char(10))
    end if

    return("<width=" + percent + "%>" + self + "</width>")
end function



///Important Number/math utils

max = function(a, b)
    if a > b then return a
    return b
end function

min = function(a,b)
    if a < b then return a
    return b
end function

clamp = function(num, lowClamp = 0, highClamp)
    if not highClamp then
        if num < lowClamp then return lowClamp
    end if
    return max(min(num,highClamp),lowClamp)
end function

_hexNibble = function(v)
    if v< 10 then return char(48 + v)
    return char(55+v)
end function

_toHexByte = function(n)
    num = clamp(n,0,255)
    hi = floor(num/16)
    lo = num - hi * 16
    return (_hexNibble(hi) + _hexNibble(lo))
end function

rgb_to_hex = function(r,g,b,a)
    return ("#" + _toHexByte(r) + _toHexByte(g) + _toHexByte(b) + _toHexByte(a))
end function

alpha_to_hex = function(a)
    return ("#" + _toHexByte(a))
end function
