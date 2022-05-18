/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 60 },
  radius = 3;

/*
this extrapolated function allows us to replace the "G" with "B" min the case of billions.
we cannot do this in the .tickFormat() because we need to pass a function as an argument,
and replace needs to act on the text (result of the function).
*/
// const formatBillions = (num) => d3.format(".2s")(num).replace(/G/, 'B')
const formatDate = d3.timeFormat("%Y%m%d %H%M%S") 

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let yAxis;
let xAxisGroup;
let yAxisGroup;

/* APPLICATION contract */
let contract = {
  data: [],
  selection: "All", // + YOUR FILTER SELECTION
};

/* APPLICATION contract */
let contract1 = {
  data: [],
  selection: "All", // + YOUR FILTER SELECTION
};


/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv('../data/day_df.csv', d => {
  // use custom initializer to reformat the data the way we want it
  // ref: https://github.com/d3/d3-fetch#dsv
  return {
    // datetime: new Date(+d3.timeParse("%Y%m%d %H%M%S")(d.datetime)),
    // you can just use "new Date ()" to have d3 recognize as date format
    datetime: new Date (d.datetime),
    name: d.name,
    price: +d.C
  }
})
.then(data => {
  console.log("loaded data:", data);
  function sortByDateAscending(a, b) {
    // sort data by date earliest to latest:
    return a.datetime - b.datetime;
} data = data.sort(sortByDateAscending);
console.log("sorted data:", data);
  contract.data = data;
  contract1.data = data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3.scaleTime()
    .domain(d3.extent(contract.data, d => d.datetime))
    .range([margin.right, width - margin.left])

  yScale = d3.scaleLinear()
    .domain(d3.extent(contract.data, d => d.price))
    .range([height - margin.bottom, margin.top])

  // + AXES
  const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%m/%d %H:%M"))
        .ticks(10) // limit the number of tick marks showing -- note: this is approximate
  yAxis = d3.axisLeft(yScale)
    // .tickFormat(formatDate)

  // + UI ELEMENT SETUP
  const selectElement = d3.select("#dropdown")

  // add in dropdown options from the unique values in the data
  selectElement.selectAll("option")
    .data([
      // manually add the first value
      "Select a country",
      // add in all the unique values from the dataset
      ...new Set(contract.data.map(d => d.name))])
    .join("option")
    .attr("attr", d => d)
    .text(d => d)

  // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)
  selectElement.on("change", event => {
    contract.selection = event.target.value
    console.log('contract has been updated to: ', contract)

  draw(contract, contract1);// re-draw the graph based on this new selection


  });

// + UI ELEMENT SETUP
const selectElement1 = d3.select("#dropdown1")

// add in dropdown options from the unique values in the data
selectElement1.selectAll("option")
  .data([
    // manually add the first value
    "Select a country",
    // add in all the unique values from the dataset
    ...new Set(contract1.data.map(d => d.name))])
  .join("option")
  .attr("attr", d => d)
  .text(d => d)

// + SET SELECT ELEMENT'S DEFAULT VALUE (optional)
selectElement1.on("change", event => {
  contract1.selection = event.target.value
  console.log('contract has been updated to: ', contract1)


  
  draw(contract, contract1);// re-draw the graph based on this new selection

});
  

  // + CREATE SVG ELEMENT
  svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // + CALL AXES
  xAxisGroup = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)

  xAxisGroup.append("text")
    .attr("class", 'xLabel')
    .attr("transform", `translate(${width / 2}, ${35})`)
    .text("Year")

  yAxisGroup = svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.right}, ${0})`)
    .call(yAxis)

  yAxisGroup.append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-45}, ${height / 2})`)
    .attr("writing-mode", 'vertical-rl')
    .text("price")

  draw(contract, contract1);// re-draw the graph based on this new selection
  // draw(contract1); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/contract
function draw(con, con1) {
  // + FILTER DATA BASED ON contract
  const filteredData = con.data
    .filter(d => d.name === con.selection)

  const filteredData_max = d3.max(filteredData, d => d.price)


  const filteredData1 = con1.data
  .filter(d => d.name === con1.selection)

  const filteredData_max1 = d3.max(filteredData1, d => d.price)

  const maxest =Math.max(filteredData_max, filteredData_max1)
  console.log('maxest: ', maxest)



  // + UPDATE SCALE(S), if needed
  yScale.domain([0, maxest])
  // + UPDATE AXIS/AXES, if needed
  yAxisGroup
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale))// need to udpate the scale

  // specify line generator function
  const lineGen = d3.line()
    .x(d => xScale(d.datetime))
    .y(d => yScale(d.price))

  // + DRAW LINE AND/OR AREA
  svg.selectAll(".line")
    .data([filteredData, filteredData1]) // data needs to take an []
    .join("path")
    .attr("class", 'line')
    .attr("fill", "none")
    .attr("stroke", "black")
    .transition()
    .duration(1000)
    .attr("d", d => lineGen(d))
}