
const totalLetters = "BUNNYSQUAD".split("");
const allEggCount = 150;
const pages = ["forest", "beach", "garden", "countryside", "meadow"];
const eggsPerPage = 30;
const pageName = window.location.pathname.split("/").pop().replace(".html", "");
const eggIndex = pages.indexOf(pageName) * eggsPerPage;

function shuffleArray(arr) {
  return arr.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
}




function getOrGenerateAssignments() {
  const stored = sessionStorage.getItem("letterAssignments");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const values = Object.values(parsed).filter(v => typeof v === "string");
      if (values.length === 10) {
        return parsed;
      }
    } catch (e) {
      // fallback to regeneration
    }
  }

  const letters = "BUNNYSQUAD".split("");
  const assignments = {};

  for (let page = 0; page < 5; page++) {
    const baseIndex = page * 30;
    const positions = shuffleArray(Array.from({ length: 30 }, (_, i) => baseIndex + i));
    const l1 = letters.shift();
    const l2 = letters.shift();
    if (l1) assignments[positions[0]] = l1;
    if (l2) assignments[positions[1]] = l2;
  }

  sessionStorage.setItem("letterAssignments", JSON.stringify(assignments));
  return assignments;
}





function getCrackedIndexes() {
  const data = sessionStorage.getItem("crackedEggIndexes");
  return data ? JSON.parse(data) : [];
}



function updateCrackedIndexes(index) {
  let cracked = getCrackedIndexes();
  if (!cracked.includes(index)) {
    cracked.push(index);
    sessionStorage.setItem("crackedEggIndexes", JSON.stringify(cracked));
  }
  return cracked;
}


function isEggCracked(index) {
  return sessionStorage.getItem("cracked_" + index) === "true";
}

function markEggCracked(index) {
  sessionStorage.setItem("cracked_" + index, "true");
}

window.onload = () => {
  const assignments = getOrGenerateAssignments();
  updateScrambledLetters(assignments);
  const assignments = getOrGenerateAssignments();
  const grid = document.getElementById("eggGrid");

  for (let i = 0; i < eggsPerPage; i++) {
    const globalIndex = eggIndex + i;
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.dataset.index = globalIndex;

    if (isEggCracked(globalIndex)) {
      egg.classList.add("cracked");
      const letter = assignments[globalIndex];
      if (letter) egg.setAttribute("data-letter", letter);
    }

    egg.onclick = () => {
      if (egg.classList.contains("cracked")) return;
      egg.classList.add("cracked", "crack-anim");

      const letter = assignments[globalIndex];
      if (letter) {
        egg.setAttribute("data-letter", letter);
        updateCrackedIndexes(globalIndex);
      }

      markEggCracked(globalIndex);
      updateScrambledLetters(assignments);
      updateProgressBar();
    };

    grid.appendChild(egg);
  }

  updateScrambledLetters(assignments);
      updateProgressBar();
};

function updateScrambledLetters(revealedLetters) {
  const scramble = document.getElementById("scrambled");
  const section = document.getElementById("guessSection");

  if (scramble) {
    scramble.innerText = "Scrambled Letters: " + revealedLetters.join(" ");
  }

  if (section && revealedLetters.length >= totalLetters.length) {
    section.style.display = "block";
  }
}

function checkCode() {
  const input = document.getElementById("codeInput")?.value.toUpperCase();
  const result = document.getElementById("result");
  if (!result) return;
  if (input === "BUNNYSQUAD") {
    result.textContent = "🎉 You got it! Use code BUNNYSQUAD at checkout for 100% off one item!";
  } else {
    result.textContent = "❌ Oops! That’s not quite right. Try again!";
  }
}


function updateProgressBar() {
  const revealed = getRevealedLetters();
  const total = totalLetters.length;
  const percent = Math.min(revealed.length / total * 100, 100);
  const fill = document.getElementById("progressFill");
  const label = document.getElementById("progressLabel");
  if (fill) fill.style.width = percent + "%";
  if (label) label.innerText = `${revealed.length} / ${total} Letters Found`;
}

// Call this after updates
window.addEventListener("load", () => {
  updateProgressBar();
});
