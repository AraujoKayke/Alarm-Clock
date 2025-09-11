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

// ====== ELEMENTOS ======
const alarmsContainer = document.getElementById('alarms-container');
const alarmSound = document.getElementById('alarm-sound');
const popup = document.getElementById('alarm-popup');
const stopBtn = document.getElementById('stop-alarm-btn');
const popupTime = document.getElementById('popup-time');
const clearBtn = document.getElementById('clear-all');

// Modal
const openModalBtn = document.getElementById('open-modal');
const modal = document.getElementById('create-modal');
const saveAlarmBtn = document.getElementById('save-alarm');
const cancelAlarmBtn = document.getElementById('cancel-alarm');
const testSoundBtn = document.getElementById('test-sound');
const soundSelect = document.getElementById('alarm-sound-select');
const testAudio = document.getElementById('test-audio');
const modalHour = document.getElementById('modal-hour');
const modalMinute = document.getElementById('modal-minute');

alarmSound.loop = true;
let alarms = []; // {hour, minute, active, sound, element}
let currentAlarming = null;

// ===== FUNÇÕES LOCAL STORAGE =====
function saveAlarms() {
    const alarmsData = alarms.map(a => ({
        hour: a.hour,
        minute: a.minute,
        active: a.active,
        sound: a.sound
    }));
    localStorage.setItem('alarms', JSON.stringify(alarmsData));
}

function loadAlarms() {
    const stored = localStorage.getItem('alarms');
    if(stored) {
        const parsed = JSON.parse(stored);
        parsed.forEach(a => addAlarmFromStorage(a.hour, a.minute, a.active, a.sound));
    }
    if(alarms.length > 0) clearBtn.style.display = "block";
}

// ===== PREENCHE DROPDOWNS =====
for(let h = 0; h < 24; h++){
    const option = document.createElement('option');
    option.value = option.textContent = String(h).padStart(2,'0');
    modalHour.appendChild(option);
}
for(let m = 0; m < 60; m++){
    const option = document.createElement('option');
    option.value = option.textContent = String(m).padStart(2,'0');
    modalMinute.appendChild(option);
}

// ===== CRIAR ALARME NO DOM =====
function addAlarmFromStorage(hour, minute, active = true, sound = "./sounds/alarm-clock-90867.mp3") {
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

    const checkbox = alarmDiv.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        const alarmObj = alarms.find(a => a.element === alarmDiv);
        alarmObj.active = checkbox.checked;
        alarmDiv.style.opacity = checkbox.checked ? "1" : "0.6";
        saveAlarms();
    });

    alarmDiv.querySelector('.trash').addEventListener('click', () => {
        alarmsContainer.removeChild(alarmDiv);
        alarms = alarms.filter(a => a.element !== alarmDiv);
        saveAlarms();
        if(alarms.length === 0) clearBtn.style.display = "none";
    });

    alarmsContainer.appendChild(alarmDiv);
    alarms.push({hour, minute, active, sound, element: alarmDiv});
    clearBtn.style.display = "block";
}

// ===== BOTÃO CLEAR ALL =====
clearBtn.addEventListener('click', () => {
    alarmsContainer.innerHTML = '';
    alarms = [];
    saveAlarms();
    clearBtn.style.display = "none";
});

// ===== ABRIR E FECHAR MODAL COM ANIMAÇÃO =====
let isTesting = false;

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
});

cancelAlarmBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    testAudio.pause();
    testAudio.currentTime = 0;
    testSoundBtn.textContent = "▶️ Testar Som";
    isTesting = false;
});

// ===== TESTAR / PARAR SOM =====
testSoundBtn.addEventListener('click', () => {
    if(!isTesting){
        testAudio.src = soundSelect.value;
        testAudio.loop = true;
        testAudio.play();
        testSoundBtn.textContent = "⏹ Parar Alarme";
        isTesting = true;
    } else {
        testAudio.pause();
        testAudio.currentTime = 0;
        testSoundBtn.textContent = "▶️ Escutar Alarme";
        isTesting = false;
    }
});

// ===== SALVAR ALARME =====
saveAlarmBtn.addEventListener('click', () => {
    let hour = modalHour.value;
    let minute = modalMinute.value;
    let sound = soundSelect.value;

    if(hour === "" || minute === ""){
        alert("Por favor, selecione hora e minuto.");
        return;
    }

    addAlarmFromStorage(hour, minute, true, sound);
    saveAlarms();

    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    modalHour.value = '';
    modalMinute.value = '';
    testAudio.pause();
    testAudio.currentTime = 0;
    testSoundBtn.textContent = "▶️ Escutar Alarme";
    isTesting = false;
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
                popup.classList.add('show');
                alarmSound.src = alarm.sound;
                alarmSound.play();
            }
        }
    });
}, 1000);

// ===== BOTÃO DESLIGAR POPUP =====
stopBtn.addEventListener('click', () => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    popup.classList.remove('show');
    setTimeout(() => {
        popup.style.display = 'none';
    }, 300);
    currentAlarming = null;
});

// ===== CARREGAR ALARMES =====
loadAlarms();