/* CONSTANTS AND GLOBALS */
const width = window.innerWidth *.8 ;
//const height = 500;
const height = window.innerWidth *.8;

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)

.then(data => {
  console.log("data", data)

  /* SCALES */


    // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.activity)])
    .range([height, 0])

    
  // xscale - categorical, count 
  const xScale = d3.scaleBand()
    .domain(data.map(d=> d.count))
    .range([width, 0]) // visual variable
    .paddingInner(.2)
 
  /* HTML ELEMENTS */
  // svg
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)


  // bars
  svg.selectAll("rect")
    .data(data)
    .join("rect")
    //.attr("width", xScale.bandwidth())
    //.attr("height", d=> height - yScale(d.count))
       .attr("width", xScale.bandwidth())
       .attr("height", d=> yScale(d.activity))
    //.attr("x", d=>xScale(d.activity))
    //.attr("y", d=> yScale(d.count))
    .attr("x", d=> xScale(d.count))
    .attr("y", d=>yScale(d.activity))



    
})