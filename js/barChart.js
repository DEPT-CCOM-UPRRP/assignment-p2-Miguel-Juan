function drawBarChart(data) {
    d3.select("#bar-chart").html(""); // Clear previous chart

    const width = 600;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 100, left: 60 };

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const tooltip = d3.select("#tooltip");

    const counts = d3.rollup(data, v => v.length, d => d.country);
    const sorted = Array.from(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const x = d3.scaleBand()
        .domain(sorted.map(d => d[0]))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sorted, d => d[1])])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    svg.selectAll("rect")
        .data(sorted)
        .enter()
        .append("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(0) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("fill", "orange")
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`Country: ${d[0]}<br>Count: ${d[1]}`)
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