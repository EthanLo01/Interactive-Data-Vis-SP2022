const margin = {top: 10, right: 30, bottom: 30, left: 50},
      width = window.innerWidth * .7,
      height = window.innerHeight * .7;

// append the svg object to the body of the page
const svg = d3.select("#container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("../data/17400C.csv",

  // When reading the csv, I must format variables:
  d => {
    return {
          date: d.time,
          value : d.price
        }
      }).then(

  // Now I can use this dataset:
  function(data) {

  // Add X axis --> it is a date format
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.value)])
    .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

  // Add the area
  svg.append("path")
    .datum(data)
    .attr("fill", "#cce5df")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr("d", d3.area()
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.value))
        )
    })
