/* CONSTANTS AND GLOBALS */
const width = window.innerWidth *.8 ;
const height = 400;


/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
.then(data => {
  console.log("data", data)

  /* SCALES */
  // xscale - categorical, activity
  const xScale = d3.scaleBand()
    .domain(data.map(d=> d.activity))
    .range([0, width]) // visual variable
    .paddingInner(.2)

    // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.count)])
    .range([height, 0])

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
    .attr("width", xScale.bandwidth())
    .attr("height", d=> height - yScale(d.count))
    .attr("x", d=>xScale(d.activity))
    .attr("y", d=> yScale(d.count))


    var x_axis = d3.axisBottom()
        .scale(xScale);

    var y_axis = d3.axisLeft()
        .scale(yScale);

    svg.append("g")
    .attr("transform", "translate(50, 10)")
    .call(y_axis);

    var xAxisTranslate = height/2 + 10;

    svg.append("g")
            .attr("transform", "translate(50, " + xAxisTranslate  +")")
            .call(x_axis)

    
})