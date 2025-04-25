d3.csv("data/leaderlist.csv").then(data => {
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
      data: data
  };

  // Function to update visualizations
  function updateVisualizations() {
      // Filter data based on the selected group
      const filtered = state.data.filter(d => d[state.selectedGroup] === "1"); // Match group columns (e.g., 'oecd')
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

  // Initial rendering of visualizations
  updateVisualizations();
});