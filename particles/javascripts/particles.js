var z = d3.scale.category20c(),
    i = 0;

// original position
var originX = 600;
var originY = 300;
var posX, posY;

var maxX = 600;
var maxY = 300;
var maxSpan = 100;

function translateXScreenDistance(distance) {
  return (distance / maxSpan) * maxX;
}

function translateYScreenDistance(distance) {
  return maxY - ((distance / maxSpan) * maxY);
}

var svg = d3.select("body").append("svg:svg");

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

var pointer;
Leap.loop(function(frame) {
  for (var i = 0; i < frame.pointables.length; i++) {
    pointer = frame.pointables[i];
    posX = originX + translateXScreenDistance(pointer.tipPosition[0]);
    posY = originY + translateYScreenDistance(pointer.tipPosition[1]);
    particle(posX, posY);
  }
});
