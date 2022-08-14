//  Inspired by Jonathan Moreira

//  http://dribbble.com/shots/1216346-Guided-tour-tooltip

// code by YoannHELIN http://yoannhelin.fr/

$(document).ready(function () {
  var startyear = 1949;
  var endyear = 2020;
  var cnt =0;
  yearid =[];
  for(i=startyear;i<=endyear;i++){
    nowstring = yeartostring[i];
    if(nowstring){
      $('.slider-turn').append($('<p>' + nowstring + '</p>'));
      yearid[cnt++] = i;
    }
  }

  var nbP = $('.container_tooltip p').length;
  var w = parseInt($('.container_tooltip p').css("width"));
  var max = (nbP - 1) * w;
  $("ul li[data-num='1']").addClass('active');
  $('.step span').html('Year ' + (startyear).toString());
  
  $('body').on('click','.btn', function(){
    var margL = parseInt($('.slider-turn').css('margin-left'));
    var modulo = margL%w;
    
    if (-margL < max && modulo == 0) {
      margL -= w;
   
      $('.slider-turn').animate({
        'margin-left':margL
      },300);
      $('ul li.active').addClass('true').removeClass('active');
      var x = -margL/w +1;
      $('ul li[data-num="'+x+'"]').addClass('active');
      $('.step span').html("Year "+ (yearid[x-1]).toString());
    }
    else  {}
  });

  $('body').on('click','.btnlst', function(){
    var margL = parseInt($('.slider-turn').css('margin-left'));
    var modulo = margL%w;
    if (-margL > 0 && modulo == 0) {
      margL += w;
   
      $('.slider-turn').animate({
        'margin-left':margL
      },300);
      $('ul li.active').addClass('true').removeClass('active');
      var x = -margL/w +1;
      $('ul li[data-num="'+x+'"]').addClass('active');
      $('.step span').html("Year " + (yearid[x-1]).toString());
    }
    else  {}
  });
});