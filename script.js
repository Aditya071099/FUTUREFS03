/* ---- Edit these for the real clinic ---- */
const WHATSAPP = "9689921037"; // country code + number, digits only (e.g. 9689921037)
const HOURS = {                  // 0 = Sunday ... 6 = Saturday; times are 24-hour
  0: [],
  1: [["09:00", "13:00"], ["17:00", "20:00"]],
  2: [["09:00", "13:00"], ["17:00", "20:00"]],
  3: [["09:00", "13:00"], ["17:00", "20:00"]],
  4: [["09:00", "13:00"], ["17:00", "20:00"]],
  5: [["09:00", "13:00"], ["17:00", "20:00"]],
  6: [["09:00", "13:00"],]
};
const CLINIC_NAME = "Sunrise Physio";

/* Mobile menu */
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.getElementById("nav-links");
menuBtn.addEventListener("click", () => {
  menuBtn.setAttribute("aria-expanded", navLinks.classList.toggle("open"));
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", false);
}));

/* "Open now" badge, based on the visitor's current time */
function toMinutes(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function updateBadge() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = (HOURS[now.getDay()] || []).some(([a, b]) => mins >= toMinutes(a) && mins < toMinutes(b));
  const badge = document.getElementById("open-badge");
  badge.textContent = open ? "Open now" : "Closed now. See our hours below";
  badge.classList.toggle("closed", !open);
}
updateBadge();
setInterval(updateBadge, 60000);

/* Appointment form: validate, then open WhatsApp with the request ready to send */
const form = document.getElementById("book-form");
const note = document.getElementById("form-message");
const today = new Date();
const localToday = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

form.date.min = localToday;

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const digits = phone.replace(/\D/g, "");
  if (!name || !form.date.value) return fail("Please enter your name and a preferred date.");
  if (digits.length < 10) return fail("Please enter a valid phone number.");

  const text = [
    `Hello ${CLINIC_NAME}, I would like to book an appointment.`,
    `Name: ${name}`, `Phone: ${phone}`, `Service: ${form.service.value}`,
    `Preferred date: ${form.date.value}`,
    form.note.value.trim() && `Note: ${form.note.value.trim()}`
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  note.className = "ok";
  note.textContent = "Thanks! WhatsApp should open with your request. Press send to finish.";
  form.reset();
});
function fail(msg) { note.className = "error"; note.textContent = msg; }
