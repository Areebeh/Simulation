function fact(num) {
  if (num < 0) {
    return -1;
  } else if (num == 0) {
    return 1;
  } else {
    let result = 1;
    for (var i = num; i > 1; i--) {
      result *= i;
    }
    return result;
  }
}
function goToHomePage() {
  window.location.href = "../index.html"; // Change "index.html" to your actual home page URL
}

function cpCalc(arrivalMean) {
  let cplookup = 0;
  let cp = 0;
  let count = 0;
  let cparray = [];
  let cplookuparray = [];

  while (cp < 1) {
    let calc = Math.pow(2.71828, -arrivalMean);
    calc = calc * Math.pow(arrivalMean, count);
    calc = calc / fact(count);

    cplookup = cp;
    cplookuparray[count] = cplookup;

    cp = calc + cplookup;
    cparray[count] = cp;
    //    console.log(cp+'\n'+count)
    count = count + 1;
  }
  let array = [cparray, cplookuparray];
  return array;
}
function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const c1 = 0.31938153;
  const c2 = -0.356563782;
  const c3 = 1.781477937;
  const c4 = -1.821255978;
  const c5 = 1.330274429;
  let probability =
    1 -
    d *
      (c1 * t +
        c2 * t * t +
        c3 * t * t * t +
        c4 * t * t * t * t +
        c5 * t * t * t * t * t);

  if (x < 0) {
    probability = 1 - probability;
  }

  return probability;
}

function cpCalcUniform(mean, variance) {
  let cplookup = 0;
  let cp = 0;
  let count = 0;

  let cparray = [];
  let cplookuparray = [];
  cplookuparray[0] = 0;

  while (cp < 1) {
    cp = normalCDF(count, mean, variance);

    cparray[count] = cp;
    count = count + 1;
    cplookup = cparray[count - 1];
    cplookuparray[count] = cplookup;
  }
  let array = [cparray, cplookuparray];
  return array;
}

function Addvalues() {
  var queuingModel = document.getElementById("queuing-model").value;
  var serviceMinInput = document.getElementById("service_min");
  var serviceMaxInput = document.getElementById("service_max");
  var serviceMean = document.getElementById("service-mean");
  var meanArrival = document.getElementById("mean-arrival");
  var avgInterarrival = document.getElementById("avg_interarrival");
  var avgService = document.getElementById("avg_service");
  var varArrival = document.getElementById("var_arrival");
  var varService = document.getElementById("var_service");
  var chiSquareDiv = document.getElementById("chi-square-results");
  var chiSquareService = document.getElementById("service-chi");

  // Hide all elements by default
  serviceMinInput.style.display = "none";
  serviceMaxInput.style.display = "none";
  serviceMean.style.display = "none";
  meanArrival.style.display = "none";
  avgInterarrival.style.display = "none";
  avgService.style.display = "none";
  varArrival.style.display = "none";
  varService.style.display = "none";
  chiSquareDiv.style.display = "none";
  chiSquareService.style.display = "none";

  //   refresh
  serviceMinInput.value = "";
  serviceMaxInput.value = "";
  serviceMean.value = "";
  meanArrival.value = "";
  avgInterarrival.value = "";
  avgService.value = "";
  varArrival.value = "";
  varService.value = "";

  if (queuingModel === "M/G/1" || queuingModel === "M/G/2") {
    serviceMinInput.style.display = "block";
    serviceMaxInput.style.display = "block";
    meanArrival.style.display = "block";
    chiSquareDiv.style.display = "block";
    chiSquareService.style.display = "none";
  }

  if (queuingModel === "M/M/2" || queuingModel === "M/M/1") {
    serviceMean.style.display = "block";
    meanArrival.style.display = "block";
    chiSquareDiv.style.display = "block";
    chiSquareService.style.display = "block";
  }

  if (queuingModel === "G/G/1" || queuingModel === "G/G/2") {
    avgInterarrival.style.display = "block";
    avgService.style.display = "block";
    varArrival.style.display = "block";
    varService.style.display = "block";
  }
}

// -------------------------------------- M / M / 1 MODEL  ---------------------------------------------- //
function generate_MM1_Table() {
  var arrivalMean = parseFloat(document.getElementById("mean-arrival").value);
  var queuingModel = document.getElementById("queuing-model").value;
  var serviceMean = parseFloat(document.getElementById("service-mean").value);

  let interarrival = [];

  let arraymain = cpCalc(arrivalMean);
  cparray = arraymain[0];
  cplookuparray = arraymain[1];

  interarrival[0] = 0;
  for (let i = 1; i < cparray.length; i++) {
    random = Math.random();
    if (random == 0) {
      random = random + 0.1;
    } else {
      for (let j = 0; j < cplookuparray.length; j++) {
        if (random > cplookuparray[j] && random < cparray[j]) {
          interarrival[i] = j + 1;
        }
      }
    }
  }

  let currentTime = 0;
  let arrivalarray = [];
  let servicearray = [];
  let starttime = [];
  let endtime = [];
  let turnaround = [];
  let waittime = [];
  let service = 0;

  for (let i = 0; i < cparray.length; i++) {
    currentTime = currentTime + interarrival[i];
    arrivalarray[i] = currentTime;
    service = exponentialRandom(serviceMean);
    if (Math.floor(service) == 0) {
      servicearray[i] = Math.ceil(service);
    } else {
      servicearray[i] = roundOff(service);
    }
  }

  let Ganttchart = [[]];
  let check = 0;
  let customer = 0;
  let index = 0;

  for (let k = 0; index < cparray.length; k++) {
    if (arrivalarray[index] == check) {
      Ganttchart[k] = [check, check + servicearray[index], index + 1];
      starttime[index] = check;
      endtime[index] = check + servicearray[index];
      check = check + servicearray[index];
      customer++;
      index++;
    } else if (arrivalarray[index] > check) {
      Ganttchart[k] = [check, arrivalarray[index], 0];
      check = arrivalarray[index];
    } else {
      Ganttchart[k] = [check, check + servicearray[index], index + 1];
      starttime[index] = check;
      endtime[index] = check + servicearray[index];
      check = check + servicearray[index];
      customer++;
      index++;
    }
  }

  const table = document.getElementById("simulation_table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (let i = 0; i < cparray.length; i++) {
    const seqNumber = i + 1;
    const cumlookup = cplookuparray[i];
    const cum = cparray[i];
    const avgArrival = i;
    const interArrivalRate = interarrival[i];
    currentTime = arrivalarray[i];
    const serviceTime = servicearray[i];
    const startTime = starttime[i];
    const endTime = endtime[i];
    const turnaroundTime = endTime - currentTime;
    turnaround[i] = turnaroundTime;
    const waitTime = startTime - currentTime;
    waittime[i] = waitTime;
    const responseTime = waitTime + serviceTime;

    const row = table.insertRow();
    row.insertCell(0).innerText = seqNumber;
    row.insertCell(1).innerText = cumlookup;
    row.insertCell(2).innerText = cum;
    row.insertCell(3).innerText = avgArrival;
    row.insertCell(4).innerText = interArrivalRate;
    row.insertCell(5).innerText = roundOff(currentTime);
    row.insertCell(6).innerText = roundOff(serviceTime);
    row.insertCell(7).innerText = roundOff(startTime);
    row.insertCell(8).innerText = roundOff(endTime);
    row.insertCell(9).innerText = roundOff(turnaroundTime);
    row.insertCell(10).innerText = roundOff(waitTime);
    row.insertCell(11).innerText = roundOff(responseTime);
    row.insertCell(12).innerText = "Server 1";
  }

  let avgwait = 0;
  let countwait = 0;
  let avgturnaround = 0;
  let servicetime = 0;
  for (let i = 0; i < cparray.length; i++) {
    avgturnaround += turnaround[i];
    servicetime += servicearray[i];
    if (waittime[i] != 0) {
      avgwait += waittime[i];
      countwait++;
    }
  }

  avgturnaround = avgturnaround / cparray.length;
  avgwait = countwait === 0 ? 0 : avgwait / countwait;

  let idle = 0;
  for (let i = 0; i < Ganttchart.length; i++) {
    if (Ganttchart[i][2] == 0) {
      idle += Ganttchart[i][1] - Ganttchart[i][0];
    }
  }

  let serverutil = 1 - idle / check;

  document.getElementById("server-utlization").innerHTML =
    serverutil.toFixed(3);
  document.getElementById("avg-turnaround").innerHTML =
    avgturnaround.toFixed(3);
  document.getElementById("avg-wait").innerHTML = avgwait.toFixed(3);

  function exponentialRandom(mean) {
    return -Math.log(1 - Math.random()) * mean;
  }

  function roundOff(value) {
    return Math.round(value);
  }

  function chiSquareTest(dataArray, mean, label, outputId) {
    const numBins = 10;
    const maxValue = Math.max(...dataArray);
    const binWidth = maxValue / numBins;

    let observed = new Array(numBins).fill(0);
    let expected = new Array(numBins).fill(0);

    dataArray.forEach((value) => {
      let bin = Math.floor(value / binWidth);
      if (bin >= numBins) bin = numBins - 1;
      observed[bin]++;
    });

    for (let i = 0; i < numBins; i++) {
      const lower = i * binWidth;
      const upper = (i + 1) * binWidth;
      const prob = Math.exp(-lower / mean) - Math.exp(-upper / mean);
      expected[i] = prob * dataArray.length;
    }

    let chiSquare = 0;
    for (let i = 0; i < numBins; i++) {
      if (expected[i] !== 0) {
        chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
      }
    }

    const numParamsEstimated = 1;
    const degreesOfFreedom = numBins - numParamsEstimated - 1;

    const chiCriticalValues = {
      7: 14.067,
      8: 15.507,
      9: 16.919,
      10: 18.307,
    };

    const criticalValue = chiCriticalValues[degreesOfFreedom] || 15.507;

    const result =
      chiSquare < criticalValue
        ? "✅ Good fit to Exponential Distribution"
        : "❌ Not a good fit";

    const outputDiv = document.getElementById(outputId);
    outputDiv.innerHTML = `
        <b>${label}</b><br/>
        Chi-Square Value: <b>${chiSquare.toFixed(3)}</b><br/>
        Critical Value (df=${degreesOfFreedom}, α=0.05): <b>${criticalValue}</b><br/>
        Result: ${result}
        <hr/>
      `;
  }

  chiSquareTest(
    interarrival.slice(1),
    arrivalMean,
    "Inter-arrival Times",
    "interarrival-chi"
  );
  chiSquareTest(servicearray, serviceMean, "Service Times", "service-chi");
}

// ------------------------------------ M / M / 2 MODEL  ---------------------------------------------- //

function generate_MM2_Table() {
  const arrivalMean = parseFloat(document.getElementById("mean-arrival").value);
  const serviceMean = parseFloat(document.getElementById("service-mean").value);

  let cparray = [];
  let cplookuparray = [];
  let interarrival = [];

  arraymain = cpCalc(arrivalMean);
  cparray = arraymain[0];
  cplookuparray = arraymain[1];

  interarrival[0] = 0;
  for (let i = 1; i < cparray.length; i++) {
    random = Math.random();
    if (random == 0) {
      random = random + 0.1;
    } else {
      for (let j = 0; j < cplookuparray.length; j++) {
        if (random > cplookuparray[j] && random < cparray[j]) {
          interarrival[i] = j + 1;
        }
      }
    }
  }

  let currentTime = 0;
  let arrivalarray = [];
  let servicearray = [];
  let starttime = [];
  let endtime = [];
  let turnaround = [];
  let waittime = [];
  let service = 0;

  for (let i = 0; i < cparray.length; i++) {
    currentTime = currentTime + interarrival[i];
    arrivalarray[i] = currentTime;
    service = exponentialRandom(serviceMean);
    servicearray[i] =
      Math.floor(service) == 0 ? Math.ceil(service) : roundOff(service);
  }

  const table = document.getElementById("simulation_table");
  let previousEndTimes = [0, 0];
  let server = [];

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (let i = 0; i < cparray.length; i++) {
    const seqNumber = i + 1;
    const cumlookup = cplookuparray[i];
    const cum = cparray[i];
    const avgArrival = i;
    const interArrivalRate = interarrival[i];
    currentTime = arrivalarray[i];
    const serviceTime = servicearray[i];

    const startTimes = [
      Math.max(currentTime, Math.max(previousEndTimes[0], previousEndTimes[1])),
      currentTime,
    ];

    let serverIndex = 0;
    if (
      previousEndTimes[0] <= currentTime &&
      previousEndTimes[1] <= currentTime
    ) {
      serverIndex = 0;
    } else if (previousEndTimes[1] < previousEndTimes[0]) {
      serverIndex = 1;
    }

    const endTime = startTimes[serverIndex] + serviceTime;
    endtime[i] = endTime;
    const turnaroundTime = Math.max(endTime - currentTime, 0);
    turnaround[i] = turnaroundTime;
    const waitTime = Math.max(startTimes[serverIndex] - currentTime, 0);
    waittime[i] = waitTime;
    const responseTime = waitTime + serviceTime;

    const row = table.insertRow();
    row.insertCell(0).innerText = seqNumber;
    row.insertCell(1).innerText = cumlookup;
    row.insertCell(2).innerText = cum;
    row.insertCell(3).innerText = avgArrival;
    row.insertCell(4).innerText = interArrivalRate;
    row.insertCell(5).innerText = roundOff(currentTime);
    row.insertCell(6).innerText = roundOff(serviceTime);
    row.insertCell(7).innerText = roundOff(startTimes[serverIndex]);
    starttime[i] = roundOff(startTimes[serverIndex]);
    row.insertCell(8).innerText = roundOff(endTime);
    row.insertCell(9).innerText = roundOff(turnaroundTime);
    row.insertCell(10).innerText = roundOff(waitTime);
    row.insertCell(11).innerText = roundOff(responseTime);
    row.insertCell(12).innerText = "Server " + (serverIndex + 1);
    server[i] = serverIndex + 1;

    previousEndTimes[serverIndex] = endTime;
  }

  let avgwait = 0,
    countwait = 0,
    avgturnaround = 0,
    servicetime = 0;
  for (let i = 0; i < cparray.length; i++) {
    avgturnaround += turnaround[i];
    servicetime += servicearray[i];
    if (waittime[i] != 0) {
      avgwait += waittime[i];
      countwait++;
    }
  }

  avgturnaround /= cparray.length;
  avgwait = countwait ? avgwait / countwait : 0;

  let serverutil1 = 0,
    serverutil2 = 0;
  let serverutilization1 = [],
    serverutilization2 = [];

  for (let i = 0; i < server.length; i++) {
    if (server[i] == 1) serverutilization1.push(i);
    else serverutilization2.push(i);
  }

  let idle = 0;
  for (let k = 0; k < serverutilization1.length - 1; k++) {
    if (starttime[serverutilization1[k + 1]] > endtime[serverutilization1[k]])
      idle +=
        starttime[serverutilization1[k + 1]] - endtime[serverutilization1[k]];
  }
  idle = previousEndTimes[0] - idle;
  serverutil1 = idle / previousEndTimes[0];

  idle = 0;
  for (let k = 0; k < serverutilization2.length - 1; k++) {
    if (starttime[serverutilization2[k + 1]] > endtime[serverutilization2[k]])
      idle +=
        starttime[serverutilization2[k + 1]] - endtime[serverutilization2[k]];
  }
  idle = previousEndTimes[1] - idle;
  serverutil2 = idle / previousEndTimes[1];

  document.getElementById(
    "server-utlization"
  ).innerHTML = `<b>Server Utilization 1</b>: ${serverutil1.toFixed(3)} &nbsp; 
       <b>Server Utilization 2</b>: ${serverutil2.toFixed(3)}`;
  document.getElementById("avg-turnaround").innerHTML =
    avgturnaround.toFixed(3);
  document.getElementById("avg-wait").innerHTML = avgwait.toFixed(3);

  // Chi-Square Test Section
  chiSquareTest(
    interarrival.slice(1),
    arrivalMean,
    "Inter-arrival Times",
    "interarrival-chi"
  );
  chiSquareTest(servicearray, serviceMean, "Service Times", "service-chi");

  function exponentialRandom(mean) {
    let value = -Math.log(1 - Math.random()) * mean;
    return value >= 0 ? value : 0;
  }

  function roundOff(value) {
    return Math.round(value);
  }

  function chiSquareTest(dataArray, mean, label, outputId) {
    const numBins = 10;
    const maxValue = Math.max(...dataArray);
    const binWidth = maxValue / numBins;

    let observed = new Array(numBins).fill(0);
    let expected = new Array(numBins).fill(0);

    dataArray.forEach((value) => {
      let bin = Math.floor(value / binWidth);
      if (bin >= numBins) bin = numBins - 1;
      observed[bin]++;
    });

    for (let i = 0; i < numBins; i++) {
      const lower = i * binWidth;
      const upper = (i + 1) * binWidth;
      const prob = Math.exp(-lower / mean) - Math.exp(-upper / mean);
      expected[i] = prob * dataArray.length;
    }

    let chiSquare = 0;
    for (let i = 0; i < numBins; i++) {
      if (expected[i] !== 0) {
        chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
      }
    }

    const degreesOfFreedom = numBins - 1 - 1;
    const chiCriticalValues = {
      7: 14.067,
      8: 15.507,
      9: 16.919,
      10: 18.307,
    };
    const criticalValue = chiCriticalValues[degreesOfFreedom] || 15.507;

    const result =
      chiSquare < criticalValue
        ? "✅ Good fit to Exponential Distribution"
        : "❌ Not a good fit";

    const outputDiv = document.getElementById(outputId);
    outputDiv.innerHTML = `
        <b>${label}</b><br/>
        Chi-Square Value: <b>${chiSquare.toFixed(3)}</b><br/>
        Critical Value (df=${degreesOfFreedom}, α=0.05): <b>${criticalValue}</b><br/>
        Result: ${result}
        <hr/>
      `;
  }
}

// ----------------------------------------- M / G / 1 MODEL  ---------------------------------------------- //

function generate_MG1_Table() {
  const arrivalMean = parseFloat(document.getElementById("mean-arrival").value);
  const serviceMin = parseFloat(document.getElementById("service_min").value);
  const serviceMax = parseFloat(document.getElementById("service_max").value);

  // For The Cummulative Probablity
  let interarrival = [];
  let arraymain = cpCalc(arrivalMean);
  cparray = arraymain[0];
  cplookuparray = arraymain[1];
  // For calculating the inter arrival time

  interarrival[0] = 0;
  for (let i = 1; i < cparray.length; i++) {
    random = Math.random();

    if (random == 0) {
      random = random + 0.1;
    } else {
      for (let j = 0; j < cplookuparray.length; j++) {
        if (random > cplookuparray[j] && random < cparray[j]) {
          interarrival[i] = j + 1;
        }
      }
    }
  }

  let currentTime = 0;
  let arrivalarray = [];
  let servicearray = [];
  let starttime = [];
  let endtime = [];
  let turnaround = [];
  let waittime = [];
  let service = 0;

  // For calculating the Arrival time and Service Time.
  for (let i = 0; i < cparray.length; i++) {
    currentTime = currentTime + interarrival[i];
    arrivalarray[i] = currentTime;
    service = uniformRandom(serviceMin, serviceMax);

    if (Math.floor(service) == 0) {
      servicearray[i] = Math.ceil(service);
    } else {
      servicearray[i] = roundOff(service);
    }
  }

  const table = document.getElementById("simulation_table");
  let previousEndTime = 0;

  // Clear previous table rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (let i = 0; i < cparray.length; i++) {
    const seqNumber = i + 1;
    const cumlookup = cplookuparray[i];
    const cum = cparray[i];
    const avgArrival = i;
    const interArrivalRate = interarrival[i];
    currentTime = arrivalarray[i];
    const serviceTime = servicearray[i];
    const startTime = Math.max(currentTime, previousEndTime);
    const endTime = startTime + serviceTime;
    endtime[i] = endTime;

    turnaroundTime = endTime - currentTime;
    turnaround[i] = turnaroundTime;
    waitTime = startTime - currentTime;
    waittime[i] = waitTime;
    responseTime = waitTime + serviceTime;

    row = table.insertRow();
    row.insertCell(0).innerText = seqNumber;
    row.insertCell(1).innerText = cumlookup;
    row.insertCell(2).innerText = cum;
    row.insertCell(3).innerText = avgArrival;
    row.insertCell(4).innerText = interArrivalRate;

    row.insertCell(5).innerText = roundOff(currentTime);
    row.insertCell(6).innerText = roundOff(serviceTime);
    row.insertCell(7).innerText = roundOff(startTime);
    row.insertCell(8).innerText = roundOff(endTime);
    row.insertCell(9).innerText = roundOff(turnaroundTime);
    row.insertCell(10).innerText = roundOff(waitTime);
    row.insertCell(11).innerText = roundOff(responseTime);

    previousEndTime = endTime;
  }

  // Calculate Average Wait Time and Turnaround Time
  let avgwait = 0;
  let countwait = 0;
  let avgturnaround = 0;
  let servicetime = 0;
  for (let i = 0; i < cparray.length; i++) {
    avgturnaround = turnaround[i] + avgturnaround;
    servicetime = servicetime + servicearray[i];
    if (waittime[i] != 0) {
      avgwait = waittime[i] + avgwait;
      countwait = countwait + 1;
    }
  }
  avgturnaround = avgturnaround / cparray.length;
  if (avgwait == 0) {
    avgwait = 0;
  } else {
    avgwait = avgwait / countwait;
  }

  // Server utilization
  let idleServer = 0;
  let serverutil = 0;
  for (let i = 0; i < cparray.length - 1; i++) {
    if (endtime[i] < starttime[i + 1]) {
      idleServer = idleServer + (starttime[i + 1] - endtime[i]);
    }
  }
  let eindex = cparray.length - 1;
  if (idleServer == 0) {
    serverutil = 1;
  } else {
    serverutil = idleServer / endtime[eindex];
  }

  const serverUtilization = document.getElementById("server-utlization");
  const avgTA = document.getElementById("avg-turnaround");
  const avgWT = document.getElementById("avg-wait");
  const avgRT = document.getElementById("avg-response");

  serverUtilization.innerHTML = serverutil;
  avgTA.innerHTML = avgturnaround;
  avgWT.innerHTML = avgwait;

  // Chi-Square Test for Inter-arrival Times
  chiSquareTest(
    interarrival.slice(1),
    arrivalMean,
    "Inter-arrival Times",
    "interarrival-chi"
  );

  function exponentialRandom(mean) {
    return Math.round(-Math.log(1 - Math.random()) / mean);
  }

  function uniformRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function roundOff(value) {
    return Math.round(value);
  }

  function chiSquareTest(dataArray, mean, label, outputId) {
    const numBins = 10;
    const maxValue = Math.max(...dataArray);
    const binWidth = maxValue / numBins;

    let observed = new Array(numBins).fill(0);
    let expected = new Array(numBins).fill(0);

    dataArray.forEach((value) => {
      let bin = Math.floor(value / binWidth);
      if (bin >= numBins) bin = numBins - 1;
      observed[bin]++;
    });

    for (let i = 0; i < numBins; i++) {
      const lower = i * binWidth;
      const upper = (i + 1) * binWidth;
      const prob = Math.exp(-lower / mean) - Math.exp(-upper / mean);
      expected[i] = prob * dataArray.length;
    }

    let chiSquare = 0;
    for (let i = 0; i < numBins; i++) {
      if (expected[i] !== 0) {
        chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
      }
    }

    const degreesOfFreedom = numBins - 1 - 1;
    const chiCriticalValues = {
      7: 14.067,
      8: 15.507,
      9: 16.919,
      10: 18.307,
    };
    const criticalValue = chiCriticalValues[degreesOfFreedom] || 15.507;

    const result =
      chiSquare < criticalValue
        ? "✅ Good fit to Exponential Distribution"
        : "❌ Not a good fit";

    const outputDiv = document.getElementById(outputId);
    outputDiv.innerHTML = `
        <b>${label}</b><br/>
        Chi-Square Value: <b>${chiSquare.toFixed(3)}</b><br/>
        Critical Value (df=${degreesOfFreedom}, α=0.05): <b>${criticalValue}</b><br/>
        Result: ${result}
        <hr/>
      `;
  }
}

// --------------------------------------- M/G/2 MODEL -------------------------------------------- //

function generate_MG2_Table() {
  const arrivalMean = parseFloat(document.getElementById("mean-arrival").value);
  const serviceMin = parseFloat(document.getElementById("service_min").value);
  const serviceMax = parseFloat(document.getElementById("service_max").value);
  const numServers = 2;

  let cparray = [];
  let cplookuparray = [];
  let interarrival = [];

  const arraymain = cpCalc(arrivalMean);
  cparray = arraymain[0];
  cplookuparray = arraymain[1];

  // Calculate inter-arrival times
  interarrival[0] = 0;
  for (let i = 1; i < cparray.length; i++) {
    let random = Math.random();
    if (random === 0) {
      random = 0.1;
    } else {
      for (let j = 0; j < cplookuparray.length; j++) {
        if (random > cplookuparray[j] && random < cparray[j]) {
          interarrival[i] = j + 1;
        }
      }
    }
  }

  let currentTime = 0;
  let arrivalarray = [];
  let starttime = [];
  let endtime = [];
  let turnaround = [];
  let waittime = [];

  // Calculate arrival times
  for (let i = 0; i < cparray.length; i++) {
    currentTime = currentTime + interarrival[i];
    arrivalarray[i] = currentTime;
  }

  const table = document.getElementById("simulation_table");
  let previousEndTimes = new Array(numServers).fill(0);

  // Clear previous table rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (let i = 0; i < cparray.length; i++) {
    // Simulate number of observations time slots
    const seqNumber = i + 1;
    const cumlookup = cplookuparray[i];
    const cum = cparray[i];
    const interArrivalRate = interarrival[i];
    currentTime = arrivalarray[i];

    const serviceTime = uniformRandom(serviceMin, serviceMax);
    const startTimes = new Array(numServers);

    // Calculate start times for both servers
    for (let serverIndex = 0; serverIndex < numServers; serverIndex++) {
      startTimes[serverIndex] = Math.max(
        currentTime,
        previousEndTimes[serverIndex]
      );
    }

    // Find the server with the minimum end time
    let serverIndex = 0;
    for (let i = 1; i < numServers; i++) {
      if (previousEndTimes[i] < previousEndTimes[serverIndex]) {
        serverIndex = i;
      }
    }

    const endTime = startTimes[serverIndex] + serviceTime;
    endtime[i] = endTime;
    const turnaroundTime = endTime - currentTime;
    turnaround[i] = turnaroundTime;
    const waitTime = startTimes[serverIndex] - currentTime;
    waittime[i] = waitTime;
    const responseTime = waitTime + serviceTime;

    const row = table.insertRow();
    row.insertCell(0).innerText = seqNumber;
    row.insertCell(1).innerText = cumlookup;
    row.insertCell(2).innerText = cum;
    row.insertCell(3).innerText = i;
    row.insertCell(4).innerText = interArrivalRate;
    row.insertCell(5).innerText = roundOff(currentTime);
    row.insertCell(6).innerText = roundOff(serviceTime);
    row.insertCell(7).innerText = roundOff(startTimes[serverIndex]);
    row.insertCell(8).innerText = roundOff(endTime);
    row.insertCell(9).innerText = roundOff(turnaroundTime);
    row.insertCell(10).innerText = roundOff(waitTime);
    row.insertCell(11).innerText = roundOff(responseTime);
    row.insertCell(12).innerText = "Server " + (serverIndex + 1);

    previousEndTimes[serverIndex] = endTime;
  }

  // Chi-Square Test for Arrival Times (Inter-Arrival Times)
  const observedFrequencies = calculateObservedFrequencies(interarrival);
  const expectedFrequencies = calculateExpectedFrequencies(
    arrivalMean,
    interarrival.length
  );
  const chiSquareStatistic = calculateChiSquare(
    observedFrequencies,
    expectedFrequencies
  );
  const degreesOfFreedom = observedFrequencies.length - 1;
  const criticalValue = getCriticalValue(degreesOfFreedom, 0.05);

  // Result based on comparison
  const result =
    chiSquareStatistic > criticalValue
      ? "Reject the null hypothesis (Distribution is not exponential)"
      : "Fail to reject the null hypothesis (Distribution is exponential)";

  // Output Chi-Square Results to HTML
  const chiSquareResults = document.getElementById("chi-square-results");
  const interArrivalChi = document.getElementById("interarrival-chi");
  interArrivalChi.innerHTML = `
      <b>Chi-Square Test for Inter-Arrival Times:</b><br/>
      Chi-Square Value: <b>${chiSquareStatistic.toFixed(3)}</b><br/>
      Critical Value (df=${degreesOfFreedom}, α=0.05): <b>${criticalValue}</b><br/>
      Result: ${result}
      <hr/>
    `;

  console.log("Chi-Square Statistic for Arrival Times: ", chiSquareStatistic);
  console.log("Critical Value: ", criticalValue);
  console.log("Result: ", result);

  let avgwait = 0;
  let countwait = 0;
  let avgturnaround = 0;
  for (let i = 0; i < cparray.length; i++) {
    avgturnaround += turnaround[i];
    if (waittime[i] !== 0) {
      avgwait += waittime[i];
      countwait++;
    }
  }

  avgturnaround /= cparray.length;
  avgwait = countwait === 0 ? 0 : avgwait / countwait;

  console.log(
    "Average Turnaround: " + avgturnaround + "   Average Wait: " + avgwait
  );

  // Server utilization calculation
  let serverutil1 = 0;
  let serverutil2 = 0;
  let idle1 = 0;
  let idle2 = 0;

  for (let k = 0; k < cparray.length - 1; k++) {
    if (starttime[k + 1] > endtime[k]) {
      idle1 += starttime[k + 1] - endtime[k];
    }
    if (starttime[k + 1] > endtime[k]) {
      idle2 += starttime[k + 1] - endtime[k];
    }
  }

  serverutil1 = (previousEndTimes[0] - idle1) / previousEndTimes[0];
  serverutil2 = (previousEndTimes[1] - idle2) / previousEndTimes[1];

  console.log("Server utilization 1: " + serverutil1);
  console.log("Server utilization 2: " + serverutil2);

  // Update HTML with results
  const serverUtilization = document.getElementById("server-utlization");
  const avgTA = document.getElementById("avg-turnaround");
  const avgWT = document.getElementById("avg-wait");

  serverUtilization.innerHTML = `<span><b>Server utilization 1 </b>: ${serverutil1}</span> &nbsp; <span><b>Server utilization 2 </b>: ${serverutil2}</span>`;
  avgTA.innerHTML = `Average Turnaround Time: ${avgturnaround}`;
  avgWT.innerHTML = `Average Wait Time: ${avgwait}`;

  function calculateObservedFrequencies(interarrivals) {
    const binSize = 1;
    const maxArrival = Math.max(...interarrivals);
    const bins = Math.ceil(maxArrival / binSize);
    const frequencies = new Array(bins).fill(0);

    interarrivals.forEach((time) => {
      const binIndex = Math.floor(time / binSize);
      frequencies[binIndex]++;
    });

    return frequencies;
  }

  function calculateExpectedFrequencies(mean, numObservations) {
    const binSize = 1;
    const maxArrival = Math.max(...interarrival);
    const bins = Math.ceil(maxArrival / binSize);
    const frequencies = new Array(bins).fill(0);

    for (let i = 0; i < bins; i++) {
      const lowerBound = i * binSize;
      const upperBound = (i + 1) * binSize;
      const probability =
        (1 / mean) * Math.exp(-lowerBound / mean) -
        (1 / mean) * Math.exp(-upperBound / mean);
      frequencies[i] = probability * numObservations;
    }

    return frequencies;
  }

  function calculateChiSquare(observed, expected) {
    let chiSquare = 0;

    for (let i = 0; i < observed.length; i++) {
      const o = observed[i];
      const e = expected[i];

      if (e > 0) {
        chiSquare += Math.pow(o - e, 2) / e;
      }
    }

    return chiSquare;
  }

  function getCriticalValue(degreesOfFreedom, alpha) {
    // Chi-Square distribution critical value for α=0.05
    const chiTable = {
      1: 3.841,
      2: 5.991,
      3: 7.815,
      4: 9.488,
      5: 11.07,
    };
    return chiTable[degreesOfFreedom] || 99999; // Default for higher degrees of freedom
  }

  function uniformRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function roundOff(value) {
    return Math.round(value);
  }
}

// -------------------------------------------- G/G/1 MODEL ----------------------------------------- //

function generate_GG1_Table() {
  const avgInterarrival = parseFloat(
    document.getElementById("avg_interarrival").value
  );
  const avgService = parseFloat(document.getElementById("avg_service").value);
  const varArrival = parseFloat(document.getElementById("var_arrival").value);
  const varService = parseFloat(document.getElementById("var_service").value);

  const table = document.getElementById("simulation_table");
  // let currentTime = 0;
  let previousEndTime = 0;

  let arraymain = cpCalcUniform(avgInterarrival, varArrival);
  cparray = arraymain[0];
  cplookuparray = arraymain[1];

  // console.log(cparray,cplookuparray)
  let interarrival = [];

  interarrival[0] = 0;
  for (let i = 1; i < cparray.length; i++) {
    random = Math.random();

    if (random == 0) {
      random = random + 0.1;
    } else {
      for (let j = 0; j < cplookuparray.length; j++) {
        if (random > cplookuparray[j] && random < cparray[j]) {
          interarrival[i] = j + 1;
        }
      }
    }
  }
  let currentTime = 0;
  let arrivalarray = [];
  let servicearray = [];
  let starttime = [];
  let endtime = [];
  let turnaround = [];
  let waittime = [];
  let service = 0;

  // For calculating the Arrival time and Service Time.
  for (let i = 0; i < cparray.length; i++) {
    currentTime = currentTime + interarrival[i];
    arrivalarray[i] = currentTime;
  }

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (let i = 0; i < cparray.length; i++) {
    // Simulate number of observations time slots
    // const arrivalTime = generateRandomWithVariance(avgInterarrival, varArrival);
    // currentTime += arrivalTime;

    let serviceTime = 0;
    while (serviceTime <= 0 || serviceTime < 1) {
      serviceTime = generateRandomWithVariance(avgService, varService);
    }
    const seqNumber = i + 1;
    const cumlookup = cplookuparray[i];
    const cum = cparray[i];
    const avgArrival = i;
    const interArrivalRate = interarrival[i];
    currentTime = arrivalarray[i];
    const startTime = Math.max(currentTime, previousEndTime);
    starttime[i] = roundOff(startTime);
    const endTime = startTime + serviceTime;
    endtime[i] = roundOff(endTime);
    const turnaroundTime = Math.max(endTime - currentTime);
    turnaround[i] = roundOff(turnaroundTime);
    const waitTime = Math.max(startTime - currentTime);
    waittime[i] = roundOff(waitTime);
    const responseTime = waitTime + serviceTime;

    const row = table.insertRow();
    row.insertCell(0).innerText = seqNumber;
    row.insertCell(1).innerText = cumlookup;
    row.insertCell(2).innerText = cum;
    row.insertCell(3).innerText = avgArrival;
    row.insertCell(4).innerText = interArrivalRate;
    row.insertCell(5).innerText = roundOff(currentTime);
    row.insertCell(6).innerText = roundOff(serviceTime);
    row.insertCell(7).innerText = roundOff(startTime);
    row.insertCell(8).innerText = roundOff(endTime);
    row.insertCell(9).innerText = roundOff(turnaroundTime);
    row.insertCell(10).innerText = roundOff(waitTime);
    row.insertCell(11).innerText = roundOff(responseTime);
    row.insertCell(12).innerText = "Server " + 1;

    previousEndTime = endTime;
  }

  let avgwait = 0;
  let countwait = 0;
  let avgturnaround = 0;
  let servicetime = 0;
  for (let i = 0; i < cparray.length; i++) {
    avgturnaround = turnaround[i] + avgturnaround;
    servicetime = servicetime + servicearray[i];
    // console.log(avgturnaround)
    if (waittime[i] != 0) {
      avgwait = waittime[i] + avgwait;
      countwait = countwait + 1;
    }
  }
  avgturnaround = avgturnaround / cparray.length;
  if (avgwait == 0) {
    avgwait = 0;
  } else {
    avgwait = avgwait / countwait;
  }
  console.log(avgturnaround + "   " + avgwait);

  let idleServer = 0;
  let serverutil = 0;
  for (let i = 0; i < cparray.length - 1; i++) {
    if (endtime[i] < starttime[i + 1]) {
      idleServer = idleServer + (starttime[i + 1] - endtime[i]);
    }
  }
  let eindex = cparray.length - 1;
  // console.log(endtime[eindex])
  if (idleServer == 0) {
    serverutil = 1;
    console.log("Server  Utilized " + serverutil);
  } else {
    serverutil = idleServer / endtime[eindex];
    console.log("Server  Utilized " + serverutil);
  }

  function generateRandomWithVariance(mean, variance) {
    const stdDev = Math.sqrt(variance);
    const normalDist = generateStandardNormal();
    let value = mean + stdDev * normalDist;
    value = Math.max(0, value); // Ensure non-negative value
    return value;
  }

  function generateStandardNormal() {
    let u, v, s;
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const multiplier = Math.sqrt((-2 * Math.log(s)) / s);
    return u * multiplier;
  }

  const serverUtilization = document.getElementById("server-utlization");
  const avgTA = document.getElementById("avg-turnaround");
  const avgWT = document.getElementById("avg-wait");
  const avgRT = document.getElementById("avg-response");

  serverUtilization.innerHTML = serverutil;
  avgTA.innerHTML = avgturnaround;
  avgWT.innerHTML = avgwait;

  function roundOff(value) {
    return Math.round(value);
  }
}

// ----------------------------------------- G/G/2 MODEL -------------------------------------------- //

function generate_GG2_Table() {
  const avgInterarrival = parseFloat(
    document.getElementById("avg_interarrival").value
  );
  const avgService = parseFloat(document.getElementById("avg_service").value);
  const varArrival = parseFloat(document.getElementById("var_arrival").value);
  const varService = parseFloat(document.getElementById("var_service").value);

  const numServers = 2;

  let arraymain = cpCalcUniform(avgInterarrival, varArrival);
  cparray = arraymain[0];
  cplookuparray = arraymain[1];

  // console.log(cparray,cplookuparray)
  let interarrival = [];

  interarrival[0] = 0;
  for (let i = 1; i < cparray.length; i++) {
    random = Math.random();

    if (random == 0) {
      random = random + 0.1;
    } else {
      for (let j = 0; j < cplookuparray.length; j++) {
        if (random > cplookuparray[j] && random < cparray[j]) {
          interarrival[i] = j + 1;
        }
      }
    }
  }
  let currentTime = 0;
  let arrivalarray = [];
  let servicearray = [];
  let starttime = [];
  let endtime = [];
  let turnaround = [];
  let waittime = [];
  let service = 0;

  // For calculating the Arrival time and Service Time.
  for (let i = 0; i < cparray.length; i++) {
    currentTime = currentTime + interarrival[i];
    arrivalarray[i] = currentTime;
  }

  let server = [];

  const table = document.getElementById("simulation_table");
  // let currentTime = 0;
  let previousEndTimes = Array(numServers).fill(0);

  // Clear previous table rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (let i = 0; i < cparray.length; i++) {
    // Simulate number of observations time slots
    // const arrivalTime = generateRandomWithVariance(avgInterarrival, varArrival);
    // currentTime += arrivalTime;

    let serviceTime = 0;
    while (serviceTime <= 0) {
      serviceTime = generateRandomWithVariance(avgService, varService);
    }

    const startTimes = previousEndTimes.slice(); // Copy previous end times

    // Find the server with the minimum end time
    let serverIndex = 0;
    for (let j = 1; j < numServers; j++) {
      if (previousEndTimes[j] < previousEndTimes[serverIndex]) {
        serverIndex = j;
      }
    }
    const seqNumber = i + 1;
    const cumlookup = cplookuparray[i];
    const cum = cparray[i];
    const avgArrival = i;
    const interArrivalRate = interarrival[i];
    const endTime = startTimes[serverIndex] + serviceTime;
    endtime[i] = roundOff(endTime);
    const turnaroundTime = Math.max(0, endTime - currentTime);
    turnaround[i] = roundOff(turnaroundTime);
    const waitTime = Math.max(0, startTimes[serverIndex] - currentTime);
    waittime[i] = roundOff(waitTime);
    const responseTime = waitTime + serviceTime;

    const row = table.insertRow();
    row.insertCell(0).innerText = seqNumber;
    row.insertCell(1).innerText = cumlookup;
    row.insertCell(2).innerText = cum;
    row.insertCell(3).innerText = avgArrival;
    row.insertCell(4).innerText = interArrivalRate;
    row.insertCell(5).innerText = roundOff(currentTime);
    row.insertCell(6).innerText = roundOff(serviceTime);
    row.insertCell(7).innerText = roundOff(startTimes[serverIndex]);
    starttime[i] = roundOff(startTimes[serverIndex]);
    row.insertCell(8).innerText = roundOff(endTime);
    row.insertCell(9).innerText = roundOff(turnaroundTime);
    row.insertCell(10).innerText = roundOff(waitTime);
    row.insertCell(11).innerText = roundOff(responseTime);
    row.insertCell(12).innerText = "Server " + (serverIndex + 1);

    previousEndTimes[serverIndex] = endTime;
  }

  let avgwait = 0;
  let countwait = 0;
  let avgturnaround = 0;
  let servicetime = 0;
  for (let i = 0; i < cparray.length; i++) {
    avgturnaround = turnaround[i] + avgturnaround;
    servicetime = servicetime + servicearray[i];
    // console.log(endtime[i])
    if (waittime[i] != 0) {
      avgwait = waittime[i] + avgwait;
      countwait = countwait + 1;
    }
  }
  avgturnaround = avgturnaround / cparray.length;
  if (avgwait == 0) {
    avgwait = 0;
  } else {
    avgwait = avgwait / countwait;
  }
  console.log(avgturnaround + "   " + avgwait);

  let serverutil1 = 0;
  let serverutil2 = 0;
  let serverutilization1 = [];
  let serverutilization2 = [];
  for (let i = 0; i < server.length; i++) {
    if (server[i] == 1) {
      serverutilization1.push(i);
    } else {
      serverutilization2.push(i);
    }
  }
  let idle = 0;
  for (let k = 0; k < serverutilization1.length - 1; k++) {
    // console.log(starttime[serverutilization1[k+1]] + "    " +  endtime[serverutilization1[k]] )
    if (starttime[serverutilization1[k + 1]] > endtime[serverutilization1[k]])
      idle =
        idle +
        (starttime[serverutilization1[k + 1]] - endtime[serverutilization1[k]]);
  }
  idle = previousEndTimes[0] - idle;
  serverutil1 = idle / previousEndTimes[0];
  console.log("Server utilized 1 " + serverutil1);

  idle = 0;
  for (let k = 0; k < serverutilization2.length - 1; k++) {
    // console.log(starttime[serverutilization2[k+1]] + "    " +  endtime[serverutilization2[k]] )
    if (starttime[serverutilization2[k + 1]] > endtime[serverutilization2[k]])
      idle =
        idle +
        (starttime[serverutilization2[k + 1]] - endtime[serverutilization2[k]]);
  }
  idle = previousEndTimes[0] - idle;
  serverutil2 = idle / previousEndTimes[0];
  console.log("Server utilized  2  " + serverutil2);

  function generateRandomWithVariance(mean, variance) {
    const stdDev = Math.sqrt(variance);
    const normalDist = generateStandardNormal();
    let value = mean + stdDev * normalDist;
    value = Math.max(1, value); // Ensure non-zero value
    return value;
  }

  function generateStandardNormal() {
    let u, v, s;
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const multiplier = Math.sqrt((-2 * Math.log(s)) / s);
    return u * multiplier;
  }

  function roundOff(value) {
    return Math.round(value);
  }

  const serverUtilization = document.getElementById("server-utlization");
  const avgTA = document.getElementById("avg-turnaround");
  const avgWT = document.getElementById("avg-wait");
  const avgRT = document.getElementById("avg-response");

  serverUtilization.innerHTML = `<span><b>Server utilization 1 </b> : ${serverutil1}</span> &nbsp <span><b>Server utilization 2 </b> : ${serverutil2}</span>`;
  avgTA.innerHTML = avgturnaround;
  avgWT.innerHTML = avgwait;
}

// ------------------------------ Calculate Button  ------------------------------------------------ //

function Calculate() {
  var queuingModel = document.getElementById("queuing-model").value;

  //  all inputs
  var serviceMinInput = document.getElementById("service_min");
  var serviceMaxInput = document.getElementById("service_max");
  var serviceMean = document.getElementById("service-mean");
  var meanArrival = document.getElementById("mean-arrival");
  var avgInterarrival = document.getElementById("avg_interarrival");
  var avgService = document.getElementById("avg_service");
  var varArrival = document.getElementById("var_arrival");
  var varService = document.getElementById("var_service");

  if (queuingModel === "M/M/1") {
    if (serviceMean.value.trim() === "" || meanArrival.value.trim() === "") {
      toastifyFunction();
      return;
    } else {
      generate_MM1_Table();
    }
  }

  if (queuingModel === "M/M/2") {
    if (serviceMean.value.trim() === "" || meanArrival.value.trim() === "") {
      toastifyFunction();
      return;
    } else {
      generate_MM2_Table();
    }
  }

  if (queuingModel === "M/G/1") {
    if (
      serviceMaxInput.value.trim() === "" ||
      meanArrival.value.trim() === "" ||
      serviceMinInput.value.trim() === ""
    ) {
      toastifyFunction();
      return;
    } else {
      generate_MG1_Table();
    }
  }

  if (queuingModel === "M/G/2") {
    if (
      serviceMaxInput.value.trim() === "" ||
      meanArrival.value.trim() === "" ||
      serviceMinInput.value.trim() === ""
    ) {
      toastifyFunction();
      return;
    } else {
      generate_MG2_Table();
    }
  }

  if (queuingModel === "G/G/1") {
    if (
      varService.value.trim() === "" ||
      varArrival.value.trim() === "" ||
      avgService.value.trim() === "" ||
      avgInterarrival.value.trim() === ""
    ) {
      toastifyFunction();
      return;
    } else {
      generate_GG1_Table();
    }
  }

  if (queuingModel === "G/G/2") {
   if (
      varService.value.trim() === "" ||
      varArrival.value.trim() === "" ||
      avgService.value.trim() === "" ||
      avgInterarrival.value.trim() === ""
    ) {
      toastifyFunction();
      return;
    } else {
     generate_GG2_Table();
    }
  }
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
