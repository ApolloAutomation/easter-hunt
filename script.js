
const totalLetters = "YOLKEDUP".split("");
const allEggCount = 50;
const pageName = window.location.pathname.split("/").pop().replace(".html", "");
const pages = ["forest", "beach", "garden", "countryside", "meadow"];
const eggIndex = pages.indexOf(pageName) * 10;

function shuffleArray(arr) {
  return arr.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
}

function getOrGenerateAssignments() {
  if (sessionStorage.getItem("letterAssignments")) {
    return JSON.parse(sessionStorage.getItem("letterAssignments"));
  }
  const shuffledLetters = shuffleArray([...totalLetters]);
  const positions = shuffleArray(Array.from({ length: allEggCount }, (_, i) => i));
  const assignments = {};
  for (let i = 0; i < shuffledLetters.length; i++) {
    assignments[positions[i]] = shuffledLetters[i];
  }
  sessionStorage.setItem("letterAssignments", JSON.stringify(assignments));
  return assignments;
}

function getRevealedLetters() {
  const data = sessionStorage.getItem("revealedLetters");
  return data ? JSON.parse(data) : [];
}

function updateRevealedLetters(letter) {
  let revealed = getRevealedLetters();
  if (!revealed.includes(letter)) {
    revealed.push(letter);
    sessionStorage.setItem("revealedLetters", JSON.stringify(revealed));
  }
  return revealed;
}

function isEggCracked(index) {
  return sessionStorage.getItem(`cracked_${index}`) === "true";
}

function markEggCracked(index) {
  sessionStorage.setItem(`cracked_${index}`, "true");
}

window.onload = () => {
  const assignments = getOrGenerateAssignments();
  const grid = document.getElementById("eggGrid");

  for (let i = 0; i < 10; i++) {
    const globalIndex = eggIndex + i;
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.dataset.index = globalIndex;

    if (isEggCracked(globalIndex)) {
      egg.classList.add("cracked");
      if (assignments[globalIndex]) {
        egg.textContent = assignments[globalIndex];
      }
    }

    egg.onclick = () => {
      if (egg.classList.contains("cracked")) return;
      egg.classList.add("cracked", "crack-anim");

      const letter = assignments[globalIndex];
      if (letter) {
        egg.textContent = letter;
        updateRevealedLetters(letter);
      }

      markEggCracked(globalIndex);
      maybeShowScrambled(getRevealedLetters());
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
