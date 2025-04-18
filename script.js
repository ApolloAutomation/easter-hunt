
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


// Clear previous session storage for updated code
sessionStorage.removeItem("letterAssignments");
sessionStorage.removeItem("revealedLetters");

window.onload = () => {
  const assignments = getOrGenerateAssignments();
  const grid = document.getElementById("eggGrid");

  for (let i = 0; i < 30; i++) {
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
        if (letter) egg.setAttribute('data-letter', letter);
        updateRevealedLetters(letter);
      }

      markEggCracked(globalIndex);
      updateScrambledLetters(getRevealedLetters());
    };

    grid.appendChild(egg);
  }

  updateScrambledLetters(getRevealedLetters());
};

function updateScrambledLetters(revealedLetters) {
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
  if (input === atob("QlVOTllTUVVBRA==")) {
    result.textContent = atob("8J+UpSBZb3UgZ290IGl0ISBVc2UgY29kZSBCVU5OWVNRVUFEIGF0IGNoZWNrb3V0IGZvciAxMDAlIG9mZiBvbmUgaXRlbSE=");
  } else {
    result.textContent = "❌ Oops! That’s not quite right. Try again!";
  }
}


function updateScrambledLetters(revealedLetters) {
  const scramble = document.getElementById("scrambled");
  if (scramble) {
    scramble.innerText = "Scrambled Letters: " + revealedLetters.join(" ");
  }
  const section = document.getElementById("guessSection");
  if (section && revealedLetters.length >= totalLetters.length) {
    section.style.display = "block";
  }
}
