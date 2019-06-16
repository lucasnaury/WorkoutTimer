$(document).ready(function () {

var practiceTimePicker = new Picker(document.querySelector('.PracticeTimeInput'), {
  format: 'mm:ss',
  date: '01:00',
  headers: true,
  controls: true,
  inline: true,
  text: {
    title: 'Pick a time',
  },
});
var restTimePicker = new Picker(document.querySelector('.RestTimeInput'), {
  format: 'mm:ss',
  date: '01:00',
  headers: true,
  controls: true,
  inline: true,
  text: {
    title: 'Pick a time',
  },
});
var nbRepeatsPicker = new Picker(document.querySelector('.nbRepeatsInput'), {
  format: 's',
  date: '1',
  headers: true,
  controls: true,
  inline: true,
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

  $( "#form" ).submit(function( event ) {
    event.preventDefault();
    console.log($(".PracticeTimeInput").val());
    console.log($(".RestTimeInput").val());
    console.log($(".nbRepeatsInput").val());

    localStorage.setItem("practiceTime",$(".PracticeTimeInput").val());
    localStorage.setItem("restTime",$(".RestTimeInput").val());
    localStorage.setItem("nbRepeats",$(".nbRepeatsInput").val());

    window.location.href = "index.html";
  });

});
