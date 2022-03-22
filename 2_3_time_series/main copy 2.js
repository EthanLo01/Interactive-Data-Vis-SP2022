 /* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * .7,
 height = window.innerHeight * .7,
 margin = 30;


// var parseTime = d3.timeParse("%Y%m%d %H%M%S");
// var parseTime = d3.time.format("%Y-%m-%d %H:%M:%S");

// var parseTime = d3.timeParse("%H:%M:%S");
// var format = d3.time.format("%Y%m%d %H%M%S")

/* LOAD DATA */
d3.csv('../data/17400C.csv', d => {
 return {
  //  datetime: format(new Date(+d.datetime, 0, 1)),
   price: d.price ,
   time: d.time,
   volume: d.volume
 }
}).then(data => {
 console.log('data :>> ', data);

 // SCALES

 const xScale = d3.scaleTime()
   .domain(d3.extent(data, d=> d.time))
   .range([margin, width-margin])

 const yScale = d3.scaleLinear()
   .domain(d3.extent(data, d=> d.price))
   .range([height-margin, margin])

 // CREATE SVG ELEMENT

 const svg = d3.select("#container")
   .append("svg")
   .attr("width", width)
   .attr("height", height)

 // BUILD AND CALL AXES

 // LINE GENERATOR FUNCTION
 const lineGen = d3.line()
   .x(d => xScale(d.time))
   .y(d => yScale(d.price))

 // DRAW LINE
 svg.selectAll("path.line")
   .data([data])
   .join("path")
   .attr("class", "line")
   .attr("stroke", "blue")
   .attr("fill","none")
   .attr("d", d => lineGen(d))

});