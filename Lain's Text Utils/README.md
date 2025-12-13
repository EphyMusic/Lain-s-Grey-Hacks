# A collection of useful TextMesh Rich Text Tag functions tied directly to strings.

Only those actually functional (currently) in Grey Hack have been included.

One version includes documentation and is meant to be used with GreybelVS.
The other is a version with no docs, able to be inserted and used directly in Grey Hack without building from Greybel.

# Quick-Reference
## Works on all strings. All strings will be represented by "string"
## All percentage values are just numbers between 0 and 100
string.align("align")
- align = "center", "left", "right", "justified", "flush"

string.altFont() - there's only one alternate font.

string.case("case")
- case = "uppercase", "lowercase", "allcaps", "smallcaps"

string.format("format")
- Covers all formatting, like super and subscript, bold, italics, etc.
- format = "sup", "sub", "b", "i", "s", "u"

string.cspace(number) - character spacing in +-em

string.alpha(number) - max 255

string.color(red,green,blue,alpha,mark)
- uses 255,255,255,255 format. Put "1" in mark parameter to highlight instead, else 0 or nothing.

string.margin(percent,"side")
- side (optional) = "left", "right"

string.mspace(number)
- monospacing in +-em

string.nobr()
- nobreak

string.pos(percent)
- percent of the way across the terminal the text should be placed

string.rotate(degree)
- degrees should be between -180 and 180

string.csize(percent)
- sets character size (allows values larger than 100)

string.space(number)
- Adds a space. If you need some space. In positive em values

string.voffset(number,number)
- offsets the displayed string vertically. In +-em
- second argument applies voffset to each line in multiline string

string.width(percent)
- squeezes text to within a certain percentage of terminal.
50 wraps text at halfway through the terminal.
