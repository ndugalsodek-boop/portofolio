// Loader
const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 600);
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Custom cursor
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Hover cursor
document.querySelectorAll("a, button, .cta, .arrow").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () =>
    cursor.classList.remove("cursor-hover")
  );
});

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
});

// Parallax profile card
const profile = document.querySelector("[data-parallax]");
document.addEventListener("mousemove", (e) => {
  const rect = profile.getBoundingClientRect();
  const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
  const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
  profile.style.transform = `translate(${dx * 10}px, ${dy * 10}px) rotateX(${
    -dy * 3
  }deg) rotateY(${dx * 3}deg)`;
});

// Reset parallax on leave
profile.addEventListener(
  "mouseleave",
  () => (profile.style.transform = "translate(0,0) rotateX(0) rotateY(0)")
);

// Reveal scroll
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Projects slider
const slidesEl = document.getElementById("slides");
const slideEls = [...slidesEl.children];
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const dotsWrap = document.getElementById("dots");
let index = 0;

function renderDots() {
  dotsWrap.innerHTML = "";
  slideEls.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot";
    d.onclick = () => goTo(i);
    if (i === index) d.classList.add("active");
    dotsWrap.appendChild(d);
  });
}

function update() {
  slidesEl.style.transform = `translateX(${-index * 338}px)`;
  [...dotsWrap.children].forEach((d, i) =>
    d.classList.toggle("active", i === index)
  );
}

function goTo(i) {
  index = Math.max(0, Math.min(i, slideEls.length - 1));
  update();
}

prev.onclick = () => goTo(index - 1);
next.onclick = () => goTo(index + 1);

// Contact form fake send
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.target.querySelector(".send-btn");
  btn.textContent = "Sending...";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "Sent!";
    e.target.reset();
    setTimeout(() => {
      btn.textContent = "Send Message";
      btn.disabled = false;
    }, 1500);
  }, 900);
});

// Smooth scroll to projects
document.getElementById("viewProjects").onclick = () =>
  document.getElementById("projects").scrollIntoView({ behavior: "smooth" });

// =============================
// GAME 8 — Enhanced Version
// =============================

const questionsGame = [
  { q: "1 + 0 = ?", answer: 1, word: "I" },
  { q: "1 + 1 = ?", answer: 2, word: "am" },
  { q: "6 ÷ 2 = ?", answer: 3, word: "very" },
  { q: "20 ÷ 5 = ?", answer: 4, word: "happy" },
  { q: "10 - 5 = ?", answer: 5, word: "today." }
];

let gameIndexX = 0;
let wordsCollected = [];
let startTime = 0;

// Audio
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function loadLeaderboard() {
  const list = document.getElementById("leaderList");
  const data = JSON.parse(localStorage.getItem("leaderboardX") || "[]");

  list.innerHTML = "";
  data.slice(0, 5).forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${entry.time}s — ${entry.sentence}`;
    list.appendChild(li);
  });
}
loadLeaderboard();

// Start question
document.getElementById("question").textContent = questionsGame[0].q;
startTime = Date.now();

function checkAnswer() {
  const userAns = parseInt(document.getElementById("answer").value);

  if (userAns === questionsGame[gameIndexX].answer) {
    correctSound.play();

    wordsCollected.push(questionsGame[gameIndexX].word);
    gameIndexX++;

    if (gameIndexX < questionsGame.length) {
      document.getElementById("question").textContent =
        questionsGame[gameIndexX].q;
      document.getElementById("answer").value = "";
    } else {
      completeGame();
    }
  } else {
    wrongSound.play();
    alert("Jawaban salah! coba lagi");
  }
}

function completeGame() {
  const stage = document.getElementById("stage");
  stage.innerHTML = "<h3>Great job!</h3>";

  const final = wordsCollected.join(" ");
  document.getElementById("finalSentence").textContent =
    "Final Sentence: " + final;

  document.getElementById("restartBtn").style.display = "block";

  const totalTime = Math.floor((Date.now() - startTime) / 1000);

  saveScore(final, totalTime);
}

function saveScore(sentence, time) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboardX") || "[]");

  leaderboard.push({ sentence, time });

  leaderboard.sort((a, b) => a.time - b.time);

  localStorage.setItem("leaderboardX", JSON.stringify(leaderboard));

  loadLeaderboard();
}

function restartGame() {
  gameIndexX = 0;
  wordsCollected = [];
  startTime = Date.now();

  document.getElementById("stage").innerHTML = `
    <div class="question" id="question">${questionsGame[0].q}</div>
    <input type="number" id="answer" placeholder="Your answer...">
    <button id="submitBtn" onclick="checkAnswer()">Submit</button>
  `;

  document.getElementById("finalSentence").textContent = "";
  document.getElementById("restartBtn").style.display = "none";

correctSound.play();
wrongSound.play();
}
// BLOG Accordion
document.querySelectorAll(".accordion-header").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    item.classList.toggle("active");
  });
});
