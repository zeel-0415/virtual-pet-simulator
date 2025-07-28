New-Item -ItemType Directory -Force -Path "virtual-pet-simulator"
Set-Location -Path "virtual-pet-simulator"

@'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Virtual Pet Simulator</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1>🐾 Virtual Pet Simulator 🐾</h1>
    <img src="pet.gif" alt="Virtual Pet" id="pet" class="happy" />

    <div class="stats">
      <div><span>🍎 Hunger:</span><progress id="hungerBar" value="100" max="100"></progress></div>
      <div><span>🎮 Happiness:</span><progress id="happinessBar" value="100" max="100"></progress></div>
      <div><span>😴 Energy:</span><progress id="energyBar" value="100" max="100"></progress></div>
    </div>

    <div class="buttons">
      <button onclick="feedPet()">Feed</button>
      <button onclick="playWithPet()">Play</button>
      <button onclick="putPetToSleep()">Sleep</button>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
'@ | Out-File -Encoding UTF8 index.html

@'
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 0 25px #00ffd5;
  animation: glow 2s ease-in-out infinite alternate;
}

img {
  width: 180px;
  margin: 20px;
  transition: transform 0.5s ease-in-out;
}

img.sad {
  filter: grayscale(100%);
}

img.sleepy {
  opacity: 0.6;
}

.stats {
  margin-bottom: 20px;
  text-align: left;
}

.stats div {
  margin: 10px 0;
}

progress {
  width: 200px;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.buttons button {
  margin: 10px;
  padding: 10px 20px;
  background: #00ffd5;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.buttons button:hover {
  transform: scale(1.1);
  background: #1de9b6;
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px #00ffd5;
  }
  to {
    box-shadow: 0 0 25px #00ffd5, 0 0 40px #00ffd5;
  }
}
'@ | Out-File -Encoding UTF8 style.css

@'
let hunger = 100;
let happiness = 100;
let energy = 100;

const hungerBar = document.getElementById("hungerBar");
const happinessBar = document.getElementById("happinessBar");
const energyBar = document.getElementById("energyBar");
const petImg = document.getElementById("pet");

function updateBars() {
  hungerBar.value = hunger;
  happinessBar.value = happiness;
  energyBar.value = energy;

  if (hunger < 30) {
    petImg.className = "sad";
  } else if (energy < 30) {
    petImg.className = "sleepy";
  } else {
    petImg.className = "happy";
  }
}

function feedPet() {
  hunger = Math.min(hunger + 20, 100);
  happiness = Math.min(happiness + 5, 100);
  updateBars();
}

function playWithPet() {
  happiness = Math.min(happiness + 20, 100);
  energy = Math.max(energy - 10, 0);
  hunger = Math.max(hunger - 10, 0);
  updateBars();
}

function putPetToSleep() {
  energy = Math.min(energy + 30, 100);
  happiness = Math.max(happiness - 5, 0);
  updateBars();
}

setInterval(() => {
  hunger = Math.max(hunger - 1, 0);
  happiness = Math.max(happiness - 1, 0);
  energy = Math.max(energy - 1, 0);
  updateBars();
}, 2000);
'@ | Out-File -Encoding UTF8 script.js

Invoke-WebRequest "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif" -OutFile "pet.gif"
Write-Host "✅ Virtual Pet Simulator setup complete!"
