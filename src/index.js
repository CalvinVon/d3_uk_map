var width = 960;
var height = 1160;
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var color = d3.scale.category20();

d3.json("/assets/uk_topo.json", function (error, uk) {
    if (error) return console.error(error);

    console.log(uk)

    var subunits = topojson.feature(uk, uk.objects.subunits);

    var projection = d3.geo.albers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(6000)
        .translate([width / 2, height / 2]);

    // Path generator
    var path = d3.geo.path()
        .projection(projection);

    svg.append("path")
        .datum(subunits)
        .attr("class", "uk")
        .attr("d", path)
        .attr('fill', function (d, i) {
            return color(i);
        })

    // Generate polygons
    svg.selectAll(".subunit")
        .data(subunits.features)
        .enter().append("path")
        .attr("class", function (d) {
            return "subunit " + d.id;
        })
        .attr("d", path);

    // Displaying Boundaries
    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function (a, b) {
            return a !== b && a.id !== "IRL";
        }))
        .attr("d", path)
        .attr("class", "subunit-boundary");

    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function (a, b) {
            return a === b && a.id === "IRL";
        }))
        .attr("d", path)
        .attr("class", "subunit-boundary IRL");

    // Displaying Places
    svg.append("path")
        .datum(topojson.feature(uk, uk.objects.places))
        .attr("d", path)
        .attr("class", "place");

    svg.selectAll(".place-label")
        .data(topojson.feature(uk, uk.objects.places).features)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function (d) {
            return "translate(" + projection(d.geometry.coordinates) + ")";
        })
        .attr("dy", ".35em")
        .text(function (d) {
            return d.properties.name;
        });

    // adjust label aligning
    svg.selectAll(".place-label")
        .attr("x", function (d) {
            return d.geometry.coordinates[0] > -1 ? 6 : -6;
        })
        .style("text-anchor", function (d) {
            return d.geometry.coordinates[0] > -1 ? "start" : "end";
        });
});