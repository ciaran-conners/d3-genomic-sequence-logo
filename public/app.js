fetch('/data')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    data.forEach((d) => {
      var y0 = 0;
      d.freq = d.map(( entry ) => {
        return {freq: entry.freq, letter: entry.letter, y0: y0, y1 : y0 += entry.frequency };}
      );
    });

    const margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

    const y = d3.scale.linear().range([height, 0]);

    const xAxis = d3.svg.axis().scale(x).orient('bottom').tickFormat((d) => d + 1);

    const yAxis = d3.svg.axis().scale(y).orient('left').tickValues([]);

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain(data.map((d, i) => i));
    y.domain([0, 1]);

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end');

    const column = svg
      .selectAll('.sequence-column')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        return 'translate(' + (x(i) + x.rangeBand() / 2) + ',0)';
      })
      .attr('class', 'sequence-column');

    const capHeightAdjust = 1.6; // approximation to bring cap-height to full font size

    column
      .selectAll('text')
      .data((d) => {
        return d.freq;
      })
      .enter()
      .append('text')
      .attr('y', (e) => {
        return y(e.y0);
      })
      .text((e) => {
        return e.letter;
      })
      .attr('class', (e) => {
        return 'letter-' + e.letter;
      })
      .style('text-anchor', 'middle')
      .style('font-family', 'monospace')
      .attr('textLength', x.rangeBand())
      .attr('lengthAdjust', 'spacingAndGlyphs')
      .attr('font-size', (e) => {
        return (y(e.y0) - y(e.y1)) * capHeightAdjust;
      })
      .style('font-size', (e) => {
        return (y(e.y0) - y(e.y1)) * capHeightAdjust;
      });
  })
  .catch(err => console.error(err));
