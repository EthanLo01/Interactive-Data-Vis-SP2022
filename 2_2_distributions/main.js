/* CONSTANTS AND GLOBALS */
const width = window.innerWidth* .7;
const height = window.innerWidth* .7;
const margin =  {top: 10, bottom: 10, left: 10, right:10};
//   radius = ;

/* LOAD DATA */
d3.json("../data/environmentRatings.json", d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.envScore2020)])
      .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(d => d.ideologyScore2020)])
      .range([height - margin.bottom, margin.top])

    /* HTML ELEMENTS */
    const svg = d3.select('#container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
    
    svg.selectAll('circle')
      .data(data, d => d.BioID)
      .join('circle')
      .attr('cx', d => xScale(d.envScore2020))
      .attr('cy', d => yScale(d.ideologyScore2020))
      .attr('r', 3)
  });
