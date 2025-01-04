import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const BitcoinChart: React.FC = () => {
  const [data, setData] = useState<{ date: Date; price: number }[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', {
          params: {
            vs_currency: 'usd',
            days: 365,
          },
        });

        const prices = response.data.prices.map((price: any) => ({
          date: new Date(price[0]),
          price: price[1],
        }));

        setData(prices);
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
    };

    fetchBitcoinData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      d3.select(chartRef.current).selectAll('*').remove();

      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', 1040)
        .attr('height', 570)
        .style('border', 'none'); 

      const margin = { top: 20, right: 30, bottom: 70, left: 60 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;

      // Define the gradient
      const defs = svg.append("defs");
      const gradient = defs.append("linearGradient")
        .attr("id", "area-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#00c6ff")
        .attr("stop-opacity", 1);
      
      gradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#0072ff")
        .attr("stop-opacity", 1);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#8a2be2")
        .attr("stop-opacity", 1);

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date) as [Date, Date])
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)!]).nice()
        .range([height - margin.bottom, margin.top]);

      const area = d3.area<{ date: Date; price: number }>()
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(d.price))
        .curve(d3.curveMonotoneX);
      const line = d3.line<{ date: Date; price: number }>()
        .x(d => x(d.date))
        .y(d => y(d.price))
        .curve(d3.curveMonotoneX);

      svg.append("path")
        .datum(data)
        .attr("fill", "url(#area-gradient)")
        .attr("d", area);

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#0072ff")
        .attr("stroke-width", 2)
        .attr("d", line);

      const makeYGridlines = () => d3.axisLeft(y).ticks(10);

      svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(makeYGridlines()
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(() => ""))
        .selectAll("line")
        .attr("stroke", "#ccc")
        .attr("stroke-opacity", 0.1);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat((d) => d3.timeFormat("%b %Y")(d as Date)))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g: any) => g.select('.domain').remove())
        .selectAll(".tick line")
        .attr("stroke", "none"); // Remove axis lines if any

      const tooltip = d3.select(chartRef.current).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("pointer-events", "none");

      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mousemove", (event) => {
          const [mx, my] = d3.pointer(event);
          const date = x.invert(mx);
          const bisect = d3.bisector<{ date: Date; price: number }, Date>(d => d.date).left;
          const index = bisect(data, date, 1);
          const d0 = data[index - 1];
          const d1 = data[index];
          if (!d0 || !d1) return;
          const datum = (date.getTime() - d0.date.getTime() > d1.date.getTime() - date.getTime()) ? d1 : d0;

          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`Date: ${datum.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}<br>Price: $${datum.price.toFixed(2)}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY}px`);
        })
        .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));
    }
  }, [data]);

  return <div ref={chartRef} className="box-content"></div>;
};

export default BitcoinChart;
