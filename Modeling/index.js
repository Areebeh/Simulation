// Queuing Models
function goToHomePage() {
  window.location.href = "../index.html"; // Change "index.html" to your actual home page URL
}
function Addvalues() {
  const queueingModels = document.getElementById("queuing-model").value;
  const arrivalRate = document.getElementById("lambda");
  const serviceRate = document.getElementById("mew");
  const min = document.getElementById("min");
  const max = document.getElementById("max");
  const ca = document.getElementById("variance-1");
  const cs = document.getElementById("variance-2");
  const chiSquareArrival = document.getElementById("chi-sq-arrival");
  const chiSquareService = document.getElementById("chi-sq-service");
  const arrivalTimes = document.getElementById("arrival-times");
  const ServiceTimes = document.getElementById("service-times");

  arrivalRate.style.display = "none";
  serviceRate.style.display = "none";
  min.style.display = "none";
  max.style.display = "none";
  ca.style.display = "none";
  cs.style.display = "none";
  chiSquareArrival.style.display = "none";
  chiSquareService.style.display = "none";

  // refresh value
  arrivalRate.value = "";
  serviceRate.value = "";
  min.value = "";
  max.value = "";
  ca.value = "";
  cs.value = "";
  arrivalTimes.value = "";
  ServiceTimes.value = "";

  if (queueingModels === "M/M/1" || queueingModels === "M/M/2") {
    arrivalRate.style.display = "block";
    serviceRate.style.display = "block";
    chiSquareArrival.style.display = "block";
    chiSquareService.style.display = "block";
  }

  if (queueingModels === "M/G/1" || queueingModels === "M/G/2") {
    arrivalRate.style.display = "block";
    min.style.display = "block";
    max.style.display = "block";
    chiSquareArrival.style.display = "block";
  }

  if (queueingModels === "G/G/1" || queueingModels === "G/G/2") {
    arrivalRate.style.display = "block";
    serviceRate.style.display = "block";
    ca.style.display = "block";
    cs.style.display = "block";
  }
}

let arrivalRate, serviceRate, min, max;

// M/M/1 Queue Model
function calculateMM1() {
  arrivalRate = Number(document.getElementById("lambda").value);
  serviceRate = Number(document.getElementById("mew").value);
  const utilization = arrivalRate / serviceRate;
  const averageQueueLengthQueue = Math.pow(utilization, 2) / (1 - utilization);
  const averageWaitingTimeQueue = averageQueueLengthQueue / arrivalRate;
  const averageWaitingTimeSystem = averageWaitingTimeQueue + 1 / serviceRate;
  const averageQueueLengthSystem = arrivalRate * averageWaitingTimeSystem;

  document.getElementById("utilization").innerHTML = utilization;
  document.getElementById("avg-queue-length").innerHTML =
    averageQueueLengthQueue;
  document.getElementById("avg-waitingTime-queue").innerHTML =
    averageWaitingTimeQueue;
  document.getElementById("avg-waitingTime-system").innerHTML =
    averageWaitingTimeSystem;
  document.getElementById("avg-queue-length-system").innerHTML =
    averageQueueLengthSystem;
}

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

function calculatePo(c, rho) {
  let res = 0;
  for (let n = 0; n < c; n++) {
    res += Math.pow(c * rho, n) / factorial(n);
  }
  return 1 / (res + Math.pow(c * rho, c) / (factorial(c) * (1 - rho)));
}

// M/M/2 Queue Model
function calculateMM2() {
  arrivalRate = Number(document.getElementById("lambda").value);
  serviceRate = Number(document.getElementById("mew").value);
  // Calculate utilization
  const utilization = arrivalRate / (2 * serviceRate);

  // Calculate average queue length and waiting
  const averageQueueLengthQueue =
    (calculatePo(2, utilization) *
      Math.pow(arrivalRate / serviceRate, 2) *
      utilization) /
    (factorial(2) * Math.pow(1 - utilization, 2));
  const averageWaitingTimeQueue = averageQueueLengthQueue / arrivalRate;
  const averageWaitingTimeSystem = averageWaitingTimeQueue + 1 / serviceRate;
  const averageQueueLengthSystem = arrivalRate * averageWaitingTimeSystem;

  document.getElementById("utilization").innerHTML = utilization;
  document.getElementById("avg-queue-length").innerHTML =
    averageQueueLengthQueue;
  document.getElementById("avg-waitingTime-queue").innerHTML =
    averageWaitingTimeQueue;
  document.getElementById("avg-waitingTime-system").innerHTML =
    averageWaitingTimeSystem;
  document.getElementById("avg-queue-length-system").innerHTML =
    averageQueueLengthSystem;
}

// M/G/1 Queue Model
function calculateMG1() {
  arrivalRate = Number(document.getElementById("lambda").value);
  min = Number(document.getElementById("min").value);
  max = Number(document.getElementById("max").value);
  serviceRate = 1 / ((min + max) / 2);

  const utilization = arrivalRate / serviceRate;
  const averageQueueLengthQueue =
    (Math.pow(arrivalRate, 2) * (Math.pow(max - min, 2) / 12) +
      Math.pow(utilization, 2)) /
    (2 * (1 - utilization));
  const averageWaitingTimeQueue = averageQueueLengthQueue / arrivalRate;
  const averageWaitingTimeSystem = averageWaitingTimeQueue + 1 / serviceRate;
  const averageQueueLengthSystem = averageWaitingTimeSystem * arrivalRate;

  document.getElementById("utilization").innerHTML = utilization;
  document.getElementById("avg-queue-length").innerHTML =
    averageQueueLengthQueue;
  document.getElementById("avg-waitingTime-queue").innerHTML =
    averageWaitingTimeQueue;
  document.getElementById("avg-waitingTime-system").innerHTML =
    averageWaitingTimeSystem;
  document.getElementById("avg-queue-length-system").innerHTML =
    averageQueueLengthSystem;
}

// M/G/2 Queue Model
function calculateMG2() {
  arrivalRate = Number(document.getElementById("lambda").value);
  min = Number(document.getElementById("min").value);
  max = Number(document.getElementById("max").value);
  serviceRate = 1 / ((min + max) / 2);
  const cs = Math.pow(min - max, 2) / 12 / Math.pow(1 / serviceRate, 2);

  // Calculate utilization
  const utilization = arrivalRate / (2 * serviceRate);

  // Estimate the average length of queue for G/G/2 model
  const expaverageQueueLengthQueue =
    (calculatePo(2, utilization) *
      Math.pow(arrivalRate / serviceRate, 2) *
      utilization) /
    (factorial(2) * Math.pow(1 - utilization, 2));
  const averageWaitingTimeQueue =
    (expaverageQueueLengthQueue / arrivalRate) * ((1 + cs) / 2);

  const averageQueueLengthQueue = averageWaitingTimeQueue * arrivalRate;
  const averageWaitingTimeSystem = averageWaitingTimeQueue + 1 / serviceRate;
  const averageQueueLengthSystem = arrivalRate * averageWaitingTimeSystem;

  document.getElementById("utilization").innerHTML = utilization;
  document.getElementById("avg-queue-length").innerHTML =
    averageQueueLengthQueue;
  document.getElementById("avg-waitingTime-queue").innerHTML =
    averageWaitingTimeQueue;
  document.getElementById("avg-waitingTime-system").innerHTML =
    averageWaitingTimeSystem;
  document.getElementById("avg-queue-length-system").innerHTML =
    averageQueueLengthSystem;
}

// G/G/1 Queue Model
function calculateGG1() {
  arrivalRate = 1 / Number(document.getElementById("lambda").value);
  serviceRate = 1 / Number(document.getElementById("mew").value);
  const ca =
    Number(document.getElementById("variance-1").value) /
    Math.pow(1 / arrivalRate, 2);
  const cs =
    Number(document.getElementById("variance-2").value) /
    Math.pow(1 / serviceRate, 2);

  // Calculate utilization
  const utilization = arrivalRate / serviceRate;

  const averageQueueLengthQueue =
    (Math.pow(utilization, 2) *
      (1 + cs) *
      (ca + Math.pow(utilization, 2) * cs)) /
    (2 * (1 - utilization) * (1 + Math.pow(utilization, 2) * cs));
  const averageWaitingTimeQueue = averageQueueLengthQueue / arrivalRate;
  const averageWaitingTimeSystem = averageWaitingTimeQueue + 1 / serviceRate;
  const averageQueueLengthSystem = arrivalRate * averageWaitingTimeSystem;

  document.getElementById("utilization").innerHTML = utilization;
  document.getElementById("avg-queue-length").innerHTML =
    averageQueueLengthQueue;
  document.getElementById("avg-waitingTime-queue").innerHTML =
    averageWaitingTimeQueue;
  document.getElementById("avg-waitingTime-system").innerHTML =
    averageWaitingTimeSystem;
  document.getElementById("avg-queue-length-system").innerHTML =
    averageQueueLengthSystem;
}

// G/G/2 Queue Model
function calculateGG2() {
  arrivalRate = 1 / Number(document.getElementById("lambda").value);
  serviceRate = 1 / Number(document.getElementById("mew").value);
  const ca =
    Number(document.getElementById("variance-1").value) /
    Math.pow(1 / arrivalRate, 2);
  const cs =
    Number(document.getElementById("variance-2").value) /
    Math.pow(1 / serviceRate, 2);

  // Calculate utilization
  const utilization = arrivalRate / (2 * serviceRate);

  // Estimate the second moment of service time for M/M/2 model
  const expaverageQueueLengthQueue =
    (calculatePo(2, utilization) *
      Math.pow(arrivalRate / serviceRate, 2) *
      utilization) /
    (factorial(2) * Math.pow(1 - utilization, 2));

  const averageQueueLengthQueue = expaverageQueueLengthQueue * ((ca + cs) / 2);
  const averageWaitingTimeQueue = averageQueueLengthQueue / arrivalRate;
  const averageWaitingTimeSystem = averageWaitingTimeQueue + 1 / serviceRate;
  const averageQueueLengthSystem = arrivalRate * averageWaitingTimeSystem;

  document.getElementById("utilization").innerHTML = utilization;
  document.getElementById("avg-queue-length").innerHTML =
    averageQueueLengthQueue;
  document.getElementById("avg-waitingTime-queue").innerHTML =
    averageWaitingTimeQueue;
  document.getElementById("avg-waitingTime-system").innerHTML =
    averageWaitingTimeSystem;
  document.getElementById("avg-queue-length-system").innerHTML =
    averageQueueLengthSystem;
}
function Calculate() {
  const lambda = document.getElementById("lambda").value.trim();
  const mew = document.getElementById("mew").value.trim();
  const min = document.getElementById("min").value.trim();
  const max = document.getElementById("max").value.trim();
  const variance1 = document.getElementById("variance-1").value.trim();
  const variance2 = document.getElementById("variance-2").value.trim();
  const arrivalTimes = document.getElementById("arrival-times").value.trim();
  const serviceTimes = document.getElementById("service-times").value.trim();

  const queueingModels = document.getElementById("queuing-model").value;

  if (queueingModels === "M/M/1") {
    if (
      lambda === "" ||
      mew === "" ||
      arrivalTimes === "" ||
      serviceTimes === ""
    ) {
      toastifyFunction();
      return;
    } else {
      calculateMM1();
      runChiSquareArrivalTest();
      runChiSquareServiceTest();
    }
  }

  if (queueingModels === "M/M/2") {
    if (
      lambda === "" ||
      mew === "" ||
      arrivalTimes === "" ||
      serviceTimes === ""
    ) {
      toastifyFunction();
      return;
    } else {
      calculateMM2();
      runChiSquareArrivalTest();
      runChiSquareServiceTest();
    }
  }

  if (queueingModels === "M/G/1") {
    if (lambda === "" || min === "" || max === "" || arrivalTimes === "") {
      toastifyFunction();
      return;
    } else {
      calculateMG1();
      runChiSquareArrivalTest();
    }
  }

  if (queueingModels === "M/G/2") {
    if (lambda === "" || min === "" || max === "" || arrivalTimes === "") {
      toastifyFunction();
      return;
    } else {
      calculateMG2();
      runChiSquareArrivalTest();
    }
  }

  if (queueingModels === "G/G/1") {
    if (lambda === "" || mew === "" || variance1 === "" || variance2 === "") {
      toastifyFunction();
      return;
    } else {
      calculateGG1();
    }
  }

  if (queueingModels === "G/G/2") {
    if (lambda === "" || mew === "" || variance1 === "" || variance2 === "") {
      toastifyFunction();
      return;
    } else {
      calculateGG2();
    }
  }
}

// Chi-Square Test Calculation
function chiSquareTest(data) {
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;

  const expected = data.map(() => mean);
  let chiSquareValue = 0;

  for (let i = 0; i < n; i++) {
    chiSquareValue += Math.pow(data[i] - expected[i], 2) / expected[i];
  }

  return chiSquareValue;
}

// Arrival Time Chi-Square Test Function
function runChiSquareArrivalTest() {
  const arrivalTimesInput = document.getElementById("arrival-times").value;
  const arrivalTimes = arrivalTimesInput
    .split(",")
    .map(Number)
    .filter((num) => !isNaN(num));

  if (arrivalTimes.length === 0) {
    document.getElementById("chi-square-arrival-result").innerHTML =
      "<p>Please enter valid arrival times.</p>";
    return;
  }

  const arrivalChiSquare = chiSquareTest(arrivalTimes);
  let result = "<h3>Chi-Square Arrival Results:</h3>";
  result += `<p>Arrival Time Chi-Square Value: ${arrivalChiSquare}</p>`;

  const degreesOfFreedom = arrivalTimes.length - 1;
  const criticalValue = 3.841;
  result += `<p>Critical Value: ${criticalValue}</p>`;

  if (arrivalChiSquare > criticalValue) {
    result +=
      "<p>Arrival time distribution does not follow exponential distribution (Reject Null Hypothesis).</p>";
  } else {
    result +=
      "<p>Arrival time distribution follows exponential distribution (Fail to Reject Null Hypothesis).</p>";
  }

  document.getElementById("chi-square-arrival-result").innerHTML = result;
}

// Service Time Chi-Square Test Function
function runChiSquareServiceTest() {
  const serviceTimesInput = document.getElementById("service-times").value;
  const serviceTimes = serviceTimesInput
    .split(",")
    .map(Number)
    .filter((num) => !isNaN(num));

  if (serviceTimes.length === 0) {
    document.getElementById("chi-square-service-result").innerHTML =
      "<p>Please enter valid service times.</p>";
    return;
  }

  const serviceChiSquare = chiSquareTest(serviceTimes);
  let result = "<h3>Chi-Square Service Results:</h3>";
  result += `<p>Service Time Chi-Square Value: ${serviceChiSquare}</p>`;

  const degreesOfFreedom = serviceTimes.length - 1;
  const criticalValue = 3.841;
  result += `<p>Critical Value: ${criticalValue}</p>`;

  if (serviceChiSquare > criticalValue) {
    result +=
      "<p>Service time distribution does not follow exponential distribution (Reject Null Hypothesis).</p>";
  } else {
    result +=
      "<p>Service time distribution follows exponential distribution (Fail to Reject Null Hypothesis).</p>";
  }

  document.getElementById("chi-square-service-result").innerHTML = result;
}

// toachify-func

function toastifyFunction() {
  Toastify({
    text: "Please fill in all required fields before calculating.",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "linear-gradient(to right, #007bff, #0056b3)",
  }).showToast();
}
