var xScreenSize = innerWidth; // canvas size
var yScreenSize = innerHeight;
var viewX = xScreenSize/2;
var viewY = yScreenSize/2;
var oldViewX = viewX;
var oldViewY = viewY;
var mouseDownX = 0;
var mouseDownY = 0;
var mouseDownViewX = 0;
var mouseDownViewY = 0;
var buttonWasPressed = false;
var upToDraw = 0;
var downToDraw = 0;
var leftToDraw = 0;
var rightToDraw = xScreenSize;
var defPixSize = 5;
var Pixsize = defPixSize;
// xScreenSize += -xScreenSize%-Pixsize;
// yScreenSize += -yScreenSize%-Pixsize;
var zoom = 1;
var calculationString = "return x%y"
var calculation = new Function("x", "y", calculationString);
var notAllowedInCalculationString = [];
// var notAllowedInCalculationString = ['creen','inner','pix','Pix','world','hunk','view','ick','ouse','calc','Calc','setup','anvas','Date','ge','Index','getXY','isDone','background','mage','move','buttonWasPressed','key','draw','text','stroke','fill','clear','color','arc','ellipse','line','point','quad','rect','triabgle','mooth','bezier','curve','begin','end','ertex','plane','box','sphere','cylinder','cone','ellipsoid','torus','loop','load','pop','push','redraw','ursor','display','window','width','height','Density','URL','Element','raphics','atrix','rotate','scale','shear','translate','tint','Tint','blend','copy','filter','get','set','http','save','day','hour','minute','millis','month','second','year','ector'];
var beginTickTime = new Date().getTime();
var minFrameRate = 10;
var myCanvas;
var ctx;

var neededInCalculationString = ['return'];

document.addEventListener('contextmenu', event => event.preventDefault()); // prevent rightclick menu to make rihtclick control less annoying to use.

function setup() { // p5 setup
  myCanvas = createCanvas(xScreenSize, yScreenSize);
  ctx = document.getElementById("defaultCanvas0").getContext("2d", { alpha: false });
  // noSmooth();
  noStroke();
}

function move() {
  if (keyIsDown(87)) { // w
    viewY += 5;
  } else if (keyIsDown(83)) { // s
    viewY -= 5;
  } if (keyIsDown(65)) { // a
    viewX += 5;
  } else if (keyIsDown(68)) { // d
    viewX -= 5;
  }
  if (keyIsDown(187)) { // +
    zoomDrawing(1.1);
  } else if (keyIsDown(189)) { // -
    zoomDrawing(0.9)
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "KeyQ") { // q
    startHiResRender()
  }
  if (e.code === "KeyE") {
    setCalculation(prompt('enter JavaScript calculation here, using variables "x" and "y":', calculationString));
  }
  if (e.code === "KeyR") {
    setCalculation(prompt('enter JavaScript calculation here, using variables "x" and "y":', "return( (" + randomFormula(0) + ") %255)"));
  }
  console.log(e.code)
});

var buttonWasPressed = false;

function mousePressed() {
  mouseDownX = mouseX;
  mouseDownY = mouseY;
  mouseDownViewX = viewX;
  mouseDownViewY = viewY;
  buttonWasPressed = false;
}

function mouseDragged() {
  if (!buttonWasPressed) {
    viewX = mouseDownViewX + (mouseDownX-mouseX)*-1;
    viewY = mouseDownViewY + (mouseDownY-mouseY)*-1;
  }
}

function startHiResRender() {
  var hiResPixSize = prompt("enter a Pixsize");
  if (parseInt(hiResPixSize) !== NaN) {
    Pixsize = parseInt(hiResPixSize);
    rightToDraw = xScreenSize;
  } else {
    alert(hiResPixSize + " is not a valid integer");
  }
}

function moveDrawing(xOff, yOff) {
  if (xOff != 0 || yOff != 0) {
    Pixsize = defPixSize;
    copy(myCanvas,0,0,xScreenSize,yScreenSize,xOff,yOff,xScreenSize,yScreenSize);
    if (xOff < 0) {
      leftToDraw += xOff;
      if (leftToDraw < 0) {
        leftToDraw = 0;
      }
      rightToDraw -= xOff;
      if (rightToDraw > xScreenSize) {
        rightToDraw = xScreenSize;
      }
    } else if (xOff > 0) {
      leftToDraw += xOff;
      if (leftToDraw > xScreenSize) {
        leftToDraw = xScreenSize;
      }
      rightToDraw -= xOff;
      if (rightToDraw < 0) {
        rightToDraw = 0;
      }
    }
    if (yOff < 0) {
      upToDraw += yOff;
      if (upToDraw < 0) {
        upToDraw = 0;
      }
      downToDraw -= yOff;
      if (downToDraw > yScreenSize) {
        downToDraw = yScreenSize;
      }
    } else if (yOff > 0) {
      upToDraw += yOff;
      if (upToDraw > yScreenSize) {
        upToDraw = yScreenSize;
      }
      downToDraw -= yOff;
      if (downToDraw < 0) {
        downToDraw = 0;
      }
    }
  }
}

function zoomDrawing(zoomOff) {
  copy(myCanvas,0,0,xScreenSize,yScreenSize,(xScreenSize-(xScreenSize*zoomOff))/2,(yScreenSize-(yScreenSize*zoomOff))/2,xScreenSize*zoomOff,yScreenSize*zoomOff);
  zoom = zoom*zoomOff;
  Pixsize = defPixSize;
  if (zoomOff>1) {
    upToDraw = 0;
    downToDraw = 0;
    leftToDraw = xScreenSize/2;
    rightToDraw = xScreenSize/2;
  } else {
    upToDraw = upToDraw*(zoomOff)
    downToDraw = downToDraw*(zoomOff)
    leftToDraw = leftToDraw*(zoomOff)
    rightToDraw = rightToDraw*(zoomOff)
    upToDraw += yScreenSize*(1-zoomOff)/2;
    downToDraw += yScreenSize*(1-zoomOff)/2;
    leftToDraw += xScreenSize*(1-zoomOff)/2;
    rightToDraw += xScreenSize*(1-zoomOff)/2;
  }
  viewX = viewX*zoomOff-(xScreenSize*(zoomOff-1))/2;
  viewY = viewY*zoomOff-(yScreenSize*(zoomOff-1))/2;
  oldViewX = viewX
  oldViewY = viewY;
}

function doPixels() {
  // if (Pixsize == 1) {
  //   strokeWeight(1);
  // } else {
  //   strokeWeight(Pixsize*1.4);
  // }
  var screenIsDone = true;
  if (leftToDraw > Pixsize/2) {
    for (var y = round(viewY%-Pixsize); y < yScreenSize; y+=Pixsize) {
      // stroke(getVal(leftToDraw, y));
      // point(leftToDraw, y);
      var color = getVal(leftToDraw, y);
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.fillRect(leftToDraw, y,ceil(Pixsize*1.1), ceil(Pixsize*1.1));
    }
    leftToDraw -= Pixsize
    screenIsDone = false;
  }
  if (rightToDraw > Pixsize/2) {
    for (var y = round(viewY%-Pixsize); y < yScreenSize; y+=Pixsize) {
      // stroke(getVal(xScreenSize-rightToDraw, y));
      // point(xScreenSize-rightToDraw, y);
      var color = getVal(xScreenSize-rightToDraw-Pixsize, y);
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.fillRect(xScreenSize-rightToDraw-Pixsize, y, ceil(Pixsize*1.1), ceil(Pixsize*1.1));
    }
    rightToDraw -= Pixsize
    screenIsDone = false;
  }
  if (upToDraw > Pixsize/2) {
    for (var x = round(viewX%-Pixsize); x < xScreenSize; x+=Pixsize) {
      // stroke(getVal(x, upToDraw));
      // point(x, upToDraw);
      var color = getVal(x, upToDraw);
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.fillRect(x, upToDraw, ceil(Pixsize*1.1), ceil(Pixsize*1.1));
    }
    upToDraw -= Pixsize
    screenIsDone = false;
  }
  if (downToDraw > Pixsize/2) {
    for (var x = round(viewX%-Pixsize); x < xScreenSize; x+=Pixsize) {
      // stroke(getVal(x, yScreenSize-downToDraw));
      // point(x, yScreenSize-downToDraw);
      var color = getVal(x, yScreenSize-downToDraw-Pixsize);
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.fillRect(x, yScreenSize-downToDraw-Pixsize, ceil(Pixsize*1.1), ceil(Pixsize*1.1))
    }
    downToDraw -= Pixsize
    screenIsDone = false;
  }
  if (screenIsDone === true && Pixsize !== defPixSize) {
    Pixsize = defPixSize;
  }
  return(screenIsDone);
}

// formula(pointX-viewX, pointY-viewY);
function getVal(x,y) {
  return calcPixel((x-viewX)/zoom, (y-viewY)/zoom);
}

function setCalculation(_calculationString) {
  calculationString = _calculationString;
  var evaluatedCalculation = evaluateCalculation();
  while (evaluatedCalculation !== true) {
    calculationString = prompt(evaluatedCalculation, calculationString);
    evaluatedCalculation = evaluateCalculation();
  }
  calculation = new Function("x", "y", calculationString);
  viewX = xScreenSize/2;
  viewY = yScreenSize/2;
  zoom = 1;
  oldViewX = viewX;
  oldViewY = viewY;
  upToDraw = 0;
  downToDraw = 0;
  leftToDraw = 0;
  rightToDraw = xScreenSize;
  background(200);
  stroke(0)
  strokeWeight(1);
  textSize(100);
  text("loading",xScreenSize/2,yScreenSize/2);
}

function randomFormula(stackSize) {
  if (stackSize > 10) {
    return (round(random(-100,100))/10).toString();
  }
  var formulaType = floor(random(10));
  if (formulaType == 0) {
    return ("(" + randomFormula(stackSize+1) + " + " + randomFormula(stackSize+1) + ")");
  }
  if (formulaType == 1) {
    return ("(" + randomFormula(stackSize+1) + " - " + randomFormula(stackSize+1) + ")");
  }
  if (formulaType == 2) {
    return ("(" + randomFormula(stackSize+1) + " * " + randomFormula(stackSize+1) + ")");
  }
  if (formulaType == 3) {
    return ("(" + randomFormula(stackSize+1) + " / " + randomFormula(stackSize+1) + ")");
  }
  if (formulaType == 4) {
    return ("(" + randomFormula(stackSize+1) + " % " + randomFormula(stackSize+1) + ")");
  }
  if (formulaType == 5) {
    return ("(" + randomFormula(stackSize+1) + ")");
  }
  if (formulaType == 6) {
    return("x");
  }
  if (formulaType == 7) {
    return("y");
  }
  return (round(random(-100,100))/10).toString();
}

function evaluateCalculation() {
  if (calculationString.indexOf('//F') !== -1) {
    return(true);
  }
  for (var i = 0; i < neededInCalculationString.length; i++) {
    if (calculationString.indexOf(neededInCalculationString[i]) === -1) {
      return('Your formula returns nothing. To return the awnser of your formula, use "return [formulaAwnser]". If you want to view the formula anyway, add "//F" to the end of the formula.');
    }
  }
  for (var i = 0; i < notAllowedInCalculationString.length; i++) {
    if (calculationString.indexOf(notAllowedInCalculationString[i]) !== -1) {
      console.log('"' + notAllowedInCalculationString[i] + '" is not allowed.');
      return('There is a chance that you are using a variable/function that, when changed/called, can crash the program. make sure all your own variables begin with "my" or rename them completely. If you want to view the formula anyway, add "//F" to the end of the formula.');
    }
  }
  return(true);
}

// function formula(x,y) {
//   return(abs(x%y));
// }

function calcPixel(x,y) {
  var doneCalc = calculation(x, -y); // vertical flip, if not flipped graphs will be upsideDown.
  if (typeof doneCalc === 'boolean') {
    if (doneCalc) {
      return([255,255,255]);
    }
    return([0,0,0]);
  } if (!isNaN(doneCalc)) { // 'if notnot a number' is the same as 'if a number' ;)
    return([doneCalc,doneCalc,doneCalc]);
  } if (typeof doneCalc === 'object') {// array
    return(doneCalc)
  }
  return([NaN,NaN,NaN]);
}

function mouseInArea(x,y,x2,y2) {
  return(mouseX >= x && mouseX <= x2 && mouseY >= y && mouseY <= y2);
}

function getIndex(x,y,width) {
  return(x+y*width);
}

function getXYsize(index, width) {
  return([index%width,Math.floor(index/width)]);
}

function ticksPassed(oldDate) {
  if ((new Date().getTime() - oldDate)/1000*minFrameRate < 10) { // no lag detection
    return((new Date().getTime() - oldDate)/1000*minFrameRate);
  }
  return(1); // in extreme lag situations
}

function draw(){ // p5 loop
  beginTickTime = new Date().getTime();
  move();
  moveDrawing(viewX-oldViewX,viewY-oldViewY);
  oldViewX = viewX;
  oldViewY = viewY;
  while (ticksPassed(beginTickTime) < 1) {
    if (doPixels()) {
      break;
    }
  }
}
