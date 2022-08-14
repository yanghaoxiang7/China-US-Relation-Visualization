
let cloud_width = 650 / 1550 * $(window).width();
let cloud_height = 250 / 762 * $(window).height();

let cloud_data = null;
let all_cloud_data;

function draw_main_cloud() {
    padding = 0
    const fontFamily = "Verdana, Arial, Helvetica, sans-serif";

    s = d3.scaleSqrt()
  .domain([1, d3.max(cloud_data.map(d => d.value))])
  .range([3, 35]);

  let svg = d3.select('#container_cloud')
    .select('svg')
    .attr("id", "word-cloud")
    .attr("viewBox", [0, 0, cloud_width, cloud_height])
    .attr("font-family", fontFamily)
    .attr("text-anchor", "middle");

  //console.log(cloud_height,cloud_width)

  const displaySelection = svg.append("text")
    .attr("font-family", "Lucida Console, Courier, monospace")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "hanging")
    .attr("x", 10)
    .attr("y", 10);

  const cloud = d3.layout.cloud()
    .size([cloud_width, cloud_height])
    .words(cloud_data.map(d => Object.create(d)))
    .padding(0)
    .rotate(() => 0)
    .font(fontFamily)
    .fontSize(d => s(d.value))
    .on("word", ({size, x, y, rotate, text}) => {
      svg.append("text")
        .attr("font-size", size)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .text(text)
        .classed("click-only-text", true)
        .classed("word-default", true)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick);

        function handleMouseOver(d, i) {
          d3.select(this)
            .classed("word-hovered", true)
            .transition(`mouseover-${text}`).duration(200).ease(d3.easeLinear)
              .attr("font-size", size + 2)
              .attr("font-weight", "bold");
        }

        function handleMouseOut(d, i) {
          d3.select(this)
            .classed("word-hovered", false)
            .interrupt(`mouseover-${text}`)
              .attr("font-size", size);
        }

        function handleClick(d, i) {
          var e = d3.select(this);
          e.classed("word-selected", !e.classed("word-selected"));
          refreshthegraph(true);
        }

    });

    cloud.start();

}

function main_cloud() {
    d3.json('data/stopwords.json').then(function(DATA){
        stopwords = new Set(DATA["stopwords"]);
        //console.log(stopwords);
        d3.csv('data/merged.csv').then(function(Data) {
            all_cloud_data = Data;
            cloud_data=get_top_words(Data,'1980/1/1','2000/12/31',stopwords,50);
            draw_main_cloud();
        })
    })
    //d3.json(data_file).then(function(DATA) {
        //data = DATA;
        //draw_main();
    //})
}

main_cloud()
