// Página del equipo: tarjetas con retrato, número, nombre y cargo. Al tocar una tarjeta, la foto se levanta en un modal.
let language = savedLanguage();
const label = (key) => TEXT[language][key];
let openIndex = -1;
let lastFocus = null;

function bigPhoto(member) {
  return member.photo.replace("assets/team/", "assets/team/big/");
}
function renderTeam() {
  document.documentElement.lang = language;
  document.title = label("teamHeading") + " · " + label("brandTitle");
  for (const element of document.querySelectorAll("[data-i18n]")) element.textContent = label(element.dataset.i18n);
  const grid = document.getElementById("team-grid");
  grid.replaceChildren();
  TEAM.forEach((member, index) => {
    const card = document.createElement("li");
    card.className = "team-card";
    card.style.setProperty("--tone", member.color);
    const open = document.createElement("button");
    open.type = "button";
    open.className = "team-open";
    open.setAttribute("aria-label", label("teamOpen") + " " + member.name);
    const figure = document.createElement("figure");
    figure.className = "team-photo";
    const img = document.createElement("img");
    img.src = member.photo;
    img.alt = member.name;
    img.loading = "lazy";
    const badge = document.createElement("span");
    badge.className = "team-number";
    badge.textContent = String(member.n);
    badge.setAttribute("aria-hidden", "true");
    figure.append(img, badge);
    const name = document.createElement("h2");
    name.textContent = member.name;
    open.append(figure, name);
    open.addEventListener("click", () => openModal(index));
    card.append(open);
    const role = member.role && member.role[language];
    if (role) {
      const text = document.createElement("p");
      text.className = "team-role";
      const icon = document.createElement("span");
      icon.className = "team-role-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = member.icon || "";
      text.append(icon, role);
      card.append(text);
    }
    grid.append(card);
  });
  document.getElementById("lang-es").setAttribute("aria-pressed", language === "es");
  document.getElementById("lang-en").setAttribute("aria-pressed", language === "en");
  document.getElementById("modal-close").setAttribute("aria-label", label("teamClose"));
  document.getElementById("modal-prev").setAttribute("aria-label", label("teamPrev"));
  document.getElementById("modal-next").setAttribute("aria-label", label("teamNext"));
  if (openIndex >= 0) fillModal();
}
function fillModal() {
  const member = TEAM[openIndex];
  const panel = document.querySelector(".team-modal-panel");
  panel.style.setProperty("--tone", member.color);
  document.getElementById("modal-img").src = bigPhoto(member);
  document.getElementById("modal-img").alt = member.name;
  document.getElementById("modal-number").textContent = String(member.n);
  document.getElementById("modal-name").textContent = member.name;
  const role = member.role && member.role[language];
  document.getElementById("modal-role").classList.toggle("hidden", !role);
  document.getElementById("modal-role-icon").textContent = member.icon || "";
  document.getElementById("modal-role-text").textContent = role || "";
}
function openModal(index) {
  lastFocus = document.activeElement;
  openIndex = index;
  fillModal();
  document.getElementById("team-modal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  document.getElementById("modal-close").focus();
}
function closeModal() {
  openIndex = -1;
  document.getElementById("team-modal").classList.add("hidden");
  document.body.classList.remove("modal-open");
  if (lastFocus) lastFocus.focus();
}
function stepModal(direction) {
  openIndex = (openIndex + direction + TEAM.length) % TEAM.length;
  fillModal();
}
function changeLanguage(next) {
  language = next;
  saveLanguage(next);
  renderTeam();
}
document.getElementById("lang-es").addEventListener("click", () => changeLanguage("es"));
document.getElementById("lang-en").addEventListener("click", () => changeLanguage("en"));
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-prev").addEventListener("click", () => stepModal(-1));
document.getElementById("modal-next").addEventListener("click", () => stepModal(1));
document.getElementById("team-modal").addEventListener("click", (event) => { if (event.target.id === "team-modal") closeModal(); });
document.addEventListener("keydown", (event) => {
  if (openIndex < 0) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") stepModal(-1);
  if (event.key === "ArrowRight") stepModal(1);
  if (event.key === "Tab") {
    // El foco se queda dentro del modal mientras está abierto.
    const items = [...document.querySelectorAll("#team-modal button")];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
renderTeam();
