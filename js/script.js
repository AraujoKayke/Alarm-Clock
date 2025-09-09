// ====== RELÓGIO EM TEMPO REAL ======
const timeEl = document.getElementById('time');
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2,'0');
    const minutes = String(now.getMinutes()).padStart(2,'0');
    const seconds = String(now.getSeconds()).padStart(2,'0');
    timeEl.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// ====== ALARMES ======
const addBtn = document.getElementById('add-alarm');
const clearBtn = document.getElementById('clear-all');
const alarmsContainer = document.getElementById('alarms-container');
const alarmSound = document.getElementById('alarm-sound');
const popup = document.getElementById('alarm-popup');
const stopBtn = document.getElementById('stop-alarm-btn');
const popupTime = document.getElementById('popup-time');

alarmSound.loop = true;
let alarms = []; // array de alarmes {hour, minute, active, element}
let currentAlarming = null;

// ===== FUNÇÕES DE LOCAL STORAGE =====
function saveAlarms() {
    const alarmsData = alarms.map(a => ({
        hour: a.hour,
        minute: a.minute,
        active: a.active
    }));
    localStorage.setItem('alarms', JSON.stringify(alarmsData));
}

function loadAlarms() {
    const stored = localStorage.getItem('alarms');
    if(stored) {
        const parsed = JSON.parse(stored);
        parsed.forEach(a => addAlarmFromStorage(a.hour, a.minute, a.active));
    }
}

// ===== FUNÇÃO PARA CRIAR ALARME NO DOM =====
function addAlarmFromStorage(hour, minute, active = true) {
    const alarmDiv = document.createElement('div');
    alarmDiv.classList.add('alarm-item');
    alarmDiv.innerHTML = `
        <h2>${hour}:${minute}</h2>
        <div class="alarm-options">
            <label class="switch">
                <input type="checkbox" ${active ? "checked" : ""}>
                <span class="slider"></span>
            </label>
            <button class="trash"><i class="bi bi-trash"></i></button>
        </div>
    `;

    // Switch on/off
    const checkbox = alarmDiv.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        const alarmObj = alarms.find(a => a.element === alarmDiv);
        alarmObj.active = checkbox.checked;
        alarmDiv.style.opacity = checkbox.checked ? "1" : "0.6";
        saveAlarms();
    });

    // Lixeira
    alarmDiv.querySelector('.trash').addEventListener('click', () => {
        alarmsContainer.removeChild(alarmDiv);
        alarms = alarms.filter(a => a.element !== alarmDiv);
        saveAlarms();
    });

    alarmsContainer.appendChild(alarmDiv);
    alarms.push({hour, minute, active, element: alarmDiv});
}

// ===== BOTÃO ADD ALARM =====
addBtn.addEventListener('click', () => {
    const hourInput = document.getElementById('hour');
    const minuteInput = document.getElementById('minute');

    let hour = Number(hourInput.value);
    let minute = Number(minuteInput.value);

    // Validação
    if(isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59){
        alert("Por favor, insira um horário válido (00-23 para horas, 00-59 para minutos).");
        return;
    }

    hour = String(hour).padStart(2,'0');
    minute = String(minute).padStart(2,'0');

    addAlarmFromStorage(hour, minute, true);
    saveAlarms();

    hourInput.value = '';
    minuteInput.value = '';
});

// ===== BOTÃO CLEAR ALL =====
clearBtn.addEventListener('click', () => {
    alarmsContainer.innerHTML = '';
    alarms = [];
    saveAlarms();
});

// ===== CHECAGEM DE ALARMES =====
setInterval(() => {
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2,'0');
    const currentMinute = String(now.getMinutes()).padStart(2,'0');
    const currentSecond = String(now.getSeconds()).padStart(2,'0');

    alarms.forEach(alarm => {
        if(alarm.active &&
           alarm.hour === currentHour &&
           alarm.minute === currentMinute &&
           currentSecond === "00") {

            if(currentAlarming === null){
                currentAlarming = alarm;
                popupTime.textContent = `Alarme: ${alarm.hour}:${alarm.minute}`;
                popup.style.display = "flex";
                alarmSound.play();
            }
        }
    });
}, 1000);

// ===== BOTÃO DESLIGAR POPUP =====
stopBtn.addEventListener('click', () => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    popup.style.display = "none";
    currentAlarming = null;
});

// ===== CARREGAR ALARMES SALVOS =====
loadAlarms();
