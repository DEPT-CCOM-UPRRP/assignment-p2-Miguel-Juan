function drawLexisChart(data) {
    d3.select("#lexis-chart").html(""); // Clear previous chart

    const width = 600;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    const svg = d3.select("#lexis-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const tooltip = d3.select("#tooltip");

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.termStart))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.ageAtStart))
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    svg.selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => x(d.termStart))
        .attr("x2", d => x(d.termEnd))
        .attr("y1", d => y(d.ageAtStart))
        .attr("y2", d => y(d.ageAtStart + (d.termEnd - d.termStart)))
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`Leader: ${d.leader}<br>Term: ${d.termStart} - ${d.termEnd}<br>Age at Start: ${d.ageAtStart}`)
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