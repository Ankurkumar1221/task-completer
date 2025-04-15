let points = 0;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return hours + ":" + minutes + ":" + seconds;
}

function addTask() {
  const taskText = document.getElementById("taskInput").value;
  const hours = parseInt(document.getElementById("hourInput").value) || 0;
  const minutes = parseInt(document.getElementById("minuteInput").value) || 0;
  const seconds = parseInt(document.getElementById("secondInput").value) || 0;

  if (!taskText) return alert("Please enter a task!");

  const totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
  if (totalTime <= 0) return alert("Please set a valid timer.");

  const taskEl = document.createElement("div");
  taskEl.className = "task";
  taskEl.innerHTML = `<strong>${taskText}</strong>`;

  const timerSection = document.createElement("div");
  timerSection.className = "timer-section";

  const circularTimer = document.createElement("div");
  circularTimer.className = "circular-timer";
  circularTimer.innerHTML = `
    <svg>
      <circle class="circle-bg" cx="40" cy="40" r="40"></circle>
      <circle class="circle-progress" cx="40" cy="40" r="40"></circle>
    </svg>
  `;
  const progressCircle = circularTimer.querySelector(".circle-progress");

  const timeDisplay = document.createElement("div");
  timeDisplay.className = "time-display";
  timeDisplay.textContent = formatTime(totalTime);

  const timerWrapper = document.createElement("div");
  timerWrapper.style.display = "flex";
  timerWrapper.style.alignItems = "center";
  timerWrapper.style.gap = "15px";
  timerWrapper.appendChild(circularTimer);
  timerWrapper.appendChild(timeDisplay);

  let timeLeft = totalTime;
  let timer;
  let running = false;

  const startBtn = document.createElement("button");
  startBtn.textContent = "Start";
  startBtn.onclick = function () {
    if (running || timeLeft <= 0) return;
    running = true;
    const originalTime = timeLeft;
    timer = setInterval(() => {
      timeLeft -= 1000;
      if (timeLeft <= 0) {
        clearInterval(timer);
        timeDisplay.textContent = "00:00:00";
        progressCircle.style.strokeDashoffset = 251;
        taskCompleted();
        running = false;
      } else {
        timeDisplay.textContent = formatTime(timeLeft);
        const progress = (timeLeft / originalTime) * 251;
        progressCircle.style.strokeDashoffset = 251 - progress;
      }
    }, 1000);
  };

  const pauseBtn = document.createElement("button");
  pauseBtn.textContent = "Pause";
  pauseBtn.onclick = function () {
    if (timer) {
      clearInterval(timer);
      running = false;
    }
  };

  const fixBtn = document.createElement("button");
  fixBtn.textContent = "Fix Time";
  fixBtn.onclick = function () {
    const newH = prompt("Enter new hours:", 0) || 0;
    const newM = prompt("Enter new minutes:", 0) || 0;
    const newS = prompt("Enter new seconds:", 0) || 0;
    timeLeft = (parseInt(newH) * 3600 + parseInt(newM) * 60 + parseInt(newS)) * 1000;
    timeDisplay.textContent = formatTime(timeLeft);
    progressCircle.style.strokeDashoffset = 0;
  };

  timerSection.appendChild(timerWrapper);
  timerSection.appendChild(startBtn);
  timerSection.appendChild(pauseBtn);
  timerSection.appendChild(fixBtn);

  taskEl.appendChild(timerSection);
  document.getElementById("taskList").appendChild(taskEl);
}

function taskCompleted() {
  points += 100;
  document.getElementById("points").textContent = points;

  const congrats = document.createElement("div");
  congrats.className = "congrats";
  congrats.innerHTML = "🎉 Task Completed 🎉";
  document.body.appendChild(congrats);

  setTimeout(() => {
    document.body.removeChild(congrats);
  }, 5000);
}
