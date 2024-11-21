import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import dummyData from '../../assets/data/data';

@Component({
  selector: 'app-tidy-tree',
  templateUrl: './tidy-tree.component.html',
  styleUrls: ['./tidy-tree.component.scss']
})
export class TidyTreeComponent implements AfterViewInit {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  data = dummyData;

  constructor() { }

  ngAfterViewInit(): void {
    this.createTree();
  }

  createTree() {
    // const width = 928;
    const width = 1500;

    // Compute the tree height; this approach will allow the height of the
    // SVG to scale according to the breadth (width) of the tree layout.
    const root: d3.HierarchyNode<any> = d3.hierarchy(this.data);
    const dx = 10;
    const dy = width / (root.height + 1);

    // Create a tree layout.
    const tree = d3.tree().nodeSize([dx, dy]);

    // Sort the tree and apply the layout.
    root.sort((a: d3.HierarchyNode<any>, b: d3.HierarchyNode<any>) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    // Compute the extent of the tree.
    let x0 = Infinity;
    let x1 = -Infinity; // Initialize x1 to -Infinity instead of -x0
    root.each((d: d3.HierarchyNode<any>) => {
      if (d.x !== undefined) { // Check if d.x is defined
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      }
    });

    // Compute the adjusted height of the tree.
    const height = x1 - x0 + dx * 2;

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-dy / 3, x0 - dx, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Append the SVG to the container
    this.svgContainer.nativeElement.appendChild(svg.node());

    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr("d", (d: { source: d3.HierarchyNode<any>, target: d3.HierarchyNode<any> }) => {
        const source = [d.source.y ?? 0, d.source.x ?? 0] as [number, number];
        const target = [d.target.y ?? 0, d.target.x ?? 0] as [number, number];
        return d3.linkHorizontal()({ source, target });
      });

    const node = svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr("transform", (d: d3.HierarchyNode<any>) => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("fill", (d: d3.HierarchyNode<any>) => d.children ? "#555" : "#999")
      .attr("r", 2.5);

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: d3.HierarchyNode<any>) => d.children ? -6 : 6)
      .attr("text-anchor", (d: d3.HierarchyNode<any>) => d.children ? "end" : "start")
      .text((d: d3.HierarchyNode<any>) => d.data.name)
      .attr("stroke", "white")
      .attr("paint-order", "stroke");
  }
}
