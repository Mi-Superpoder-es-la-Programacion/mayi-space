// Mayi Space: trivia de ciencia espacial. Los puntos son reglas de juego, no unidades reales.
// Cada partida sortea 7 preguntas del banco (questions.js). Acertar suma y da un descubrimiento;
// fallar resta. La respuesta correcta nunca deja una barra en cero, así que siempre se puede ganar.
const TIP_CHIPS = [
  ["🤔", {es:"Piensa: Tierra vs. Espacio", en:"Think: Earth vs. Space"}],
  ["📖", {es:"Lee la explicación", en:"Read the explanation"}]
];
const RESOURCE_ICONS = {oxygen:"assets/icons/air.svg", energy:"assets/icons/energy.svg", shield:"assets/icons/shelter.svg"};
const RESOURCES = ["oxygen", "energy", "shield"];
const LETTERS = ["A", "B", "C"];
const $ = id => document.getElementById(id);
let language = savedLanguage();
let state = null;
let playerName = "";
let soundEnabled = true;
let currentAudio = null;
let currentClip = null;
let audioContext = null;
let captionTimer = null;
let radioTimer = null;

const AUDIO_CLIPS = {
  launch:{file:"assets/audio/apollo11-liftoff.mp3", caption:"clipLaunch"},
  radio:{file:"assets/audio/quindar.mp3", caption:"clipRadio"},
  landed:{file:"assets/audio/apollo11-landed.mp3", caption:"clipLanded"}
};

function translate(value) {
  return typeof value === "string" ? value : value[language];
}
function label(key) {
  return TEXT[language][key];
}
function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function updateSoundButton() {
  const button = $("sound-toggle");
  button.setAttribute("aria-pressed", String(soundEnabled));
  button.setAttribute("aria-label", label(soundEnabled ? "muteSound" : "unmuteSound"));
  button.firstChild.textContent = soundEnabled ? "🔊 " : "🔇 ";
  button.querySelector("span").textContent = label(soundEnabled ? "soundOn" : "soundOff");
}
function stopAudio() {
  clearTimeout(radioTimer);
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  currentClip = null;
  clearTimeout(captionTimer);
  $("audio-caption").classList.add("hidden");
}
function playNASA(name) {
  if (!soundEnabled) return;
  stopAudio();
  const clip = AUDIO_CLIPS[name];
  const audio = new Audio(clip.file);
  audio.volume = name === "radio" ? 0.35 : 0.55;
  currentAudio = audio;
  currentClip = name;
  const caption = $("audio-caption");
  caption.textContent = "🎙️ " + label(clip.caption);
  caption.classList.remove("hidden");
  captionTimer = setTimeout(() => caption.classList.add("hidden"), 5000);
  if (name === "radio") radioTimer = setTimeout(() => { audio.pause(); if (currentAudio === audio) { currentAudio = null; currentClip = null; } }, 2200);
  audio.addEventListener("ended", () => { if (currentAudio === audio) { currentAudio = null; currentClip = null; } });
  audio.play().catch(() => { if (currentAudio === audio) stopAudio(); });
}
function playEffect(kind) {
  if (!soundEnabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const now = audioContext.currentTime;
    // step = segundos entre notas, length = duración de cada nota
    let notes = kind === "warning" ? [420, 310] : kind === "discovery" ? [500, 660, 850] : [520, 690];
    let step = 0.12, length = 0.16, wave = "sine", volume = 0.12;
    if (kind === "tick") { notes = [988]; length = 0.07; volume = 0.1; }
    if (kind === "win") { notes = [523, 659, 784, 1047, 784, 1047, 1319]; step = 0.14; length = 0.3; wave = "triangle"; volume = 0.4; }
    if (kind === "lose") { notes = [392, 370, 330, 262]; step = 0.28; length = 0.45; wave = "triangle"; volume = 0.4; }
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = now + index * step;
      oscillator.type = wave;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + length + 0.01);
    });
  } catch (_) { /* El juego funciona aunque el navegador no ofrezca audio. */ }
}

function show(screen) {
  for (const id of ["intro", "tutorial", "play", "ending"]) $(id).classList.toggle("hidden", id !== screen);
  document.body.dataset.screen = screen;
}
// ---- Tutorial: recorre las estaciones del dibujo antes de jugar ----
let tutorialStep = 0;
function showTutorial() {
  tutorialStep = 0;
  show("tutorial");
  renderTutorial();
  window.scrollTo(0, 0);
}
function renderTutorial() {
  const step = TUTORIAL[tutorialStep];
  const last = tutorialStep === TUTORIAL.length - 1;
  document.body.style.setProperty("--room", step.color);
  document.body.dataset.ink = step.light ? "light" : "dark";
  $("tutorial-img").src = step.art;
  // El fondo del marco toma el color de los bordes de cada dibujo, para que las franjas no se noten.
  document.querySelector(".tutorial-art").style.setProperty("--frame", step.frame || step.color);
  document.querySelector(".tutorial-art").style.setProperty("--art", step.noBlur ? "none" : "url(\"" + step.art + "\")");
  $("tutorial-img").alt = translate(step.title);
  $("tutorial-count").textContent = last ? label("tutBars") : label("tutStation") + " " + (tutorialStep + 1) + " " + label("of") + " " + (TUTORIAL.length - 1);
  $("tutorial-count").classList.toggle("hidden", false);
  $("tutorial-title").replaceChildren();
  const titleIcon = document.createElement("span");
  titleIcon.className = "tutorial-icon";
  titleIcon.setAttribute("aria-hidden", "true");
  if (step.logo) {
    // Logo dibujado por el equipo: todos del mismo tamaño dentro del círculo.
    const logo = document.createElement("img");
    logo.src = step.logo;
    logo.alt = "";
    titleIcon.append(logo);
  } else {
    titleIcon.textContent = step.icon;
  }
  $("tutorial-title").append(titleIcon, translate(step.title));
  $("tutorial-text").textContent = translate(step.text);
  const bars = $("tutorial-bars");
  bars.replaceChildren();
  bars.classList.toggle("hidden", !step.bars);
  for (const bar of step.bars || []) {
    const item = document.createElement("li");
    const icon = document.createElement("img");
    icon.src = bar.icon;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    const name = document.createElement("strong");
    name.textContent = translate(bar.name);
    item.append(icon, name, " — " + translate(bar.hint));
    bars.append(item);
  }
  $("tutorial-next").textContent = last ? label("start") + " →" : label("tutNext");
  $("tutorial-back").classList.toggle("invisible", tutorialStep === 0);
  $("tutorial-skip").classList.toggle("hidden", last);
  $("tutorial-dots").replaceChildren();
  TUTORIAL.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "day-dot" + (i < tutorialStep ? " done" : i === tutorialStep ? " current" : "");
    dot.textContent = String(i + 1);
    $("tutorial-dots").append(dot);
  });
}
function moveTutorial(direction) {
  const next = tutorialStep + direction;
  if (next < 0) return;
  if (next >= TUTORIAL.length) { startGame(); return; }
  tutorialStep = next;
  renderTutorial();
  $("tutorial-next").focus({preventScroll:true});
}
function currentRoom() {
  return state.current.question;
}
// Prepara la sala: mezcla las respuestas y sortea cuánto suma cada una (1 o 2 puntos).
function buildRound() {
  const question = QUESTIONS[state.order[state.round]];
  const options = shuffle(question.options).map((option) => {
    const change = {};
    for (const [key, amount] of Object.entries(option.fx)) change[key] = amount > 0 ? amount + randInt(0, 1) : amount;
    if (option.correct) change.science = 1;
    return {text:option.text, icon:option.icon, short:option.short, correct:!!option.correct, change};
  });
  state.current = {question, options};
  hideArtCaption();
}
function afterChoice(option) {
  const after = {oxygen:state.oxygen, energy:state.energy, shield:state.shield, science:state.science};
  for (const [key, amount] of Object.entries(option.change)) {
    after[key] = key === "science" ? after[key] + amount : Math.min(10, after[key] + amount);
  }
  return after;
}
function failed() {
  return state.oxygen <= 0 || state.energy <= 0 || state.shield <= 0;
}
// ---- Temporizador: 1 minuto por pregunta ----
// El jugador elige antes de empezar: 60 s, 30 s o sin tiempo (0). Se recuerda en este navegador.
function savedSeconds() {
  try { const v = Number(localStorage.getItem("mision-luna-tiempo")); return [0, 30, 60].includes(v) && localStorage.getItem("mision-luna-tiempo") !== null ? v : 60; } catch (_) { return 60; }
}
function saveSeconds(value) {
  try { localStorage.setItem("mision-luna-tiempo", String(value)); } catch (_) { /* Sin almacenamiento: se usa el valor por defecto. */ }
}
let questionSeconds = savedSeconds();
const TIMEOUT_CHANGE = {energy:-2};
const timer = {id:null, left:60, last:0, paused:false, said:{}};
function timeRuleText() {
  return label(questionSeconds === 0 ? "timeRule0" : questionSeconds === 30 ? "timeRule30" : "timeRule60");
}
function stopTimer() {
  clearInterval(timer.id);
  timer.id = null;
}
function renderTimer() {
  const seconds = Math.ceil(timer.left);
  const box = $("timer");
  $("timer-num").textContent = Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
  $("timer-icon").textContent = timer.paused ? "⏸️" : "⏱️";
  box.style.setProperty("--pct", String((timer.left / questionSeconds) * 100));
  box.classList.toggle("warn", seconds <= questionSeconds / 2 && seconds > 10);
  box.classList.toggle("danger", seconds <= 10);
  box.classList.toggle("paused", timer.paused);
  box.setAttribute("aria-label", label("timerLeft") + ": " + seconds + " " + label("timerSeconds") + ". " + label(timer.paused ? "timerResume" : "timerPause"));
}
function announceTime(seconds) {
  // Avisos para lectores de pantalla solo a los 30 y 10 segundos.
  if ((seconds === questionSeconds / 2 || seconds === 10) && !timer.said[seconds]) {
    timer.said[seconds] = true;
    $("timer-sr").textContent = seconds + " " + label("timerSeconds");
  }
}
function tickTimer() {
  const now = performance.now();
  if (timer.paused || document.hidden) { timer.last = now; return; }
  const before = Math.ceil(timer.left);
  timer.left = Math.max(0, timer.left - (now - timer.last) / 1000);
  timer.last = now;
  const seconds = Math.ceil(timer.left);
  if (seconds !== before && seconds > 0 && seconds <= 5) playEffect("tick");
  announceTime(seconds);
  renderTimer();
  if (timer.left <= 0) { stopTimer(); timeUp(); }
}
function startTimer() {
  stopTimer();
  $("timer").classList.toggle("hidden", questionSeconds === 0);
  if (questionSeconds === 0) return;
  timer.left = questionSeconds;
  timer.paused = false;
  timer.said = {};
  timer.last = performance.now();
  timer.id = setInterval(tickTimer, 250);
  renderTimer();
}
function togglePause() {
  if (!timer.id) return;
  timer.paused = !timer.paused;
  timer.last = performance.now();
  renderTimer();
}
function timeUp() {
  if (!state || state.ended || state.selected !== null) return;
  // Se acabó el tiempo: cuenta como un fallo y gasta energía.
  submitAnswer({change:TIMEOUT_CHANGE, correct:false}, -1, $("timer").getBoundingClientRect());
}
// Orden de las preguntas: "fixed" = el del banco (1 Agua, 2 Invernadero, 3 Cultivos, 4 Gimnasio, 5 Temperatura, 6 Escudo, 7 Comedor) o "random".
function savedOrder() {
  try { return localStorage.getItem("mision-luna-orden") === "random" ? "random" : "fixed"; } catch (_) { return "fixed"; }
}
function saveOrder(value) {
  try { localStorage.setItem("mision-luna-orden", value); } catch (_) { /* Sin almacenamiento: se usa el valor por defecto. */ }
}
let questionOrder = savedOrder();
function pickOrder() {
  const pool = QUESTIONS.map((q, i) => q.art ? i : -1).filter((i) => i >= 0);
  return (questionOrder === "random" ? shuffle(pool) : pool).slice(0, ROUNDS_PER_GAME);
}
// ---- Ejemplos de nombre en el campo: cambian cada 3 segundos y desaparecen al escribir ----
const NAME_EXAMPLES = ["Marcelo", "Alfonso", "David", "Santiago", "Emiliano", "Gabriela", "Isabela", "Tomas", "Carolina"];
let nameExample = 0;
function showNamePlaceholder() {
  $("player-name").placeholder = NAME_EXAMPLES[nameExample];
}
function tickNamePlaceholder() {
  if (document.body.dataset.screen !== "intro") return;
  const input = $("player-name");
  input.classList.add("ph-hide");
  setTimeout(() => {
    nameExample = (nameExample + 1) % NAME_EXAMPLES.length;
    showNamePlaceholder();
    input.classList.remove("ph-hide");
  }, 250);
}
setInterval(tickNamePlaceholder, 3000);
// ---- Arduino directo desde la web (Web Serial) ----
// Cada base declara en questions.js el LED que enciende cuando se responde bien:
//   Planta de Reciclaje de Agua -> pin 3   |   Invernadero Espacial -> pin 4
// Si la respuesta es incorrecta (o se acaba el tiempo) ese LED queda apagado.
const LED_PINS = [3, 4];
const ledState = {3:false, 4:false};
const arduino = {port:null, writer:null, reader:null, status:"off", ready:false, verified:false, acked:0, testing:false, toastTimer:null};
const SERIAL_SUPPORTED = "serial" in navigator;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitUntil(test, ms) {
  const start = performance.now();
  while (!test() && performance.now() - start < ms) await sleep(50);
  return test();
}
function arduinoToast(key) {
  const toast = $("arduino-toast");
  toast.textContent = label(key);
  toast.classList.remove("hidden");
  clearTimeout(arduino.toastTimer);
  arduino.toastTimer = setTimeout(() => toast.classList.add("hidden"), 9000);
}
// LEDs virtuales de la barra: muestran lo que el juego le pide al Arduino aunque no haya placa conectada.
function renderLeds() {
  for (const pin of LED_PINS) {
    const led = $("led-" + pin);
    if (led) led.classList.toggle("on", ledState[pin]);
  }
}
function renderArduinoButton() {
  const button = $("arduino-btn");
  button.classList.toggle("hidden", !SERIAL_SUPPORTED);
  const warn = arduino.status === "on" && !arduino.verified;
  button.dataset.state = warn ? "warn" : arduino.status;
  button.setAttribute("aria-pressed", String(arduino.status === "on"));
  const text = arduino.status === "connecting" ? "arduinoConnecting" : arduino.status === "on" ? (warn ? "arduinoWarn" : "arduinoOn") : "arduinoBtn";
  $("arduino-label").textContent = label(text);
  const hint = label(arduino.status === "on" ? "arduinoDisconnect" : "arduinoConnect");
  button.title = hint;
  button.setAttribute("aria-label", label(text) + ". " + hint);
}
function sendArduino(text) {
  if (arduino.status !== "on" || !arduino.writer) return;
  arduino.writer.write(new TextEncoder().encode(text + "\n")).catch(() => arduinoLost());
}
function setLed(pin, on) {
  ledState[pin] = on;
  renderLeds();
  sendArduino(pin + ":" + (on ? 1 : 0));
}
function resetLeds() {
  for (const pin of LED_PINS) ledState[pin] = false;
  renderLeds();
  sendArduino("OFF");
}
function syncLeds() {
  sendArduino("OFF");
  for (const pin of LED_PINS) if (ledState[pin]) sendArduino(pin + ":1");
}
// Prueba de los LEDs: enciende uno por uno y luego deja cada LED como estaba.
async function testLeds() {
  if (arduino.testing) return;
  arduino.testing = true;
  const saved = {...ledState};
  for (const pin of LED_PINS) {
    setLed(pin, true);
    await sleep(500);
    setLed(pin, false);
    await sleep(150);
  }
  for (const pin of LED_PINS) setLed(pin, saved[pin]);
  arduino.testing = false;
}
async function listenArduino(port) {
  try {
    const reader = port.readable.getReader();
    arduino.reader = reader;
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const {value, done} = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, {stream:true});
      let end;
      while ((end = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, end).trim();
        buffer = buffer.slice(end + 1);
        if (line.startsWith("READY")) arduino.ready = true;
        else if (line.startsWith("OK")) arduino.acked += 1;
        else if (line.startsWith("ERR")) arduinoToast("arduinoErr");
      }
      if (buffer.length > 200) buffer = buffer.slice(-50);
    }
  } catch (_) { /* El puerto se cerró o se desconectó el cable. */ }
  if (arduino.status === "on") arduinoLost();
}
async function connectArduino() {
  if (!SERIAL_SUPPORTED || arduino.status === "connecting") return;
  let port;
  try { port = await navigator.serial.requestPort(); } catch (_) { return; } // la persona canceló la ventana de puertos
  arduino.status = "connecting";
  renderArduinoButton();
  try {
    await port.open({baudRate:9600});
    arduino.port = port;
    arduino.writer = port.writable.getWriter();
    arduino.ready = false;
    arduino.verified = false;
    arduino.acked = 0;
    listenArduino(port);
    // Muchas placas se reinician al abrir el puerto: se espera el "READY" (máximo 2,6 s).
    await waitUntil(() => arduino.ready, 2600);
    arduino.status = "on";
    renderArduinoButton();
    // ¿Está cargado el programa correcto? Se manda OFF y se espera la respuesta "OK OFF".
    sendArduino("OFF");
    arduino.verified = await waitUntil(() => arduino.acked > 0, 1800);
    if (!arduino.verified) {
      sendArduino("OFF");
      arduino.verified = await waitUntil(() => arduino.acked > 0, 1200);
    }
    renderArduinoButton();
    if (!arduino.verified) {
      arduinoToast("arduinoNoReply");
      syncLeds();
      return;
    }
    await testLeds(); // parpadeo de confirmación
    syncLeds();
  } catch (_) {
    await closeArduino();
    arduinoToast("arduinoFail");
  }
}
async function closeArduino() {
  const wasOn = arduino.status === "on";
  try { if (wasOn && arduino.writer) await arduino.writer.write(new TextEncoder().encode("OFF\n")); } catch (_) {}
  arduino.status = "off";
  arduino.verified = false;
  try { if (arduino.reader) { await arduino.reader.cancel(); arduino.reader.releaseLock(); } } catch (_) {}
  try { if (arduino.writer) arduino.writer.releaseLock(); } catch (_) {}
  try { if (arduino.port) await arduino.port.close(); } catch (_) {}
  arduino.port = arduino.writer = arduino.reader = null;
  renderArduinoButton();
}
function arduinoLost() {
  if (arduino.status === "off") return;
  closeArduino();
  arduinoToast("arduinoLost");
}
function startGame() {
  stopTimer();
  resetLeds();
  photoUrl = "";
  state = {
    round:0, order:pickOrder(),
    oxygen:randInt(8, 9), energy:randInt(8, 9), shield:randInt(5, 6), science:0,
    correct:0, selected:null, ended:false, lastMissed:null, delta:null, history:[]
  };
  buildRound();
  show("play");
  renderRound();
  startTimer();
  playNASA("launch");
  window.scrollTo(0, 0);
}

function renderResources() {
  for (const key of RESOURCES) {
    const value = Math.max(0, state[key]);
    $(key + "-value").textContent = value + "/10";
    $(key + "-bar").style.width = (value * 10) + "%";
    $(key + "-bar").classList.toggle("low", value <= 2);
  }
  $("science-value").textContent = state.science;
}
function renderProgress() {
  $("progress").replaceChildren();
  for (let round = 0; round < ROUNDS_PER_GAME; round++) {
    const dot = document.createElement("span");
    dot.className = "day-dot" + (round < state.round || (round === state.round && state.selected !== null) ? " done" : round === state.round ? " current" : "");
    dot.textContent = String(round + 1);
    dot.setAttribute("aria-label", label("room") + " " + (round + 1));
    $("progress").append(dot);
  }
}
function renderChoices() {
  const box = $("choices");
  box.replaceChildren();
  state.current.options.forEach((option, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    const letter = document.createElement("span");
    letter.className = "choice-symbol";
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = LETTERS[i];
    const icon = document.createElement("span");
    icon.className = "choice-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = option.icon || "";
    const body = document.createElement("span");
    body.className = "choice-body";
    const short = document.createElement("span");
    short.className = "choice-short";
    short.textContent = option.short ? translate(option.short) : translate(option.text);
    const text = document.createElement("span");
    text.className = "choice-text";
    text.textContent = translate(option.text);
    body.append(short, text);
    button.setAttribute("aria-label", LETTERS[i] + ": " + translate(option.text));
    button.append(letter, icon, body);
    button.addEventListener("click", () => choose(i));
    box.append(button);
  });
}
function renderRound() {
  const question = currentRoom();
  $("day-label").textContent = label("room") + " " + (state.round + 1) + " " + label("of") + " " + ROUNDS_PER_GAME;
  $("event-title").textContent = question.icon + " " + translate(question.room);
  $("event-story").textContent = translate(question.question);
  // Cada sala tiene su color y su dibujo, como en el plano del equipo.
  document.body.style.setProperty("--room", question.color);
  document.body.dataset.ink = question.light ? "light" : "dark";
  $("room-art").src = question.art;
  $("room-art").alt = translate(question.room);
  // Tierra | Espacio: tocar una mitad del dibujo muestra la diferencia.
  $("room-art-box").style.setProperty("--split", String(question.split || 0.5));
  $("art-earth").querySelector(".art-pill").textContent = label("earthLabel");
  $("art-space").querySelector(".art-pill").textContent = label("spaceLabel");
  $("art-earth").setAttribute("aria-label", label("earthLabel") + ": " + translate(question.earth));
  $("art-space").setAttribute("aria-label", label("spaceLabel") + ": " + translate(question.space));
  renderResources();
  renderProgress();
  const answered = state.selected !== null;
  $("timer").classList.toggle("hidden", answered || questionSeconds === 0);
  document.querySelector(".story-card").classList.toggle("answered", answered);
  $("choice-area").classList.toggle("hidden", answered);
  $("result").classList.toggle("hidden", !answered);
  if (answered) renderResult();
  else renderChoices();
}
// ---- Dibujo de la sala: tocar Tierra o Espacio ----
let artSide = "";
function hideArtCaption() {
  artSide = "";
  $("art-caption").classList.add("hidden");
  $("art-earth").classList.remove("active");
  $("art-space").classList.remove("active");
}
function toggleArtCaption(side) {
  if (artSide === side) { hideArtCaption(); return; }
  artSide = side;
  const question = currentRoom();
  $("art-caption").textContent = label(side === "earth" ? "earthLabel" : "spaceLabel") + ": " + translate(question[side]);
  $("art-caption").classList.remove("hidden");
  $("art-earth").classList.toggle("active", side === "earth");
  $("art-space").classList.toggle("active", side === "space");
}
// ---- Efectos: la sala reacciona y los puntos vuelan a las barras ----
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
function flyNumber(text, from, target, good) {
  const layer = $("fx-layer");
  const bubble = document.createElement("span");
  bubble.className = "fx-num " + (good ? "good" : "bad");
  bubble.textContent = text;
  layer.append(bubble);
  const to = target.getBoundingClientRect();
  const startX = from.left + from.width / 2, startY = from.top + from.height / 2;
  const endX = to.left + to.width / 2, endY = to.top + to.height / 2;
  const animation = bubble.animate([
    {transform:"translate(" + (startX - 30) + "px," + (startY - 15) + "px) scale(.6)", opacity:0},
    {transform:"translate(" + (startX - 30) + "px," + (startY - 70) + "px) scale(1.15)", opacity:1, offset:.28},
    {transform:"translate(" + (endX - 30) + "px," + (endY - 15) + "px) scale(.9)", opacity:1, offset:.85},
    {transform:"translate(" + (endX - 30) + "px," + (endY - 15) + "px) scale(.5)", opacity:0}
  ], {duration:1300, easing:"ease-in-out"});
  setTimeout(() => bubble.remove(), 1700);
  animation.onfinish = () => {
    bubble.remove();
    const meter = target.closest(".meter, .score-line");
    if (meter) { meter.classList.remove("pop"); void meter.offsetWidth; meter.classList.add("pop"); }
  };
}
function playFx(good, from, delta) {
  if (REDUCED_MOTION.matches) return;
  const layer = $("fx-layer");
  const flash = document.createElement("div");
  flash.className = "fx-flash " + (good ? "good" : "bad");
  layer.append(flash);
  setTimeout(() => flash.remove(), 1000);
  const cx = from.left + from.width / 2, cy = from.top + from.height / 2;
  const pieces = good ? ["⭐", "✨", "🌟", "🎉", "✨", "⭐", "🌟", "✨", "⭐", "🎉", "✨", "🌟"] : ["💥", "⚠️", "💥", "⚠️", "💢", "💥"];
  pieces.forEach((piece, i) => {
    const el = document.createElement("span");
    el.className = "fx-piece";
    el.textContent = piece;
    layer.append(el);
    const angle = (i / pieces.length) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 90 + Math.random() * 140;
    const spin = (Math.random() - 0.5) * 360;
    const anim = el.animate([
      {transform:"translate(" + cx + "px," + cy + "px) scale(.4) rotate(0deg)", opacity:1},
      {transform:"translate(" + (cx + Math.cos(angle) * dist) + "px," + (cy + Math.sin(angle) * dist - (good ? 40 : 0)) + "px) scale(1.3) rotate(" + spin + "deg)", opacity:0}
    ], {duration:900 + Math.random() * 500, easing:"cubic-bezier(.2,.8,.3,1)"});
    anim.onfinish = () => el.remove();
    setTimeout(() => el.remove(), 1800);
  });
  const box = $("room-art-box");
  box.classList.remove("react-good", "react-bad");
  void box.offsetWidth;
  box.classList.add(good ? "react-good" : "react-bad");
  if (!good) {
    const card = document.querySelector(".story-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  }
  for (const key of RESOURCES) {
    const change = delta.after[key] - delta.before[key];
    if (!change) continue;
    flyNumber((change > 0 ? "+" : "−") + Math.abs(change) + " " + label(key + "Name"), from, $(key + "-bar").parentElement, change > 0);
  }
  if (delta.science > 0) flyNumber("+" + delta.science + " ⭐", from, $("science-value"), true);
}
function choose(index) {
  const option = state.current.options[index];
  const clicked = document.querySelectorAll("#choices .choice")[index];
  const origin = clicked ? clicked.getBoundingClientRect() : {left:innerWidth / 2, top:innerHeight / 2, width:0, height:0};
  submitAnswer(option, index, origin);
}
function submitAnswer(option, index, origin) {
  stopTimer();
  const before = {oxygen:state.oxygen, energy:state.energy, shield:state.shield};
  const after = afterChoice(option);
  state.delta = {before, after, science:after.science - state.science};
  state.oxygen = after.oxygen;
  state.energy = after.energy;
  state.shield = after.shield;
  state.science = after.science;
  state.selected = index;
  state.history.push({icon:currentRoom().icon, room:currentRoom().room, color:currentRoom().color, correct:option.correct});
  // Arduino: cada base tiene su LED (campo "led" en questions.js) y solo se enciende si la respuesta es correcta.
  const ledPin = currentRoom().led;
  if (ledPin) {
    const acked = arduino.acked;
    setLed(ledPin, option.correct);
    if (arduino.status === "on") setTimeout(() => { if (arduino.status === "on" && arduino.acked === acked) arduinoToast("arduinoNoAck"); }, 900);
  }
  if (option.correct) state.correct += 1;
  else state.lastMissed = currentRoom();
  playEffect(failed() ? "warning" : option.correct ? "discovery" : "warning");
  hideArtCaption();
  renderRound();
  playFx(option.correct, origin, state.delta);
  $("result").scrollIntoView({behavior:"smooth", block:"nearest"});
  // Teclado y lectores de pantalla: el foco pasa al botón de continuar.
  const nextButton = document.querySelector("#result .primary");
  if (nextButton) nextButton.focus({preventScroll:true});
}
function changeChip(key) {
  const before = state.delta.before[key];
  const after = state.delta.after[key];
  if (before === after) return null;
  const chip = document.createElement("span");
  chip.className = "preview-chip " + key + (after <= 0 ? " danger" : after > before ? " up" : " down");
  const icon = document.createElement("img");
  icon.className = "preview-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.src = RESOURCE_ICONS[key];
  icon.alt = "";
  const values = document.createElement("span");
  values.textContent = label(key + "Name") + " " + before + "→" + Math.max(0, after);
  chip.append(icon, values);
  return chip;
}
function renderResult() {
  const question = currentRoom();
  const timedOut = state.selected === -1;
  const option = timedOut ? {correct:false} : state.current.options[state.selected];
  const box = $("result");
  box.replaceChildren();
  box.classList.toggle("is-correct", option.correct);
  box.classList.toggle("is-wrong", !option.correct);
  const title = document.createElement("h2");
  title.textContent = label(timedOut ? "timeUpTitle" : option.correct ? "correctTitle" : "wrongTitle");
  box.append(title);
  if (!option.correct) {
    const best = state.current.options.find((item) => item.correct);
    const answer = document.createElement("p");
    answer.className = "best-answer";
    const strong = document.createElement("strong");
    strong.textContent = label("bestAnswer") + " ";
    answer.append(strong, translate(best.text));
    box.append(answer);
  }
  const chips = document.createElement("div");
  chips.className = "result-chips";
  for (const key of RESOURCES) {
    const chip = changeChip(key);
    if (chip) chips.append(chip);
  }
  if (state.delta.science > 0) {
    const discovery = document.createElement("span");
    discovery.className = "preview-chip discovery";
    discovery.textContent = "⭐ +" + state.delta.science + " " + label("discoveries");
    chips.append(discovery);
  }
  if (arduino.status === "on" && currentRoom().led) {
    const pin = currentRoom().led;
    const led = document.createElement("span");
    led.className = "preview-chip led-chip" + (ledState[pin] ? " on" : "");
    led.textContent = label(ledState[pin] ? "arduinoLedOn" : "arduinoLedOff").replace("{pin}", pin);
    chips.append(led);
  }
  box.append(chips);
  const compare = document.createElement("div");
  compare.className = "earth-space";
  for (const [labelKey, field] of [["earthLabel", "earth"], ["spaceLabel", "space"]]) {
    const row = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label(labelKey) + ": ";
    row.append(strong, translate(question[field]));
    compare.append(row);
  }
  const why = document.createElement("p");
  why.className = "why";
  why.textContent = translate(question.explain);
  const source = document.createElement("p");
  source.className = "result-source";
  source.append(label("sourceLabel") + ": ");
  question.osd.forEach((id, i) => {
    if (i) source.append(" · ");
    const link = document.createElement("a");
    link.href = OSDR_STUDY_URL + id;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = id + " ↗";
    source.append(link);
  });
  const next = document.createElement("button");
  next.className = "primary";
  next.type = "button";
  next.textContent = failed() || state.round === ROUNDS_PER_GAME - 1 ? label("seeResult") + " →" : label("next") + " →";
  next.addEventListener("click", nextRound);
  box.append(compare, why, source, next);
}
function nextRound() {
  if (failed() || state.round === ROUNDS_PER_GAME - 1) {
    state.ended = true;
    stopTimer();
    show("ending");
    renderEnding();
    stopAudio();
    if (failed()) playEffect("lose");
    else { playEffect("win"); radioTimer = setTimeout(() => playNASA("landed"), 1300); }
  } else {
    state.round += 1;
    state.selected = null;
    buildRound();
    renderRound();
    startTimer();
    if (state.round === 3) playNASA("radio");
  }
  window.scrollTo({top:0, behavior:"smooth"});
  const heading = state.ended ? $("ending-title") : $("event-title");
  heading.setAttribute("tabindex", "-1");
  heading.focus({preventScroll:true});
}
function renderEnding() {
  const lost = failed();
  document.querySelector(".ending-card").classList.toggle("win", !lost);
  const badge = lost ? "badgeTryAgain" : state.correct >= 6 ? "badgeScientist" : state.correct >= 4 ? "badgeExplorer" : "badgeGuardian";
  $("achievement").textContent = (lost ? "🚀 " : "🏅 ") + label(badge);
  $("ending-title").textContent = playerName
    ? label(lost ? "loseNamed" : "winNamed").replace("{name}", playerName)
    : label(lost ? "loseTitle" : "winTitle");
  if (lost) {
    const reason = state.oxygen <= 0 ? "reasonOxygen" : state.energy <= 0 ? "reasonEnergy" : "reasonShield";
    $("ending-text").textContent = label("loseText") + (state.round + 1) + label("because") + label(reason) + ".";
  } else {
    $("ending-text").textContent = label("winText") + state.correct + " / " + ROUNDS_PER_GAME + ".";
  }
  const tip = $("ending-tip");
  tip.classList.toggle("hidden", !lost);
  if (lost) {
    const kind = state.oxygen <= 0 ? "Oxygen" : state.energy <= 0 ? "Energy" : "Shield";
    const key = kind.toLowerCase();
    tip.replaceChildren();
    const lead = document.createElement("strong");
    lead.className = "tip-head";
    lead.textContent = "🐰 " + label("mayitoLoseLead");
    const problem = document.createElement("div");
    problem.className = "tip-problem";
    const icon = document.createElement("img");
    icon.src = RESOURCE_ICONS[key];
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    const why = document.createElement("span");
    why.textContent = label("loseWhy" + kind);
    problem.append(icon, why);
    tip.append(lead, problem);
    if (state.lastMissed) {
      const fact = document.createElement("p");
      fact.className = "tip-fact";
      fact.textContent = label("loseFactLead") + " " + translate(state.lastMissed.explain);
      tip.append(fact);
    }
    const chips = document.createElement("div");
    chips.className = "tip-chips";
    for (const [emoji, text] of TIP_CHIPS) {
      const chip = document.createElement("span");
      chip.className = "tip-chip";
      const sign = document.createElement("span");
      sign.setAttribute("aria-hidden", "true");
      sign.textContent = emoji;
      chip.append(sign, " " + text[language]);
      chips.append(chip);
    }
    tip.append(chips);
  }
  $("diploma-btn").classList.toggle("hidden", lost);
  $("ending-learning").classList.toggle("hidden", lost);
  $("ending-learning").textContent = label("winLearning");
}

// ---- Diploma imprimible ----
function rankKey() {
  return state.correct >= 6 ? "badgeScientist" : state.correct >= 4 ? "badgeExplorer" : "badgeGuardian";
}
function renderDiploma() {
  $("diploma-kicker").textContent = label("diplomaKicker");
  $("diploma-title").textContent = label("diplomaTitle");
  $("diploma-awarded").textContent = label("diplomaAwarded");
  $("diploma-name").textContent = playerName || "—";
  $("diploma-text").textContent = label("diplomaBody").replace("{n}", state.correct).replace("{total}", ROUNDS_PER_GAME);
  $("diploma-rank").textContent = "🏅 " + label(rankKey());
  $("diploma-sign").textContent = label("diplomaSign");
  $("diploma-date-label").textContent = label("diplomaDate") + ": ";
  $("diploma-date").textContent = new Date().toLocaleDateString(language === "es" ? "es-CO" : "en-US", {day:"numeric", month:"long", year:"numeric"});
  $("diploma-based").textContent = label("diplomaBased");
  $("diploma-disclaimer").textContent = label("diplomaDisclaimer");
  renderPhoto();
  const stamps = $("diploma-stamps");
  stamps.replaceChildren();
  for (const item of state.history) {
    const stamp = document.createElement("li");
    stamp.className = "diploma-stamp" + (item.correct ? " earned" : "");
    stamp.style.setProperty("--tone", item.color);
    const icon = document.createElement("span");
    icon.className = "stamp-icon";
    icon.textContent = item.icon;
    const name = document.createElement("small");
    name.textContent = translate(item.room);
    stamp.append(icon, name);
    stamps.append(stamp);
  }
}
// ---- Foto rápida para el diploma (la imagen vive solo en memoria: no se guarda ni se envía) ----
let cameraStream = null;
let photoUrl = "";
let countdownTimer = null;
function stopCamera() {
  clearInterval(countdownTimer);
  if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
  cameraStream = null;
  $("camera-video").srcObject = null;
  $("camera-count").classList.add("hidden");
}
function renderPhoto() {
  const has = Boolean(photoUrl);
  $("diploma-photo").classList.toggle("hidden", !has);
  if (has) $("diploma-photo-img").src = photoUrl;
  else $("diploma-photo-img").removeAttribute("src");
  $("diploma-photo-img").alt = label("photoAlt") + " " + (playerName || "");
  $("photo-remove").classList.toggle("hidden", !has);
  $("photo-open").textContent = label(has ? "photoRetake" : "photoBtn");
}
async function openCamera() {
  $("camera-panel").classList.remove("hidden");
  $("camera-error").classList.add("hidden");
  $("camera-hint").classList.remove("hidden");
  $("camera-shoot").disabled = true;
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("sin camara");
    cameraStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"user", width:{ideal:960}, height:{ideal:1280}}, audio:false});
    $("camera-video").srcObject = cameraStream;
    await $("camera-video").play().catch(() => {});
    $("camera-shoot").disabled = false;
    $("camera-shoot").focus();
  } catch (_) {
    $("camera-error").classList.remove("hidden");
    $("camera-hint").classList.add("hidden");
    $("camera-cancel").focus();
  }
}
function closeCamera() {
  stopCamera();
  $("camera-panel").classList.add("hidden");
  $("photo-open").focus();
}
function shootPhoto() {
  const video = $("camera-video");
  if (!video.videoWidth) return;
  $("camera-shoot").disabled = true;
  let left = 3;
  const count = $("camera-count");
  count.textContent = String(left);
  count.classList.remove("hidden");
  countdownTimer = setInterval(() => {
    left -= 1;
    if (left > 0) { count.textContent = String(left); return; }
    clearInterval(countdownTimer);
    // Recorte vertical 3:4 al centro del video, en espejo como una selfie.
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    const vw = video.videoWidth, vh = video.videoHeight;
    let sw = vw, sh = vw / (3 / 4);
    if (sh > vh) { sh = vh; sw = vh * (3 / 4); }
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height);
    photoUrl = canvas.toDataURL("image/jpeg", 0.88);
    playEffect("discovery");
    closeCamera();
    renderPhoto();
  }, 1000);
}
let diplomaFocus = null;
function openDiploma() {
  diplomaFocus = document.activeElement;
  renderDiploma();
  $("diploma-modal").classList.remove("hidden");
  document.body.classList.add("diploma-open");
  $("diploma-print").focus();
}
function closeDiploma() {
  stopCamera();
  $("camera-panel").classList.add("hidden");
  $("diploma-modal").classList.add("hidden");
  document.body.classList.remove("diploma-open");
  if (diplomaFocus) diplomaFocus.focus();
}
function setLanguage(nextLanguage) {
  language = nextLanguage;
  saveLanguage(language);
  document.documentElement.lang = language;
  document.title = language === "es" ? "Mayi Space" : "Mayi Space";
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = label(element.dataset.i18n);
  }
  showNamePlaceholder();
  $("rule-note").textContent = label("ruleNote") + "\n" + timeRuleText();
  updateSoundButton();
  if (currentClip) $("audio-caption").textContent = "🎙️ " + label(AUDIO_CLIPS[currentClip].caption);
  $("lang-es").setAttribute("aria-pressed", language === "es");
  $("lang-en").setAttribute("aria-pressed", language === "en");
  $("progress").setAttribute("aria-label", language === "es" ? "Progreso de la misión" : "Mission progress");
  document.querySelector(".status-card").setAttribute("aria-label", language === "es" ? "Recursos de la base" : "Base resources");
  if (!$("tutorial").classList.contains("hidden")) renderTutorial();
  if (!$("diploma-modal").classList.contains("hidden")) renderDiploma();
  if (timer.id) renderTimer();
  renderArduinoButton();
  if (!$("restart-modal").classList.contains("hidden")) renderRestartModal();
  if (state) {
    if (state.ended) renderEnding();
    else if (!$("play").classList.contains("hidden")) renderRound();
  }
}

function tryStart() {
  const name = $("player-name").value.trim();
  if (!name) {
    $("name-error").classList.remove("hidden");
    $("player-name").focus();
    return;
  }
  playerName = name;
  $("name-error").classList.add("hidden");
  showTutorial();
}
$("start").addEventListener("click", tryStart);
$("player-name").addEventListener("keydown", (event) => { if (event.key === "Enter") tryStart(); });
// ---- Aviso antes de reiniciar: se detiene el tiempo y se explica qué va a pasar ----
let restartFocus = null;
let restartWasPaused = false;
function renderRestartModal() {
  $("restart-title").textContent = label("restartTitle");
  const progress = state
    ? label("restartProgress").replace("{n}", state.round + 1).replace("{total}", ROUNDS_PER_GAME).replace("{c}", state.correct)
    : "";
  $("restart-text").textContent = label("restartText") + " " + progress + " " + label(questionOrder === "random" ? "restartRandom" : "restartFixed");
  $("restart-yes").textContent = label("restartYes");
  $("restart-no").textContent = label("restartNo");
}
function openRestartModal() {
  restartFocus = document.activeElement;
  restartWasPaused = timer.paused;
  if (timer.id) { timer.paused = true; renderTimer(); }
  renderRestartModal();
  $("restart-modal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  $("restart-no").focus();
}
function closeRestartModal(resume) {
  $("restart-modal").classList.add("hidden");
  document.body.classList.remove("modal-open");
  if (resume && timer.id) { timer.paused = restartWasPaused; timer.last = performance.now(); renderTimer(); }
  if (resume && restartFocus) restartFocus.focus();
}
$("restart").addEventListener("click", () => {
  if (state && !state.ended) openRestartModal();
  else startGame();
});
$("restart-yes").addEventListener("click", () => { closeRestartModal(false); startGame(); });
$("restart-no").addEventListener("click", () => closeRestartModal(true));
$("restart-modal").addEventListener("click", (event) => { if (event.target.id === "restart-modal") closeRestartModal(true); });
document.addEventListener("keydown", (event) => {
  if ($("restart-modal").classList.contains("hidden")) return;
  if (event.key === "Escape") closeRestartModal(true);
  if (event.key === "Tab") {
    const first = $("restart-no"), last = $("restart-yes");
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
$("again").addEventListener("click", startGame);
$("timer").addEventListener("click", togglePause);
$("arduino-btn").addEventListener("click", () => { if (arduino.status === "on") closeArduino(); else connectArduino(); });
if (SERIAL_SUPPORTED) navigator.serial.addEventListener("disconnect", (event) => { if (event.target === arduino.port) arduinoLost(); });
renderArduinoButton();
for (const radio of document.querySelectorAll("input[name=\"order\"]")) {
  radio.checked = radio.value === questionOrder;
  radio.addEventListener("change", () => { questionOrder = radio.value; saveOrder(questionOrder); });
}
for (const radio of document.querySelectorAll("input[name=\"time\"]")) {
  radio.checked = Number(radio.value) === questionSeconds;
  radio.addEventListener("change", () => {
    questionSeconds = Number(radio.value);
    saveSeconds(questionSeconds);
    $("rule-note").textContent = label("ruleNote") + "\n" + timeRuleText();
  });
}
$("art-earth").addEventListener("click", () => toggleArtCaption("earth"));
$("art-space").addEventListener("click", () => toggleArtCaption("space"));
$("diploma-btn").addEventListener("click", openDiploma);
$("diploma-close").addEventListener("click", closeDiploma);
$("diploma-print").addEventListener("click", () => window.print());
$("photo-open").addEventListener("click", openCamera);
$("camera-shoot").addEventListener("click", shootPhoto);
$("camera-cancel").addEventListener("click", closeCamera);
$("photo-remove").addEventListener("click", () => { photoUrl = ""; renderPhoto(); });
window.addEventListener("pagehide", stopCamera);
$("diploma-modal").addEventListener("click", (event) => { if (event.target.id === "diploma-modal") closeDiploma(); });
document.addEventListener("keydown", (event) => {
  if ($("diploma-modal").classList.contains("hidden")) return;
  if (event.key === "Escape") {
    if (!$("camera-panel").classList.contains("hidden")) closeCamera();
    else closeDiploma();
  }
});
$("tutorial-next").addEventListener("click", () => moveTutorial(1));
$("tutorial-back").addEventListener("click", () => moveTutorial(-1));
$("tutorial-skip").addEventListener("click", startGame);
document.addEventListener("keydown", (event) => {
  if ($("tutorial").classList.contains("hidden")) return;
  if (event.key === "ArrowRight") moveTutorial(1);
  if (event.key === "ArrowLeft") moveTutorial(-1);
});
$("sound-toggle").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (!soundEnabled) stopAudio();
  else playEffect("choice");
  updateSoundButton();
});
$("lang-es").addEventListener("click", () => setLanguage("es"));
$("lang-en").addEventListener("click", () => setLanguage("en"));
document.body.dataset.screen = "intro";
setLanguage(language);
