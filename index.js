/*!  Curve calc function for canvas 2.3.7
 *  (c) Epistemex 2013-2016
 *  www.epistemex.com
 *  License: MIT
 */

/**
 * Calculates an array containing points representing a cardinal spline through given point array.
 * Points must be arranged as: [x1, y1, x2, y2, ..., xn, yn].
 *
 * There must be a minimum of two points in the input array but the function
 * is only useful where there are three points or more.
 *
 * The points for the cardinal spline are returned as a new array.
 *
 * @param {Array} points - point array
 * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
 * @param {Number} [numOfSeg=25] - number of segments between two points (line resolution)
 * @param {Boolean} [close=false] - Close the ends making the line continuous
 * @returns {Float32Array} New array with the calculated points that was added to the path
 */
module.exports =
function getCurvePoints(points, tension, numOfSeg, close) {

  'use strict';

  if (typeof points === "undefined" || points.length < 2) return new Float32Array(0);

  // options or defaults
  tension = typeof tension === "number" ? tension : 0.5;
  numOfSeg = typeof numOfSeg === "number" ? numOfSeg : 25;

  var pts,                              // for cloning point array
    l = points.length,
    rPos = 0,
    rLen = (l-2) * numOfSeg + 2 + (close ? 2 * numOfSeg: 0),
    res = [],
    cache = new Float32Array((numOfSeg + 2) << 2),
    cachePtr = 4;

  pts = points.slice(0);

  if (close) {
    pts.unshift(points[l - 1]);                    // insert end point as first point
    pts.unshift(points[l - 2]);
    pts.push(points[0], points[1]);                 // first point as last point
  }
  else {
    pts.unshift(points[1]);                      // copy 1. point and insert at beginning
    pts.unshift(points[0]);
    pts.push(points[l - 2], points[l - 1]);              // duplicate end-points
  }

  // cache inner-loop calculations as they are based on t alone
  cache[0] = 1;                            // 1,0,0,0

  for (var i = 1; i < numOfSeg; i++) {

    var st = i / numOfSeg,
      st2 = st * st,
      st3 = st2 * st,
      st23 = st3 * 2,
      st32 = st2 * 3;

    cache[cachePtr++] =  st23 - st32 + 1;              // c1
    cache[cachePtr++] =  st32 - st23;                // c2
    cache[cachePtr++] =  st3 - 2 * st2 + st;              // c3
    cache[cachePtr++] =  st3 - st2;                  // c4
  }

  cache[++cachePtr] = 1;                        // 0,1,0,0

  // calc. points
  parse(pts, cache, l, tension);

  if (close) {
    //l = points.length;
    pts = [];
    pts.push(
      points[l - 4], points[l - 3],

      points[l - 2], points[l - 1],               // second last and last

      points[0], points[1],

      points[2], points[3]
    );                 // first and second
    parse(pts, cache, 4, tension);
  }

  function parse(pts, cache, l, tension) {

    for (var i = 2, t; i < l; i += 2) {

      var pt1x = pts[i],
        pt1y = pts[i+1],
        pt2x = pts[i+2],
        pt2y = pts[i+3],

        t1x = (pt2x - pts[i-2]) * tension,
        t1y = (pt2y - pts[i-1]) * tension,
        t2x = (pts[i+4] - pt1x) * tension,
        t2y = (pts[i+5] - pt1y) * tension,
        c = 0, c1, c2, c3, c4;

      for (t = 0; t < numOfSeg; t++) {

        c1 = cache[c++];
        c2 = cache[c++];
        c3 = cache[c++];
        c4 = cache[c++];

        res.push([
          c1 * pt1x + c2 * pt2x + c3 * t1x + c4 * t2x,
          c1 * pt1y + c2 * pt2y + c3 * t1y + c4 * t2y
        ])
      }
    }
  }

  // add last point
  l = close ? 0 : points.length - 2;
  res.push([points[l++], points[l]])

  return res
}






