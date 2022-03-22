/* CONSTANTS AND GLOBALS */
const width = window.innerWidth *.8 ;
const height = window.innerWidth *.8;
const margin = { top: 20, bottom: 60, left: 60, right: 40 }

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
.then(data => {
  console.log("data", data)

  /* SCALES */
  // xscale - categorical, activity
  const xScale = d3.scaleBand()
    .domain(data.map(d=> d.activity))
    .range([margin.left, width - margin.right]) // visual variable
    .paddingInner(.2)

    // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.count)])
    .range([height - margin.bottom, margin.top])

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
  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", d=> height - yScale(d.count))
    .attr("x", d=>xScale(d.activity))
    .attr("y", d=> yScale(d.count))
})