$(document).ready(function () {

  var playPauseBtn = null;
  var editBtn = null;

  var countdowns = null;

  //////////////////////SELECT TIMER//////////////////////////
  var practiceTimePicker = new Picker(document.querySelector('.PracticeTimeInput'), {
    format: 'mm:ss',
    date: '01:00',
    headers: true,
    controls: true,
    text: {
      title: 'Pick a time',
    },
    increment: {
      second:5
    }
  });
  var restTimePicker = new Picker(document.querySelector('.RestTimeInput'), {
    format: 'mm:ss',
    date: '01:00',
    headers: true,
    controls: true,
    text: {
      title: 'Pick a time',
    },
    increment: {
      second:5
    }
  });
  var nbRepeatsPicker = new Picker(document.querySelector('.nbRepeatsInput'), {
    format: 's',
    date: '1',
    headers: true,
    controls: true,
    text: {
      title: '',
      second: 'Number of Repeats'
    }
  });

  var defaultPracticeTime = localStorage.getItem("practiceTime");
  var defaultRestTime = localStorage.getItem("restTime");
  var defaultNbRepeats = localStorage.getItem("nbRepeats");


  if (defaultPracticeTime != null && defaultRestTime != null && defaultNbRepeats != null ){
    $(".PracticeTimeInput").val(defaultPracticeTime);
    $(".RestTimeInput").val(defaultRestTime);
    $(".nbRepeatsInput").val(defaultNbRepeats);

    practiceTimePicker.update();
    restTimePicker.update();
    nbRepeatsPicker.update();
  }

  $("#submitBtn").click(function(){

    localStorage.setItem("practiceTime",$(".PracticeTimeInput").val());
    localStorage.setItem("restTime",$(".RestTimeInput").val());
    localStorage.setItem("nbRepeats",$(".nbRepeatsInput").val());

    var localPracticeTime = $(".PracticeTimeInput").val();
    var localRestTime = $(".RestTimeInput").val();
    var localNbRepeats = $(".nbRepeatsInput").val();

    $(".choose").css("opacity",0);
    setTimeout(function() {
      $(".choose").css("visibility","hidden");
      $("#form").trigger("reset");
    },300);

    ///////////////////////////INIT TIMER////////////////////////////////

    if (localStorage.getItem("practiceTime") != null && localStorage.getItem("restTime") != null && localStorage.getItem("nbRepeats") != null){
      localPracticeTime = localStorage.getItem("practiceTime");
      localRestTime = localStorage.getItem("restTime");
      localNbRepeats = localStorage.getItem("nbRepeats");
    }

    if (localPracticeTime != null && localRestTime != null && localNbRepeats != null ){
      var appendData = (
        `<div class='section'>
          <div class='container'>
            <div class='restTime'><i class='material-icons-round'>history</i><span> ${localRestTime} </span></div>
            <div class='countdown'><img src="img/PracticeTime.png"><span> ${localPracticeTime} </span></div>
            <div class='nbRepeats'>${localNbRepeats}</div>
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
      $(".section").remove();
      $("body").append(appendData);
      playPauseBtn = $('.playPauseBtn');
      editBtn = $('.editBtn');
      start();
    } else {
      playPauseBtn = $('.playPauseBtn');
      editBtn = $('.editBtn');
      start();
    }

  });

  ////////////////////////////////////PROCESSING COUNTDOWN////////////////////////////
  function start (){

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

    var state = 'init';

    playPauseBtn.click(function(){

      if (state == 'init'){
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
      else if (state == 'pause'){
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

        x = setInterval(function() {timer(actualCountdown)},1000);
      }
      else if (state == 'play'){
        clearInterval(x);
        state = 'pause';
        actualPlayPauseBtn.html('play_arrow');
      }
      else if (state == 'end'){
        clearInterval(x);
        state = 'play';
        actualPlayPauseBtn.html('pause');
        x = setInterval(function() {timer(actualCountdown)},1000);
      }

    });


    editBtn.click(function(){
      $("#form").trigger("reset");
      $(".choose").css("visibility","visible");
      $(".choose").css("opacity",1);

      defaultPracticeTime = localStorage.getItem("practiceTime");
      defaultRestTime = localStorage.getItem("restTime");
      defaultNbRepeats = localStorage.getItem("nbRepeats");

      if (defaultPracticeTime != null && defaultRestTime != null && defaultNbRepeats != null ){
        $(".PracticeTimeInput").val(defaultPracticeTime);
        $(".RestTimeInput").val(defaultRestTime);
        $(".nbRepeatsInput").val(defaultNbRepeats);

        practiceTimePicker.update();
        restTimePicker.update();
        nbRepeatsPicker.update();
      } else {
        $(".PracticeTimeInput").val(initialCountdownTimeText);
        $(".RestTimeInput").val(initialRestTimeText);
        $(".nbRepeatsInput").val(initialNbRepeatText);

        practiceTimePicker.update();
        restTimePicker.update();
        nbRepeatsPicker.update();
      }
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


  }

});
