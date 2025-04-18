
const totalLetters = "YOLKEDUP".split("");
const pageName = window.location.pathname.split("/").pop().replace(".html", "");

const letterAssignments = {
  forest: {2: 0},
  beach: {4: 1},
  garden: {1: 2, 7: 3},
  countryside: {0: 4, 5: 5},
  meadow: {3: 6, 6: 7}
};

const letterMap = [
  "WQ==", "Tw==", "TA==", "Sw==", "RQA=", "RA==", "VQ==", "UA=="
];

window.onload = () => {
  const grid = document.getElementById("eggGrid");
  const pageAssignments = letterAssignments[pageName] || {};

  for (let i = 0; i < 10; i++) {
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.dataset.index = i;
    const key = `egg_${pageName}_${i}`;
    const saved = localStorage.getItem(key);
    const savedLetter = localStorage.getItem(`${key}_letter`);

    if (saved) {
      egg.classList.add("cracked");
      if (savedLetter) egg.textContent = atob(savedLetter);
    }

    egg.onclick = () => {
      if (egg.classList.contains("cracked")) return;
      egg.classList.add("cracked");
      if (pageAssignments.hasOwnProperty(i)) {
        const letter = letterMap[pageAssignments[i]];
        egg.textContent = atob(letter);
        localStorage.setItem(`${key}_letter`, letter);
      }
      localStorage.setItem(key, "cracked");
    };

    grid.appendChild(egg);
  }

  const revealedLetters = [];
  Object.keys(localStorage).forEach(k => {
    if (k.endsWith("_letter")) revealedLetters.push(atob(localStorage.getItem(k)));
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
