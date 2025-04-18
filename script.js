
const totalLetters = "YOLKEDUP".split(""); // 8 letters total
const pageName = window.location.pathname.split("/").pop().replace(".html", ""); // 'forest', 'beach', etc.
const lettersPerPage = {
  forest: [],
  beach: [],
  garden: [],
  countryside: [],
  meadow: []
};

// Assign letter positions across pages
const letterPositions = {
  forest: [2],
  beach: [4],
  garden: [1, 7],
  countryside: [0, 5],
  meadow: [3, 6]
};

// Decode letters from base64
const letterMap = {
  0: "WQ==", // Y
  1: "Tw==", // O
  2: "TA==", // L
  3: "Sw==", // K
  4: "RQA=", // E
  5: "RA==", // D
  6: "VQ==", // U
  7: "UA=="  // P
};

window.onload = () => {
  const grid = document.getElementById("eggGrid");
  for (let i = 0; i < 10; i++) {
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.dataset.index = i;
    const key = `egg_${pageName}_${i}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      egg.classList.add("cracked");
      const content = localStorage.getItem(`${key}_letter`);
      if (content) egg.textContent = atob(content);
    }

    egg.onclick = () => {
      if (egg.classList.contains("cracked")) return;
      egg.classList.add("cracked");
      const eggIndex = parseInt(egg.dataset.index);
      const globalIndex = letterPositions[pageName]?.indexOf(eggIndex);
      if (globalIndex !== -1 && globalIndex !== undefined) {
        const letter = letterMap[totalLetters.indexOf("YOLKEDUP"[Object.keys(letterPositions).flatMap(p => letterPositions[p]).indexOf(eggIndex)])];
        egg.textContent = atob(letter);
        localStorage.setItem(`${key}_letter`, letter);
      }
      localStorage.setItem(key, "cracked");
    };

    grid.appendChild(egg);
  }

  // Show scrambled letters
  const revealedLetters = [];
  Object.keys(localStorage).forEach(k => {
    if (k.endsWith("_letter")) {
      revealedLetters.push(atob(localStorage.getItem(k)));
    }
  });

  if (revealedLetters.length >= 8) {
    document.getElementById("scrambled").innerText = "Scrambled Letters: " + revealedLetters.join(" ");
    document.getElementById("guessSection").style.display = "block";
  }
};

function checkCode() {
  const input = document.getElementById("codeInput").value.toUpperCase();
  const result = document.getElementById("result");
  if (input === "YOLKEDUP") {
    result.textContent = "🎉 You got it! Use code YOLKEDUP at checkout for 100% off one item!";
  } else {
    result.textContent = "❌ Oops! That’s not quite right. Try again!";
  }
}
