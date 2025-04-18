
const totalLetters = "BUNNYSQUAD".split("");
const pages = ["forest", "beach", "garden", "countryside", "meadow"];
const eggsPerPage = 30;
const allEggCount = eggsPerPage * pages.length;
const pageName = window.location.pathname.split("/").pop().replace(".html", "");
const eggIndex = pages.indexOf(pageName) * eggsPerPage;

// Generate random assignments ON LOAD (no sessionStorage for now)
function shuffleArray(arr) {
  return arr.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
}

const assignments = (() => {
  const shuffledLetters = shuffleArray([...totalLetters]);
  const positions = shuffleArray(Array.from({ length: allEggCount }, (_, i) => i));
  const result = {};
  for (let i = 0; i < shuffledLetters.length; i++) {
    result[positions[i]] = shuffledLetters[i];
  }
  return result;
})();

let crackedEggs = [];

window.onload = () => {
  const grid = document.getElementById("eggGrid");

  for (let i = 0; i < eggsPerPage; i++) {
    const globalIndex = eggIndex + i;
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.dataset.index = globalIndex;

    egg.onclick = () => {
      if (egg.classList.contains("cracked")) return;
      egg.classList.add("cracked");
      if (assignments[globalIndex]) {
        crackedEggs.push(assignments[globalIndex]);
      }
      updateScrambledLetters();
    };

    grid.appendChild(egg);
  }
};

function updateScrambledLetters() {
  const scramble = document.getElementById("scrambled");
  scramble.innerText = "Scrambled Letters: " + crackedEggs.join(" ");
}
