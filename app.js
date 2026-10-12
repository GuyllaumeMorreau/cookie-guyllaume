import { gift } from "./config.js";
import { remainingDays, thaiDate } from "./countdown.js";
const $ = (selector) => document.querySelector(selector);
for (const id of ["title", "intro", "hint"]) $(`#${id}`).textContent = gift[id];
$(".names").replaceChildren(document.createTextNode(gift.names));
function updateCountdown() {
  const days = remainingDays(gift.reunionDate);
  const countdown = $("#countdown");
  countdown.replaceChildren();
  if (days) {
    countdown.append("อีก ");
    const number = document.createElement("strong");
    number.textContent = days;
    countdown.append(number, " วัน");
  } else countdown.textContent = gift.afterDate;
  $("#planned").textContent =
    `เราวางแผนจะเจอกันที่ฝรั่งเศส · ${thaiDate(gift.reunionDate)}`;
  $("#date-note").textContent = days
    ? "นับถอยหลังถึงวันที่เราวางแผนไว้"
    : gift.afterNote;
}
updateCountdown();
setInterval(updateCountdown, 60000);
const dialog = $("#gift-dialog");
const content = $("#dialog-content");
let cookieIndex = 0;
let openingButton;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function heading(icon, title) {
  content.replaceChildren(element("p", "dialog-icon", icon));
  const h = element("h2", "", title);
  h.id = "dialog-title";
  content.append(h);
}
function renderCookies() {
  heading("♡", "โหลคุกกี้");
  const image = element("img", "cookie-drawing");
  image.src = "assets/cookie.svg";
  image.alt = "";
  const message = element("p", "sweet-message", gift.cookies[cookieIndex]);
  message.setAttribute("aria-live", "polite");
  const counter = element(
    "p",
    "cookie-count",
    `${cookieIndex + 1} / ${gift.cookies.length}`,
  );
  const next = element("button", "next", "อีกชิ้นได้ไหม");
  next.addEventListener("click", () => {
    cookieIndex = (cookieIndex + 1) % gift.cookies.length;
    message.textContent = gift.cookies[cookieIndex];
    counter.textContent = `${cookieIndex + 1} / ${gift.cookies.length}`;
  });
  content.append(image, message, counter, next);
}
function renderLetter(index = 0) {
  heading("✉", gift.letters[index].title);
  const body = element("div", "letter-body");
  body.append(
    element("p", "", "ถึง Cookie"),
    element("p", "", gift.letters[index].body),
    element("p", "signature", "จาก Guyllaume ถึง Cookie"),
  );
  const choices = element("div", "letter-choices");
  gift.letters.forEach((letter, i) => {
    const choice = element(
      "button",
      "",
      `${i === index ? "♡ " : ""}${letter.title}`,
    );
    choice.setAttribute("aria-pressed", String(i === index));
    choice.addEventListener("click", () => {
      renderLetter(i);
      content.querySelectorAll(".letter-choices button")[i].focus();
    });
    choices.append(choice);
  });
  content.append(body, choices);
}
function render(kind) {
  if (kind === "cookies") renderCookies();
  if (kind === "letter") renderLetter();
  if (kind === "frame") {
    heading("♡", "มุมเล็ก ๆ ของเรา");
    const image = element("img", "couple");
    image.src = gift.photo || "assets/couple.svg";
    image.alt = gift.photo
      ? "รูปของ Cookie และ Guyllaume"
      : "ภาพวาดคุกกี้สองชิ้นอยู่ด้วยกัน";
    image.addEventListener(
      "error",
      () => {
        image.src = "assets/couple.svg";
        image.alt = "ภาพวาดคุกกี้สองชิ้นอยู่ด้วยกัน";
      },
      { once: true },
    );
    content.append(image, element("p", "frame-caption", gift.frameMessage));
  }
  if (kind === "stars") {
    heading("✧", "หน้าต่างแห่งความคิดถึง");
    const image = element("img", "stars-drawing");
    image.src = "assets/stars.svg";
    image.alt = "";
    content.append(image, element("p", "sweet-message", gift.starMessage));
  }
}
function show(kind, button) {
  openingButton = button || openingButton;
  render(kind);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add("modal-open");
}
function hide() {
  if (dialog.open) dialog.close();
  document.body.classList.remove("modal-open");
  openingButton?.focus();
}
function closeWithHistory() {
  if (location.hash.startsWith("#gift-")) history.back();
  else hide();
}
document.querySelectorAll("[data-open]").forEach((button) =>
  button.addEventListener("click", () => {
    const kind = button.dataset.open;
    history.pushState({ gift: kind }, "", `#gift-${kind}`);
    show(kind, button);
  }),
);
$(".close").addEventListener("click", closeWithHistory);
$(".back").addEventListener("click", closeWithHistory);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeWithHistory();
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      closeWithHistory();
  }
});
const validKinds = ["letter", "frame", "cookies", "stars"];
function syncHash() {
  const kind = location.hash.replace("#gift-", "");
  if (validKinds.includes(kind)) show(kind);
  else hide();
}
window.addEventListener("popstate", syncHash);
// Direct links still get a room entry so the in-app return never leaves the gift.
if (validKinds.includes(location.hash.replace("#gift-", ""))) {
  const hash = location.hash;
  history.replaceState(null, "", location.pathname + location.search);
  history.pushState(null, "", hash);
  syncHash();
}
// Keep keyboard navigation inside the letter, including Chrome's final Tab stop.
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const buttons = [...dialog.querySelectorAll("button")];
  const first = buttons[0];
  const last = buttons.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
