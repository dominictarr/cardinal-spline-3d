var canvas = document.createElement('canvas')
canvas.width = window.innerWidth - 20
canvas.height = window.innerHeight - 20

document.body.appendChild(canvas)

var ctx = canvas.getContext('2d')

var spline = require('./')

var input = []
for(var i = 0; i < 10; i++) {
  input.push([Math.random()*canvas.width, Math.random()*canvas.height])
}

var _input = []
input.forEach(function (p) {
  _input.push(p[0]); _input.push(p[1])
})

var a = spline(_input, 0.5, 10)

ctx.beginPath()
for(var i = 0; i < a.length; i+=2) {
  if(i) ctx.lineTo(a[i], a[i+1])
  else ctx.moveTo(a[i], a[i+1])
}
ctx.stroke()

ctx.fillStyle = 'red'
for(var i = 0; i < input.length; i++)
  ctx.fillRect(input[i][0],input[i][1], 10, 10)
ctx.stroke()

console.log(input)

console.log("RED")

