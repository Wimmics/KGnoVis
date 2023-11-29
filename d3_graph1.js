import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const loading = () => {
        // set the dimensions and margins of the graph
        const width = 960;
        const height = 500;
        const svg = d3.select("#d3_demo").attr("width", width).attr("height", height);

        const x_scale = d3.scaleBand().range([0, width]).padding(0.1);
        const y_scale = d3.scaleLinear().range([height, 0]);

        d3
        .json(
        "https://raw.githubusercontent.com/iamspruce/intro-d3/main/data/nigeria-states.json"
        )
        .then(({ data }) => {
        data.forEach((d) => (d.Population = +d.info.Population));

        // Scale the range of the data in the domains
        x_scale.domain(data.map((d) => d.Name));
        y_scale.domain([0, d3.max(data, (d) => d.Population)]);

        // append the rectangles for the bar chart
        svg
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x_scale(d.Name))
            .attr("y", (d) => y_scale(d.Population))
            .attr("width", x_scale.bandwidth())
            .attr("height", (d) => height - y_scale(d.Population));
        });
}

loading()