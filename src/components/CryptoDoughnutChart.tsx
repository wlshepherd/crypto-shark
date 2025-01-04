import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CryptoData {
  axis: string;
  value: number;
}

const CryptoDoughnutChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const data: CryptoData[] = [
      { axis: 'BTC', value: 150 },
      { axis: 'ETH', value: 99 },
      { axis: 'Ripple', value: 81 },
      { axis: 'Dogecoin', value: 56 },
    ];

    const width = 375;
    const height = 375;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.5;
    const outerRadius = radius - 10;
    const cornerRadius = 0;

    const color = d3.scaleSequential<string>()
      .domain([0, data.length - 1])
      .interpolator(d3.interpolateRgb("#8a2be2", "#0000ff"));

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3)
      .attr('result', 'blur');
    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 3)
      .attr('dy', 3)
      .attr('result', 'offsetBlur');
    filter.append('feMerge')
      .append('feMergeNode')
      .attr('in', 'offsetBlur');
    filter.append('feMerge')
      .append('feMergeNode')
      .attr('in', 'SourceGraphic');

    const arc = d3.arc<any, d3.PieArcDatum<CryptoData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(cornerRadius);

    const hoverArc = d3.arc<any, d3.PieArcDatum<CryptoData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius + 10);

    const pie = d3.pie<CryptoData>()
      .value(d => d.value)
      .sort(null);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', 'none')
      .style('filter', 'url(#drop-shadow)')
      .on('mouseover', function(event, d) {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('d', () => hoverArc(d as d3.PieArcDatum<CryptoData>));
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`${d.data.value}`)
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('d', () => arc(d as d3.PieArcDatum<CryptoData>));
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('fill', '#fff')
      .text(d => d.data.axis);

  }, []);

  return <svg ref={svgRef}></svg>;
};

export default CryptoDoughnutChart;
