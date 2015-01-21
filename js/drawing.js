//Set up some globals
var pixSize = 8, lastPoint = null, currentColor = "000", mouseDown = 0, myCanvas = null, myContext = null, pixelDataRef = null;

//Setup each color palette & add it to the screen
var colors = ["fff","000","f00","0f0","00f","88f","f8d","f88","f05","f80","0f8","cf0","08f","408","ff8","8ff"];

function doAlgorithm(pageX, pageY, obj) {
  var offset = $("canvas").offset();
  var x1 = Math.floor((pageX - offset.left) / pixSize - 1),
    y1 = Math.floor((pageY - offset.top) / pixSize - 1);
  var x0 = (lastPoint == null) ? x1 : lastPoint[0];
  var y0 = (lastPoint == null) ? y1 : lastPoint[1];
  var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;

  var obj = {
    offset:offset,
    x0:x0,
    x1:x1,
    y0:y0,
    y1:y1,
    dx:dx,
    dy:dy,
    sx:sx,
    sy:sy,
    err:err
  };
  return obj;
};

function lineNotFinished(obj) {
  var e2 = 2 * obj.err;
  if (e2 > -obj.dy) {
    obj.err = obj.err - obj.dy;
    obj.x0 = obj.x0 + obj.sx;
  }
  if (e2 < obj.dx) {
    obj.err = obj.err + obj.dx;
    obj.y0 = obj.y0 + obj.sy;
  }
  return obj.x0 == obj.x1 && obj.y0 == obj.y1;
};

$(function() {
  
  // Set up our canvas
  myCanvas = document.getElementById("drawing-canvas");
  myContext = myCanvas.getContext ? myCanvas.getContext("2d") : null;
  if (myContext == null) {
    alert("You must use a browser that supports HTML5 Canvas to run this demo.");
    return;
  }

  for (c in colors) {
    var item = $("<div/>").css("background-color", "#" + colors[c]).addClass("colorbox");
    item.click((function () {
      var col = colors[c];
      return function () {
        currentColor = col;
      };
    })());
    item.appendTo("#colorholder");
  }

  $('#clear-screen').click(function(){
    pixelDataRef.set(null);
  });

  //Keep track of if the mouse is up or down
  myCanvas.onmousedown = function () {mouseDown = 1;};
  myCanvas.onmouseout = myCanvas.onmouseup = function () {
    mouseDown = 0, lastPoint = null;
  };
});
