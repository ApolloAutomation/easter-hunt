
const totalLetters = "YOLKEDUP".split(""); // 8 letters total
const pageName = window.location.pathname.split("/").pop().replace(".html", ""); // 'forest', 'beach', etc.

// Define which eggs on which page get real letters (by index)
const letterPositions = {
  forest: [2],
  beach: [4],
  garden: [1, 7],
  countryside: [0, 5],
  meadow: [3, 6]
};

// Map letter index to base64-encoded letter values
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
  const thisPagePositions = letterPositions[pageName] || [];
  const allAssignedIndices = Object.values(letterPositions).flat();

  for (let i = 0; i < 10; i++) {
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.dataset.index = i;

    const key = `egg_${pageName}_${i}`;
    const saved = localStorage.getItem(key);
    const savedLetter = localStorage.getItem(`${key}_letter`);

    if (saved) {
      egg.classList.add("cracked");
      if (savedLetter) {
        egg.textContent = atob(savedLetter);
      }
    }

    egg.onclick = () => {
      if (egg.classList.contains("cracked")) return;
      egg.classList.add("cracked");

      // Is this egg one that should contain a letter?
      if (thisPagePositions.includes(i)) {
        // Find its global letter index based on all flattened letter positions
        const flatIndex = allAssignedIndices.indexOf(i);
        const letter = letterMap[flatIndex];
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
