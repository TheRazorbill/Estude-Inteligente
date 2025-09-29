document.addEventListener('DOMContentLoaded', () => {

    const sound1 = new Audio('assets/sound/sound1.mp3');
    const sound2 = new Audio('assets/sound/sound2.mp3');
    const sound3 = new Audio('assets/sound/sound3.mp3');

    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const completeRoundBtn = document.getElementById('complete-round-btn');
    const sessionTypeDisplay = document.getElementById('session-type');
    const progressIndicator = document.getElementById('progress-indicator');

    const studyTimeInput = document.getElementById('study-time');
    const shortBreakTimeInput = document.getElementById('short-break-time');
    const longBreakTimeInput = document.getElementById('long-break-time');
    const longBreakIntervalInput = document.getElementById('long-break-interval');
    const totalSessionsInput = document.getElementById('total-sessions');
    const saveTimeSettingsBtn = document.getElementById('save-time-settings');

    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    
    const inputTarefa = document.getElementById('tarefa');
    const botaoAdicionar = document.getElementById('adicionar');
    const listaTarefas = document.getElementById('lista-tarefas');

    let timer;
    let timeLeft;
    let currentPhase = 'study';
    let studySessionCount = 0;
    let totalStudySessions = 6;
    let longBreakInterval = 3;
    let defaultStudyTime = 25 * 60;
    let defaultShortBreakTime = 5 * 60;
    let defaultLongBreakTime = 15 * 60;
    const originalTitle = document.title;

    function openSettingsModal() { settingsModal.classList.remove('hidden'); }
    function closeSettingsModal() { settingsModal.classList.add('hidden'); }

    function loadSettings() {
        defaultStudyTime = parseInt(localStorage.getItem('studyTime') || '25') * 60;
        defaultShortBreakTime = parseInt(localStorage.getItem('shortBreakTime') || '5') * 60;
        defaultLongBreakTime = parseInt(localStorage.getItem('longBreakTime') || '15') * 60;
        longBreakInterval = parseInt(localStorage.getItem('longBreakInterval') || '3');
        totalStudySessions = parseInt(localStorage.getItem('totalSessions') || '6');

        studyTimeInput.value = defaultStudyTime / 60;
        shortBreakTimeInput.value = defaultShortBreakTime / 60;
        longBreakTimeInput.value = defaultLongBreakTime / 60;
        longBreakIntervalInput.value = longBreakInterval;
        totalSessionsInput.value = totalStudySessions;
    }

    function saveSettings() {
        localStorage.setItem('studyTime', studyTimeInput.value);
        localStorage.setItem('shortBreakTime', shortBreakTimeInput.value);
        localStorage.setItem('longBreakTime', longBreakTimeInput.value);
        localStorage.setItem('longBreakInterval', longBreakIntervalInput.value);
        localStorage.setItem('totalSessions', totalSessionsInput.value);
        loadSettings();
    }

    function renderProgressIndicator() {
        progressIndicator.innerHTML = '';
        for (let i = 1; i <= totalStudySessions; i++) {
            const roundElement = document.createElement('div');
            roundElement.className = 'w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 transition-all';
            
            if (i <= studySessionCount) {
                roundElement.classList.add('bg-primary');
            } else if (i === studySessionCount + 1 && currentPhase === 'study') {
                roundElement.classList.add('ring-2', 'ring-offset-2', 'dark:ring-offset-gray-800', 'ring-primary');
            }
            progressIndicator.appendChild(roundElement);

            if (i > 0 && i % longBreakInterval === 0 && i < totalStudySessions) {
                const breakElement = document.createElement('div');
                breakElement.className = 'w-4 h-4 rounded-sm bg-gray-400 dark:bg-gray-500';
                progressIndicator.appendChild(breakElement);
            }
        }
    }
    
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
        sessionTypeDisplay.textContent = getPhaseName(currentPhase);
        document.title = `${minutesDisplay.textContent}:${secondsDisplay.textContent} - ${getPhaseName(currentPhase)}`;
        renderProgressIndicator();
    }

    function getPhaseName(phase) {
        switch (phase) {
            case 'study': return 'Estudo';
            case 'short-break': return 'Pausa Curta';
            case 'long-break': return 'Pausa Longa';
            default: return 'Pomodoro';
        }
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft < 0) {
                handleTimerEnd();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timer);
    }

    function resetTimer() {
        clearInterval(timer);
        currentPhase = 'study';
        studySessionCount = 0;
        timeLeft = defaultStudyTime;
        document.title = originalTitle;
        updateDisplay();
    }

    function handleTimerEnd() {
        clearInterval(timer);
        const phaseEnding = currentPhase;
        if (phaseEnding === 'study') {
            studySessionCount++;
            if (studySessionCount === totalStudySessions) {
                sound3.play();
                alert('Ciclo de Pomodoro completo!');
                resetTimer();
                return;
            }

            sound1.play();
            if (studySessionCount % longBreakInterval === 0) {
                currentPhase = 'long-break';
                timeLeft = defaultLongBreakTime;
            } else {
                currentPhase = 'short-break';
                timeLeft = defaultShortBreakTime;
            }
        } else {
            if(phaseEnding === 'long-break') {
                sound2.play();
            } else {
                sound1.play();
            }
            currentPhase = 'study';
            timeLeft = defaultStudyTime;
        }
        
        updateDisplay();
        startTimer();
    }

    function criarElementoTarefa(tarefa) { const novaTarefa = document.createElement('li'); novaTarefa.className = 'flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700'; const spanTarefa = document.createElement('span'); spanTarefa.textContent = tarefa.texto; if (tarefa.concluida) { spanTarefa.classList.add('concluida'); } const divBotoes = document.createElement('div'); divBotoes.className = 'flex gap-2'; const botaoConcluir = document.createElement('button'); botaoConcluir.textContent = 'Concluir'; botaoConcluir.className = 'px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm'; botaoConcluir.addEventListener('click', () => { spanTarefa.classList.toggle('concluida'); salvarTarefas(); }); const botaoRemover = document.createElement('button'); botaoRemover.textContent = 'Remover'; botaoRemover.className = 'px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm'; botaoRemover.addEventListener('click', () => { listaTarefas.removeChild(novaTarefa); salvarTarefas(); }); divBotoes.appendChild(botaoConcluir); divBotoes.appendChild(botaoRemover); novaTarefa.appendChild(spanTarefa); novaTarefa.appendChild(divBotoes); return novaTarefa; }
    function adicionarTarefa() { const textoTarefa = inputTarefa.value.trim(); if (textoTarefa === '') return; const tarefa = { texto: textoTarefa, concluida: false }; const elementoTarefa = criarElementoTarefa(tarefa); listaTarefas.appendChild(elementoTarefa); inputTarefa.value = ''; inputTarefa.focus(); salvarTarefas(); }
    function salvarTarefas() { const tarefas = []; document.querySelectorAll('#lista-tarefas li').forEach(item => { const textoTarefa = item.querySelector('span').textContent; const concluida = item.querySelector('span').classList.contains('concluida'); tarefas.push({ texto: textoTarefa, concluida: concluida }); }); localStorage.setItem('tarefas', JSON.stringify(tarefas)); }
    function carregarTarefas() { const tarefasSalvas = localStorage.getItem('tarefas'); if (!tarefasSalvas) return; const tarefas = JSON.parse(tarefasSalvas); tarefas.forEach(tarefa => { const elementoTarefa = criarElementoTarefa(tarefa); listaTarefas.appendChild(elementoTarefa); }); }

    settingsBtn.addEventListener('click', openSettingsModal);
    closeSettingsBtn.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeSettingsModal(); });

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    completeRoundBtn.addEventListener('click', () => {
        handleTimerEnd();
    });

    saveTimeSettingsBtn.addEventListener('click', () => {
        saveSettings();
        resetTimer();
        closeSettingsModal();
    });

    botaoAdicionar.addEventListener('click', adicionarTarefa);
    inputTarefa.addEventListener('keypress', e => { if (e.key === 'Enter') adicionarTarefa(); });
    
    loadSettings();
    carregarTarefas();
    resetTimer();
});