import React, { useEffect } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const SankeyChart = ({ data, svgRef }) => {
  useEffect(() => {
    if (data?.chartType === "sankey") {
      const sankyData = data?.sankyData;
      const nodeColors = data?.nodeColorArray;

      // Remove any existing SVG elements
      d3.select(svgRef.current).selectAll("*").remove();

      const width = 1020;
      const height = 410;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g");

      // Prepare nodes and links for d3 sankey
      const nodes = Array.from(
        new Set(sankyData?.flatMap(([from, to]) => [from, to]))
      ).map((name) => ({ name }));

      const links = sankyData?.map(([from, to, value]) => ({
        source: from,
        target: to,
        value,
      }));

      // Create a node map for lookup
      const nodeMap = new Map(nodes.map((node, index) => [node.name, index]));

      // Convert links to use node indices
      const formattedLinks = links.map((link) => ({
        source: nodeMap.get(link.source),
        target: nodeMap.get(link.target),
        value: link.value,
      }));

      const sankeyGenerator = sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([
          [1, 1],
          [width - 1, height - 6],
        ]);

      const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
        nodes,
        links: formattedLinks,
      });

      // Render links
      svg
        .append("g")
        .selectAll("path")
        .data(sankeyLinks)
        .enter()
        .append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", "#000")
        .attr("stroke-width", (d) => Math.max(1, d.width))
        .attr("fill", "none")
        .attr("stroke-opacity", 0.2)
        .append("title")
        .text((d) => `${d.source.name} → ${d.target.name}: ${d.value}`);

      // Render nodes
      svg
        .append("g")
        .selectAll("rect")
        .data(sankeyNodes)
        .enter()
        .append("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", sankeyGenerator.nodeWidth())
        .attr(
          "fill",
          (d) => nodeColors.find((color) => color.id === d.name)?.color
        )
        .attr("stroke", "#000")
        .append("title")
        .text((d) => `${d.name}`);

      // Add labels
      svg
        .append("g")
        .selectAll("text")
        .data(sankeyNodes)
        .enter()
        .append("text")
        .attr("x", (d) => d.x0 - 6)
        .attr("y", (d) => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .style("font-size", "12px") // Set font size here
        .text((d) => d.name)
        .filter((d) => d.x0 < width / 2)
        .attr("x", (d) => d.x1 + 6)
        .attr("text-anchor", "start");
    }
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default SankeyChart;
