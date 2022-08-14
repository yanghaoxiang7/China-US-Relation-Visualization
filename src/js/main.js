
let _width = 700 / 1550 * $(window).width();
let _height = 400 / 762 * $(window).height();
let width = 0.9 * _width;
let height = 0.96 * _height;

let fontFamily;

let data_area = null;
let backup_data_area;
let data_file = 'data/topics-new5.csv';

function set_ui() {
    // 设置字体
    let ua = navigator.userAgent.toLowerCase();
    fontFamily = "Khand-Regular";
    if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
        fontFamily = "PingFangSC-Regular";
    }
    d3.select("body")
        .style("font-family", fontFamily);
}

function draw_main_area() {
    //data = Object.assign(d3.csvParse(data_file, d3.autoType), {y: "Unemployment"})
    //console.log(data[0])

    series = d3.stack().keys(data_area.columns.slice(1))(data_area)
    console.log(d3.max(series, d => d3.max(d, d => d[1])))


margin = ({top: 20, right: 30, bottom: 30, left: 40})


    area = d3.area()
    .x(d => x(d.data.date))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))

    x = d3.scaleUtc()
    .domain(d3.extent(data_area, d => d.date))
    .range([margin.left, width - margin.right])

    y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height - margin.bottom, margin.top])

    color = d3.scaleOrdinal()
    .domain(data_area.columns.slice(1))
    .range(d3.schemeSet3)

    xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data_area.y))

  //const svg = d3.create("svg")
    //  .attr("viewBox", [0, 0, width, height]);

    /*

    let svg1 = d3.select('#container_title')
        .select('svg')

    svg1.append('g')
        .attr('transform', `translate(${1000}, ${20})`)
        .append('text')
        .attr('class', 'title')
        .text('A Visualization for Faculties That Research on Computer Science in Well-known Universities');
    
        */

  let svg = d3.select('#container_stackedarea')
    .select('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append("g")
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("fill", ({key}) => color(key))
      .attr("d", area)
    .append("title")
      .text(({key}) => key);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

    /*
    d3.csv(data_file).then(function(DATA) {
        data = DATA;

        // remove data without x_attr or y_attr
        data = data.filter((d, i) => (d[x_attr] != '' && d[y_attr] != '' && Institutions.includes(d['Institution']) && Institutions.includes(d['Ph.D. Graduate School'])));
        set_ui();
        draw_main();
    })
    */
}

function main_area() {
    d3.csv(data_file, d3.autoType).then(function(DATA) {
        //data = DATA;
        data_area = Object.assign(DATA, {y: "News"})
        backup_data_area = data_area;
        t_st = new Date('1980-1-1');
        t_ed = new Date('2000-12-31');

        data_area = backup_data_area.filter((d, i)=>{
            t1 = new Date(d['date']);
            return t1 >= t_st && t1 <= t_ed;
          });
      
        data_area['columns'] = ["date", "politics", "economy", "culture", "military","sports","science"];
        data_area['y'] = "News";
        draw_main_area();
    })

}

main_area()
