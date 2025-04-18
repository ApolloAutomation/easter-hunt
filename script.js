
const totalLetters = "YOLKEDUP".split("");
const allEggCount = 50;
const pageName = window.location.pathname.split("/").pop().replace(".html", "");
const pages = ["forest", "beach", "garden", "countryside", "meadow"];
const eggIndex = pages.indexOf(pageName) * 10;

// Clear progress on load
Object.keys(localStorage).forEach(key => {
  if (key.startsWith("egg_")) localStorage.removeItem(key);
});

// Shuffle helper
function shuffleArray(arr) {
  return arr.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
}

// Assign random letters to 8 random eggs
function generateRandomAssignments() {
  const shuffledLetters = shuffleArray([...totalLetters]);
  const positions = shuffleArray(Array.from({ length: allEggCount }, (_, i) => i));
  const assignments = {};
  for (let i = 0; i < shuffledLetters.length; i++) {
    assignments[positions[i]] = shuffledLetters[i];
  }
  return assignments;
}

// Load previously revealed letters from sessionStorage
function getRevealedLetters() {
  const data = sessionStorage.getItem("revealedLetters");
  return data ? JSON.parse(data) : [];
}

// Save revealed letters to sessionStorage
function updateRevealedLetters(letter) {
  let revealed = getRevealedLetters();
  if (!revealed.includes(letter)) {
    revealed.push(letter);
    sessionStorage.setItem("revealedLetters", JSON.stringify(revealed));
  }
  return revealed;
}

window.onload = () => {
  const assignments = generateRandomAssignments();
  const grid = document.getElementById("eggGrid");

  for (let i = 0; i < 10; i++) {
    const globalIndex = eggIndex + i;
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.dataset.index = globalIndex;

    egg.onclick = () => {
      if (egg.classList.contains("cracked")) return;
      egg.classList.add("cracked", "crack-anim");

      const letter = assignments[globalIndex];
      if (letter) {
        egg.textContent = letter;
        const revealed = updateRevealedLetters(letter);
        maybeShowScrambled(revealed);
      }
    };

    grid.appendChild(egg);
  }

  maybeShowScrambled(getRevealedLetters());
};

function maybeShowScrambled(revealedLetters) {
  const scramble = document.getElementById("scrambled");
  const section = document.getElementById("guessSection");
  if (revealedLetters.length >= totalLetters.length) {
    scramble.innerText = "Scrambled Letters: " + revealedLetters.join(" ");
    if (section) section.style.display = "block";
  }
}

function checkCode() {
  const input = document.getElementById("codeInput")?.value.toUpperCase();
  const result = document.getElementById("result");
  if (!result) return;
  if (input === "YOLKEDUP") {
    result.textContent = "🎉 You got it! Use code YOLKEDUP at checkout for 100% off one item!";
  } else {
    result.textContent = "❌ Oops! That’s not quite right. Try again!";
  }
}
