let hunger = 100;
let happiness = 100;
let energy = 100;
let level = 1;
let xp = 0;
let isNight = false;
let petName = '';
let currentPet = 'cat';
let animationFrameId;

const pets = {
  cat: { hungerRate: 0.8, happinessRate: 1.2, energyRate: 1 },
  dragon: { hungerRate: 1.5, happinessRate: 0.8, energyRate: 0.9 }
};

const hungerBar = document.getElementById("hungerBar");
const happinessBar = document.getElementById("happinessBar");
const energyBar = document.getElementById("energyBar");
const petCanvas = document.getElementById("petCanvas");
const ctx = petCanvas.getContext("2d");
const levelDisplay = document.getElementById("level");
const xpDisplay = document.getElementById("xp");
const achievementsDisplay = document.getElementById("achievements");
const petNameDisplay = document.getElementById("petName");

let achievements = [];
let animationTime = 0;

// Web Audio API for sound effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  if (type === 'feed') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  } else if (type === 'play') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
  } else if (type === 'sleep') {
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
  }
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
}

// Canvas animations for pets
function drawCat() {
  const frame = Math.floor(animationTime / 10) % 2; // 2-frame animation
  ctx.clearRect(0, 0, petCanvas.width, petCanvas.height);
  // Body
  ctx.fillStyle = '#f0a500';
  ctx.beginPath();
  ctx.ellipse(100, 140, 60, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(100, 60, 40, 0, Math.PI * 2);
  ctx.fill();
  // Ears
  ctx.fillStyle = '#d98c00';
  ctx.beginPath();
  ctx.moveTo(70, 30);
  ctx.lineTo(90, 10);
  ctx.lineTo(90, 50);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(130, 30);
  ctx.lineTo(110, 10);
  ctx.lineTo(110, 50);
  ctx.fill();
  // Eyes (blinking)
  ctx.fillStyle = frame === 0 ? '#000' : '#fff';
  ctx.beginPath();
  ctx.arc(85, 50, 8, 0, Math.PI * 2);
  ctx.arc(115, 50, 8, 0, Math.PI * 2);
  ctx.fill();
  // Tail (wagging)
  ctx.save();
  ctx.translate(160, 140);
  ctx.rotate((Math.sin(animationTime / 20) * Math.PI) / 8);
  ctx.fillStyle = '#f0a500';
  ctx.fillRect(0, -10, 40, 20);
  ctx.restore();
}

function drawDragon() {
  const frame = Math.floor(animationTime / 10) % 2; // 2-frame wing flap
  ctx.clearRect(0, 0, petCanvas.width, petCanvas.height);
  // Body
  ctx.fillStyle = '#4b0082';
  ctx.beginPath();
  ctx.ellipse(100, 140, 70, 90, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(100, 60, 40, 0, Math.PI * 2);
  ctx.fill();
  // Wings
  ctx.fillStyle = '#800080';
  ctx.save();
  ctx.translate(60, 100);
  ctx.rotate(frame === 0 ? -Math.PI / 6 : Math.PI / 6);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-60, -40);
  ctx.lineTo(-20, 20);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(140, 100);
  ctx.rotate(frame === 0 ? Math.PI / 6 : -Math.PI / 6);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(60, -40);
  ctx.lineTo(20, 20);
  ctx.fill();
  ctx.restore();
  // Eyes (glowing)
  ctx.fillStyle = '#ff4500';
  ctx.beginPath();
  ctx.arc(85, 50, 8, 0, Math.PI * 2);
  ctx.arc(115, 50, 8, 0, Math.PI * 2);
  ctx.fill();
}

function animatePet() {
  animationTime++;
  if (currentPet === 'cat') {
    drawCat();
  } else {
    drawDragon();
  }
  animationFrameId = requestAnimationFrame(animatePet);
}

function updateBars() {
  hungerBar.value = hunger;
  happinessBar.value = happiness;
  energyBar.value = energy;
  levelDisplay.textContent = level;
  xpDisplay.textContent = xp;
  petNameDisplay.textContent = petName || "Your Pet";
  petCanvas.className = "happy";
  if (hunger < 30) {
    petCanvas.classList.add("sad");
  } else if (energy < 30) {
    petCanvas.classList.add("sleepy");
  }
  if (isNight) {
    petCanvas.classList.add("night");
  }
  achievementsDisplay.textContent = achievements.length > 0 ? "Achievements: " + achievements.join(", ") : "";
  saveGame();
}

function addAchievement(name) {
  if (!achievements.includes(name)) {
    achievements.push(name);
    updateBars();
  }
}

function checkLevelUp() {
  const xpNeeded = level * 50;
  if (xp >= xpNeeded) {
    level++;
    xp = 0;
    addAchievement(`Level ${level} Reached`);
    if (level === 5) addAchievement("Unlocked Dragon");
  }
}

function feedPet() {
  hunger = Math.min(hunger + 20, 100);
  happiness = Math.min(happiness + 5, 100);
  xp += 10;
  playSound('feed');
  checkLevelUp();
  if (hunger === 100) addAchievement("Fully Fed");
  updateBars();
}

function playWithPet() {
  happiness = Math.min(happiness + 20, 100);
  energy = Math.max(energy - 10, 0);
  hunger = Math.max(hunger - 10, 0);
  xp += 15;
  playSound('play');
  checkLevelUp();
  if (happiness === 100) addAchievement("Super Happy");
  updateBars();
}

function putPetToSleep() {
  energy = Math.min(energy + 30, 100);
  happiness = Math.max(happiness - 5, 0);
  xp += 5;
  playSound('sleep');
  checkLevelUp();
  if (energy === 100) addAchievement("Well Rested");
  updateBars();
}

function toggleDayNight() {
  isNight = !isNight;
  document.body.className = isNight ? "night" : "";
  updateBars();
}

function showPetSelection() {
  document.getElementById("petSelection").style.display = "flex";
}

function switchPet(petType) {
  if (petType === 'dragon' && level < 5) return alert('Unlock Dragon at Level 5!');
  currentPet = petType;
  document.getElementById("petSelection").style.display = "none";
  updateBars();
}

function startGame() {
  const input = document.getElementById("petNameInput").value.trim();
  if (input) {
    petName = input;
    document.getElementById("namePrompt").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    updateBars();
    animatePet();
  } else {
    alert("Please enter a name for your pet!");
  }
}

function saveGame() {
  localStorage.setItem('petState', JSON.stringify({
    hunger, happiness, energy, level, xp, achievements, petName, isNight, currentPet
  }));
}

function loadGame() {
  const state = JSON.parse(localStorage.getItem('petState'));
  if (state) {
    hunger = state.hunger;
    happiness = state.happiness;
    energy = state.energy;
    level = state.level;
    xp = state.xp;
    achievements = state.achievements;
    petName = state.petName;
    isNight = state.isNight;
    currentPet = state.currentPet;
  }
}

window.onload = () => {
  loadGame();
  if (!petName) {
    document.getElementById("namePrompt").style.display = "flex";
    document.getElementById("gameContainer").style.display = "none";
  } else {
    document.getElementById("namePrompt").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    updateBars();
    animatePet();
  }
};

setInterval(() => {
  const pet = pets[currentPet];
  hunger = Math.max(hunger - pet.hungerRate, 0);
  happiness = Math.max(happiness - pet.happinessRate, 0);
  energy = Math.max(energy - pet.energyRate, 0);
  updateBars();
}, 2000);