/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

/* LOAD DATA */
d3.json("../data/DatabaseJSONFile.json", d3.autoType).then(data => {
  console.log(data)

  /* SCALES */
  // xscale  - linear,count
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d.unit_cost))])
    .range([margin.left, width - margin.right])

    // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.quantity)])
    //.domain([0, d3.max(data, d => d.envScoreLifetime)])
    .range([height - margin.bottom, margin.top])

  const colorScale = d3.scaleOrdinal()
    .domain(["Wisozk Inc", "Keebler-Hilpert", 'Schmitt-Weissnat'])
    .range(["red", "blue", "purple"])

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

  // append x, y label
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - margin.top)
    .text("Unit Cost");

  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", `translate(${margin.left},0)`,  "rotate(-90)")
    .attr("transform", "rotate(-90)")
    .text("Quantity");

  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", (height - margin.bottom/3))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Ethan Company Supplier List");

  // circles
  const dot = svg
    .selectAll("circle")
    .data(data, d => d.BioID) // second argument is the unique key for that row
    .join("circle")
    .attr("cx", d => xScale(d.unit_cost))
    .attr("cy", d => yScale(d.quantity))
    // .attr("r", radius)

    .attr("fill", d => colorScale(d.supplier))
    // .attr('r',5)

  // d3.selectAll('circle')
  // .style('fill', 'orange')


    // .attr('r', function() {
    //   return 10 + Math.random() * 40
    // });

    .attr('r', 
    d => (d.customer_satisfaction/5 + 1)
     
  );

    // .attr('r', 
    //   d => yScale(d.quantity)/15 + 5
       
    // );
  // .attr('r', function() {
  //   d => xScale(d.unit_cost)
  // return d



      // rect
  // const dot = svg
  // .selectAll("rect")
  // .data(data, d => d.BioID) // second argument is the unique key for that row
  // .join("rect")
  // .attr("x", d => xScale(d.quantity))
  // .attr("y", d => yScale(d.quantity))

  // .attr("fill", d => colorScale(d.supplier))
  // .attr("width", 50)
  // .attr("height", 50);
});