
//Create a reference to the pixel data for our drawing.
pixelDataRef = new Firebase("https://<YOUR-FIREBASE-NAME>.firebaseio.com/demo1");

$(function(){
  
  //Draw a line from the mouse's last position to its current position
  var drawLineOnMouseMove = function(e) {
    if (!mouseDown) return;
    var obj = doAlgorithm(e.pageX, e.pageY);
    
    do {
      //write the pixel into Firebase, or if we are drawing white, remove the pixel
      pixelDataRef.child(obj.x0 + ":" + obj.y0).set(currentColor === "fff" ? null : currentColor);
        
    } while (!lineNotFinished(obj))

    lastPoint = [obj.x1, obj.y1];
  };


  $(myCanvas).on('mousemove', drawLineOnMouseMove);
  $(myCanvas).on('mousedown', drawLineOnMouseMove);


  var drawPixel = function(snapshot) {
    // Fill this pixel
    var coords = snapshot.key().split(":");
    myContext.fillStyle = "#" + snapshot.val();
    myContext.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
    // Note that child_added events will be fired for initial pixel data as well.
  }


  pixelDataRef.on("child_added", drawPixel);
  pixelDataRef.on("child_changed", drawPixel);


  pixelDataRef.on("child_removed", function(snapshot) {
    // Clear this pixel
    var coords = snapshot.key().split(":");
    myContext.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
  });

  
});