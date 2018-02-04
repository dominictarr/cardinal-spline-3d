var spline = require('./')

var input = []
for(var i = 0; i < 20; i++)
  input.push([Math.random()*100 - 50, Math.random()*100 - 50, Math.random()*100 - 50])

var start = Date.now()
var a = spline(input, 0.8, 40)
console.log('SPLINE',a.length, Date.now()-start)
//var a = input
var csg = require('@jscad/csg').CSG
CSG = csg

module.exports = function () {
  var c
  var start = Date.now()
  var _ts = start
  console.log(a.length, a)
  for(var i = 0; i < Math.min(a.length, 760); i++) {
    var _c = csg.cube({size: 4})
              .translate(a[i])
    if(c) c = c.unionForNonIntersecting(_c)
    else c = _c
    var ts = Date.now()
    if(ts > _ts+1000) {
      console.log(i, _ts-start)
      _ts = ts
    }
  }
  console.log('time', Date.now()-start)

  return c

  return a.reduce(function (a, b) {
    if(!a)
      return csg.cube({center: {x: b[0], y: b[1], z: 0}, size: 4})
    return a.union(csg.cube({center: {x: b[0], y: b[1], z: 0}, size: 4}))
  }, null)
}














