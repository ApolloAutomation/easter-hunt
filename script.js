
const letters = "HOPHUNT".split("");
let shuffled = [...letters].sort(() => 0.5 - Math.random());
let revealed = [];

window.onload = () => {
  const grid = document.getElementById("eggGrid");
  shuffled.forEach((letter, i) => {
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.dataset.letter = letter;
    egg.onclick = () => revealLetter(egg, letter);
    grid.appendChild(egg);
  });
};

function revealLetter(egg, letter) {
  if (egg.classList.contains("revealed")) return;
  egg.classList.add("revealed");
  egg.textContent = letter;
  revealed.push(letter);
  if (revealed.length === letters.length) {
    document.getElementById("scrambled").innerText = "Scrambled Letters: " + shuffled.join(" ");
    document.getElementById("guessSection").style.display = "block";
  }
}

function checkCode() {
  const input = document.getElementById("codeInput").value.toUpperCase();
  const result = document.getElementById("result");
  if (input === "HOPHUNT") {
    result.textContent = "🎉 You got it! Use code HOPHUNT at checkout for 100% off one item!";
  } else {
    result.textContent = "❌ Oops! That’s not quite right. Try again!";
  }
}
