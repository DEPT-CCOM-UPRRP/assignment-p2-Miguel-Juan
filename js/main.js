d3.csv("leaderlist.csv").then(data => {
    console.log("Raw Data:", data); // Debugging

    // Process the data to match the expected structure
    data.forEach(d => {
        d.birthYear = +d.birthyear; // Match 'birthyear' from CSV
        d.termStart = +d.start_year; // Match 'start_year' from CSV
        d.termEnd = +d.end_year; // Match 'end_year' from CSV
        d.ageAtStart = d.termStart - d.birthYear;
        d.gdpPerCapita = +d.pcgdp; // Match 'pcgdp' from CSV
    });

    console.log("Processed Data:", data); // Debugging

    // Define the application state
    const state = {
        selectedGroup: "oecd", // Default group
        selectedGender: "all", // Default gender filter
        data: data
    };

    // Function to draw the gender chart
    function drawGenderChart(filteredData) {
        d3.select("#gender-chart").html(""); // Clear previous chart

        const width = 300;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };

        const svg = d3.select("#gender-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const tooltip = d3.select("#tooltip");

        // Count male and female leaders
        const counts = d3.rollup(filteredData, v => v.length, d => d.gender);
        const sorted = Array.from(counts);

        const x = d3.scaleBand()
            .domain(sorted.map(d => d[0]))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(sorted, d => d[1])])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Add x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        // Add y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y));

        // Add bars
        svg.selectAll("rect")
            .data(sorted)
            .enter()
            .append("rect")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(0) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("fill", "purple")
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible")
                    .html(`Gender: ${d[0]}<br>Count: ${d[1]}`)
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

    // Function to update visualizations
    function updateVisualizations() {
        // Filter data based on the selected group and gender
        let filtered = state.data.filter(d => d[state.selectedGroup] === "1"); // Match group columns (e.g., 'oecd')
        if (state.selectedGender !== "all") {
            filtered = filtered.filter(d => d.gender === state.selectedGender);
        }
        console.log("Filtered Data:", filtered); // Debugging

        // Call the chart functions with the filtered data
        drawBarChart(filtered);
        drawScatterPlot(filtered);
        drawLexisChart(filtered);
        drawGenderChart(filtered);
    }

    // Event listener for the dropdown menu
    d3.select("#country-selector").on("change", function () {
        state.selectedGroup = this.value; // Update the selected group
        updateVisualizations(); // Update the visualizations
    });

    // Event listener for the gender filter
    d3.select("#gender-selector").on("change", function () {
        state.selectedGender = this.value; // Update the selected gender
        updateVisualizations(); // Update the visualizations
    });

    // Initial rendering of visualizations
    updateVisualizations();
});