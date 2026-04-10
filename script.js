let allQuestions = [];
let pool = [];
let batch = [];
let current = null;

let score = 0;
let total = 0;

const q = document.getElementById("question");
const a = document.getElementById("answers");
const p = document.getElementById("progress");
const s = document.getElementById("score");
const r = document.getElementById("result");
const restartBtn = document.getElementById("restart");

restartBtn.onclick = () => load();

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

async function load() {
  try {
    const res = await fetch("./datos.json");
    allQuestions = await res.json();

    pool = [...allQuestions];
    shuffle(pool);

    // SOLO 30 PREGUNTAS
    batch = pool.slice(0, 30);

    score = 0;
    total = 0;

    r.textContent = "";

    next();
    update();

  } catch (e) {
    console.error(e);
    q.textContent = "Error cargando preguntas";
  }
}

function next() {
  if (batch.length === 0) return end();

  current = batch.shift();
  show();
  update();
}

function show() {
  q.textContent = current.question;
  a.innerHTML = "";

  Object.entries(current.answers).forEach(([k, v]) => {
    let div = document.createElement("div");
    div.className = "answer";
    div.textContent = v;

    div.onclick = () => check(k, div);

    a.appendChild(div);
  });
}

function check(k, el) {
  let ok = current.correct;

  document.querySelectorAll(".answer")
    .forEach(x => x.style.pointerEvents = "none");

  if (k === ok) {
    el.classList.add("correct");
    score++;
  } else {
    el.classList.add("wrong");
    mark(ok);
  }

  total++;
  setTimeout(next, 400);
}

function mark(ok) {
  let answers = Object.entries(current.answers);

  document.querySelectorAll(".answer").forEach((el, i) => {
    if (answers[i][0] === ok) {
      el.classList.add("correct");
    }
  });
}

function update() {
  p.textContent = `Pregunta ${total + 1}/30`;
  s.textContent = `Aciertos: ${score}`;
}

function end() {
  q.textContent = "FIN DEL EXAMEN";
  a.innerHTML = "";

  let nota = (score / 30) * 10;

  if (nota >= 9) {
    r.textContent = "ES LO RECOMENDABLE";
  } else if (nota >= 5) {
    r.textContent = "PRÁCTICAMENTE DESPRECIABLE";
  } else {
    r.textContent = nota.toFixed(2);
  }

  p.textContent = "Finalizado";
  s.textContent = `Nota: ${nota.toFixed(2)} / 10`;
}

load();