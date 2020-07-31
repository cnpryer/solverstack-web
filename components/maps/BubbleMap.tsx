import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3"; // TODO: optimize d3
import * as GeoTypes from "../types/geo";


const getMapCenter = (markers: any) => {
    /**
     * Calculates average of coordinates and returns
     * as list [longitude, latitude]
     * 
     * NOTE: unused
     */
    let latSum = 0, lonSum = 0;

    for (var i = 0; i < markers.length; i++) {
        latSum = latSum + markers[i].latitude;
        lonSum = lonSum + markers[i].longitude;
    }
    
    let center = [lonSum / markers.length, latSum / markers.length];

    return center;
}

const isDefaultMarkers = (lat: Number, lon: Number) => {
    /** Is Null Island, set to something nice TODO: null island default */
    if (lat == 0. || lat == null || lon == 0. || lon == null) {
        return true;
    } else {
        return false;
    }
} 

// TODO: d3 types
const resizeSvg = (svg: any, height: Number, width: Number) => {
    svg.attr("width", width).attr("height", height);
}

const createGeoProjection = (centerMarkerArray: Array<Number>, height: Number, width: Number, zoom: Number) => {
    const projection = d3.geoMercator()
        .center(centerMarkerArray)
        .scale(zoom)
        .translate([ Number(width) / 2, Number(height) / 2 ]);

    return projection;
}

const addMapToProjection = (svg: any, projection: any, translation: any) => {
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data) {

        // Filter data
        data.features = data.features.filter( function(d){return d.properties.name=="USA"} );

        // Draw the map
        svg.append("g").attr("transform", translation)
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath()
                    .projection(projection)
                )
            .style("stroke", "black")
            .style("opacity", .3);
    
    }).catch(function(error) { 
        console.log("error", error);
    });
}

const markerIsContinuousUsa = (lat: Number, lon: Number) => {
    if (lat >= 19.50139 && lat <= 64.85694 && lon >= -161.75583 && lon <= -68.01197) {
        return true;
    } else {
        return false;
    }
}

const drawCirclesOnMap = (svg: any, markers: Array<Object>, projection: any, translation: any, name: string, size: number) => {
    svg.selectAll("myCircles")
        .data(markers)
        .enter()
        .append("svg:circle")
        .attr("class", name)
        .attr("cx", function(d){ return projection([d.longitude, d.latitude])[0] })
        .attr("cy", function(d){ return projection([d.longitude, d.latitude])[1] })
        .attr("r", size)
        .style("fill", "69b3a2")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", (size/4))
        .attr("fill-opacity", .4)
        .attr("transform", translation);
}

const addOriginToMap = (svg: any, lat: Number, lon: Number, projection: any, translation: any) => {
    const name = "originCircle";
    const size = 8;
    svg.selectAll("." + name).remove();

    const markers = [{"latitude": lat, "longitude": lon}];
    drawCirclesOnMap(svg, markers, projection, translation, name, size);
}

const addDemandToMap = (svg: any, markers: Array<Object>, projection: any, translation: any) => {
    const name = "demandCircles";
    const size = 3;
    svg.selectAll("." + name).remove();
    
    drawCirclesOnMap(svg, markers, projection, translation, name, size);
}

const VrpBubbleMap = (props) => {
    const svgRef = useRef(null);

    // TODO: relative margins and translations
    const margin = {top: 20, right: 20, bottom: 0, left: 175},
          zoom = 625,
          height = 400,
          width = 550,
          translation = "translate(" + margin.left + "," + margin.top + ")",
          centerMarker = [-92., 37.]; // projection needs [lon, lat];

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const projection = createGeoProjection(centerMarker, height, width, zoom);

        const markers = props.demandMarkers;
        if (!markers) {
            return;
        }

        let isContiguousUsa = true;
        for (let i = 0; i < markers.length; i++) {
            if (!markerIsContinuousUsa(markers[i].latitude, markers[i].longitude)) {
                isContiguousUsa = false;
            }
        }

        if (isContiguousUsa) {
            addDemandToMap(svg, markers, projection, translation);
        }
    });

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const projection = createGeoProjection(centerMarker, height, width, zoom);

        const lat = props.originLat;
        const lon = props.originLon;
        if (markerIsContinuousUsa(lat, lon)) {
            addOriginToMap(svg, lat, lon, projection, translation);
        }
    });
   
    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const adjustedWidth = width + margin.left + margin.right;
        const adjustedHeight = height + margin.top + margin.bottom;
        resizeSvg(svg, adjustedHeight, adjustedWidth);

        const projection = createGeoProjection(centerMarker, height, width, zoom);
        addMapToProjection(svg, projection, translation);
    }, []);

    return (<svg ref={svgRef} height="100px" width="550px" display="block"></svg>);
}
  
export default VrpBubbleMap;