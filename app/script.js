// Elements
const employeesElem = document.getElementById("employees");
const weeklyPullRequestsElem = document.getElementById("weeklyPullRequests");
const daysElem = document.getElementById("days");
const shortTestTimeElem = document.getElementById("shortTestTime");
const mediumTestTimeElem = document.getElementById("mediumTestTime");
const longTestTimeElem = document.getElementById("longTestTime");
const updateGraphButton = document.getElementById("updateGraph");

// Chart instance placeholder
let testTimeChart;

// Function to Calculate and Plot the Graph
function plotGraph() {
  // Get values from editable text
  const employees = parseInt(employeesElem.textContent.trim(), 10);
  const weeklyPullRequests = parseInt(
    weeklyPullRequestsElem.textContent.trim(),
    10,
  );
  const days = parseInt(daysElem.textContent.trim(), 10);

  const AVG_SHORT_TEST_TIME = parseFloat(shortTestTimeElem.textContent.trim());
  const AVG_MEDIUM_TEST_TIME = parseFloat(
    mediumTestTimeElem.textContent.trim(),
  );
  const AVG_LONG_TEST_TIME = parseFloat(longTestTimeElem.textContent.trim());

  let shortRunningTests = 0;
  let mediumRunningTests = 0;
  let longRunningTests = 0;

  let totalTestTimes = [];
  let labels = [];

  const dailyPullRequests = (employees * weeklyPullRequests) / 5;
  console.log(`dailyPullRequests ${dailyPullRequests}`);

  // Simulate data for each day
  for (let day = 1; day <= days; day++) {
    const newTests = dailyPullRequests / 2;
    shortRunningTests += newTests;
    mediumRunningTests += dailyPullRequests / 5;
    longRunningTests += dailyPullRequests / 100;

    const totalTestTime =
      (shortRunningTests * AVG_SHORT_TEST_TIME) / 1000 +
      mediumRunningTests * AVG_MEDIUM_TEST_TIME;
    //longRunningTests * AVG_LONG_TEST_TIME;

    totalTestTimes.push(totalTestTime / 60); // Convert to minutes
    labels.push(`Day ${day}`);

    console.log(`Day ${day}`);
    console.log(`Short Running Tests: ${shortRunningTests}`);
  }

  // Update the results table
  updateTable(
    employees,
    dailyPullRequests,
    shortRunningTests,
    mediumRunningTests,
    longRunningTests,
    AVG_SHORT_TEST_TIME / 1000,
    AVG_MEDIUM_TEST_TIME,
    AVG_LONG_TEST_TIME,
  );

  // Render the graph using Chart.js
  const ctx = document.getElementById("testTimeChart").getContext("2d");

  // Create a new chart instance
  window.testTimeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Test Time (minutes)",
          data: totalTestTimes,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Test Time (minutes)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Days",
          },
        },
      },
    },
  });
}

// Function to Update Results Table
function updateTable(
  employees,
  dailyPullRequests,
  shortRunningTests,
  mediumRunningTests,
  longRunningTests,
  shortTestTime,
  mediumTestTime,
  longTestTime,
) {
  // Clear existing rows
  resultsTableBody.innerHTML = "";

  const data = [
    ["Developers", employees],
    ["Daily Pull Requests", dailyPullRequests.toFixed(0)],
    ["Unit-tests", shortRunningTests.toFixed(0)],
    ["Docker/test-container tests", mediumRunningTests.toFixed(0)],
    ["Integration/performance tests", longRunningTests.toFixed(0)],
    ["Avg. Unit-test Time (s)", shortTestTime],
    ["Avg. Docker/test-container Test Time (s)", mediumTestTime],
    ["Avg. Integration/performance Test Time (s)", longTestTime],
  ];

  data.forEach(([metric, value]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${metric}</td><td>${value}</td>`;
    resultsTableBody.appendChild(row);
  });
}

// Event Listener to Update Variables and Replot the Graph
updateGraphButton.addEventListener("click", () => {
  // Destroy the old chart instance if it exists
  if (window.testTimeChart) {
    window.testTimeChart.destroy();
    plotGraph();
  }
});

// Initial Plot
plotGraph();
