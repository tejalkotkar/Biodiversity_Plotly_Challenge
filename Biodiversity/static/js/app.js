// Creating References
var dropdown = d3.select("#selDataset");
var meta_info = d3.select("#sample-metadata");

/** getMetadata =>
 * function to display metadata information for particular id
 * @param {object} metadata
 * metadata - is the filtered metadata details(object) for selected id
 */

getMetadata=(metadata)=>{

    // Clear the already existing information
    meta_info.html("");

    // Write the metadata for the selected id
    // Iterate through each entry of the object 
    // & for each key-value pair of that entry
    // append the h5 tag with key & value as text to reference of metadata

    Object.entries(metadata).forEach(([key,value])=>{
        meta_info.append("h5").attr("id","meta_id").text(key+":"+value+"\n");
    });
}

/** getPlot =>
 * function to display Bar Graph & Bubble chart  for selected id
 * @param {object} samples
 * samples - filtered samples data from samples.json for selected id.
 * Bar Graph : To display top 10 OTU's
 * Bubble Chart : Displays each sample for the selected id.
 */


getPlot=(filter_sample)=>{

    // ================= BAR GRAPH =================

    // Extract only top 10 out id's along with sample_values & labels.
    // Reverse all the above values so that bar graph displays 
    // OUT id's with higher values on top
    var values = (filter_sample.sample_values.slice(0,10)).reverse();
    var ids = (filter_sample.otu_ids.slice(0,10)).reverse();
    var labels = (filter_sample.otu_labels.slice(0,10)).reverse();

    // string concatination to attach text "OTU" along with the id.
    var otuId = ids.map(id => 'OTU '+id);

    // Trace for Bar graph with attributes.
    var bar_trace = {
        x: values,
        y: otuId,
        text: labels,
        type: "bar",
        orientation: "h"
    };

    // data
    var bar_data = [bar_trace];

    // Defining layout for Bar Graph
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

    // Trace for Bubble chart with attributes.
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

    // data
    var bubble_data = [bubble_trace];

    // Defining layout
    var bubble_layout = {
        xaxis:{
            title: "OTU ID"
        }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot('bubble', bubble_data, bubble_layout);
}


getGauge=(wfreq)=>{
    // Trace for Gauge chart with attributes.
    gauge_trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly Button Washing Frequency<br><span style='font-size:17px'> Scrubs per Week</span>"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { 
                range: [null, 9], 
                tickwidth: 1, 
                tickcolor: "darkblue",
                tickmode: "array",
                tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                ticktext: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
                ticks: ""
            },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "#F8F3EC" },
              { range: [1, 2], color: "#F4F1E5" },
              { range: [2, 3], color: "#E9E6CA" },
              { range: [3, 4], color: "#E2E4B1" },
              { range: [4, 5], color: "#D5E49D" },
              { range: [5, 6], color: "#B7CC92" },
              { range: [6, 7], color: "#8CBF88" },
              { range: [7, 8], color: "#8ABB8F" },
              { range: [8, 9], color: "#85B48A" },
            ],
        }        
    };

    //data
    var gauge_data = [gauge_trace];

    // Defining Layout
    var gauge_layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        //paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
      };
    
        
    // Render Plot
    Plotly.newPlot('gauge', gauge_data, gauge_layout);
}

/** optionChanged =>
 * function to filter data for selected id & call getMetadata & getPlot methods
 * @param {string} id
 * id - selected otu id from dropdown
 */
optionChanged=(id)=>{
    // read the samples.json file 
    d3.json("samples.json").then(function(data){
        
        // Filter metadata & sample data for selected id
        var filter_metadata = data.metadata.filter(meta => meta.id.toString() === id)[0];
        var filter_samples = data.samples.filter(sample => sample.id.toString() === id)[0];

        // Call getMetadata & getPlot function by passing required parameters
        getMetadata(filter_metadata); 
        getPlot(filter_samples);
        getGauge(filter_metadata.wfreq);
    });
}

/** init =>
 * Default function to render the ids's dropdown & default view of page
 * This function takes no parameter.
 */ 

init=()=>{
    // read the samples.json file 
    d3.json("samples.json").then(function(data){

        // Store data.names in variable names
        // iterate through names array, and add each name(id) in dropdown by appending option tag to the select tag
        // and adding value & text as name(id)
        var names = data.names;
        names.forEach(name => {
            dropdown.append("option").attr("value",name).text(name);
        });

        // Call optionChanged fucntion with first name(id) from names array to display graph's & metadata info
        optionChanged(names[0]);
    });
}

// Call init function to display default page
init();