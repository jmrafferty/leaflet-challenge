// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  /*
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  */

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  
  
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   pointToLayer: function(features, latlng){
  //     return l.circlemarker(latlng);
  //   },
  //   style:style,
  //   onEachFeature: onEachFeature
     
  // });

  // // Create overlay object to hold our overlay layer
  // var overlayMaps = {
  //   Earthquakes: earthquakes
  // };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5 //,
    //layers: [streetmap, earthquakes]
  });

  darkmap.addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  //console.log(data);
  //if (data.features) {createFeatures(data.features);
  //let mag_value = data.features.map(mag =>mag.properties.mag)
  function style(features) {
    return{
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(features.properties.mag),
      color: "white",
      radius: getRadius(features.properties.mag),
      stroke: true,
      weight: .5
    };
    }

    function getColor(mag) {
      switch(true){
        case mag > 5:
          return "red";
        case mag > 4:
          return "orange";
        case mag > 3:
          return "yellow";
        case mag > 2:
          return "green";
        case mag > 1:
          return "blue";
        default:
          return "white";
      }
    }
    function getRadius(mag) {
      if (mag === 0){return 1;}
      return mag * 10;
    }
    
  L.geoJson(data, {
    pointToLayer: function(features, latlng){
      return L.circleMarker(latlng);
    },
    style:style,
    onEachFeature:function(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<hr><p>" + "Magnitude: " + feature.properties.mag + "</p>");
      }
     
  }).addTo(myMap);

//Add Legend -- create object first
//define position
var legend = L.control({
  position: "bottomright"
});

legend.onAdd=function(){
  var div = L.DomUtil.create("div", "info legend");
  var grades = [0, 1, 2, 3, 4, 5];
  var colors = ["white", "blue", "green", "yellow", "orange", "red"];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};
legend.addTo(myMap);
});