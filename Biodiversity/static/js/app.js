// Creating References
dropdown = d3.select("#selDataset");
meta_info = d3.select("#sample-metadata");

getMetadata=(metadata)=>{
    meta_info.html("");
    // Write the metadata for the selected id
    Object.entries(metadata).forEach(([key,value])=>{
        meta_info.append("h5").attr("id","meta_id").text(key+":"+value+"\n");
    });
}

getPlot=(filter_sample)=>{
    values = (filter_sample.sample_values.slice(0,10)).reverse();
    ids = (filter_sample.otu_ids.slice(0,10)).reverse();
    otuId = ids.map(id => 'OTU '+id);
    labels = (filter_sample.otu_labels.slice(0,10)).reverse();

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
        names = data.names;
        names.forEach(name => {
            dropdown.append("option").attr("value",name).text(name);
        });
        metadata = data.metadata;
        filter_data = metadata.filter(meta => meta.id.toString() === names[0])[0]
        optionChanged(names[0]);
    });
}

init();