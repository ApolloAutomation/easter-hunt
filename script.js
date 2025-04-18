
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
  const expectedLetters = totalLetters.length;
  const stored = sessionStorage.getItem("letterAssignments");

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const lettersUsed = Object.values(parsed).filter(v => typeof v === "string").length;
      if (lettersUsed === expectedLetters) {
        return parsed;
      }
    } catch (e) {
      // Continue to generate fresh below
    }
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
  revealed.push(letter);
    sessionStorage.setItem("revealedLetters", JSON.stringify(revealed));
  }
  return revealed;
}

function isEggCracked(index) {
  return sessionStorage.getItem("cracked_" + index) === "true";
}

function markEggCracked(index) {
  sessionStorage.setItem("cracked_" + index, "true");
}

window.onload = () => {
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
