const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const samples_data = d3.json(url);
console.log("Samples Data: ", samples_data);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Function to create the horizontal bar chart
function createBarChart(sampleData) {
  // Extract the top 10 OTUs
  var top10SampleValues = sampleData.sample_values.slice(0, 10);
  var top10OTUIds = sampleData.otu_ids.slice(0, 10);
  var top10OTULabels = sampleData.otu_labels.slice(0, 10);

  // Create the bar chart trace
  var trace = {
      type: "bar",
      orientation: "h",
      x: top10SampleValues,
      y: top10OTUIds.map(id => `OTU ${id}`),
      text: top10OTULabels,
      hoverinfo: "text+x"
  };

  // Create the bar chart layout
  var layout = {
      title: "Top 10 OTUs Found in Individual",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
  };

  // Plot the bar chart
  Plotly.newPlot("bar", [trace], layout);
}

// Function to create the bubble chart
function createBubbleChart(sampleData) {
  var trace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
          size: sampleData.sample_values, // Use sample_values for marker size
          color: sampleData.otu_ids, // Use otu_ids for marker colors
          colorscale: 'Viridis',
          opacity: 0.5
      }
  };

  var data = [trace];

  var layout = {
      title: 'Bubble Chart for Sample',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' }
  };

  // Plot the bubble chart
  Plotly.newPlot('bubble', data, layout);
}

// Fetch the JSON data and create the bubble chart
d3.json(url).then(function(data) {
  var samples = data.samples;
  createBubbleChart(samples[0]); // Assuming 'samples' is the array containing your sample data
  createBarChart(samples[0]);
});

// Function to populate the dropdown menu with sample IDs
function populateDropdown(samples) {
  var dropdown = document.getElementById("selDataset");

  for (var i = 0; i < samples.length; i++) {
      var option = document.createElement("option");
      option.value = samples[i].id;
      option.text = samples[i].id;
      dropdown.appendChild(option);
  }

  // Add an event listener to the dropdown to update the chart
  dropdown.addEventListener("change", function () {
      var selectedSampleId = dropdown.value;
      var selectedSampleData = samples.find(sample => sample.id === selectedSampleId);
      createBarChart(selectedSampleData);
      createBubbleChart(selectedSampleData)
  });

  // Initialize the chart with the first sample data
  //createBarChart(samples[0]);
}

// Fetch the JSON data and populate the dropdown and create the initial chart
d3.json(url).then(function(data) {
  var samples = data.samples;
  populateDropdown(samples);
});

// Function to display sample metadata
function displaySampleMetadata(metadata) {
  var metadataPanel = document.getElementById("sample-metadata");
  metadataPanel.innerHTML = ""; // Clear existing content

  // Loop through the metadata and display each key-value pair
  Object.entries(metadata).forEach(([key, value]) => {
    var metadataEntry = document.createElement("p");
    metadataEntry.innerHTML = `<strong>${key}:</strong> ${value}`;
    metadataPanel.appendChild(metadataEntry);
  });
}

// Fetch the JSON data and populate the dropdown and create the initial chart
d3.json(url).then(function(data) {
  var samples = data.samples;
  var metadata = data.metadata; // Extract metadata

  // Populate the dropdown menu with sample IDs
  populateDropdown(samples);

  // Display the metadata for the initial sample (samples[0])
  displaySampleMetadata(metadata[0]);
});

// Update all charts based on the selected sample
function optionChanged(selectedSampleData) {
  // Update the bar chart
  createBarChart(selectedSampleData);

  // Update the bubble chart
  createBubbleChart(selectedSampleData);
}
