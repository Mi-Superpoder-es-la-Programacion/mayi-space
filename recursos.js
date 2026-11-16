// Página de recursos: pestañas (estudios NASA OSDR por sala / reto y créditos), textos e idioma.
let language = savedLanguage();
const label = (key) => TEXT[language][key];

function renderReferences() {
  const grid = document.getElementById("reference-grid");
  grid.replaceChildren();
  for (const ref of REFERENCES) {
    const card = document.createElement("li");
    card.className = "reference-card" + (ref.inGame ? " in-game" : "");
    card.style.setProperty("--tone", ref.color);
    const head = document.createElement("div");
    head.className = "reference-head";
    const icon = document.createElement("span");
    icon.className = "reference-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = ref.icon;
    const name = document.createElement("h3");
    name.textContent = ref.n + ". " + ref.room[language];
    head.append(icon, name);
    const badge = document.createElement("span");
    badge.className = "reference-badge";
    badge.textContent = label(ref.inGame ? "refInGame" : "refBank");
    const title = document.createElement("p");
    title.className = "reference-title";
    title.textContent = ref.title;
    title.title = ref.title;
    const ids = document.createElement("div");
    ids.className = "reference-ids";
    for (const id of ref.ids) {
      const link = document.createElement("a");
      link.href = OSDR_STUDY_URL + id;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = id + " ↗";
      link.title = label("refOpen") + " " + id;
      ids.append(link);
    }
    card.append(head, badge, title, ids);
    grid.append(card);
  }
}
function selectTab(name) {
  for (const key of ["studies", "credits"]) {
    const active = key === name;
    document.getElementById("tab-" + key).setAttribute("aria-selected", String(active));
    document.getElementById("panel-" + key).classList.toggle("hidden", !active);
  }
}
function renderResources() {
  document.documentElement.lang = language;
  document.title = label("resourcesHeading") + " · " + label("brandTitle");
  for (const element of document.querySelectorAll("[data-i18n]")) element.textContent = label(element.dataset.i18n);
  document.getElementById("lang-es").setAttribute("aria-pressed", language === "es");
  document.getElementById("lang-en").setAttribute("aria-pressed", language === "en");
  renderReferences();
}
function changeLanguage(next) {
  language = next;
  saveLanguage(next);
  renderResources();
}
document.getElementById("lang-es").addEventListener("click", () => changeLanguage("es"));
document.getElementById("lang-en").addEventListener("click", () => changeLanguage("en"));
document.getElementById("tab-studies").addEventListener("click", () => selectTab("studies"));
document.getElementById("tab-credits").addEventListener("click", () => selectTab("credits"));
// Flechas del teclado para pasar de una pestaña a otra.
document.querySelector(".resource-tabs").addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const next = document.getElementById("tab-studies").getAttribute("aria-selected") === "true" ? "credits" : "studies";
  selectTab(next);
  document.getElementById("tab-" + next).focus();
});
renderResources();
