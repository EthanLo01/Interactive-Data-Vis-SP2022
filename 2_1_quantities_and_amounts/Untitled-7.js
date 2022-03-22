/* CONSTANTS AND GLOBALS */
const width = window.innerWidth *.8 ;
const height = window.innerWidth *.5;
const margin = { top: 20, bottom: 60, left: 60, right: 40 }

console.log(margin.left)
/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
.then(data => {
  console.log("data", data)

  /* SCALES */
  // xscale - categorical, activity
  const yScale = d3.scaleBand()
    .domain(data.map(d=> d.activity))
    .range([height - margin.bottom, margin.top])
     // visual variable
    .paddingInner(.2)

    // yscale - linear,count
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.count)])
    .range([margin.left, width - margin.right])

  /* HTML ELEMENTS */
  // svg
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)



  // axis scales
  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);
  
  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);
    
  // bars
  svg.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('width', d => xScale(d.count))
  .attr('height', yScale.bandwidth())
  .attr("y", d => yScale(d.activity))
  .attr("x")

  
})