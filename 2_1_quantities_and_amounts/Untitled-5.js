/* CONSTANTS AND GLOBALS */
const width = window.innerWidth *.08;
const height = window.innerHeight /3;
const margin = { top: 20, bottom: 60, left: 60, right: 40 }


/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
  .then(data => {
    console.log("data", data)

    /* SCALES */


    const xScale = d3.scaleLinear()
      .domain([0,d3.max(data, d => d.count)])
      .range([margin.left, width - margin.right])

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.activity))
      .range([height - margin.bottom, margin.top])
      .paddingInner(.2)
    /** This is where you should define your scales from data to pixel space */
    
    const svg = d3.select('#container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */

    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('width', d => xScale(d.count))
      .attr('height', yScale.bandwidth())
      .attr("y", d => yScale(d.activity))
      .attr("x")
  })

