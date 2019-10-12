function buildMetadata(sample) {
    metadata_url = "/metadata/" + sample;

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadata_url).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    sample_div = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_div.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    sample_array = Object.entries(data);

    sample_array.forEach(person => {
      var data_line = sample_div.append("p");
      data_line.text(person[0] + ": " + person[1]);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {
  sample_url = "/samples/" + sample;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sample_url).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data

    var bubble_trace = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      type: "scatter",
      mode: "markers",
      marker: {
        color: data.otu_ids,
        size: data.sample_values
      }
    };

    var bubble_layout = {
      xaxis: { title: "OTU ID"}
    }

    var bubble_data = [bubble_trace];

    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var ids_slice = data.otu_ids.slice(0, 10);
    var labels_slice = data.otu_labels.slice(0, 10);
    var values_slice = data.sample_values.slice(0, 10);

    var pie_trace = {
      values: values_slice,
      labels: ids_slice,
      hovertext: labels_slice,
      type: "pie"
    };

    var pie_data = [pie_trace];

    Plotly.newPlot("pie", pie_data);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
