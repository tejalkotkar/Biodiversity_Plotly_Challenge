// Creating References
dropdown = d3.select("#selDataset");
meta_info = d3.select("#sample-metadata");

getMetadata=(id, metadata)=>{

    //Get the metadata for the id selected.
    filter_data = metadata.filter(meta => meta.id.toString() === id)[0];
    meta_info.html("");

    // Write the metadata for the selected id
    Object.entries(filter_data).forEach(([key,value])=>{
        meta_info.append("h5").text(key+":"+value+"\n");
    });
}


optionChanged=(id)=>{
    d3.json("samples.json").then(function(data){
        getMetadata(id, data.metadata);  
    });
}

// Init function to read the json file and render data
init=()=>{
    d3.json("samples.json").then(function(data){
        names = data.names;
        names.forEach(name => {
            dropdown.append("option").attr("value",name).text(name);
        });
        getMetadata(names[0], data.metadata);
    });
}

init();