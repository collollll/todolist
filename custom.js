let user = document.querySelector("#user");
let add = document.querySelector("#add");
let taskBoard = document.querySelector("#taskBoard");

let taskList = [];

// 랜덤 이미지들
let images = [
  "img/grape.png",
  "img/orange.png",
  "img/peach.png",
  "img/tomato.png",
];

// Task 생성
add.addEventListener("click", () => {
  if (!user.value.trim()) return;
  makeTask();
});
function makeTask() {
  let task = {
    id: Date.now(),
    content: user.value,
    isComplete: false,
    img: "",
  };

  taskList.push(task);
  addTask(task);

  user.value = "";
}

// 개별 task 생성 함수
function addTask(task) {
  let div = document.createElement("label");
  div.classList.add("task");
  div.dataset.id = task.id;

  let input = document.createElement("input");
  input.type = "checkbox";
  input.id = task.id;
  input.checked = task.isComplete;

  let label = document.createElement("label");
  label.setAttribute("for", task.id);

  if (task.img) label.style.backgroundImage = `url("${task.img}")`;

  let text = document.createElement("div");
  text.textContent = task.content;
  if (task.isComplete) text.classList.add("task-done");

  let delBtn = document.createElement("button");
  delBtn.textContent = "Delete";

  div.append(input, label, text, delBtn);
  taskBoard.append(div);

  // 개별 이벤트 연결
  input.addEventListener("change", () =>
    checking(task.id, input.checked, label, text)
  );
  delBtn.addEventListener("click", () => modalUp(task.id));
}

// 체크박스 이벤트
function checking(id, checked, label, text) {
  let task = taskList.find((t) => t.id === id);
  task.isComplete = checked;

  if (checked) {
    let randomImg = images[Math.floor(Math.random() * images.length)];
    task.img = randomImg;
    label.style.backgroundImage = `url("${randomImg}")`;
    label.style.border = "none";
    text.classList.add("task-done");
  } else {
    task.img = "";
    label.style.backgroundImage = "none";
    label.style.border = " 1px solid #999";
    text.classList.remove("task-done");
  }
}

// 모달창
let close = document.querySelector("#close");
let modal = document.querySelector("#modalBox");
let ok = document.querySelector("#ok");

function modalUp(id) {
  modal.style.display = "flex";

  close.onclick = () => (modal.style.display = "none");

  ok.onclick = () => {
    deleteTask(id);
    modal.style.display = "none";
  };
}

function deleteTask(id) {
  taskList = taskList.filter((t) => t.id !== id);

  let target = document.querySelector(`.task[data-id="${id}"]`);
  if (target) target.remove();
}

// 모두 해제 & 모두 체크
let allDel = document.querySelector(".allDel");
let allCheck = document.querySelector(".allCheck");

allCheck.addEventListener("click", () => {
  document.querySelectorAll(".task").forEach((task) => {
    let checkbox = task.querySelector("input");
    let label = task.querySelector("label");
    let text = task.querySelector("div:nth-child(3)");
    let id = Number(task.dataset.id);

    checkbox.checked = true;
    checking(id, true, label, text);
  });
});

allDel.addEventListener("click", () => {
  document.querySelectorAll(".task").forEach((task) => {
    const checkbox = task.querySelector("input");
    const label = task.querySelector("label");
    const text = task.querySelector("div:nth-child(3)");
    const id = Number(task.dataset.id);

    checkbox.checked = false;
    checking(id, false, label, text);
  });
});

// 목록 초기화
let clear = document.querySelector(".clear");
clear.addEventListener("click", () => {
  modal.style.display = "flex";
  modal.querySelector("p").innerText = "모든 할 일을 지울까요?";
  close.onclick = () => (modal.style.display = "none");
  ok.onclick = () => {
    AllClear();
    modal.style.display = "none";
    modal.querySelector("p").innerText = "할 일을 지울까요?";
  };
});
function AllClear() {
  taskList = [];
  taskBoard.innerHTML = "";
}

// 엔터 시 함수 실행
user.addEventListener("keydown", (e) => {
  if (!user.value.trim()) return;
  if (e.key == "Enter") {
    makeTask();
  }
});

// todo에 오늘 날짜 넣기
let day = document.querySelector(".day");

let day1 = new Date();
let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
day.textContent = `${day1.getFullYear()}.${
  day1.getMonth() + 1
}.${day1.getDate()} (${weekdays[day1.getDay()]})`;

// cork에 일주일 날짜 넣기
let today = new Date(); // 오늘
let eachDay = today.getDay(); // 0(일) ~ 6(토)

// 이번 주 일요일
let sunday = new Date(today);
sunday.setDate(today.getDate() - eachDay);

let weekDate = [];
for (let i = 0; i < 7; i++) {
  let date = new Date(sunday);
  date.setDate(sunday.getDate() + i);
  weekDate.push(date);
}

let weekName = weekdays;

console.log(weekDate);
let empty = document.querySelectorAll("ul li");

weekDate.forEach((date, i) => {
  empty[i].innerHTML = `
  <p>
  ${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} (${
    weekName[date.getDay()]
  })
  </p>
  `;

  if (date.getDay() === day1.getDay()) {
    empty[i].querySelector("p").classList.add("today");
  }

  // 요일 정보 key 같이 저장
  empty[i].dataset.dayKey = date.getDay();
});

// 지난주의 투두리스트 기록 삭제
let savedSunday = localStorage.getItem("weekStart");
let sunday2 = new Date(sunday);
sunday2.setHours(0, 0, 0, 0);
let currentSunday = sunday2.getTime().toString();

if (savedSunday && savedSunday !== currentSunday) {
  for (let i = 0; i < 7; i++) {
    localStorage.removeItem("tasks_" + i);
  }
}
localStorage.setItem("weekStart", currentSunday);
console.log(currentSunday);

// 요일키
function getDayKey() {
  let dayKey = day1.getDay();
  return dayKey;
}

// week 버튼
let corkBoard = document.querySelector(".corkBoard");
let weekBtn = document.querySelector(".week");
let todoBtn = document.querySelector(".todo");

let corkHeight = corkBoard.clientHeight;

weekBtn.addEventListener("click", function () {
  $(".corkBoard").animate(
    { transform: "translateY(0px)" },
    1000,
    "easeOutBounce"
  );
  if (!day.classList.contains("on")) {
    todoSaving();
  }
});

todoBtn.addEventListener("click", function () {
  weekUp();
});
function weekUp() {
  $(".corkBoard").animate(
    { transform: `translateY(-${corkHeight})` },
    1500,
    "easeInOutElastic"
  );
}

// todo 내용 저장
let save = document.querySelector(".save");
let test = document.querySelector(".test");

save.addEventListener("click", function () {
  if (day.classList.contains("on")) {
    alert("오늘의 투두리스트만 저장할 수 있어요!");
    return;
  }
  todoSaving();
  alert("오늘의 투두리스트를 저장했습니다!");
});
function todoSaving() {
  let key = "tasks_" + day1.getDay();
  localStorage.setItem(key, JSON.stringify(taskList));
}

// 요일 별로 기록 가져오기
let loadPop = document.querySelector(".loadPop");
let loadYes = document.querySelector("#loadYes");
let loadNo = document.querySelector("#loadNo");
let left = document.querySelector(".left");

let selectLi = null;
let selectP = null;
let isLoadYes = false;

empty.forEach((li) => {
  li.addEventListener("click", () => {
    empty.forEach((li) => {
      li.classList.remove("selected");
    });
    selectLi = li;
    selectP = li.querySelector("p");

    selectLi.classList.add("selected");

    loadPop.style.display = "block";
  });
});

loadYes.addEventListener("click", function () {
  loadPop.style.display = "none";

  let key = "tasks_" + selectLi.dataset.dayKey;
  let saved = localStorage.getItem(key);

  if (selectP.classList.contains("today")) {
    selectReset();

    if (saved) {
      AllClear();
      taskList = JSON.parse(saved);
      taskList.forEach(addTask);
    } else {
      AllClear();
    }
    weekUp();
    return;
  }

  if (!saved) {
    selectLi.classList.remove("selected");
    alert("앗! 그날의 기록이 저장되지 않았나봐요!");
    return;
  }

  AllClear();
  selectReset();
  taskList = JSON.parse(saved);
  taskList.forEach(addTask);

  day.classList.add("on");
  let span = document.createElement("span");
  span.textContent = selectP.textContent;
  day.appendChild(document.createElement("br"));
  left.appendChild(span);

  weekUp();
});

function selectReset() {
  let lastSpan = document.querySelector(".left > span");
  let lastBr = document.querySelector(".left br");
  if (lastSpan) lastSpan.remove();
  if (lastBr) lastBr.remove();

  day.classList.remove("on");
}

console.log(JSON.stringify(localStorage, null, 2));

loadNo.addEventListener("click", function () {
  selectLi.classList.remove("selected");
  loadPop.style.display = "none";
});

// 리턴 버튼
let returnBtn = document.querySelector(".return");

returnBtn.addEventListener("click", function () {
  selectReset();

  let key = "tasks_" + day1.getDay();
  let saved = localStorage.getItem(key);

  if (saved) {
    AllClear();
    taskList = JSON.parse(saved);
    taskList.forEach(addTask);
  } else {
    alert("저장되어 있는 투두리스트가 없습니다.");
  }
});
