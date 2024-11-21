import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import dummyData from '../../assets/data/data';
@Component({
  selector: 'app-force-directed-tree',
  templateUrl: './force-directed-tree.component.html',
  styleUrls: ['./force-directed-tree.component.scss'],
})
export class ForceDirectedTreeComponent implements AfterViewInit  {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  data = dummyData;

  constructor() {
  }

  ngAfterViewInit() {
    this.createTree();
  }

  createTree() {
    const that = this;

    // Specify the chart’s dimensions.
    const width = 928;
    const height = 600;

    // Compute the graph and start the force simulation.
    const root = d3.hierarchy(that.data);
    const links = root.links();
    const nodes = root.descendants();

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(0)
          .strength(1)
      )
      .force('charge', d3.forceManyBody().strength(-50))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    // Create the container SVG.
    const svg = d3
      .create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    // Append links.
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line');

    // Append nodes.
    const node = svg
      .append('g')
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('fill', (d) => (d.children ? null : '#000'))
      .attr('stroke', (d) => (d.children ? null : '#fff'))
      .attr('r', 3.5)
      .call(drag(simulation));

    node.append('title').text((d: any) => d.data.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
    });

      // Append the generated SVG to the container
      this.svgContainer.nativeElement.innerHTML = '';
      this.svgContainer.nativeElement.appendChild(svg.node());

    // Stop the simulation when the animation ends (optional, can be removed).
    simulation.on('end', () => {
      simulation.stop();
    });

    function drag(simulation: any) {
      // Ensure event parameters and data types are explicit.
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      // Explicitly define the element type and data type for D3 drag behavior
      return d3
        .drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return svg.node();
  }

  // Correctly typing the drag behavior for d3.
  // drag(simulation: any) {
  //   // Ensure event parameters and data types are explicit.
  //   function dragstarted(event: any, d: any) {
  //     if (!event.active) simulation.alphaTarget(0.3).restart();
  //     d.fx = d.x;
  //     d.fy = d.y;
  //   }

  //   function dragged(event: any, d: any) {
  //     d.fx = event.x;
  //     d.fy = event.y;
  //   }

  //   function dragended(event: any, d: any) {
  //     if (!event.active) simulation.alphaTarget(0);
  //     d.fx = null;
  //     d.fy = null;
  //   }

  //   // Explicitly define the element type and data type for D3 drag behavior
  //   return d3.drag<SVGCircleElement, any>()
  //     .on("start", dragstarted)
  //     .on("drag", dragged)
  //     .on("end", dragended);
  // }
}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

