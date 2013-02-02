// original position
var originX = 600;
var originY = 300;
var _r = new DollarRecognizer();
var posX, posY, ctx, canvas, translatedX, translatedY;
var prevX = 0;
var prevY = 0;
var _points = [];
var maxX = 600;
var maxY = 300;
var maxSpan = 100;
var z = d3.scale.category20c();
var i = 0;
var svg;

$(document).ready(function() {
  svg = d3.select("body").append("svg:svg");
});

function translateX(distance) {
  return Math.floor((distance / maxSpan) * maxX);
}

function translateY(distance) {
  return Math.floor(maxY - ((distance / maxSpan) * maxY));
}

function particle(x, y) {
  svg.append("svg:circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 1e-6)
      .style("stroke", z(++i))
      .style("stroke-opacity", 1)
    .transition()
      .duration(2000)
      .ease(Math.sqrt)
      .attr("r", 100)
      .style("stroke-opacity", 1e-6)
      .remove();
}

var draw = function(posX, posY) {
  translatedX = originX + translateX(posX);
  translatedY = originY + translateY(posY);
  particle(translatedX, translatedY);
};

var pointMove = function(frame) {
  var pointer = frame.pointables[0];
  posX = pointer.tipPosition[0];
  posY = pointer.tipPosition[1];
  if (Math.abs(posX - prevX) > 3 || Math.abs(posY - prevY) > 3) {
    _points.push(new Point(posX, posY));
    prevX = posX;
    prevY = prevY;
    draw(posX, posY);
  }
};

var pointStart = function(frame) {
};

var pointEnd = function(frame) {
  if (_points.length > 10) {
    var result = _r.Recognize(_points);
    $("#shapeOutput").text(result.Name);
    $("#mathOutput").text(Math.round(result.Score*100) + "%");
  }
  _points = [];
};

var fsm = StateMachine.create({
  initial: 'fist',
  events: [
    { name: 'pointstart', from: 'fist',  to: 'point' },
    { name: 'pointend', from: 'point', to: 'fist' }
  ],
  callbacks: {
    onpointstart: pointStart,
    onpointend: pointEnd
  }
});

Leap.loop(function(frame) {
  if (frame.pointables.length === 0 && fsm.current === 'point') {
    fsm.pointend(frame);
  } else if (frame.pointables.length === 1 && fsm.current === 'fist') {
    fsm.pointstart(frame);
  } else if (frame.pointables.length === 1 && fsm.current == 'point') {
    pointMove(frame);
  }
});
