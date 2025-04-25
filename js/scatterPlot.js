function drawScatterPlot(data) {
    console.log("Scatter Plot Data:", data); // Debugging
    d3.select("#scatter-plot").html(""); // Clear previous chart

    const width = 600;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    const svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const tooltip = d3.select("#tooltip");

    // Adjust x and y domains with padding
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.gdpPerCapita) * 0.9, d3.max(data, d => d.gdpPerCapita) * 1.1]) // Add padding
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.ageAtStart) * 0.9, d3.max(data, d => d.ageAtStart) * 1.1]) // Add padding
        .range([height - margin.bottom, margin.top]);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    // Add y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    // Add points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.gdpPerCapita))
        .attr("cy", d => y(d.ageAtStart))
        .attr("r", 5)
        .attr("fill", "blue")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`GDP per Capita: ${d.gdpPerCapita}<br>Age at Start: ${d.ageAtStart}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mousemove", event => {
            tooltip.style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
        });
}