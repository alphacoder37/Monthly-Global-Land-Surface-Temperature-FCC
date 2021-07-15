document.addEventListener("DOMContentLoaded", function() {
    
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(res => {

        let data = res.monthlyVariance
console.log(data)

        let h = 600;
        let w = 1200;
        let padding = 60;

        let svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        
        // scales and axes

        // x-axis
        let maxX = d3.max(data, d => d.year);
        let minX = d3.min(data, d=> d.year);
        let yearScale = d3.scaleLinear()
        .range([padding, w - padding])
        .domain([minX, maxX])

        let xAxis = d3.axisBottom(yearScale).tickFormat(tick => tick * 1)

        svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0" + ", " + (h - padding) + ")")
        .call(xAxis)

        // y-axis
        const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let monthScale = d3.scaleBand()
        .range([h - padding, padding])
        .domain(monthsArray)
        let yAxis = d3.axisLeft(monthScale)

        svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", " translate(" + (padding) + ", " + (h) + ") scale(1, -1)")
        .call(yAxis)

        // defining variables for the color scale
        const maxTemp = d3.max(data, d => d.variance + res.baseTemperature)
        const minTemp = d3.min(data, d => d.variance + res.baseTemperature);
        const colorArray = [ '#a50026',
        '#d73027',
        '#f46d43',
        '#fdae61',
        '#fee090',
        '#ffffbf',
        '#e0f3f8',
        '#abd9e9',
        '#74add1',
        '#4575b4',
        '#313695']


        let colorScale = d3.scaleQuantize()
        .domain([minTemp, maxTemp])
        .range(colorArray.reverse())

        // creating the rectangles
        svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", d => d.month - 1 )
        .attr("data-year", d => d.year * 1)
        .attr("data-temp", d => (res.baseTemperature + d.variance).toFixed(1))
        .attr("data-variance", d => d.variance)
        .attr("x", (d, i) => {
            return yearScale(d.year)
        })
        .attr("y", d => 20 + (monthScale.bandwidth() * (d.month)))
        .attr("height",  monthScale.bandwidth())
        .attr("width", (w - 2*padding)/(maxX - minX))
        .style("fill", d => colorScale(res.baseTemperature + d.variance))
        

        // creating tooltip
        const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")

        // adding event listeners to the rectangles
        svg
        .selectAll("rect")
        .on("mouseover", d => {
            tooltip
            .style("visibility", "visible")
            .attr("data-year", d.year)
            .html(`${d.year} - ${monthsArray[d.month - 1]} <br>Temp: ${(res.baseTemperature + d.variance).toFixed(2)} <br>Variance: ${d.variance.toFixed(2)}`)
            .style("left", (yearScale(d.year) - 50) + "px")
            .style("top", 60 + (monthScale.bandwidth() * (d.month)) + "px")
        })
        .on("mouseout", d => {
            tooltip
            .style("visibility", "hidden")
        })

        // creating the legend
        const legendWidth = 240
        const legendHeight = 120
        const legPadding = 20
        var legend = d3.select("body")
        .append("svg")
        .attr("id", "legend")
        .attr("height", legendHeight)
        .attr("width", legendWidth)


        const legendScale = d3.scaleLinear()
        .range([legPadding, legendWidth - legPadding])
        .domain([minTemp, maxTemp])
        .nice()
        let legendAxis = d3.axisBottom(legendScale).ticks(5)

        legend.append("g")
        .attr("id", "legend-axis")
        .attr("transform", "translate(0" + ", " + (legendHeight - legPadding) + ")")
        .call(legendAxis)

        const legendXValueArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        legend.selectAll("rect")
        .data(legendXValueArray)
        .enter()
        .append("rect")
        .attr("x", d => (legendWidth - (2*legPadding))/11 * d + 3)
        .attr("y", 79.5)
        .attr("height", 20)
        .attr("width", d => (legendWidth - (2*legPadding))/11)
        .style("fill", d => colorArray[d -1])

    })

})