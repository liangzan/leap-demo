var scale = d3.scale.category20c(),
    i = 0;

// original position
var originX = 600;
var originY = 300;
var originZ = 600;
var posX, posY;

var maxX = originX;
var maxY = originY;
var maxZ = originZ;

var maxSpan = 100;
var maxZSpan = 160;

function translateXScreenDistance(distance) {
  return (distance / maxSpan) * maxX;
}

function translateYScreenDistance(distance) {
  return maxY - ((distance / maxSpan) * maxY);
}

function translateZScreenDistance(distance){
  return (distance / maxZSpan) * maxZ;
}

var svg = d3.select("body").append("svg:svg");

function particle(x, y, z) {
  svg.append("svg:circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 1e-6 + (z / 20))
      .style("stroke", scale(++i))
      .style("stroke-opacity", 1 - ((maxZ -z) / 1000))
    .transition()
      .duration(2000)
      .ease(Math.sqrt)
      .attr("r", 100 + (z / 20))
      .style("stroke-opacity", 1e-6)
      .remove();
}

var pointer;

Leap.loop(function(frame) {
  for (var i = 0; i < frame.pointables.length; i++) {
    pointer = frame.pointables[i];
    posX = originX + translateXScreenDistance(pointer.tipPosition[0]);
    posY = originY + translateYScreenDistance(pointer.tipPosition[1]);
    posZ = originZ + translateZScreenDistance(pointer.tipPosition[2]);

    particle(posX, posY, posZ);
  }
});
