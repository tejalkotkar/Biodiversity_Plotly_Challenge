// Creating References
var dropdown = d3.select("#selDataset");
var meta_info = d3.select("#sample-metadata");

getMetadata=(metadata)=>{
    meta_info.html("");
    // Write the metadata for the selected id
    Object.entries(metadata).forEach(([key,value])=>{
        meta_info.append("h5").attr("id","meta_id").text(key+":"+value+"\n");
    });
}

getPlot=(filter_sample)=>{
    var values = (filter_sample.sample_values.slice(0,10)).reverse();
    var ids = (filter_sample.otu_ids.slice(0,10)).reverse();
    var otuId = ids.map(id => 'OTU '+id);
    var labels = (filter_sample.otu_labels.slice(0,10)).reverse();

    // ================= BAR GRAPH =================
    var bar_trace = {
        x: values,
        y: otuId,
        text: labels,
        type: "bar",
        orientation: "h"
    };

    // data
    var bar_data = [bar_trace];

    // Apply the group bar mode to the layout
    var bar_layout = {
        margin: {
            l: 100,
            r: 100,
            t: 30,
            b: 20
        }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", bar_data, bar_layout);

        // ================= BUBBLE GRAPH ================= 
    var bubble_trace = {
        x: filter_sample.otu_ids,
        y: filter_sample.sample_values,
        text: filter_sample.otu_labels,
        mode: 'markers',
        marker: {
          color: filter_sample.otu_ids,
          size: filter_sample.sample_values
        }
    };

    var bubble_data = [bubble_trace];

    var bubble_layout = {
        xaxis:{
            title: "OTU ID"
        }
    };

    Plotly.newPlot('bubble', bubble_data, bubble_layout);

    // ================= BUBBLE GRAPH ================= 
    var bubble_trace = {
        x: filter_sample.otu_ids,
        y: filter_sample.sample_values,
        text: filter_sample.otu_labels,
        mode: 'markers',
        marker: {
          color: filter_sample.otu_ids,
          size: filter_sample.sample_values
        }
    };

    var bubble_data = [bubble_trace];

    var bubble_layout = {
        xaxis:{
            title: "OTU ID"
        }
    };

    Plotly.newPlot('bubble', bubble_data, bubble_layout);
}


optionChanged=(id)=>{
    d3.json("samples.json").then(function(data){
        var filter_metadata = data.metadata.filter(meta => meta.id.toString() === id)[0];
        var filter_samples = data.samples.filter(sample => sample.id.toString() === id)[0];
        getMetadata(filter_metadata); 
        getPlot(filter_samples);
    });
}

// Init function to read the json file and render data
init=()=>{
    d3.json("samples.json").then(function(data){
        var names = data.names;
        names.forEach(name => {
            dropdown.append("option").attr("value",name).text(name);
        });
        var metadata = data.metadata;
        var filter_data = metadata.filter(meta => meta.id.toString() === names[0])[0]
        optionChanged(names[0]);
    });
}

init();