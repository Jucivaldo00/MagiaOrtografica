let score = 0;
let correctAnswers = 0;
let round = 1;
let gameOver = false;
let currTiles = [];
let intervalId;
let usedIndexes = [];
const maxScore = 100;
let audio;

const palavrasRound1 = [
  ["Pichar", "Pixar"], ["Chão", "Xão"], ["Mexer", "Mecher"], 
  ["Chique", "Xique"], ["Xícara", "Chícara"]
];

const palavrasRound2 = [
  ["Cansaço", "Cançaso"], ["Licença", "Licensa"], ["Assunto", "Acunto"],
  ["Passo", "Paço"], ["Pressa", "Preça"]
];

const palavrasRound3 = [
  ["Gelo", "Jelo"], ["Bege", "Beje"], ["Girar", "Jirar"],
  ["Viagem", "Viajem"], ["Geada", "Jeada"]
];

function getPalavras() {
  if (round === 1) return palavrasRound1;
  if (round === 2) return palavrasRound2;
  if (round === 3) return palavrasRound3;
  return [];
}

window.onload = function() {
  createInstructionBoard();
  setupButtons();
  updateInstructionBoard();
};

function createInstructionBoard() {
  const instructionBoard = document.createElement("div");
  instructionBoard.id = "instructionBoard";
  Object.assign(instructionBoard.style, {
    position: "absolute",
    right: "20px",
    top: "300px",
    width: "200px",
    padding: "15px",
    backgroundColor: "#4CAF50",
    border: "2px solid #ccc",
    borderRadius: "10px",
    fontSize: "16px",
    color: "#000"
  });
  document.body.appendChild(instructionBoard);
}

function updateInstructionBoard() {
  const instructionBoard = document.getElementById("instructionBoard");
  const instructions = [
    "Aperte nas palavras escritas corretamente com 'ch' ou 'x'.",
    "Aperte nas palavras escritas corretamente com 'ss' ou 'ç'.",
    "Aperte nas palavras escritas corretamente com 'g' ou 'j'."
  ];
  instructionBoard.innerText = instructions[round - 1] || "Fim do jogo!";
}

function setGame() {
  const board = document.getElementById("board");
  if (!board) return console.error("Elemento 'board' não encontrado.");

  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.className = "tile";
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);

    let wordContainer = document.createElement("div");
    wordContainer.className = "word-container";
    tile.appendChild(wordContainer);

    board.appendChild(tile);
  }
  setWords();
  clearInterval(intervalId);
  intervalId = setInterval(setWords, 4000);
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function setWords() {
  if (gameOver) return;

  currTiles.forEach(tile => {
    const wordContainer = tile.querySelector(".word-container");
    if (wordContainer) wordContainer.innerHTML = "";
    tile.removeEventListener("click", selectTile);
  });
  currTiles = [];

  const palavras = getPalavras();
  if (!palavras.length) return;

  if (usedIndexes.length >= palavras.length) usedIndexes = [];

  let index;
  do {
    index = getRandomIndex(palavras.length);
  } while (usedIndexes.includes(index));

  usedIndexes.push(index);

  const [correta, incorreta] = palavras[index];
  const corretaIndex = getRandomIndex(9);
  let incorretaIndex;

  do {
    incorretaIndex = getRandomIndex(9);
  } while (incorretaIndex === corretaIndex);

  createWordTile(corretaIndex, correta, "palavra-correta");
  createWordTile(incorretaIndex, incorreta, "palavra-incorreta");
}

function createWordTile(index, word, className) {
  const tile = document.getElementById(index.toString());
  if (!tile) return console.error(`Tile ${index} não encontrado.`);

  const wordContainer = tile.querySelector(".word-container");
  const div = document.createElement("div");
  div.className = className;
  div.textContent = word;
  wordContainer.appendChild(div);
  currTiles.push(tile);
  tile.addEventListener("click", selectTile);
}

function selectTile() {
  if (gameOver) return;
  this.removeEventListener("click", selectTile);

  if (this.querySelector(".palavra-correta")) {
    score += 10;
    correctAnswers += 1;
    document.getElementById("score").innerText = score.toString();

    if (correctAnswers >= 5) nextRound();
    if (score >= maxScore) endGame("vitória_fase1.html");
  } else {
    endGame("derrota.html");
  }
}

function nextRound() {
  correctAnswers = 0;
  round++;
  if (round > 3) {
    endGame("vitoria.html");
  } else {
    usedIndexes = [];
    setGame();
    updateInstructionBoard();
  }
}

function endGame(destination) {
  gameOver = true;
  clearInterval(intervalId);
  try {
    window.location.href = destination;
  } catch (error) {
    console.error("Erro ao redirecionar: ", error);
    alert(`Erro ao redirecionar para ${destination}.`);
  }
}

function resetGame() {
  score = 0;
  correctAnswers = 0;
  round = 1;
  gameOver = false;
  usedIndexes = [];
  document.getElementById("score").innerText = score.toString();
  setGame();
  updateInstructionBoard();
}

function setupButtons() {
  const buttonContainer = document.createElement("div");
  Object.assign(buttonContainer.style, {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    display: "flex",
    gap: "10px"
  });
  document.body.appendChild(buttonContainer);

  const reviewButton = createButton("Revisão", () => {
    window.location.href = "revisao1.html"; // Redireciona para revisao.html
  }, "#C8A2C8");

  const startButton = createButton("Iniciar Jogo", resetGame, "#4CAF50", "#FFF");

  const musicButton = createMusicButton("Música", playMusic, "#FFA500");

  buttonContainer.appendChild(reviewButton);
  buttonContainer.appendChild(startButton);

  // Cria o botão de música no canto superior esquerdo
  const musicContainer = document.createElement("div");
  Object.assign(musicContainer.style, {
    position: "absolute",
    top: "20px",
    left: "20px"
  });
  musicContainer.appendChild(musicButton);
  document.body.appendChild(musicContainer);
}

function createButton(text, onClick, backgroundColor, color = "#000") {
  const button = document.createElement("button");
  button.innerText = text;
  button.addEventListener("click", onClick);
  Object.assign(button.style, {
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor,
    color,
    borderRadius: "8px"
  });
  return button;
}

function createMusicButton(text, onClick, backgroundColor, color = "#000") {
  const button = document.createElement("button");
  button.innerText = text;
  button.addEventListener("click", onClick);
  Object.assign(button.style, {
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor,
    color,
    borderRadius: "8px"
  });
  return button;
}

function playMusic() {
  if (!audio) {
    audio = new Audio("sua-musica.mp3"); // Substitua "sua-musica.mp3" pelo caminho do seu arquivo de áudio
  }
  audio.play();
}
