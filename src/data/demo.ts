const demoText = `### Demo ###

1.2 / (3.3 + 1.7)
3M / 6k
5 % 2
total

line4 * 22

# Unit conversions
a = 1.7ft + 25.3 cm
a in inches
3 yards in mm
pi * 6cm^2
1km to mi

# Currency conversions
29 CAD to USD
100 GBP in $
$2000 to btc
$6 in nickels

# Variables
width = 6 feet
length = 30 inches
height = 45 cm
width * length * height in gallons
width * length

# Algebra
f = parse('2x + x')
f.evaluate({ x: 4 })
simplify('x * y * -x / (x ^ 2)')
derivative("2x^2 + 3x + 4", "x")

# Percentages
12% of 20
40 + 30%
20% off 110

# Comments
last + 7 // inline comments

# Functions (see mathjs.org/docs)
round(pi, 5)
log(10000, 10)
sqrt(-4)
sin(90 deg)
hyp(a, b) = sqrt(a^2 + b^2)
hyp(3, 4)

# Date calculations
today - 3 weeks
now + 36 hours - 2 days
yesterday - 1 year

ladle = 6 tablespoons
gravyBoat = 5 ladle
3 gravyBoat in cups

hexToChar("D83DDE43")
charToHex("👾")

anArray = [[2, 0], [-1, 3]]
aMatrix = matrix([[7, 1], [-2, 3]])
multiply(anArray, aMatrix)
aMatrix * 2

[2, 3, 4] - 3

add(aMatrix, 2)

det(aMatrix)
det(anArray)
sum
avg`;

export default demoText;
