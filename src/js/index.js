let flag = 0;
let newspapers = 'all';
newsnames = [
  'nytimes',
  'latimes',
  'wsj',
]
function change_news(){
  newspapers = document.getElementById("selectnews").value;
  if(newspapers != 'all') newspapers = Array(newspapers)
  refreshthegraph();
}
$(function() {

  // Initiate Slider
  $('#slider-range').slider({
    range: true,
    min: 1940,
    max: 2020,
    step: 1,
    values: [1980, 2000]
  });

  // Move the range wrapper into the generated divs
  $('.ui-slider-range').append($('.range-wrapper'));

  // Apply initial values to the range container
  $('.range').html('<span class="range-value">' + $('#slider-range').slider("values", 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span><span class="range-divider"></span><span class="range-value">' + $("#slider-range").slider("values", 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span>');

  // Show the gears on press of the handles
  $('.ui-slider-handle, .ui-slider-range').on('mousedown', function() {
    $('.gear-large').addClass('active');
  });

  document.getElementById('start_date').value = '1980-01-01'
  document.getElementById('end_date').value = '2000-12-31'

  // Hide the gears when the mouse is released
  // Done on document just incase the user hovers off of the handle
  $(document).on('mouseup', function() {
    if ($('.gear-large').hasClass('active')) {
      $('.gear-large').removeClass('active');
    }
  });


  // Rotate the gears
  var gearOneAngle = 0,
    gearTwoAngle = 0,
    rangeWidth = $('.ui-slider-range').css('width');

  $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
  $('.gear-two').css('transform', 'rotate(' + gearTwoAngle + 'deg)');

  $('#slider-range').slider({
    slide: function(event, ui) {

      // Update the range container values upon sliding

      $('.range').html('<span class="range-value">' + ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span><span class="range-divider"></span><span class="range-value">' + ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span>');

      // Get old value
      var previousVal = parseInt($(this).data('value'));

      // Save new value
      $(this).data({
        'value': parseInt(ui.value)
      });

      // Figure out which handle is being used
      if (ui.values[0] == ui.value) {

        // Left handle
        if (previousVal > parseInt(ui.value)) {
          // value decreased
          gearOneAngle -= 7;
          $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
        } else {
          // value increased
          gearOneAngle += 7;
          $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
        }
        tmp = document.getElementById('start_date').value;
        tmpls = tmp.split('-')
        tmpls[0] = (ui.values[0]).toString();
        document.getElementById('start_date').value = tmpls.join('-')
        

      } else {

        // Right handle
        if (previousVal > parseInt(ui.value)) {
          // value decreased
          gearOneAngle -= 7;
          $('.gear-two').css('transform', 'rotate(' + gearOneAngle + 'deg)');
        } else {
          // value increased
          gearOneAngle += 7;
          $('.gear-two').css('transform', 'rotate(' + gearOneAngle + 'deg)');
        }

        tmp = document.getElementById('end_date').value;
        tmpls = tmp.split('-')
        tmpls[0] = (ui.values[1]).toString();
        document.getElementById('end_date').value = tmpls.join('-')

      }
      refreshthegraph();
    }
  });

  // Prevent the range container from moving the slider
  $('.range, .range-alert').on('mousedown', function(event) {
    event.stopPropagation();
  });
  refreshthegraph(true);
  console.log($(window).width(), $(window).height());
  console.log('top', document.getElementsByClassName('range-wrapper'))
});
function get_time_range(){
  st_date = document.getElementById('start_date').value;
  ed_date = document.getElementById('end_date').value;
  tmp = st_date.split('-').map(x => Number(x));
  st_year = tmp[0];
  st_month = tmp[1];
  st_date = tmp[2];
  tmp = ed_date.split('-').map(x => Number(x));
  ed_year = tmp[0];
  ed_month = tmp[1];
  ed_date = tmp[2];
  return {
    'st_year': st_year,
    'st_month': st_month,
    'st_date': st_date,
    'ed_year': ed_year,
    'ed_month': ed_month,
    'ed_date': ed_date
  };
}

function refreshthegraph(first=false){
  alltime = get_time_range();

  if(!first){
    st_date = document.getElementById('start_date').value;
    ed_date = document.getElementById('end_date').value;
    t_st = new Date(st_date);
    t_ed = new Date(ed_date);
    d3.select('#container_cloud').selectAll('svg > *').remove();
    cloud_data=get_top_words(all_cloud_data,st_date,ed_date,stopwords,50);
    draw_main_cloud();
    d3.select('#container_stackedarea').selectAll('svg > *').remove();
    
    data_area = backup_data_area.filter((d, i)=>{
      t1 = new Date(d['date']);
      return t1 >= t_st && t1 <= t_ed;
    });

    data_area['columns'] = ["date", "politics", "economy", "culture", "military", "sports", "science"];
    data_area['y'] = "News";
    
    draw_main_area();
  }
  tmp = d3.selectAll('.word-selected')._groups[0];
  WordArray = {};
  if(tmp.length==0){
    WordArray = {'america': 1, 'china': 1};
  }
  else{
    for(i=0;i<tmp.length;i++){
      WordArray[tmp[i].textContent] = 1;
    }
  }
  
  get_detail(alltime['st_year'], alltime['st_month'], alltime['st_date'], alltime['ed_year'], alltime['ed_month'], alltime['ed_date'], newspapers, WordArray, 7)
  .then(showed_list=>{
    var visuallist = document.getElementById('showlist');
  visuallist.innerHTML="";
  for(i in showed_list){
    article = showed_list[i];
    html = document.createElement('li');
    html.setAttribute('class','my_fav_list_li');
    elea = document.createElement('a');
    elea.setAttribute('class', 'my_fav_list_a');
    elea.setAttribute('href', article['url']);
    elea.setAttribute('target', "_blank");
    elea.innerText = article['headline'];
    console.log(article['url']);
    html.appendChild(elea);
    visuallist.appendChild(html);
  }
  })
}
