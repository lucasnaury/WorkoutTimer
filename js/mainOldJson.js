$(document).ready(function () {

  var scrollContainer = $('.scroll');

  var playPauseBtn = null;
  var editBtn = null;

  var countdowns = null;

    var ajax = $.ajax({ //JSON REQUEST FOR COUNTDOWNS
        url: "js/data.json",
        dataType: "json",
        success: function(data) {

            countdowns = data.timers;

            $('.section').remove;

            $.each(data.timers, function (i, timer){
              var appendData = (
                `<div class='section' ${timer.active ? 'id="active"' : ''}
                ${timer.colors ? 'style=" background:linear-gradient(to top right, rgb(' : ''}
                ${timer.colors.bottom}) 0%, rgb(${timer.colors.top}) 100%);">
                  <div class='container'>
                    <div class='restTime'><i class='material-icons-round'>history</i><span> ${timer.restTime} </span></div>
                    <div class='countdown'><img src="img/PracticeTime.png"><span> ${timer.totalTime} </span></div>
                    <div class='nbRepeats'>${timer.nbRepeats}</div>
                    <div class="background">
                      <i class='material-icons-round background-rest'>history</i>
                      <img class='background-countdown' src="img/PracticeTime.png">
                    </div>
                    <div class="svgContainer">
                      <svg version="1.1" viewBox="0 0 500 500" preserveAspectRatio="xMinYMin meet">
                        <circle cx="250" cy="250" r="251" stroke="white" stroke-width="4px" stroke-linecap="round" stroke-dasharray="250px" stroke-dashoffset="1580"/>
                      </svg>
                    </div>
                  </div>
                  <div class='parameters'>
                    <span class='legend'>Practice Time</span>
                    <i class='material-icons-round playPauseBtn'>play_arrow</i>
                    <i class='material-icons-round editBtn'>edit</i>
                  </div>
              </div>`);

              $(scrollContainer.append(appendData));
              playPauseBtn = $('.playPauseBtn');
              editBtn = $('.editBtn');
              $(".navInfo").append(`<span class='navPoint ${timer.state ? timer.state : ''}'>.</span>`)

            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('ERROR', textStatus, errorThrown);
        }
    });

    $.when(ajax.done(function(){

      var x;
      var actualContainer;
      var actualPlayPauseBtn;
      var actualCountdown;
      var actualRestTime;
      var actualNbRepeats;
      var actualParameters;
      var actualBackground;
      var actualSVGCircle;

      var initialCountdownTimeText;
      var initialRestTimeText;
      var initialNbRepeatText;
      var initialParametersLegendText;

      var state = 'pause';

      playPauseBtn.click(function(){

        if (state == 'pause'){
          clearInterval(x);
          state = 'play';
          actualPlayPauseBtn = $(this);
          actualPlayPauseBtn.html('pause');

          actualContainer = $(this).parent().parent().children('.container');
          actualCountdown = actualContainer.children('.countdown');
          actualRestTime = actualContainer.children('.restTime');
          actualNbRepeats = actualContainer.children('.nbRepeats');
          actualParameters = actualContainer.parent().children('.parameters');
          actualBackground = actualContainer.children('.background');
          actualSVGCircle = actualContainer.children('.svgContainer').children("svg").children("circle");

          initialCountdownTimeText= actualCountdown.children('span').text();
          initialRestTimeText= actualRestTime.children('span').text();
          initialNbRepeatText= actualContainer.children('.nbRepeats').text();
          initialParametersLegendText = actualContainer.parent().children('.parameters').children(".legend").text();

          x = setInterval(function() {timer(actualCountdown)},1000);
        }
        else if (state == 'play'){

          if(actualPlayPauseBtn = $(this)){
            clearInterval(x);
            state = 'pause';
            actualPlayPauseBtn.html('play_arrow');
          }
          else{
            console.log('Reset');
            resetTimers();
            actualPlayPauseBtn = $(this);
          }

        }
        else if (state == 'end'){
          clearInterval(x);
          state = 'play';
          actualPlayPauseBtn.html('pause');
          x = setInterval(function() {timer(actualCountdown)},1000);
        }

      });


      editBtn.click(function(){
        console.log('Edit');
      });



      function timer (){

        actualRestTime.addClass("restTime");
        actualRestTime.removeClass("restTimeToCountdown");

        actualCountdown.addClass("countdown");
        actualCountdown.removeClass("countdownToRestTime");

        actualRestTime.children("span").html(initialRestTimeText);
        actualParameters.children(".legend").html("Practice Time");

        actualBackground.children().removeClass("active");
        actualBackground.children(".background-countdown").addClass("active");

        var countdownTimeText = actualCountdown.text().split(/:/);
        var countdownTime = countdownTimeText[0]*60000 + countdownTimeText[1]*1000 - 1000;

        var minutes = Math.floor((countdownTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((countdownTime % (1000 * 60)) / 1000).toString();

        if (seconds < 10){seconds = '0' + seconds}

        actualCountdown.children("span").html(`${minutes}:${seconds}`);
        var initialCountdownTime = initialCountdownTimeText.split(/:/);
        var progression = parseFloat(countdownTime) / parseFloat(initialCountdownTime[0]*60000 + initialCountdownTime[1]*1000);
        actualSVGCircle.css("stroke-dashoffset",3.16 * 2 * 250 * progression);

        if (actualNbRepeats.html() < 1){
          resetTimers();
          actualParameters.children(".legend").html("Finished");
          state = 'end';
          actualPlayPauseBtn.html('replay');
        }

        if (countdownTime <= 0){
          clearInterval(x);
          x = setInterval(function() {rest()},1000);
          actualNbRepeats.html(actualNbRepeats.html() - 1);
          actualSVGCircle.css("stroke-dashoffset",3.16 * 2 * 250);
        }
      }

      function rest (){

        actualRestTime.removeClass("restTime");
        actualRestTime.addClass("restTimeToCountdown");

        actualCountdown.removeClass("countdown");
        actualCountdown.addClass("countdownToRestTime");

        actualCountdown.children("span").html(initialCountdownTimeText);
        actualParameters.children(".legend").html("Rest Time");

        actualBackground.children().removeClass("active");
        actualBackground.children(".background-rest").addClass("active");

        var restTimeText = actualRestTime.children("span").text().split(/:/);
        var restTime = restTimeText[0]*60000 + restTimeText[1]*1000 - 1000;

        var minutes = Math.floor((restTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((restTime % (1000 * 60)) / 1000).toString();

        if (seconds < 10){seconds = '0' + seconds}

        actualRestTime.children("span").html(`${minutes}:${seconds}`);
        var initialRestTime = initialRestTimeText.split(/:/);
        var progression = parseFloat(restTime) / parseFloat(initialRestTime[0]*60000 + initialRestTime[1]*1000);
        actualSVGCircle.css("stroke-dashoffset",3.16 * 2 * 250 *progression);

        if (restTime <= 0){
          clearInterval(x);
          x = setInterval(function() {timer(actualCountdown)},1000);
          actualSVGCircle.css("stroke-dashoffset",3.16 * 2 * 250);
        }

      }

      function resetTimers (){
        clearInterval(x);
        state = 'pause';

        actualCountdown.children("span").html(initialCountdownTimeText);
        actualRestTime.children("span").html(initialRestTimeText);
        actualNbRepeats.html(initialNbRepeatText);

        actualParameters.children(".legend").html(initialParametersLegendText);
        actualPlayPauseBtn.html('play_arrow');
        actualBackground.children().removeClass("active");

        actualSVGCircle.css("stroke-dashoffset","calc(3.16 * 2 * 250)");
      }


    }));

});
