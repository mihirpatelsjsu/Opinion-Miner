var script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v3.min.js';
    script.defer = true;
    script.async = true;
document.head.appendChild(script);

function createChart(eleClass, eleId, dataset, color, text){
    // console.log(ele);
    
    var div = d3.select(eleClass).append("div").attr("class", "toolTip");
    
    // Height and Width of chart
    var width = document.getElementById(eleId).offsetWidth / 1.2,
        height = document.getElementById(eleId).offsetHeight / 1.2,
        radius = Math.min(width, height) / 2;
  
    // For hollow chart
    var arc = d3.svg.arc()
        .outerRadius(radius - 30)
        .innerRadius(radius - 50);
  
    // Set start and end angle for chart
    var pie = d3.layout.pie()
        .sort(null)
        .startAngle(2*Math.PI)
        .endAngle(4*Math.PI)
        .value(function(d) { return d.total; });
  
    var svg = d3.select(eleClass).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
    var g = svg.selectAll(".arc")
      .data(pie(dataset))
      .enter().append("g")
      .attr("class", "arc");
  
    // Change duration as per requirement
    g.append("path")
      .style("fill", function(d) {
          return color(d.data.name);
        })
      .transition()
      .delay(function(d,i) {
          return i * 500;
        })
      .duration(1000)
      .attrTween('d', function(d) {
      var i = d3.interpolate(d.startAngle, d.endAngle);
      return function(t) {
          d.endAngle = i(t); 
          return arc(d)
        }
      }); 
  
    // For adding texts on the parts of chart
    // g.append("text")
    //   .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    //   .attr("dy", ".35em")
    //   .transition()
    //   .delay(1000)
    //   .text(function(d) { return d.data.name; });
  
    // Text for center of chart
    if (text == "") {
      text = dataset[0].percent + "%";
    }
    else {
      text = text + " " + dataset[0].percent + "%";
    }
    g.append("text")
       .attr('y', 5)
       .attr('fill', 'white')
       .transition()
       .delay(1000)
       .text(text);
  
    d3.selectAll("path").on("mousemove", function(d) {
      
      // Get parent div position
      var parentDiv = document.getElementById(eleId);
      var position = parentDiv.getBoundingClientRect();
      var l = position.left;
      var t = position.top;
  
      // Get mouse co-ordinate
      var x = d3.event.pageX;
      var y = d3.event.pageY;
      // console.log(div)
      div.style("left", x-l+10+"px");
      div.style("top", y-t-25+"px");
      div.style("display", "inline-block");
      div.html((d.data.name)+"<br>"+(d.data.total) + "<br>"+(d.data.percent) + "%");
    });
        
    d3.selectAll("path").on("mouseout", function(d){
      div.style("display", "none");
    });
  
  }
  
  
  $(document).ready(function(){
  
    var p_tweets = parseInt("<%= positive_tweets %>");
    var n_tweets = parseInt("<%= negative_tweets %>");
    var p_visibility = parseInt("<%= positive_visibility %>");
    var n_visibility = parseInt("<%= negative_visibility %>");
    var p_tweets_locations = "<%= JSON.stringify(positive_tweets_locations) %>";
    var n_tweets_locations = "<%= JSON.stringify(negative_tweets_locations) %>";
  
    if (p_tweets_locations != ""){
      p_tweets_locations = p_tweets_locations.replace(/&#34;/gi, "'")
      p_tweets_locations = p_tweets_locations.replace(/\[+/g, "")
      p_tweets_locations = p_tweets_locations.replace(/\]+/g, "")
      p_tweets_locations = p_tweets_locations.replace(/\'+/g, "")
      p_tweets_locations = p_tweets_locations.split(",")
    }
    
    if (n_tweets_locations != "") {
      n_tweets_locations = n_tweets_locations.replace(/&#34;/gi, "'")
      n_tweets_locations = n_tweets_locations.replace(/\[+/g, "")
      n_tweets_locations = n_tweets_locations.replace(/\]+/g, "")
      n_tweets_locations = n_tweets_locations.replace(/\'+/g, "")
      n_tweets_locations = n_tweets_locations.split(",")
    }
  
    // Find sum of tweets and visibility
    var sum_tweets = p_tweets + n_tweets;
    var sum_visibility = p_visibility + n_visibility;
  
    var p_tweets_percent = Math.round((p_tweets /sum_tweets) * 100);
    var n_tweets_percent = Math.round((n_tweets /sum_tweets) * 100);
    var p_visibility_percent = Math.round((p_visibility /sum_visibility) * 100);
    var n_visibility_percent = Math.round((n_visibility /sum_visibility) * 100);
  
    // Dataset for pie chart
    var dataset1 = [
      { name: 'Positive', total: p_tweets, percent: p_tweets_percent },
      { name: 'Negative', total: n_tweets, percent: n_tweets_percent }
    ];
  
    var dataset2 = [
      { name: 'Negative', total: n_tweets, percent: n_tweets_percent },
      { name: 'Positive', total: p_tweets, percent: p_tweets_percent }
    ];
  
    var dataset3 = [
      { name: 'Positive', total: p_visibility, percent: p_visibility_percent },
      { name: 'Negative', total: n_visibility, percent: n_visibility_percent }
    ];
  
    // Color for different parts of pie chart
    var color1 = d3.scale.ordinal()
        .range(["#32CD32", "#000000"]);
  
    var color2 = d3.scale.ordinal()
        .range(["#FF4D4D", "#000000"]);  
  
    var color3 = d3.scale.ordinal()
        .range(["#32CD32", "#FF4D4D"]);    
  
    createChart('.chart1', 'chart1', dataset1, color1, "");
    createChart('.chart2', 'chart2', dataset2, color2, "");
    createChart('.chart3', 'chart3', dataset3, color3, "Visibility");
  
    // Load Google maps api
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAXWCI5f1-e6DpiCVMaw-GwUEipY1T8FIY&callback=initMap';
    script.defer = true;
    script.async = true;
  
    // Attach initMap to initialize the map
    window.initMap = function() {
  
      // usa location
      var usa = {lat: 40.052059, lng: -86.470642};
      // The map, centered at usa
      var map = new google.maps.Map(
          document.getElementById('map'), {zoom: 3, center: usa});
      
      var marker;    
  
      // Add markers for positive tweet locations    
      for (var i=0; i<p_tweets_locations.length; i=i+3) {
        console.log(p_tweets_locations[i][1] + " " +p_tweets_locations[i][2])
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(p_tweets_locations[i+1], p_tweets_locations[i+2]),
          animation: google.maps.Animation.DROP,
          map: map,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          }
        });
      }
  
      // Add markers for negative tweet locations
      for (var i=0; i<n_tweets_locations.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(n_tweets_locations[i+1], n_tweets_locations[i+2]),
          animation: google.maps.Animation.DROP,
          map: map,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }
        });
      }
    };
  
    // Append the 'script' element to 'head'
    document.head.appendChild(script);
  
  });