// ============================================================
//  Panel de Servicios — lógica
//  Persistencia: Supabase (nube, compartido) + localStorage (caché).
//  Export/Import: JSON.
// ============================================================

const STORAGE_KEY = "panel-servicios-v1";

let state = loadCache();
let activeId = state.servicios[0]?.id || null;
let editing = false;

// ---------- Caché local (render inmediato + offline) ----------
function loadCache() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return structuredClone(DATA_DEFAULT);
}

// ---------- Guardar: nube + caché ----------
async function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setStatus("Guardando…");
  try {
    await cloudSave(state);
    setStatus("✓ Guardado en la nube", 2000);
  } catch (e) {
    setStatus("⚠ Sin conexión: guardado solo local", 3500);
    console.error("cloudSave error", e);
  }
}

// ---------- Cargar desde la nube al iniciar / al volver a la pestaña ----------
async function syncFromCloud() {
  try {
    const remote = await cloudLoad();
    if (remote && remote.servicios) {
      state = remote;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (!getService(activeId)) activeId = state.servicios[0]?.id || null;
      if (!editing) render();
      setStatus("✓ Sincronizado", 1500);
    } else {
      // No hay registro todavía: sembramos el contenido actual.
      await cloudSave(state);
    }
  } catch (e) {
    setStatus("⚠ Mostrando copia local (sin conexión)", 3500);
    console.error("cloudLoad error", e);
  }
}

function setStatus(msg, resetMs) {
  const el = document.getElementById("saveState");
  if (!el) return;
  el.textContent = msg;
  if (resetMs)
    setTimeout(() => (el.textContent = "Contenido sincronizado con la nube"), resetMs);
}

// ---------- Helpers ----------
const $ = (s) => document.querySelector(s);
const esc = (s = "") =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const getService = (id) => state.servicios.find((s) => s.id === id);

// ---------- Render marca ----------
function renderBrand() {
  $("#brandName").textContent = state.marca?.nombre || "Mis Servicios";
  $("#brandSub").textContent = state.marca?.subtitulo || "";
}

// ---------- Render tabs ----------
function renderTabs() {
  const tabs = $("#tabs");
  tabs.innerHTML = state.servicios
    .map(
      (s) => `
      <button class="tab ${s.id === activeId ? "active" : ""}" data-id="${s.id}">
        <span class="ic">${esc(s.icono || "•")}</span> ${esc(s.nombre)}
      </button>`
    )
    .join("");
  tabs.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", () => {
      activeId = t.dataset.id;
      render();
    })
  );
}

// ---------- Render contenido ----------
function renderContent() {
  const s = getService(activeId);
  const content = $("#content");
  if (!s) {
    content.innerHTML = "<p>Sin servicios.</p>";
    return;
  }

  const beneficios = (s.beneficios || [])
    .map(
      (b) => `
      <div class="benefit">
        <span class="b-ic">◆</span>
        <div><b>${esc(b.titulo)}</b><span>${esc(b.detalle)}</span></div>
      </div>`
    )
    .join("");

  const incluye = (s.incluye || []).map((i) => `<li>${esc(i)}</li>`).join("");

  const packs = (s.paquetes || [])
    .map(
      (p) => `
      <div class="pack">
        <div class="p-name">${esc(p.nombre)}</div>
        <div class="p-price">${esc(p.precio)}</div>
        <div class="p-detail">${esc(p.detalle)}</div>
      </div>`
    )
    .join("");

  content.innerHTML = `
    <div class="top-row">
      <section class="hero">
        <div class="ic">${esc(s.icono || "•")}</div>
        <h2>${esc(s.nombre)}</h2>
        <p class="tagline">${esc(s.tagline || "")}</p>
        <p class="desc">${esc(s.descripcion || "")}</p>
      </section>

      <aside class="panel price-col">
        <h3>Paquetes / Precios</h3>
        <div class="packs-vert">${packs || '<p class="ideal">—</p>'}</div>
      </aside>
    </div>

    <div class="grid">
      <div class="panel">
        <h3>Beneficios</h3>
        ${beneficios || '<p class="ideal">—</p>'}
      </div>
      <div class="panel">
        <h3>Qué incluye</h3>
        <ul class="list">${incluye || "<li>—</li>"}</ul>
        <h3 style="margin-top:18px">Ideal para</h3>
        <p class="ideal">${esc(s.idealPara || "—")}</p>
      </div>
    </div>
  `;
}

function render() {
  renderBrand();
  renderTabs();
  renderContent();
}

// ============================================================
//  MODO EDICIÓN
// ============================================================
function toggleEdit() {
  editing = !editing;
  document.body.classList.toggle("editing", editing);
  $("#btnEdit").classList.toggle("active", editing);
  $("#btnEdit").textContent = editing ? "✓ Editando" : "✏️ Editar";
  if (editing) openEditor(activeId);
}

function field(label, value, key, textarea = false) {
  const input = textarea
    ? `<textarea rows="3" data-key="${key}">${esc(value)}</textarea>`
    : `<input type="text" data-key="${key}" value="${esc(value)}" />`;
  return `<div class="field"><label>${label}</label>${input}</div>`;
}

function openEditor(id) {
  const s = getService(id);
  if (!s) return;
  $("#modalTitle").textContent = "Editar: " + s.nombre;
  const body = $("#modalBody");

  body.innerHTML = `
    ${field("Nombre del servicio", s.nombre, "nombre")}
    ${field("Ícono (emoji)", s.icono, "icono")}
    ${field("Tagline (frase corta)", s.tagline, "tagline")}
    ${field("Descripción", s.descripcion, "descripcion", true)}
    ${field("Ideal para", s.idealPara, "idealPara", true)}

    <div class="editor-block">
      <div class="eb-head"><b>Beneficios</b>
        <button class="btn btn-mini" data-add="beneficio">+ Agregar</button></div>
      <div id="benList"></div>
    </div>

    <div class="editor-block">
      <div class="eb-head"><b>Qué incluye</b>
        <button class="btn btn-mini" data-add="incluye">+ Agregar</button></div>
      <div id="incList"></div>
    </div>

    <div class="editor-block">
      <div class="eb-head"><b>Paquetes / Precios</b>
        <button class="btn btn-mini" data-add="paquete">+ Agregar</button></div>
      <div id="packList"></div>
    </div>
  `;

  renderBenefitsEditor(s);
  renderIncluyeEditor(s);
  renderPacksEditor(s);

  body.querySelectorAll("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const type = btn.dataset.add;
      readModalInto(s); // conservar lo escrito
      if (type === "beneficio") (s.beneficios ||= []).push({ titulo: "", detalle: "" });
      if (type === "incluye") (s.incluye ||= []).push("");
      if (type === "paquete") (s.paquetes ||= []).push({ nombre: "", precio: "$ —", detalle: "" });
      openEditor(id);
    })
  );

  $("#modal").hidden = false;
  $("#btnSave").onclick = () => {
    readModalInto(s);
    save();
    render();
    $("#modal").hidden = true;
  };
}

function renderBenefitsEditor(s) {
  const wrap = $("#benList");
  wrap.innerHTML = (s.beneficios || [])
    .map(
      (b, i) => `
      <div class="editor-block" data-ben="${i}">
        <div class="row">
          <input type="text" data-bk="titulo" value="${esc(b.titulo)}" placeholder="Título" />
          <input type="text" data-bk="detalle" value="${esc(b.detalle)}" placeholder="Detalle" />
        </div>
        <div style="text-align:right;margin-top:8px">
          <button class="btn btn-mini btn-del" data-delben="${i}">Eliminar</button>
        </div>
      </div>`
    )
    .join("");
  wrap.querySelectorAll("[data-delben]").forEach((b) =>
    b.addEventListener("click", () => {
      readModalInto(s);
      s.beneficios.splice(+b.dataset.delben, 1);
      openEditor(s.id);
    })
  );
}

function renderIncluyeEditor(s) {
  const wrap = $("#incList");
  wrap.innerHTML = (s.incluye || [])
    .map(
      (txt, i) => `
      <div class="row" data-inc="${i}" style="margin-bottom:8px">
        <input type="text" data-ik value="${esc(txt)}" placeholder="Ítem incluido" />
        <button class="btn btn-mini btn-del" data-delinc="${i}" style="flex:0 0 auto">✕</button>
      </div>`
    )
    .join("");
  wrap.querySelectorAll("[data-delinc]").forEach((b) =>
    b.addEventListener("click", () => {
      readModalInto(s);
      s.incluye.splice(+b.dataset.delinc, 1);
      openEditor(s.id);
    })
  );
}

function renderPacksEditor(s) {
  const wrap = $("#packList");
  wrap.innerHTML = (s.paquetes || [])
    .map(
      (p, i) => `
      <div class="editor-block" data-pack="${i}">
        <div class="row">
          <input type="text" data-pk="nombre" value="${esc(p.nombre)}" placeholder="Nombre" />
          <input type="text" data-pk="precio" value="${esc(p.precio)}" placeholder="Precio" />
        </div>
        <div class="field" style="margin:8px 0 0">
          <input type="text" data-pk="detalle" value="${esc(p.detalle)}" placeholder="Detalle" />
        </div>
        <div style="text-align:right;margin-top:8px">
          <button class="btn btn-mini btn-del" data-delpack="${i}">Eliminar</button>
        </div>
      </div>`
    )
    .join("");
  wrap.querySelectorAll("[data-delpack]").forEach((b) =>
    b.addEventListener("click", () => {
      readModalInto(s);
      s.paquetes.splice(+b.dataset.delpack, 1);
      openEditor(s.id);
    })
  );
}

// Lee todos los inputs del modal y los vuelca en el servicio
function readModalInto(s) {
  const body = $("#modalBody");
  body.querySelectorAll("[data-key]").forEach((el) => (s[el.dataset.key] = el.value));

  body.querySelectorAll("[data-ben]").forEach((block) => {
    const i = +block.dataset.ben;
    if (!s.beneficios[i]) return;
    block.querySelectorAll("[data-bk]").forEach((el) => (s.beneficios[i][el.dataset.bk] = el.value));
  });

  const inc = [];
  body.querySelectorAll("[data-ik]").forEach((el) => inc.push(el.value));
  if (body.querySelector("[data-ik]")) s.incluye = inc;

  body.querySelectorAll("[data-pack]").forEach((block) => {
    const i = +block.dataset.pack;
    if (!s.paquetes[i]) return;
    block.querySelectorAll("[data-pk]").forEach((el) => (s.paquetes[i][el.dataset.pk] = el.value));
  });
}

function closeModal() {
  $("#modal").hidden = true;
}

// ============================================================
//  Export / Import
// ============================================================
function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "panel-servicios.json";
  a.click();
  URL.revokeObjectURL(url);
}
function importJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.servicios) throw new Error("Formato inválido");
      state = data;
      activeId = state.servicios[0]?.id || null;
      save();
      render();
      alert("Datos importados correctamente.");
    } catch (err) {
      alert("No se pudo importar: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ============================================================
//  Eventos
// ============================================================
$("#btnEdit").addEventListener("click", toggleEdit);
$("#btnExport").addEventListener("click", exportJSON);
$("#btnImport").addEventListener("click", () => $("#fileImport").click());
$("#fileImport").addEventListener("change", (e) => {
  if (e.target.files[0]) importJSON(e.target.files[0]);
  e.target.value = "";
});
$("#btnCloseModal").addEventListener("click", closeModal);
$("#btnCancel").addEventListener("click", closeModal);

// Botón flotante para editar el servicio activo mientras estás en modo edición
const fab = document.createElement("button");
fab.className = "edit-fab";
fab.innerHTML = "✏️ Editar este servicio";
fab.addEventListener("click", () => openEditor(activeId));
document.body.appendChild(fab);

// Init
render();
syncFromCloud();

// Al volver a la pestaña, traer la última versión (lo que cargó el socio)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && !editing) syncFromCloud();
});
