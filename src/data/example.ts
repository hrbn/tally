const exampleContent = `### Examples ###

1.2 / (3.3 + 1.7)
3M / 6k
5 % 2
total

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
height = 6 feet
width = 30 inches
width + height in meters

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

# Functions 
# [https://mathjs.org/docs/index.html]
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

line39
line30
sum
avg

[2, 3, 4] - 3`;

export default exampleContent;
