// Garante que o script só será executado após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

    // Carrega os arquivos de áudio para notificações do Pomodoro
    const sound1 = new Audio('assets/sound/sound1.mp3'); // Som para início/fim de sessões curtas
    const sound2 = new Audio('assets/sound/sound2.mp3'); // Som para fim de pausa longa
    const sound3 = new Audio('assets/sound/sound3.mp3'); // Som para fim de ciclo completo

    // Seleciona os elementos do DOM relacionados ao timer
    const minutesDisplay = document.getElementById('minutes'); // Exibe os minutos
    const secondsDisplay = document.getElementById('seconds'); // Exibe os segundos
    const startBtn = document.getElementById('start-btn'); // Botão de iniciar
    const pauseBtn = document.getElementById('pause-btn'); // Botão de pausar
    const resetBtn = document.getElementById('reset-btn'); // Botão de reiniciar
    const completeRoundBtn = document.getElementById('complete-round-btn'); // Botão para concluir rodada manualmente
    const sessionTypeDisplay = document.getElementById('session-type'); // Exibe o tipo de sessão (Estudo, Pausa Curta, Pausa Longa)
    const progressIndicator = document.getElementById('progress-indicator'); // Indicador visual de progresso das rodadas
    
    // Áreas do timer para manipulação de visibilidade e conteúdo
    const timerDisplayArea = document.getElementById('timer-display-area'); // Área onde o tempo é exibido
    const progressIndicatorArea = document.getElementById('progress-indicator-area'); // Área do indicador de progresso
    const buttonsArea = document.getElementById('buttons-area'); // Área dos botões de controle do timer
    const sessionInfoArea = document.getElementById('session-info-area'); // Área de informações da sessão

    // Elementos do DOM relacionados às configurações do timer
    const studyTimeInput = document.getElementById('study-time'); // Input para tempo de estudo
    const shortBreakTimeInput = document.getElementById('short-break-time'); // Input para tempo de pausa curta
    const longBreakTimeInput = document.getElementById('long-break-time'); // Input para tempo de pausa longa
    const longBreakIntervalInput = document.getElementById('long-break-interval'); // Input para intervalo de pausa longa
    const totalSessionsInput = document.getElementById('total-sessions'); // Input para total de sessões no ciclo
    const saveTimeSettingsBtn = document.getElementById('save-time-settings'); // Botão para salvar configurações

    // Elementos do DOM relacionados ao modal de configurações
    const settingsBtn = document.getElementById('settings-btn'); // Botão para abrir o modal de configurações
    const settingsModal = document.getElementById('settings-modal'); // O modal de configurações
    const closeSettingsBtn = document.getElementById('close-settings-btn'); // Botão para fechar o modal

    // Elementos do DOM relacionados à lista de tarefas
    const inputTarefa = document.getElementById('tarefa'); // Input para adicionar nova tarefa
    const botaoAdicionar = document.getElementById('adicionar'); // Botão para adicionar tarefa
    const listaTarefas = document.getElementById('lista-tarefas'); // Lista onde as tarefas são exibidas

    // Variáveis de estado do Pomodoro
    let timer; // Variável para armazenar o ID do setInterval do timer
    let timeLeft; // Tempo restante em segundos
    let currentPhase = 'study'; // Fase atual do Pomodoro ('study', 'short-break', 'long-break')
    let studySessionCount = 0; // Contador de sessões de estudo concluídas
    let totalStudySessions = 6; // Número total de sessões de estudo em um ciclo
    let longBreakInterval = 3; // Quantas sessões de estudo antes de uma pausa longa
    let defaultStudyTime = 25 * 60; // Tempo padrão de estudo em segundos (25 minutos)
    let defaultShortBreakTime = 5 * 60; // Tempo padrão de pausa curta em segundos (5 minutos)
    let defaultLongBreakTime = 15 * 60; // Tempo padrão de pausa longa em segundos (15 minutos)
    const originalTitle = document.title; // Título original da página para restaurar
    let isCycleEnded = false; // Flag para indicar se o ciclo Pomodoro terminou
    let endTime; // Novo: horário de término calculado com base em Date.now()

    // Funções para controlar a visibilidade do modal de configurações
    function openSettingsModal() { settingsModal.classList.remove('hidden'); } // Remove a classe 'hidden' para exibir o modal
    function closeSettingsModal() { settingsModal.classList.add('hidden'); } // Adiciona a classe 'hidden' para ocultar o modal

    // Carrega as configurações salvas no localStorage ou usa valores padrão
    function loadSettings() {
        defaultStudyTime = parseInt(localStorage.getItem('studyTime') || '25') * 60; // Tempo de estudo
        defaultShortBreakTime = parseInt(localStorage.getItem('shortBreakTime') || '5') * 60; // Tempo de pausa curta
        defaultLongBreakTime = parseInt(localStorage.getItem('longBreakTime') || '15') * 60; // Tempo de pausa longa
        longBreakInterval = parseInt(localStorage.getItem('longBreakInterval') || '3'); // Intervalo para pausa longa
        totalStudySessions = parseInt(localStorage.getItem('totalSessions') || '6'); // Total de sessões

        // Atualiza os inputs do modal com os valores carregados
        studyTimeInput.value = defaultStudyTime / 60;
        shortBreakTimeInput.value = defaultShortBreakTime / 60;
        longBreakTimeInput.value = defaultLongBreakTime / 60;
        longBreakIntervalInput.value = longBreakInterval;
        totalSessionsInput.value = totalStudySessions;
    }

    // Salva as configurações atuais no localStorage
    function saveSettings() {
        localStorage.setItem('studyTime', studyTimeInput.value);
        localStorage.setItem('shortBreakTime', shortBreakTimeInput.value);
        localStorage.setItem('longBreakTime', longBreakTimeInput.value);
        localStorage.setItem('longBreakInterval', longBreakIntervalInput.value);
        localStorage.setItem('totalSessions', totalSessionsInput.value);
        loadSettings(); // Recarrega as configurações para aplicar as mudanças
    }

    // Renderiza o indicador visual de progresso das rodadas
    function renderProgressIndicator() {
        progressIndicator.innerHTML = ''; // Limpa o indicador existente
        for (let i = 1; i <= totalStudySessions; i++) {
            const roundElement = document.createElement('div');
            roundElement.className = 'w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 transition-all';
            
            // Destaca as rodadas concluídas e a rodada atual de estudo
            if (i <= studySessionCount) {
                roundElement.classList.add('bg-primary'); // Rodada concluída
            } else if (i === studySessionCount + 1 && currentPhase === 'study') {
                roundElement.classList.add('ring-2', 'ring-offset-2', 'dark:ring-offset-gray-800', 'ring-primary'); // Rodada atual de estudo
            }
            progressIndicator.appendChild(roundElement);

            // Adiciona um separador para indicar pausas longas
            if (i > 0 && i % longBreakInterval === 0 && i < totalStudySessions) {
                const breakElement = document.createElement('div');
                breakElement.className = 'w-4 h-4 rounded-sm bg-gray-400 dark:bg-gray-500';
                progressIndicator.appendChild(breakElement);
            }
        }
    }
    
    // Atualiza a exibição do timer e o título da página
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60); // Calcula os minutos restantes
        const seconds = timeLeft % 60; // Calcula os segundos restantes
        
        const minutesSpan = document.getElementById('minutes');
        const secondsSpan = document.getElementById('seconds');
        
        if(minutesSpan && secondsSpan) {
            // Atualiza os elementos de exibição de minutos e segundos, formatando com zero à esquerda
            minutesSpan.textContent = String(minutes).padStart(2, '0');
            secondsSpan.textContent = String(seconds).padStart(2, '0');
        }
        
        sessionTypeDisplay.textContent = getPhaseName(currentPhase); // Atualiza o tipo de sessão
        document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - ${getPhaseName(currentPhase)}`; // Atualiza o título da página
        renderProgressIndicator(); // Atualiza o indicador de progresso
    }

    // Retorna o nome amigável da fase atual do Pomodoro
    function getPhaseName(phase) {
        switch (phase) {
            case 'study': return 'Estudo';
            case 'short-break': return 'Pausa Curta';
            case 'long-break': return 'Pausa Longa';
            default: return 'Pomodoro'; // Caso padrão
        }
    }

    // Inicia ou retoma o timer
    function startTimer() {
        if(isCycleEnded) { // Se o ciclo anterior terminou, reinicia o timer
            resetTimer();
        }
        clearInterval(timer); // Limpa qualquer timer existente para evitar múltiplos timers
        isCycleEnded = false; // Reseta a flag de ciclo encerrado

        if (timeLeft === undefined || timeLeft === null) {
            timeLeft = defaultStudyTime; // Define o tempo inicial se não houver tempo restante
        }

        // Calcula o horário de término com base no tempo restante
        endTime = Date.now() + timeLeft * 1000;

        // Inicia o contador regressivo baseado no tempo real
        timer = setInterval(() => {
            timeLeft = Math.round((endTime - Date.now()) / 1000); // Calcula o tempo restante
            updateDisplay(); // Atualiza a exibição
            if (timeLeft <= 0) {
                handleTimerEnd(); // Lida com o fim do timer
            }
        }, 1000); // Atualiza a cada segundo (1000ms)

        updateDisplay(); // Atualiza a interface imediatamente
    }

    // Pausa o timer
    function pauseTimer() {
        clearInterval(timer); // Para o setInterval
        if (endTime) {
            timeLeft = Math.round((endTime - Date.now()) / 1000); // Atualiza o tempo restante ao pausar
        }
    }

    // Reinicia o timer para o estado inicial
    function resetTimer() {
        clearInterval(timer); // Para o setInterval
        currentPhase = 'study'; // Volta para a fase de estudo
        studySessionCount = 0; // Zera o contador de sessões de estudo
        timeLeft = defaultStudyTime; // Define o tempo para o padrão de estudo
        document.title = originalTitle; // Restaura o título original da página
        isCycleEnded = false; // Reseta a flag de ciclo encerrado
        restoreUI(); // Restaura a interface do usuário
        updateDisplay(); // Atualiza a exibição
    }

    // Lida com o fim de cada período do timer (estudo, pausa curta, pausa longa)
    function handleTimerEnd() {
        clearInterval(timer); // Para o timer atual
        const phaseEnding = currentPhase; // Armazena a fase que está terminando

        if (phaseEnding === 'study') {
            studySessionCount++; // Incrementa o contador de sessões de estudo
            if (studySessionCount >= totalStudySessions) {
                endCycle(); // Se todas as sessões foram concluídas, encerra o ciclo
                return;
            }

            sound1.play(); // Toca um som para indicar o fim da sessão de estudo
            // Decide se a próxima fase é pausa longa ou curta
            if (studySessionCount % longBreakInterval === 0) {
                currentPhase = 'long-break';
                timeLeft = defaultLongBreakTime;
            } else {
                currentPhase = 'short-break';
                timeLeft = defaultShortBreakTime;
            }
        } else {
            // Toca sons diferentes para o fim da pausa longa ou curta
            if (phaseEnding === 'long-break') sound2.play();
            else sound1.play();
            
            currentPhase = 'study'; // Volta para a fase de estudo
            timeLeft = defaultStudyTime; // Define o tempo para o padrão de estudo
        }
        
        updateDisplay(); // Atualiza a exibição para a nova fase
        startTimer(); // Inicia o timer para a próxima fase
    }

    // Encerra o ciclo completo do Pomodoro
    function endCycle() {
        sound3.play(); // Toca um som especial para o fim do ciclo
        isCycleEnded = true; // Define a flag de ciclo encerrado
        clearInterval(timer); // Para o timer

        // Atualiza a interface para mostrar que a sessão foi encerrada
        timerDisplayArea.innerHTML = `<span class="text-3xl md:text-4xl font-bold">Sessão Encerrada</span>`;
        progressIndicatorArea.classList.add('hidden'); // Oculta o indicador de progresso
        sessionInfoArea.classList.add('hidden'); // Oculta as informações da sessão

        // Altera o botão para "Iniciar Novo Ciclo"
        const startBtnHTML = `<button id="start-btn" class="px-6 py-3 rounded-lg bg-primary text-white hover:bg-secondary transition-colors ring-2 ring-offset-2 ring-primary animate-pulse">Iniciar Novo Ciclo</button>`;
        buttonsArea.innerHTML = startBtnHTML;
        document.getElementById('start-btn').addEventListener('click', startTimer); // Adiciona o event listener ao novo botão
    }
    
    // Restaura a interface do usuário para o estado inicial do timer
    function restoreUI() {
        // Restaura a exibição do timer
        timerDisplayArea.innerHTML = `<span id="minutes">25</span>:<span id="seconds">00</span>`;
        progressIndicatorArea.classList.remove('hidden'); // Exibe o indicador de progresso
        sessionInfoArea.classList.remove('hidden'); // Exibe as informações da sessão

        // Restaura os botões de controle do timer
        buttonsArea.innerHTML = `
            <button id="start-btn" class="px-5 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors">Iniciar</button>
            <button id="pause-btn" class="px-5 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition-colors">Pausar</button>
            <button id="reset-btn" class="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">Reiniciar</button>
            <button id="complete-round-btn" class="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">Concluir Rodada</button>
        `;
        
        // Reatribui os event listeners aos botões restaurados
        document.getElementById('start-btn').addEventListener('click', startTimer);
        document.getElementById('pause-btn').addEventListener('click', pauseTimer);
        document.getElementById('reset-btn').addEventListener('click', resetTimer);
        document.getElementById('complete-round-btn').addEventListener('click', handleTimerEnd);
    }

    // Função para criar um elemento de tarefa na lista
    function criarElementoTarefa(tarefa) {
        const novaTarefa = document.createElement('li'); // Cria um novo item de lista
        novaTarefa.className = 'flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700'; // Classes Tailwind para estilo

        const spanTarefa = document.createElement('span'); // Cria um span para o texto da tarefa
        spanTarefa.textContent = tarefa.texto; // Define o texto da tarefa
        if (tarefa.concluida) {
            spanTarefa.classList.add('concluida'); // Adiciona classe se a tarefa estiver concluída
        }

        const divBotoes = document.createElement('div'); // Cria uma div para os botões de ação
        divBotoes.className = 'flex gap-2'; // Classes Tailwind para estilo

        const botaoConcluir = document.createElement('button'); // Botão de concluir
        botaoConcluir.textContent = 'Concluir'; // Texto do botão
        botaoConcluir.className = 'px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm'; // Classes Tailwind para estilo
        botaoConcluir.addEventListener('click', () => {
            spanTarefa.classList.toggle('concluida'); // Alterna a classe 'concluida'
            salvarTarefas(); // Salva as tarefas após a alteração
        });

        const botaoRemover = document.createElement('button'); // Botão de remover
        botaoRemover.textContent = 'Remover'; // Texto do botão
        botaoRemover.className = 'px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm'; // Classes Tailwind para estilo
        botaoRemover.addEventListener('click', () => {
            listaTarefas.removeChild(novaTarefa); // Remove a tarefa
            salvarTarefas(); // Atualiza o armazenamento após remoção
        });

        // Adiciona os botões à div e a tarefa à lista
        divBotoes.appendChild(botaoConcluir);
        divBotoes.appendChild(botaoRemover);
        novaTarefa.appendChild(spanTarefa);
        novaTarefa.appendChild(divBotoes);
        return novaTarefa;
    }

    // Adiciona nova tarefa à lista
    function adicionarTarefa() {
        const textoTarefa = inputTarefa.value.trim(); // Pega o valor do input
        if (textoTarefa === '') return; // Ignora se estiver vazio

        const tarefa = { texto: textoTarefa, concluida: false }; // Cria objeto de tarefa
        const elementoTarefa = criarElementoTarefa(tarefa); // Cria elemento visual
        listaTarefas.appendChild(elementoTarefa); // Adiciona na lista

        inputTarefa.value = ''; // Limpa input
        inputTarefa.focus(); // Coloca foco novamente no input
        salvarTarefas(); // Salva no localStorage
    }

    // Salva todas as tarefas atuais no localStorage
    function salvarTarefas() {
        const tarefas = []; // Array para armazenar tarefas
        document.querySelectorAll('#lista-tarefas li').forEach(item => {
            const textoTarefa = item.querySelector('span').textContent; // Texto da tarefa
            const concluida = item.querySelector('span').classList.contains('concluida'); // Se está concluída
            tarefas.push({ texto: textoTarefa, concluida: concluida });
        });
        localStorage.setItem('tarefas', JSON.stringify(tarefas)); // Salva em formato JSON
    }

    // Carrega as tarefas salvas do localStorage
    function carregarTarefas() {
        const tarefasSalvas = localStorage.getItem('tarefas'); // Recupera do localStorage
        if (!tarefasSalvas) return; // Se não houver nada, sai
        const tarefas = JSON.parse(tarefasSalvas); // Converte para array
        tarefas.forEach(tarefa => {
            const elementoTarefa = criarElementoTarefa(tarefa); // Cria elemento visual
            listaTarefas.appendChild(elementoTarefa); // Adiciona na lista
        });
    }

    // --- Event Listeners ---

    // Modal de configurações
    settingsBtn.addEventListener('click', openSettingsModal);
    closeSettingsBtn.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeSettingsModal(); });

    // Botões do Pomodoro
    document.getElementById('start-btn').addEventListener('click', startTimer);
    document.getElementById('pause-btn').addEventListener('click', pauseTimer);
    document.getElementById('reset-btn').addEventListener('click', resetTimer);
    document.getElementById('complete-round-btn').addEventListener('click', handleTimerEnd);

    // Salvar configurações
    saveTimeSettingsBtn.addEventListener('click', () => {
        saveSettings(); // Salva no localStorage
        resetTimer(); // Reinicia timer com novas configs
        closeSettingsModal(); // Fecha modal
    });

    // Lista de tarefas
    botaoAdicionar.addEventListener('click', adicionarTarefa);
    inputTarefa.addEventListener('keypress', e => { if (e.key === 'Enter') adicionarTarefa(); });

    // Inicialização
    loadSettings(); // Carrega configurações iniciais
    carregarTarefas(); // Carrega tarefas salvas
    resetTimer(); // Inicia com timer resetado
});
