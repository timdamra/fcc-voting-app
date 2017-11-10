var canvas = document.getElementById('barChart');
var ctx = canvas.getContext('2d');
var optionsform = document.querySelector('.optionsform');
var poll = JSON.parse(canvas.dataset.poll),
  colors = ['red', 'blue', 'yellow', 'orange', 'green', 'purple'],
  dataLabels = poll.options.map(function(val, i) {
    return val.option;
  }),
  dataVotes = poll.options.map(function(val, i) {
    return val.votes;
  }),
  chartData;

function createChart(set) {
  chartData = set.map(function(val, i) {
    return {
      label: val,
      fill: false,
      lineTension: 0.1,
      backgroundColor: colors[i],
      borderColor: colors[i], // The main line color
      borderCapStyle: 'square',
      borderDash: [], // try [5, 15] for instance
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'black',
      pointBackgroundColor: 'white',
      pointBorderWidth: 1,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: 'yellow',
      pointHoverBorderColor: 'brown',
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHitRadius: 10,
      data: [dataVotes[i]],
      // notice the gap in the data and the spanGaps: true
      spanGaps: true
    };
  });
  return chartData;
}

var dataConfig = createChart(dataLabels);

dataLabels.forEach(function(val, i) {
  var button = document.createElement('button');
  button.classList.add('waves-effect', 'waves-teal', 'btn-flat');
  button.textContent = val;
  button.setAttribute('name', val);
  button.addEventListener('click', function() {
    var optionid = poll.options[i]._id;
    var url = `/poll/${poll._id}/${optionid}`;

    fetch(url)
      .then(function(result) {
        return result.json();
      })
      .then(function(jsondata) {
        (dataLabels = jsondata.options.map(function(val, i) {
          return val.option;
        })), (dataVotes = jsondata.options.map(function(val, i) {
          return val.votes;
        }));
        dataConfig = createChart(dataLabels);
        data = {
          labels: dataLabels,
          datasets: dataConfig
        };

        // Notice the scaleLabel at the same level as Ticks
        options = {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: poll.title,
                  fontSize: 20
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  offsetGridLines: true
                },
                ticks: {
                  autoSkip: false,
                  maxRotation: 45,
                  minRotation: 45
                }
              }
            ]
          }
        };

        myBarChart.destroy();
        myBarChart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: options
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  });
  optionsform.appendChild(button);
});

// Global Options:
Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontSize = 16;

data = {
  labels: dataLabels,
  datasets: dataConfig
};

// Notice the scaleLabel at the same level as Ticks
options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: poll.title,
          fontSize: 20
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          offsetGridLines: true
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }
    ]
  }
};

// Chart declaration:
myBarChart = new Chart(ctx, {
  type: 'bar',
  data: data,
  options: options
});
