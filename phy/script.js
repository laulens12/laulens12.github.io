konstanten = {
  "dt": 0.1,
  "m": 1,
  "k": 1
};
startwerte = {
  "v": 0,
  "x": 1
};
formeln = {
  "Fres": "-k * x",
  "a": "Fres / m",
  "v": "v + a * dt",
  "x": "x + v * dt"
};
results = {};

var steps = 100;
var labelPrecision = 3;
var gName = "x";
var kName;
var vName;

function vDiagram() {
  gName = vName;
  $("#diagHeader").text(gName + ",t-Diagramm");
  run();
}

function resetKonstanten() {
  $('#konstanten>a:not(.noEdit)').remove();
  if (kName == null) {
    for (var konstante in konstanten) {
      if (konstanten.hasOwnProperty(konstante)) {
        var newLink = $('<a href="#" class="list-group-item list-group-item-action" id="' + konstante + '">' + konstante + ' = ' + konstanten[konstante] + '</a>');
        newLink.insertBefore('#togglerKonstanten');
      }
    }
  }
  else {
    var doneName = false;
    for (var konstante in konstanten) {
      if (konstanten.hasOwnProperty(konstante)) {
        if (konstante == kName) {
          doneName = true;
        }
        else {
          var newLink = $('<a href="#" class="list-group-item list-group-item-action" id="' + konstante + '">' + konstante + ' = ' + konstanten[konstante] + '</a>');
          if (!doneName) {
            newLink.insertBefore('#togglerKonstanten');
          }
          else {
            newLink.insertBefore('#plusKonstante');
          }
        }
      }
    }
  }
  $('#konstanten>a:not(.noEdit)').click(function(){
    kName = $(this)[0].id;
    resetKonstanten();
    $("#togglerKonstanten").show();
    $("#togglerVariablen").hide();
    vName = null;
    resetVariablen();
    resetKInput();
  });
}
function resetKInput() {
  var value = konstanten[kName];
  var input = $("#togglerKonstanten>input")[0];

  if (value > 0) {
    input.min = 0;
    input.max = 2*value;
  }
  if (value == 0) {
    input.min = -10;
    input.max = 10;
  }
  if (value < 0) {
    input.min = 2*value;
    input.max = 0;
  }
  input.value = value;

  $("#togglerKonstanten>input").off("change input mouseup touchend keyup");
  $("#togglerKonstanten>input").on("change input", function(){
    $("#togglerKonstanten>label")[0].innerHTML = kName + " = " + input.value;
  });
  $("#togglerKonstanten>input").on("mouseup touchend keyup", function(evt){
    if (evt.type != "keyup") $("#togglerKonstanten>input").blur();
    konstanten[kName] = input.value;
    run();
    resetKInput();
    return false;
  });
  $("#togglerKonstanten>input").on("mousemove touchmove", function(evt){
    if ($("#togglerKonstanten>input").is(":focus") == false) {
      return false;
    }
  });

  $("#togglerKonstanten>label")[0].innerHTML = kName + " = " + input.value;
  $("#togglerKonstanten>label").click(function(evt){
    evt.stopImmediatePropagation();
    var entered = Number(prompt("Wert für " + kName + " eingeben").replace(",", "."));
    if (!isNaN(entered)) {
      konstanten[kName] = entered;
      run();
      resetKInput();
    }
    else {
      alert("Das ist keine Zahl.")
    }
  });
}
resetKonstanten();

function resetVariablen() {
  $('#variablen>a:not(.noEdit)').remove();
  if (vName == null) {
    for (var formel in formeln) {
      if (formeln.hasOwnProperty(formel)) {
        if (startwerte.hasOwnProperty(formel)) {
          html = '<a href="#" class="list-group-item list-group-item-action" id="' + formel + '">' + formel + ' = ' + formeln[formel] + '<br>' +
          formel + '(0) = ' + startwerte[formel];
          $('#togglerVariablen').before(html);
        }
        else {
          html = '<a href="#" class="list-group-item list-group-item-action" id="' + formel + '">' + formel + ' = ' + formeln[formel];
          $('#togglerVariablen').before(html);
        }
      }
    }
  }
  else {
    var doneName = false;
    for (var formel in formeln) {
      if (formeln.hasOwnProperty(formel)) {
        if (formel == vName) {
          doneName = true;
        }
        else {
          var html = "";
          if (startwerte.hasOwnProperty(formel)) {
            html = '<a href="#" class="list-group-item list-group-item-action" id="' + formel + '">' + formel + ' = ' + formeln[formel] + '<br>' +
            formel + '(0) = ' + startwerte[formel];
          }
          else {
            html = '<a href="#" class="list-group-item list-group-item-action" id="' + formel + '">' + formel + ' = ' + formeln[formel];
          }

          if (!doneName) {
            $('#togglerVariablen').before(html);
          }
          else {
            $('#plusVariable').before(html);
          }
        }
      }
    }
  }
  $('#variablen>a:not(.noEdit)').click(function(){
    vName = $(this)[0].id;
    resetVariablen();
    $("#togglerVariablen").show();
    if (!startwerte.hasOwnProperty(vName)) {
      $("#togglerVariablen>input").hide();
    }
    else {
      $("#togglerVariablen>input").show();
    }
    $("#togglerKonstanten").hide();
    kName = null;
    resetKonstanten();
    resetVInput();
  });
}
function resetVInput() {
  var value = startwerte[vName];
  var input = $("#togglerVariablen>input")[0];

  if (value > 0) {
    input.min = 0;
    input.max = 2*value;
  }
  if (value == 0) {
    input.min = -10;
    input.max = 10;
  }
  if (value < 0) {
    input.min = 2*value;
    input.max = 0;
  }
  input.value = value;

  if (startwerte.hasOwnProperty(vName)) {
    $("#togglerVariablen>label")[0].innerHTML = vName + " = " + formeln[vName] + "<br>"
                                              + vName + "(0) = " + input.value;
  }
  else {
    $("#togglerVariablen>label")[0].innerHTML = vName + " = " + formeln[vName];
  }
  $("#togglerVariablen>input").off("change input mouseup touchend keyup");
  $("#togglerVariablen>input").on("change input", function(){
    if (startwerte.hasOwnProperty(vName)) {
      $("#togglerVariablen>label")[0].innerHTML = "<br>" + vName + "(0) = " + input.value;
    }
    else {
      $("#togglerVariablen>label")[0].innerHTML = vName + " = " + formeln[vName];
    }
  });
  $("#togglerVariablen>input").on("mouseup touchend keyup", function(evt){
    console.log("released");

    if (evt.type != "keyup") $("#togglerVariablen>input").blur();
    startwerte[vName] = input.value;
    run();
    resetVInput();
    return false;
  });
  $("#togglerVariablen>input").on("mousemove touchmove", function(evt){
    if ($("#togglerVariablen>input").is(":focus") == false) {
      return false;
    }
  });

  $("#togglerVariablen>label").click(function(evt){
    evt.stopImmediatePropagation();
    var entered = Number(prompt("Startwert für " + vName + " eingeben").replace(",", "."));
    if (!isNaN(entered)) {
      startwerte[vName] = entered;
      run();
      resetVInput();
    }
    else {
      alert("Das ist keine Zahl.")
    }
  });
}
resetVariablen();

// -- -- -- CHART -- -- --
var ctx = $('#modelcanv');
var scatterChart = new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [{
      data: []
    }]
  },
  options: {
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          return "t = " + tooltipItem.xLabel.toFixed(3) + ", " + gName + " = " + tooltipItem.yLabel.toFixed(3);
        }
      }
    },
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }]
    }
  }
});

function reset() {
  scatterChart.data.datasets[0].data = [];
  scatterChart.update();
}

function run() {
  reset();
  for (var key in startwerte) {
    if (startwerte.hasOwnProperty(key))
    {
      var result = startwerte[key];
      results[key] = [result];
      eval(key + " = " + result + ";");
    }
  }
  var result = 0;
  results["t"] = [result];
  t = result;
  for (var key in konstanten) {
    if (konstanten.hasOwnProperty(key))
    {
      var result = konstanten[key];
      results[key] = [result];
      eval(key + " = " + result + ";");
    }
  }
  for (var key in formeln) {
    if (!startwerte.hasOwnProperty(key))
    {
      var result = eval(formeln[key]);
      results[key] = [result];
      eval(key + " = " + result + ";");
    }
  }
  for (i = 1; i < steps; i++) {
    for (var key in formeln) {
      var result = eval(formeln[key]);
      results[key][i] = result;
      eval(key + " = " + result +";");
    }
    var result = t + dt;
    results["t"][i] = result;
    t = result;
  }
  for (i = 0; i < steps; i++) {
    scatterChart.data.datasets[0].data.push({x: results["t"][i], y: results[gName][i]});
  }
  scatterChart.update();
}

run();
