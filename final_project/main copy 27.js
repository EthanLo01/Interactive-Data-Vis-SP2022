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

let xScale1;
let yScale1;
let yAxis1;
let xAxisGroup1;
let yAxisGroup1;

let tooltip;

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
    contract_month: d.contract_month,
    strike_price: d.strike_price,
    cp: d.cp,
    price: +d.C,
    volume: +d.volume
  }
})
.then(data => {
  console.log("loaded data:", data);
  //  function to sort data within code
  function sortByCountryDateAscending(a, b) {
    // sorting code goes here!
    return a.name.localeCompare(b.name) || a.datetime - b.datetime;
} data = data.sort(sortByCountryDateAscending);

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

   // + SCALES
  xScale1 = d3.scaleTime()
  .domain(d3.extent(contract1.data, d => d.datetime))
  .range([margin.right, width - margin.left])

  yScale1 = d3.scaleLinear()
  .domain(d3.extent(contract1.data, d => d.price))
  .range([height - margin.bottom, margin.top])

  // + AXES
  const xAxis1 = d3.axisBottom(xScale1)
      .tickFormat(d3.timeFormat("%m/%d %H:%M"))
      .ticks(10) // limit the number of tick marks showing -- note: this is approximate
  yAxis1 = d3.axisLeft(yScale1)


  

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

  // + CALL AXES
  xAxisGroup1 = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis1)

  xAxisGroup1.append("text")
    .attr("class", 'xLabel')
    .attr("transform", `translate(${width / 2}, ${35})`)
    .text("Year")

  yAxisGroup1 = svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.right}, ${0})`)
    .call(yAxis1)

  yAxisGroup1.append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-45}, ${height / 2})`)
    .attr("writing-mode", 'vertical-rl')
    .text("price")

  tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("z-index", "10")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("tooltip"); 

  
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

  const maxest = Math.max(filteredData_max, filteredData_max1)
  console.log('maxest: ', maxest)



  // + UPDATE SCALE(S), if needed
  yScale.domain([0, maxest])
  // + UPDATE AXIS/AXES, if needed
  yAxisGroup
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale))// need to udpate the scale

  // + UPDATE SCALE(S), if needed
  yScale1.domain([0, maxest])
  // + UPDATE AXIS/AXES, if needed
  yAxisGroup1
    .transition()
    .duration(1000)
    .call(yAxis1.scale(yScale1))// need to udpate the scale

  // specify line generator function
  const lineGen = d3.line()
    .x(d => xScale(d.datetime))
    .y(d => yScale(d.price))
  
  // specify line generator function
  const lineGen1 = d3.bar()
    .x(d => xScale1(d.datetime))
    .y(d => yScale1(d.volume))



  // // + DRAW LINE AND/OR AREA
  svg.selectAll(".line")
    .data([filteredData]) // data needs to take an []
    .join("path")
    .attr("class", 'line')
    .attr("fill", "none")
    .attr('stroke', "black")
    .transition()
    .duration(1000)
    .attr("d", d => lineGen(d))

  // // + DRAW LINE AND/OR AREA
  svg.selectAll(".line1")
    .data([filteredData1]) // data needs to take an []
    .join("path")
    .attr("class", 'line')
    .attr("fill", "none")
    .attr('stroke', "blue")
    .transition()
    .duration(2000)
    .attr("d", d => lineGen(d))

  // // + DRAW LINE AND/OR AREA
  svg.selectAll(".line2")
    .data([filteredData1]) // data needs to take an []
    .join("path")
    .attr("class", 'bra')
    .attr("fill", "none")
    .attr('stroke', "blue")
    .transition()
    .duration(2000)
    .attr("d", d => lineGen1(d))


  svg.selectAll(".circle-point")
    .data(filteredData)
    .join("circle") // enter append
      .attr("class", "circle-point")
      .attr("r", "3") // radius
      .attr("cx", d=> xScale(d.datetime))   // center x on line
      .attr("cy", d=> yScale(d.price))   // center y on line
      .attr("fill", "white")
      .attr("opacity", 0.01)
      .on("mouseover", function(event,d,i){return tooltip
        .html(`<div>datetime: ${d.datetime} <br>
                    Price: ${d.price} </div>`)
         .style("visibility", "visible");})
      .on("mousemove", function(event){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  svg.selectAll(".circle-point1")
  .data(filteredData1)
  .join("circle") // enter append
    .attr("class", "circle-point")
    .attr("r", "3") // radius
    .attr("cx", d=> xScale(d.datetime))   // center x on line
    .attr("cy", d=> yScale(d.price))   // center y on line
    .attr("fill", "white")
    .attr("opacity", 0.01)
    .on("mouseover", function(event,d,i){return tooltip
      .html(`<div>datetime: ${d.datetime} <br>
                  Price: ${d.price} </div>`)
        .style("visibility", "visible");})
    .on("mousemove", function(event){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});



    
}

// Month: ${d.contract_month} <br>
// Strike Price: ${d.strike_price} <br>
// Call / Put: ${d.cp} <br>