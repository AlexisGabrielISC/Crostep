// ==========================================
// 1. CATÁLOGO DE PUNTOS CON SÍMBOLOS GRÁFICOS SVG OFICIALES
// ==========================================
const CATALOGO_PUNTOS = [
  {
    id: "Anillo Mágico (am)",
    nombre: "Anillo Mágico",
    abbr: "am",
    factorPuntos: 1,
    svg: `<circle cx="14" cy="14" r="8" />`
  },
  {
    id: "Punto Bajo (pb)",
    nombre: "Punto Bajo",
    abbr: "pb",
    factorPuntos: 1,
    svg: `<line x1="14" y1="6" x2="14" y2="22" /><line x1="6" y1="14" x2="22" y2="14" />`
  },
  {
    id: "Aumento (aum)",
    nombre: "Aumento",
    abbr: "aum",
    factorPuntos: 2,
    svg: `<path d="M8 6 L14 22 L20 6" /><line x1="6" y1="13" x2="13" y2="13" /><line x1="15" y1="13" x2="22" y2="13" />`
  },
  {
    id: "Disminución (dism)",
    nombre: "Disminución",
    abbr: "dism",
    factorPuntos: 1,
    svg: `<path d="M8 22 L14 6 L20 22" /><line x1="6" y1="14" x2="22" y2="14" />`
  },
  {
    id: "Cadena (cad)",
    nombre: "Cadena",
    abbr: "cad",
    factorPuntos: 1,
    svg: `<ellipse cx="14" cy="14" rx="8" ry="4.5" />`
  },
  {
    id: "Punto Deslizado (pd)",
    nombre: "Punto Deslizado",
    abbr: "pd",
    factorPuntos: 1,
    svg: `<circle cx="14" cy="14" r="3.5" fill="currentColor" />`
  },
  {
    id: "Punto Medio Alto (pma)",
    nombre: "Medio Alto",
    abbr: "pma",
    factorPuntos: 1,
    svg: `<line x1="8" y1="6" x2="20" y2="6" /><line x1="14" y1="6" x2="14" y2="23" />`
  },
  {
    id: "Punto Alto (pa)",
    nombre: "Punto Alto",
    abbr: "pa",
    factorPuntos: 1,
    svg: `<line x1="8" y1="5" x2="20" y2="5" /><line x1="14" y1="5" x2="14" y2="23" /><line x1="10" y1="14" x2="18" y2="12" />`
  },
  {
    id: "Punto Alto Doble (pad)",
    nombre: "Alto Doble",
    abbr: "pad",
    factorPuntos: 1,
    svg: `<line x1="8" y1="4" x2="20" y2="4" /><line x1="14" y1="4" x2="14" y2="24" /><line x1="10" y1="12" x2="18" y2="10" /><line x1="10" y1="17" x2="18" y2="15" />`
  },
  {
    id: "Punto Alto Triple (pat)",
    nombre: "Alto Triple",
    abbr: "pat",
    factorPuntos: 1,
    svg: `<line x1="8" y1="3" x2="20" y2="3" /><line x1="14" y1="3" x2="14" y2="25" /><line x1="10" y1="10" x2="18" y2="8" /><line x1="10" y1="14" x2="18" y2="12" /><line x1="10" y1="18" x2="18" y2="16" />`
  },
  {
    id: "Punto Picot (picot)",
    nombre: "Punto Picot",
    abbr: "picot",
    factorPuntos: 1,
    svg: `<circle cx="14" cy="11" r="6" /><circle cx="14" cy="20" r="2.5" fill="currentColor" />`
  },
  {
    id: "Abanico 3 pa (abanico)",
    nombre: "Abanico (3 pa)",
    abbr: "abanico",
    factorPuntos: 3,
    svg: `<line x1="6" y1="5" x2="22" y2="5" /><line x1="14" y1="23" x2="8" y2="5" /><line x1="14" y1="23" x2="14" y2="5" /><line x1="14" y1="23" x2="20" y2="5" /><line x1="7" y1="13" x2="21" y2="11" />`
  },
  {
    id: "Punto Popcorn (pop)",
    nombre: "Popcorn",
    abbr: "pop",
    factorPuntos: 1,
    svg: `<ellipse cx="14" cy="14" rx="7" ry="9" /><line x1="14" y1="4" x2="14" y2="24" /><line x1="6" y1="14" x2="22" y2="14" />`
  }
];

const STORAGE_KEY = "crostep_proyecto_activo_v2";

// ==========================================
// 2. MODELOS DE DATOS MULTINIVEL
// ==========================================
class InstruccionPunto {
  constructor(tipoPunto, cantidad = 1, colorId = null) {
    this.tipo_punto = tipoPunto;
    this.cantidad = parseInt(cantidad, 10) || 1;
    this.colorId = colorId;
  }

  calcularPuntosTotales() {
    const meta = CATALOGO_PUNTOS.find(p => p.id === this.tipo_punto);
    if (meta) return this.cantidad * meta.factorPuntos;
    if (this.tipo_punto.includes("Aumento") || this.tipo_punto.includes("Doble")) return this.cantidad * 2;
    return this.cantidad;
  }

  toDict() {
    return {
      tipo_punto: this.tipo_punto,
      cantidad: this.cantidad,
      colorId: this.colorId
    };
  }
}

class GrupoRepeticion {
  constructor(repeticiones = 1) {
    this.repeticiones = parseInt(repeticiones, 10) || 1;
    this.elementos = [];
  }

  agregarElemento(elemento) {
    this.elementos.push(elemento);
  }

  calcularPuntosTotales() {
    const subtotal = this.elementos.reduce((acc, el) => acc + el.calcularPuntosTotales(), 0);
    return subtotal * this.repeticiones;
  }

  toDict() {
    return {
      repeticiones: this.repeticiones,
      elementos: this.elementos.map(el => el.toDict())
    };
  }
}

class Vuelta {
  constructor(numero, nota = "") {
    this.numero = numero;
    this.instrucciones = [];
    this.nota = nota;
  }

  agregarInstruccion(inst) {
    this.instrucciones.push(inst);
  }

  totalPuntos() {
    return this.instrucciones.reduce((acc, inst) => acc + inst.calcularPuntosTotales(), 0);
  }

  toDict() {
    return {
      numero: this.numero,
      nota: this.nota,
      instrucciones: this.instrucciones.map(inst => inst.toDict())
    };
  }
}

class Pieza {
  constructor(id, nombre, cantidad = 1, colorInicialId = null) {
    this.id = id || `pieza_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.nombre = nombre;
    this.cantidad = parseInt(cantidad, 10) || 1;
    this.colorInicialId = colorInicialId;
    this.vueltas = [];
  }

  agregarVuelta(vuelta) {
    this.vueltas.push(vuelta);
  }

  eliminarVuelta(index) {
    this.vueltas.splice(index, 1);
    this.vueltas.forEach((v, i) => {
      v.numero = i + 1;
    });
  }

  toDict() {
    return {
      id: this.id,
      nombre: this.nombre,
      cantidad: this.cantidad,
      colorInicialId: this.colorInicialId,
      vueltas: this.vueltas.map(v => v.toDict())
    };
  }
}

// ==========================================
// 3. ESTADO GLOBAL DEL PROYECTO
// ==========================================
let proyecto = {
  autoria: {
    titulo: "",
    autor: "",
    fecha: new Date().toISOString().split("T")[0],
    ganchillo: "",
    notas: ""
  },
  paletaHilos: [], // [{ id, nombre, hex }]
  piezas: [],
  piezaActivaId: null
};

let puntoSeleccionadoId = CATALOGO_PUNTOS[1].id; // Punto Bajo por defecto
let colorPasoActualId = null;
let secuenciaTemporal = []; // Pasos encadenados antes de guardar la vuelta
let sugerenciaActual = null;
let accionPendienteTrasAutoria = null; // 'json' | 'pdf' | null
let modoModalPaleta = "edit"; // 'new' | 'edit'
let fotoTemporalDataUrl = null; // Solo en RAM para el PDF, jamás en localStorage

// ==========================================
// 4. REFERENCIAS DOM
// ==========================================
const lblProyectoActual = document.getElementById("lbl-proyecto-actual");
const badgeTotalVueltas = document.getElementById("badge-total-vueltas");
const piezasTabsContainer = document.getElementById("piezas-tabs-container");
const txtNombrePieza = document.getElementById("txt-nombre-pieza");
const txtCantidadPieza = document.getElementById("txt-cantidad-pieza");
const piezaColorInicialPills = document.getElementById("pieza-color-inicial-pills");
const pasoColorPills = document.getElementById("paso-color-pills");
const stitchRadioGrid = document.getElementById("stitch-radio-grid");
const txtCantidad = document.getElementById("txt-cantidad");
const txtRepeticiones = document.getElementById("txt-repeticiones");
const txtNotaVuelta = document.getElementById("txt-nota-vuelta");
const colElementosGrupo = document.getElementById("col-elementos-grupo");
const btnLimpiarSecuencia = document.getElementById("btn-limpiar-secuencia");
const btnPiezaTargetName = document.getElementById("btn-pieza-target-name");
const lblVistaPreviaTitulo = document.getElementById("lbl-vista-previa-titulo");
const colPatronVista = document.getElementById("col-patron-vista");
const chkVistaClasica = document.getElementById("chk-vista-clasica");
const classicalLiveBox = document.getElementById("classical-live-box");
const suggestionTextEl = document.getElementById("suggestion-text");
const toastEl = document.getElementById("toast");

// ==========================================
// 5. PERSISTENCIA EN LOCALSTORAGE
// ==========================================
function guardarEnLocalStorage() {
  try {
    const serializado = {
      autoria: proyecto.autoria,
      paletaHilos: proyecto.paletaHilos,
      piezaActivaId: proyecto.piezaActivaId,
      piezas: proyecto.piezas.map(p => p.toDict())
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializado));
  } catch (e) {
    console.warn("No se pudo guardar en localStorage:", e);
  }
}

function hidratarPiezaDesdeDict(pData) {
  const pieza = new Pieza(pData.id, pData.nombre || "Pieza", pData.cantidad || 1, pData.colorInicialId || null);
  (pData.vueltas || []).forEach((vData, idx) => {
    const v = new Vuelta(vData.numero || idx + 1, vData.nota || "");
    (vData.instrucciones || []).forEach(instData => {
      if (instData.elementos) {
        const g = new GrupoRepeticion(instData.repeticiones || 1);
        instData.elementos.forEach(sub => {
          g.agregarElemento(new InstruccionPunto(sub.tipo_punto, sub.cantidad, sub.colorId || null));
        });
        v.agregarInstruccion(g);
      } else {
        v.agregarInstruccion(new InstruccionPunto(instData.tipo_punto, instData.cantidad, instData.colorId || null));
      }
    });
    pieza.agregarVuelta(v);
  });
  return pieza;
}

function cargarDesdeLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    proyecto.autoria = {
      titulo: data.autoria?.titulo || "",
      autor: data.autoria?.autor || "",
      fecha: data.autoria?.fecha || new Date().toISOString().split("T")[0],
      ganchillo: data.autoria?.ganchillo || "",
      notas: data.autoria?.notas || ""
    };
    proyecto.paletaHilos = Array.isArray(data.paletaHilos) ? data.paletaHilos : [];
    proyecto.piezas = (data.piezas || []).map(hidratarPiezaDesdeDict);

    if (proyecto.piezas.length === 0) {
      const pDefault = new Pieza(null, "Cuerpo Principal", 1, proyecto.paletaHilos[0]?.id || null);
      proyecto.piezas.push(pDefault);
    }

    proyecto.piezaActivaId = proyecto.piezas.some(p => p.id === data.piezaActivaId)
      ? data.piezaActivaId
      : proyecto.piezas[0].id;

    return true;
  } catch (e) {
    console.error("Error leyendo localStorage:", e);
    return false;
  }
}

function getPiezaActiva() {
  let pieza = proyecto.piezas.find(p => p.id === proyecto.piezaActivaId);
  if (!pieza && proyecto.piezas.length > 0) {
    pieza = proyecto.piezas[0];
    proyecto.piezaActivaId = pieza.id;
  }
  return pieza;
}

function getHiloById(id) {
  return proyecto.paletaHilos.find(h => h.id === id) || proyecto.paletaHilos[0] || { id: "default", nombre: "Color Base", hex: "#9d7cd8" };
}

// ==========================================
// 6. UTILIDADES UI
// ==========================================
function mostrarToast(mensaje) {
  toastEl.textContent = mensaje;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 3000);
}

function configurarStepper(inputEl, btnDec, btnInc, minVal = 1, onChange = null) {
  btnDec.addEventListener("click", () => {
    const val = parseInt(inputEl.value, 10) || minVal;
    if (val > minVal) {
      inputEl.value = val - 1;
      if (onChange) onChange(parseInt(inputEl.value, 10));
    }
  });
  btnInc.addEventListener("click", () => {
    const val = parseInt(inputEl.value, 10) || minVal;
    inputEl.value = val + 1;
    if (onChange) onChange(parseInt(inputEl.value, 10));
  });
  inputEl.addEventListener("change", () => {
    const val = parseInt(inputEl.value, 10);
    inputEl.value = (!isNaN(val) && val >= minVal) ? val : minVal;
    if (onChange) onChange(parseInt(inputEl.value, 10));
  });
}

function crearSelectPuntos(valorSeleccionado, claseExtra = "") {
  const select = document.createElement("select");
  select.className = `neo-select ${claseExtra}`.trim();
  CATALOGO_PUNTOS.forEach(pt => {
    const opt = document.createElement("option");
    opt.value = pt.id;
    opt.textContent = `${pt.nombre} (${pt.abbr})`;
    if (pt.id === valorSeleccionado) opt.selected = true;
    select.appendChild(opt);
  });
  return select;
}

function crearSelectHilos(valorSeleccionado, claseExtra = "") {
  const select = document.createElement("select");
  select.className = `neo-select ${claseExtra}`.trim();
  select.style.width = "auto";
  select.style.maxWidth = "130px";
  proyecto.paletaHilos.forEach(h => {
    const opt = document.createElement("option");
    opt.value = h.id;
    opt.textContent = `● ${h.nombre}`;
    opt.style.color = h.hex;
    if (h.id === valorSeleccionado) opt.selected = true;
    select.appendChild(opt);
  });
  return select;
}

// ==========================================
// 7. MOTOR DE DETECCIÓN LÓGICA DE PATRONES
// ==========================================
function calcularSugerenciaLogica(pieza) {
  const n = pieza.vueltas.length;
  const colorActual = colorPasoActualId || pieza.colorInicialId || proyecto.paletaHilos[0]?.id;

  // Caso 0: Pieza vacía -> Anillo Mágico de 6 pb
  if (n === 0) {
    return {
      texto: "Vuelta 1: Anillo Mágico de 6 puntos bajos (6 pts)",
      crearVuelta: () => {
        const v = new Vuelta(1);
        v.agregarInstruccion(new InstruccionPunto("Anillo Mágico (am)", 6, colorActual));
        return v;
      }
    };
  }

  const ultimaVuelta = pieza.vueltas[n - 1];
  const ptsUltima = ultimaVuelta.totalPuntos();

  // Detectar base de anillo mágico inicial (ej. 6 u 8)
  let baseAM = 6;
  const primeraInst = pieza.vueltas[0]?.instrucciones[0];
  if (primeraInst && primeraInst.tipo_punto === "Anillo Mágico (am)") {
    baseAM = primeraInst.cantidad;
  }

  // Caso 1: Después de AM -> Base de aumentos (ej. 6 aum = 12 pts)
  if (n === 1 && primeraInst && primeraInst.tipo_punto === "Anillo Mágico (am)") {
    return {
      texto: `Vuelta 2: ${baseAM} aumentos (${baseAM * 2} pts)`,
      crearVuelta: () => {
        const v = new Vuelta(2);
        v.agregarInstruccion(new InstruccionPunto("Aumento (aum)", baseAM, colorActual));
        return v;
      }
    };
  }

  // Analizar si la última vuelta fue una progresión de aumentos: (k pb, 1 aum) x baseAM
  const inst0 = ultimaVuelta.instrucciones[0];
  if (inst0 instanceof GrupoRepeticion && inst0.repeticiones === baseAM && inst0.elementos.length === 2) {
    const [e1, e2] = inst0.elementos;
    if (e1.tipo_punto === "Punto Bajo (pb)" && e2.tipo_punto === "Aumento (aum)" && e2.cantidad === 1) {
      const siguientePb = e1.cantidad + 1;
      const totalEsperado = baseAM * (siguientePb + 2);
      // Sugerir siguiente aumento hasta 5 pb, o vuelta recta si ya creció bastante
      if (siguientePb <= 5) {
        return {
          texto: `Vuelta ${n + 1}: (${siguientePb} pb, 1 aum) x ${baseAM} (${totalEsperado} pts)`,
          crearVuelta: () => {
            const v = new Vuelta(n + 1);
            const g = new GrupoRepeticion(baseAM);
            g.agregarElemento(new InstruccionPunto("Punto Bajo (pb)", siguientePb, colorActual));
            g.agregarElemento(new InstruccionPunto("Aumento (aum)", 1, colorActual));
            v.agregarInstruccion(g);
            return v;
          }
        };
      } else {
        return {
          texto: `Vuelta ${n + 1}: Vuelta recta de ${ptsUltima} pb (${ptsUltima} pts)`,
          crearVuelta: () => {
            const v = new Vuelta(n + 1);
            v.agregarInstruccion(new InstruccionPunto("Punto Bajo (pb)", ptsUltima, colorActual));
            return v;
          }
        };
      }
    }

    // Analizar si la última vuelta fue una progresión de disminuciones: (k pb, 1 dism) x baseAM
    if (e1.tipo_punto === "Punto Bajo (pb)" && e2.tipo_punto === "Disminución (dism)" && e2.cantidad === 1) {
      const siguientePb = e1.cantidad - 1;
      if (siguientePb >= 1) {
        const totalEsperado = baseAM * (siguientePb + 1);
        return {
          texto: `Vuelta ${n + 1}: (${siguientePb} pb, 1 dism) x ${baseAM} (${totalEsperado} pts)`,
          crearVuelta: () => {
            const v = new Vuelta(n + 1);
            const g = new GrupoRepeticion(baseAM);
            g.agregarElemento(new InstruccionPunto("Punto Bajo (pb)", siguientePb, colorActual));
            g.agregarElemento(new InstruccionPunto("Disminución (dism)", 1, colorActual));
            v.agregarInstruccion(g);
            return v;
          }
        };
      } else {
        return {
          texto: `Vuelta ${n + 1}: ${baseAM} disminuciones para cerrar (${baseAM} pts)`,
          crearVuelta: () => {
            const v = new Vuelta(n + 1);
            v.agregarInstruccion(new InstruccionPunto("Disminución (dism)", baseAM, colorActual));
            return v;
          }
        };
      }
    }
  }

  // Caso 2: Después de (baseAM aumentos) -> (1 pb, 1 aum) x baseAM
  if (n === 2 && inst0 && inst0.tipo_punto === "Aumento (aum)" && inst0.cantidad === baseAM) {
    const totalEsperado = baseAM * 3;
    return {
      texto: `Vuelta 3: (1 pb, 1 aum) x ${baseAM} (${totalEsperado} pts)`,
      crearVuelta: () => {
        const v = new Vuelta(3);
        const g = new GrupoRepeticion(baseAM);
        g.agregarElemento(new InstruccionPunto("Punto Bajo (pb)", 1, colorActual));
        g.agregarElemento(new InstruccionPunto("Aumento (aum)", 1, colorActual));
        v.agregarInstruccion(g);
        return v;
      }
    };
  }

  // Caso por defecto: Continuar altura con puntos bajos rectos
  return {
    texto: `Vuelta ${n + 1}: 1 pb en cada punto (${ptsUltima} pts)`,
    crearVuelta: () => {
      const v = new Vuelta(n + 1);
      v.agregarInstruccion(new InstruccionPunto("Punto Bajo (pb)", ptsUltima, colorActual));
      return v;
    }
  };
}

function actualizarBannerSugerencia() {
  const pieza = getPiezaActiva();
  if (!pieza) return;
  sugerenciaActual = calcularSugerenciaLogica(pieza);
  suggestionTextEl.textContent = sugerenciaActual.texto;
}

// ==========================================
// 8. RENDERIZADO DE SELECTORES (RADIO BUTTONS & COLORES)
// ==========================================
function renderizarRadioButtonsPuntos() {
  stitchRadioGrid.innerHTML = "";
  CATALOGO_PUNTOS.forEach(pt => {
    const label = document.createElement("label");
    label.className = "stitch-radio-label";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "tipo-punto-radio";
    input.value = pt.id;
    if (pt.id === puntoSeleccionadoId) input.checked = true;

    input.addEventListener("change", () => {
      puntoSeleccionadoId = pt.id;
      // Si selecciona Anillo Mágico, sugerir cantidad 6 automáticamente
      if (pt.id === "Anillo Mágico (am)" && parseInt(txtCantidad.value, 10) === 1) {
        txtCantidad.value = 6;
      }
    });

    const card = document.createElement("div");
    card.className = "stitch-radio-card";
    card.innerHTML = `
      <svg class="stitch-symbol-svg" viewBox="0 0 28 28" aria-hidden="true">
        ${pt.svg}
      </svg>
      <span class="stitch-name">${pt.nombre}</span>
      <span class="stitch-abbr">(${pt.abbr})</span>
    `;

    label.append(input, card);
    stitchRadioGrid.appendChild(label);
  });
}

function renderizarPildorasColores() {
  const pieza = getPiezaActiva();
  if (!pieza) return;

  if (!pieza.colorInicialId && proyecto.paletaHilos.length > 0) {
    pieza.colorInicialId = proyecto.paletaHilos[0].id;
  }
  if (!colorPasoActualId || !proyecto.paletaHilos.some(h => h.id === colorPasoActualId)) {
    colorPasoActualId = pieza.colorInicialId || proyecto.paletaHilos[0]?.id;
  }

  // 1. Píldoras de color inicial de la pieza
  piezaColorInicialPills.innerHTML = "";
  proyecto.paletaHilos.forEach(hilo => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = `yarn-pill ${pieza.colorInicialId === hilo.id ? "selected" : ""}`;
    pill.innerHTML = `<span class="yarn-swatch" style="background:${hilo.hex}"></span>${hilo.nombre}`;
    pill.addEventListener("click", () => {
      pieza.colorInicialId = hilo.id;
      colorPasoActualId = hilo.id;
      guardarEnLocalStorage();
      renderizarPildorasColores();
      actualizarVistaPatron();
    });
    piezaColorInicialPills.appendChild(pill);
  });

  // 2. Píldoras de color para el paso/punto actual
  pasoColorPills.innerHTML = "";
  proyecto.paletaHilos.forEach(hilo => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = `yarn-pill ${colorPasoActualId === hilo.id ? "selected" : ""}`;
    pill.innerHTML = `<span class="yarn-swatch" style="background:${hilo.hex}"></span>${hilo.nombre}`;
    pill.addEventListener("click", () => {
      colorPasoActualId = hilo.id;
      renderizarPildorasColores();
      actualizarBannerSugerencia();
    });
    pasoColorPills.appendChild(pill);
  });
}

// ==========================================
// 9. GESTIÓN Y NAVEGACIÓN DE PIEZAS
// ==========================================
function renderizarTabsPiezas() {
  piezasTabsContainer.innerHTML = "";
  const piezaActiva = getPiezaActiva();

  proyecto.piezas.forEach(p => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `pieza-tab ${p.id === piezaActiva.id ? "active" : ""}`;

    const hilo = getHiloById(p.colorInicialId);
    const labelText = p.cantidad > 1 ? `${p.nombre} (x${p.cantidad})` : p.nombre;

    tab.innerHTML = `
      <span class="yarn-swatch" style="background:${hilo.hex}"></span>
      <span>${labelText}</span>
    `;

    tab.addEventListener("click", () => {
      cambiarPiezaActiva(p.id);
    });

    if (proyecto.piezas.length > 1) {
      const delSpan = document.createElement("span");
      delSpan.className = "tab-del";
      delSpan.title = "Eliminar pieza";
      delSpan.textContent = "✕";
      delSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        eliminarPieza(p.id);
      });
      tab.appendChild(delSpan);
    }

    piezasTabsContainer.appendChild(tab);
  });
}

function cambiarPiezaActiva(piezaId) {
  proyecto.piezaActivaId = piezaId;
  secuenciaTemporal = [];
  actualizarVistaSecuencia();

  const pieza = getPiezaActiva();
  txtNombrePieza.value = pieza.nombre;
  txtCantidadPieza.value = pieza.cantidad;
  colorPasoActualId = pieza.colorInicialId || proyecto.paletaHilos[0]?.id;

  guardarEnLocalStorage();
  sincronizarInterfazCompleta();
}

function crearNuevaPieza() {
  const num = proyecto.piezas.length + 1;
  const defaultColor = proyecto.paletaHilos[0]?.id || null;
  const nueva = new Pieza(null, `Pieza ${num}`, 1, defaultColor);
  proyecto.piezas.push(nueva);
  cambiarPiezaActiva(nueva.id);
  txtNombrePieza.focus();
  txtNombrePieza.select();
  mostrarToast(`Pieza "${nueva.nombre}" creada`);
}

function eliminarPieza(piezaId) {
  if (proyecto.piezas.length <= 1) return;
  proyecto.piezas = proyecto.piezas.filter(p => p.id !== piezaId);
  if (proyecto.piezaActivaId === piezaId) {
    proyecto.piezaActivaId = proyecto.piezas[0].id;
  }
  guardarEnLocalStorage();
  sincronizarInterfazCompleta();
  mostrarToast("Pieza eliminada");
}

// ==========================================
// 10. SECUENCIA TEMPORAL Y VISTA PREVIA
// ==========================================
function actualizarVistaSecuencia() {
  colElementosGrupo.innerHTML = "";
  btnLimpiarSecuencia.style.display = secuenciaTemporal.length > 0 ? "inline-flex" : "none";

  if (secuenciaTemporal.length === 0) {
    colElementosGrupo.innerHTML = `<div class="empty-hint">Paso único seleccionado. Usa "Encadenar otro punto" si deseas combinar puntos (ej. 1 pb + 1 aum) antes de guardar la vuelta.</div>`;
    return;
  }

  secuenciaTemporal.forEach((el, idx) => {
    const row = document.createElement("div");
    row.className = "sub-item-row";

    const selColor = crearSelectHilos(el.colorId, "neo-select-sm");
    selColor.addEventListener("change", (e) => {
      secuenciaTemporal[idx].colorId = e.target.value;
    });

    const ddSub = crearSelectPuntos(el.tipo_punto, "neo-select-sm");
    ddSub.addEventListener("change", (e) => {
      secuenciaTemporal[idx].tipo_punto = e.target.value;
    });

    const txtSubCant = document.createElement("input");
    txtSubCant.type = "number";
    txtSubCant.min = "1";
    txtSubCant.value = el.cantidad;
    txtSubCant.className = "neo-input neo-input-sm";
    txtSubCant.addEventListener("change", (e) => {
      const val = parseInt(e.target.value, 10);
      secuenciaTemporal[idx].cantidad = (!isNaN(val) && val > 0) ? val : 1;
      e.target.value = secuenciaTemporal[idx].cantidad;
    });

    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "neo-btn neo-btn-danger";
    btnDel.textContent = "🗑";
    btnDel.addEventListener("click", () => {
      secuenciaTemporal.splice(idx, 1);
      actualizarVistaSecuencia();
    });

    row.append(selColor, ddSub, txtSubCant, btnDel);
    colElementosGrupo.appendChild(row);
  });
}

function formatearInstruccionClasica(inst, colorContextoId) {
  if (inst instanceof GrupoRepeticion) {
    const partes = inst.elementos.map(el => formatearInstruccionClasica(el, colorContextoId));
    const contenido = partes.join(", ");
    return inst.repeticiones > 1 ? `* ${contenido} * rep ${inst.repeticiones} veces` : contenido;
  }

  const meta = CATALOGO_PUNTOS.find(p => p.id === inst.tipo_punto);
  const abbr = meta ? meta.abbr : inst.tipo_punto;
  let texto = "";

  if (inst.tipo_punto === "Anillo Mágico (am)") {
    texto = `Anillo mágico de ${inst.cantidad} pb`;
  } else if (inst.tipo_punto === "Aumento (aum)") {
    texto = inst.cantidad === 1 ? "1 aum" : `${inst.cantidad} aumentos`;
  } else if (inst.tipo_punto === "Disminución (dism)") {
    texto = inst.cantidad === 1 ? "1 dism" : `${inst.cantidad} disminuciones`;
  } else {
    texto = `${inst.cantidad} ${abbr}`;
  }

  if (inst.colorId && inst.colorId !== colorContextoId) {
    const hilo = getHiloById(inst.colorId);
    texto += ` [en ${hilo.nombre}]`;
  }
  return texto;
}

function generarTextoClasicoPieza(pieza) {
  const hiloInicial = getHiloById(pieza.colorInicialId);
  const tituloPieza = pieza.cantidad > 1
    ? `${pieza.nombre.toUpperCase()} (HACER ${pieza.cantidad})`
    : pieza.nombre.toUpperCase();

  let lineas = [];
  lineas.push(tituloPieza);
  lineas.push(`COLOR ${hiloInicial.nombre.toUpperCase()}`);

  let colorVigente = pieza.colorInicialId;

  pieza.vueltas.forEach(v => {
    // Detectar si toda la vuelta cambió de color respecto a la anterior
    const primerElem = v.instrucciones[0] instanceof GrupoRepeticion
      ? v.instrucciones[0].elementos[0]
      : v.instrucciones[0];

    if (primerElem && primerElem.colorId && primerElem.colorId !== colorVigente) {
      colorVigente = primerElem.colorId;
      const nuevoHilo = getHiloById(colorVigente);
      lineas.push(`CAMBIAMOS A COLOR ${nuevoHilo.nombre.toUpperCase()}`);
    }

    const desc = v.instrucciones.map(i => formatearInstruccionClasica(i, colorVigente)).join(", ");
    let lineaVuelta = `${v.numero}.- ${desc} (${v.totalPuntos()})`;
    if (v.nota) lineaVuelta += ` — ${v.nota}`;
    lineas.push(lineaVuelta);
  });

  return lineas.join("\n");
}

function actualizarVistaPatron() {
  const pieza = getPiezaActiva();
  if (!pieza) return;

  colPatronVista.innerHTML = "";
  const totalVueltasProyecto = proyecto.piezas.reduce((acc, p) => acc + p.vueltas.length, 0);
  badgeTotalVueltas.textContent = `${pieza.vueltas.length} Vuelta${pieza.vueltas.length === 1 ? "" : "s"} (${totalVueltasProyecto} total)`;

  const labelPieza = pieza.cantidad > 1 ? `${pieza.nombre} (x${pieza.cantidad})` : pieza.nombre;
  btnPiezaTargetName.textContent = labelPieza;
  lblVistaPreviaTitulo.textContent = `📋 2. Vista Previa: ${labelPieza}`;

  if (chkVistaClasica.checked) {
    classicalLiveBox.style.display = "block";
    classicalLiveBox.textContent = generarTextoClasicoPieza(pieza);
  } else {
    classicalLiveBox.style.display = "none";
  }

  actualizarBannerSugerencia();

  if (pieza.vueltas.length === 0) {
    colPatronVista.innerHTML = `<div class="empty-hint">Aún no has agregado vueltas a "${pieza.nombre}".</div>`;
    return;
  }

  pieza.vueltas.forEach((v, vIndex) => {
    const card = document.createElement("div");
    card.className = "vuelta-card";

    // Determinar color predominante de la vuelta para el borde lateral
    const primerElem = v.instrucciones[0] instanceof GrupoRepeticion
      ? v.instrucciones[0].elementos[0]
      : v.instrucciones[0];
    const hiloVuelta = getHiloById(primerElem?.colorId || pieza.colorInicialId);
    card.style.borderLeftColor = hiloVuelta.hex;

    const header = document.createElement("div");
    header.className = "vuelta-header";

    const titleSpan = document.createElement("span");
    titleSpan.className = "vuelta-badge";
    titleSpan.innerHTML = `
      Vuelta ${v.numero}
      <span class="pts-pill">${v.totalPuntos()} pts</span>
      <span class="color-tag-mini"><span class="yarn-swatch" style="background:${hiloVuelta.hex}"></span>${hiloVuelta.nombre}</span>
    `;

    const btnDelVuelta = document.createElement("button");
    btnDelVuelta.type = "button";
    btnDelVuelta.className = "neo-btn neo-btn-danger";
    btnDelVuelta.title = "Eliminar vuelta";
    btnDelVuelta.textContent = "🗑";
    btnDelVuelta.addEventListener("click", () => {
      pieza.eliminarVuelta(vIndex);
      guardarEnLocalStorage();
      actualizarVistaPatron();
    });

    header.append(titleSpan, btnDelVuelta);
    card.appendChild(header);

    // Instrucciones editables en vivo
    v.instrucciones.forEach((inst, instIdx) => {
      if (inst instanceof GrupoRepeticion) {
        const grupoBox = document.createElement("div");
        grupoBox.className = "grupo-box";

        const gHeader = document.createElement("div");
        gHeader.className = "grupo-box-header";
        gHeader.innerHTML = `<span>Secuencia repetida:</span> <span>x</span>`;

        const txtRepG = document.createElement("input");
        txtRepG.type = "number";
        txtRepG.min = "1";
        txtRepG.value = inst.repeticiones;
        txtRepG.className = "neo-input neo-input-sm";
        txtRepG.style.width = "64px";
        txtRepG.addEventListener("change", (e) => {
          const val = parseInt(e.target.value, 10);
          pieza.vueltas[vIndex].instrucciones[instIdx].repeticiones = (!isNaN(val) && val > 0) ? val : 1;
          guardarEnLocalStorage();
          actualizarVistaPatron();
        });

        gHeader.appendChild(txtRepG);
        grupoBox.appendChild(gHeader);

        inst.elementos.forEach((elem, subIdx) => {
          const subRow = document.createElement("div");
          subRow.className = "inst-simple-row";

          const selColor = crearSelectHilos(elem.colorId || pieza.colorInicialId, "neo-select-sm");
          selColor.addEventListener("change", (e) => {
            pieza.vueltas[vIndex].instrucciones[instIdx].elementos[subIdx].colorId = e.target.value;
            guardarEnLocalStorage();
            actualizarVistaPatron();
          });

          const ddElemTipo = crearSelectPuntos(elem.tipo_punto, "neo-select-sm");
          ddElemTipo.addEventListener("change", (e) => {
            pieza.vueltas[vIndex].instrucciones[instIdx].elementos[subIdx].tipo_punto = e.target.value;
            guardarEnLocalStorage();
            actualizarVistaPatron();
          });

          const txtElemCant = document.createElement("input");
          txtElemCant.type = "number";
          txtElemCant.min = "1";
          txtElemCant.value = elem.cantidad;
          txtElemCant.className = "neo-input neo-input-sm";
          txtElemCant.addEventListener("change", (e) => {
            const val = parseInt(e.target.value, 10);
            pieza.vueltas[vIndex].instrucciones[instIdx].elementos[subIdx].cantidad = (!isNaN(val) && val > 0) ? val : 1;
            guardarEnLocalStorage();
            actualizarVistaPatron();
          });

          subRow.append(selColor, ddElemTipo, txtElemCant);
          grupoBox.appendChild(subRow);
        });

        card.appendChild(grupoBox);
      } else {
        const simpleRow = document.createElement("div");
        simpleRow.className = "inst-simple-row";

        const selColor = crearSelectHilos(inst.colorId || pieza.colorInicialId, "neo-select-sm");
        selColor.addEventListener("change", (e) => {
          pieza.vueltas[vIndex].instrucciones[instIdx].colorId = e.target.value;
          guardarEnLocalStorage();
          actualizarVistaPatron();
        });

        const ddT = crearSelectPuntos(inst.tipo_punto, "neo-select-sm");
        ddT.addEventListener("change", (e) => {
          pieza.vueltas[vIndex].instrucciones[instIdx].tipo_punto = e.target.value;
          guardarEnLocalStorage();
          actualizarVistaPatron();
        });

        const txtC = document.createElement("input");
        txtC.type = "number";
        txtC.min = "1";
        txtC.value = inst.cantidad;
        txtC.className = "neo-input neo-input-sm";
        txtC.addEventListener("change", (e) => {
          const val = parseInt(e.target.value, 10);
          pieza.vueltas[vIndex].instrucciones[instIdx].cantidad = (!isNaN(val) && val > 0) ? val : 1;
          guardarEnLocalStorage();
          actualizarVistaPatron();
        });

        simpleRow.append(selColor, ddT, txtC);
        card.appendChild(simpleRow);
      }
    });

    if (v.nota) {
      const notaDiv = document.createElement("div");
      notaDiv.className = "vuelta-nota-text";
      notaDiv.textContent = `📌 Nota: ${v.nota}`;
      card.appendChild(notaDiv);
    }

    colPatronVista.appendChild(card);
  });
}

function sincronizarInterfazCompleta() {
  const pieza = getPiezaActiva();
  lblProyectoActual.textContent = proyecto.autoria.titulo
    ? `${proyecto.autoria.titulo} ${proyecto.autoria.autor ? "• por " + proyecto.autoria.autor : ""}`
    : "Proyecto sin título";

  txtNombrePieza.value = pieza.nombre;
  txtCantidadPieza.value = pieza.cantidad;

  renderizarTabsPiezas();
  renderizarPildorasColores();
  actualizarVistaSecuencia();
  actualizarVistaPatron();
}

// ==========================================
// 11. MODALES: PALETA DE HILOS Y AUTORÍA
// ==========================================
const modalPaleta = document.getElementById("modal-paleta");
const listaHilosConfig = document.getElementById("lista-hilos-config");
let hilosBorrador = [];

function renderizarListaHilosModal() {
  listaHilosConfig.innerHTML = "";
  if (hilosBorrador.length === 0) {
    listaHilosConfig.innerHTML = `<div class="empty-hint">Agrega al menos un hilo/color para continuar.</div>`;
    return;
  }
  hilosBorrador.forEach((h, idx) => {
    const item = document.createElement("div");
    item.className = "yarn-config-item";
    item.innerHTML = `
      <div class="yarn-config-left">
        <span class="yarn-swatch" style="width:18px;height:18px;background:${h.hex}"></span>
        <span>${h.nombre}</span>
        <span class="helper-small">(${h.hex})</span>
      </div>
    `;
    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "neo-btn neo-btn-danger neo-btn-sm";
    btnDel.textContent = "🗑";
    btnDel.addEventListener("click", () => {
      hilosBorrador.splice(idx, 1);
      renderizarListaHilosModal();
    });
    item.appendChild(btnDel);
    listaHilosConfig.appendChild(item);
  });
}

function abrirModalPaleta(modo = "edit") {
  modoModalPaleta = modo;
  const tituloWrap = document.getElementById("nuevo-proyecto-nombre-wrap");
  const modalTitulo = document.getElementById("modal-paleta-titulo");

  if (modo === "new") {
    modalTitulo.textContent = "🧶 Nuevo Proyecto — Paleta de Hilos Obligatoria";
    tituloWrap.style.display = "block";
    document.getElementById("txt-nuevo-proyecto-titulo").value = "";
    hilosBorrador = [
      { id: `hilo_${Date.now()}_1`, nombre: "Color Principal", hex: "#6ec4a7" }
    ];
  } else {
    modalTitulo.textContent = "🎨 Gestionar Paleta de Hilos y Colores";
    tituloWrap.style.display = "none";
    hilosBorrador = proyecto.paletaHilos.map(h => ({ ...h }));
  }

  renderizarListaHilosModal();
  modalPaleta.classList.add("open");
}

document.getElementById("btn-add-yarn").addEventListener("click", () => {
  const hex = document.getElementById("inp-yarn-color").value;
  const nombreInput = document.getElementById("txt-yarn-name");
  const nombre = nombreInput.value.trim();

  if (!nombre) {
    mostrarToast("Escribe un nombre o tipo de hilo");
    nombreInput.focus();
    return;
  }

  hilosBorrador.push({
    id: `hilo_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    nombre,
    hex
  });
  nombreInput.value = "";
  renderizarListaHilosModal();
});

document.getElementById("btn-confirmar-paleta").addEventListener("click", () => {
  if (hilosBorrador.length === 0) {
    mostrarToast("⚠️ Debes configurar al menos un color de hilo");
    return;
  }

  if (modoModalPaleta === "new") {
    const nuevoTitulo = document.getElementById("txt-nuevo-proyecto-titulo").value.trim();
    if (!nuevoTitulo) {
      mostrarToast("⚠️ Ingresa el título del nuevo proyecto");
      document.getElementById("txt-nuevo-proyecto-titulo").focus();
      return;
    }

    const primerHiloId = hilosBorrador[0].id;
    const piezaInicial = new Pieza(null, "Cuerpo Principal", 1, primerHiloId);

    proyecto = {
      autoria: {
        titulo: nuevoTitulo,
        autor: proyecto.autoria.autor || "",
        fecha: new Date().toISOString().split("T")[0],
        ganchillo: "",
        notas: ""
      },
      paletaHilos: hilosBorrador,
      piezas: [piezaInicial],
      piezaActivaId: piezaInicial.id
    };
    colorPasoActualId = primerHiloId;
    secuenciaTemporal = [];
    mostrarToast(`Proyecto "${nuevoTitulo}" iniciado`);
  } else {
    proyecto.paletaHilos = hilosBorrador;
  }

  modalPaleta.classList.remove("open");
  guardarEnLocalStorage();
  sincronizarInterfazCompleta();
});

document.getElementById("btn-cerrar-paleta").addEventListener("click", () => {
  if (proyecto.paletaHilos.length === 0) {
    mostrarToast("⚠️ Configura al menos un hilo antes de cerrar");
    return;
  }
  modalPaleta.classList.remove("open");
});

// Modal Autoría
const modalAutoria = document.getElementById("modal-autoria");

function esAutoriaCompleta() {
  return Boolean(
    proyecto.autoria.titulo?.trim() &&
    proyecto.autoria.autor?.trim() &&
    proyecto.autoria.fecha?.trim()
  );
}

function abrirModalAutoria(pendiente = null) {
  accionPendienteTrasAutoria = pendiente;
  document.getElementById("txt-autoria-titulo").value = proyecto.autoria.titulo || "";
  document.getElementById("txt-autoria-autor").value = proyecto.autoria.autor || "";
  document.getElementById("txt-autoria-fecha").value = proyecto.autoria.fecha || new Date().toISOString().split("T")[0];
  document.getElementById("txt-autoria-ganchillo").value = proyecto.autoria.ganchillo || "";
  document.getElementById("txt-autoria-notas").value = proyecto.autoria.notas || "";

  document.getElementById("autoria-aviso").textContent = pendiente
    ? "⚠️ Para exportar tu patrón por primera vez, completa los datos obligatorios (*)."
    : "Edita los metadatos y créditos de tu diseño de crochet.";

  modalAutoria.classList.add("open");
}

document.getElementById("btn-guardar-autoria").addEventListener("click", () => {
  const titulo = document.getElementById("txt-autoria-titulo").value.trim();
  const autor = document.getElementById("txt-autoria-autor").value.trim();
  const fecha = document.getElementById("txt-autoria-fecha").value.trim();
  const ganchillo = document.getElementById("txt-autoria-ganchillo").value.trim();
  const notas = document.getElementById("txt-autoria-notas").value.trim();

  if (!titulo || !autor || !fecha) {
    mostrarToast("⚠️ Título, Autor y Fecha son campos obligatorios");
    return;
  }

  proyecto.autoria = { titulo, autor, fecha, ganchillo, notas };
  guardarEnLocalStorage();
  sincronizarInterfazCompleta();
  modalAutoria.classList.remove("open");
  mostrarToast("Datos de autoría guardados");

  const pendiente = accionPendienteTrasAutoria;
  accionPendienteTrasAutoria = null;
  if (pendiente === "json") ejecutarExportacionJSON();
  if (pendiente === "pdf") abrirModalPDF();
});

document.getElementById("btn-cerrar-autoria").addEventListener("click", () => {
  accionPendienteTrasAutoria = null;
  modalAutoria.classList.remove("open");
});

// ==========================================
// 12. EXPORTACIÓN / IMPORTACIÓN JSON GLOBAL
// ==========================================
function ejecutarExportacionJSON() {
  const payload = {
    version: "2.0",
    app: "Crostep",
    autoria: proyecto.autoria,
    paletaHilos: proyecto.paletaHilos,
    piezaActivaId: proyecto.piezaActivaId,
    piezas: proyecto.piezas.map(p => p.toDict())
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug = (proyecto.autoria.titulo || "patron_crostep").toLowerCase().replace(/[^a-z0-9]+/g, "_");
  a.href = url;
  a.download = `${slug}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  mostrarToast("Proyecto multipieza exportado en JSON");
}

document.getElementById("btn-exportar").addEventListener("click", () => {
  if (!esAutoriaCompleta()) {
    abrirModalAutoria("json");
    return;
  }
  ejecutarExportacionJSON();
});

const fileInputJson = document.getElementById("file-input-json");
document.getElementById("btn-importar").addEventListener("click", () => fileInputJson.click());

fileInputJson.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);

      // Compatibilidad tanto con JSON v2 multipieza como v1 monopieza
      if (Array.isArray(data.piezas) && data.piezas.length > 0) {
        proyecto.autoria = {
          titulo: data.autoria?.titulo || "",
          autor: data.autoria?.autor || "",
          fecha: data.autoria?.fecha || new Date().toISOString().split("T")[0],
          ganchillo: data.autoria?.ganchillo || "",
          notas: data.autoria?.notas || ""
        };
        proyecto.paletaHilos = (Array.isArray(data.paletaHilos) && data.paletaHilos.length > 0)
          ? data.paletaHilos
          : [{ id: "hilo_default", nombre: "Color Base", hex: "#6ec4a7" }];

        proyecto.piezas = data.piezas.map(hidratarPiezaDesdeDict);
        proyecto.piezaActivaId = proyecto.piezas.some(p => p.id === data.piezaActivaId)
          ? data.piezaActivaId
          : proyecto.piezas[0].id;
      } else if (data.vueltas) {
        // Migración automática de formato antiguo (v1)
        const hiloDef = { id: "hilo_migrado", nombre: "Color Base", hex: "#9d7cd8" };
        const piezaMig = hidratarPiezaDesdeDict({
          nombre: data.pieza || "Pieza Importada",
          cantidad: 1,
          colorInicialId: hiloDef.id,
          vueltas: data.vueltas
        });
        proyecto.paletaHilos = [hiloDef];
        proyecto.piezas = [piezaMig];
        proyecto.piezaActivaId = piezaMig.id;
      } else {
        throw new Error("Formato JSON no reconocido");
      }

      secuenciaTemporal = [];
      guardarEnLocalStorage();
      sincronizarInterfazCompleta();
      mostrarToast(`Patrón cargado (${proyecto.piezas.length} pieza${proyecto.piezas.length > 1 ? "s" : ""})`);
    } catch (err) {
      mostrarToast("Error al importar el archivo JSON");
    }
    fileInputJson.value = "";
  };
  reader.readAsText(file);
});

// ==========================================
// 13. EXPORTACIÓN A PDF FORMATO CLÁSICO + FOTO TEMPORAL
// ==========================================
const modalPdf = document.getElementById("modal-pdf");
const inpPdfFoto = document.getElementById("inp-pdf-foto");
const pdfFotoPreviewWrap = document.getElementById("pdf-foto-preview-wrap");
const pdfFotoPreview = document.getElementById("pdf-foto-preview");

function abrirModalPDF() {
  const pieza = getPiezaActiva();
  document.getElementById("pdf-pieza-actual-lbl").textContent = pieza.nombre;
  modalPdf.classList.add("open");
}

document.getElementById("btn-abrir-pdf").addEventListener("click", () => {
  if (!esAutoriaCompleta()) {
    abrirModalAutoria("pdf");
    return;
  }
  abrirModalPDF();
});

document.getElementById("btn-cerrar-pdf").addEventListener("click", () => {
  modalPdf.classList.remove("open");
});

inpPdfFoto.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    // Se guarda exclusivamente en una variable temporal en memoria
    fotoTemporalDataUrl = ev.target.result;
    pdfFotoPreview.src = fotoTemporalDataUrl;
    pdfFotoPreviewWrap.style.display = "block";
  };
  reader.readAsDataURL(file);
});

document.getElementById("btn-quitar-foto").addEventListener("click", () => {
  fotoTemporalDataUrl = null;
  inpPdfFoto.value = "";
  pdfFotoPreviewWrap.style.display = "none";
});

document.getElementById("btn-generar-pdf-final").addEventListener("click", () => {
  if (!window.jspdf) {
    mostrarToast("Error: librería PDF no cargada");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const scope = document.querySelector('input[name="pdf-scope"]:checked').value;
  const piezasAExportar = scope === "current" ? [getPiezaActiva()] : proyecto.piezas;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = 18;

  // Cabecera estilo patrón clásico
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(40, 40, 55);
  doc.text(`PATRÓN DE ${(proyecto.autoria.autor || "AUTOR").toUpperCase()}`, margin, y);
  y += 7;

  doc.setFontSize(13);
  doc.setTextColor(110, 75, 175);
  doc.text(proyecto.autoria.titulo.toUpperCase(), margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(100, 105, 120);
  const metaLine = [
    `Fecha: ${proyecto.autoria.fecha}`,
    proyecto.autoria.ganchillo ? `Material/Ganchillo: ${proyecto.autoria.ganchillo}` : null
  ].filter(Boolean).join("   |   ");
  doc.text(metaLine, margin, y);
  y += 5;

  // Abreviaturas estándar
  doc.setFontSize(8.5);
  doc.text("Abreviaturas: am = anillo mágico | pb = punto bajo | pma = medio alto | pa = punto alto | aum = aumento | dism = disminución | cad = cadena | pd = punto deslizado", margin, y, { maxWidth: pageWidth - margin * 2 });
  y += 8;

  if (proyecto.autoria.notas) {
    doc.setFont("helvetica", "italic");
    doc.text(`Notas: ${proyecto.autoria.notas}`, margin, y, { maxWidth: pageWidth - margin * 2 });
    y += 7;
  }

  // Línea separadora
  doc.setDrawColor(190, 185, 215);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Si hay imagen temporal adjunta, colocarla a la derecha arriba
  let textoMaxWidth = pageWidth - margin * 2;
  let fotoBottomY = 0;

  if (fotoTemporalDataUrl) {
    const imgW = 62;
    const imgH = 62;
    const imgX = pageWidth - margin - imgW;
    try {
      doc.addImage(fotoTemporalDataUrl, "JPEG", imgX, y, imgW, imgH);
      textoMaxWidth = pageWidth - margin * 2 - imgW - 8;
      fotoBottomY = y + imgH + 6;
    } catch (e) {
      console.warn("No se pudo insertar imagen en PDF:", e);
    }
  }

  // Renderizado de cada pieza en formato clásico
  piezasAExportar.forEach((pieza, pIdx) => {
    const anchoActual = y < fotoBottomY ? textoMaxWidth : (pageWidth - margin * 2);

    if (y > pageHeight - 25) {
      doc.addPage();
      y = 18;
    }

    const hiloInicial = getHiloById(pieza.colorInicialId);
    const tituloPieza = pieza.cantidad > 1
      ? `${pieza.nombre.toUpperCase()} (HACER ${pieza.cantidad})`
      : pieza.nombre.toUpperCase();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(30, 30, 40);
    doc.text(tituloPieza, margin, y);
    y += 5;

    doc.setFontSize(10);
    doc.setTextColor(90, 60, 150);
    doc.text(`COLOR ${hiloInicial.nombre.toUpperCase()}`, margin, y);
    y += 5.5;

    let colorVigente = pieza.colorInicialId;

    pieza.vueltas.forEach(v => {
      const anchoLinea = y < fotoBottomY ? textoMaxWidth : (pageWidth - margin * 2);

      const primerElem = v.instrucciones[0] instanceof GrupoRepeticion
        ? v.instrucciones[0].elementos[0]
        : v.instrucciones[0];

      if (primerElem && primerElem.colorId && primerElem.colorId !== colorVigente) {
        colorVigente = primerElem.colorId;
        const nuevoHilo = getHiloById(colorVigente);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(90, 60, 150);
        doc.text(`CAMBIAMOS A COLOR ${nuevoHilo.nombre.toUpperCase()}`, margin, y);
        y += 5;
      }

      const desc = v.instrucciones.map(i => formatearInstruccionClasica(i, colorVigente)).join(", ");
      let linea = `${v.numero}.- ${desc} (${v.totalPuntos()})`;
      if (v.nota) linea += ` — ${v.nota}`;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(35, 35, 45);

      const lineasEnvueltas = doc.splitTextToSize(linea, anchoLinea);
      if (y + lineasEnvueltas.length * 5 > pageHeight - 16) {
        doc.addPage();
        y = 18;
      }
      doc.text(lineasEnvueltas, margin, y);
      y += lineasEnvueltas.length * 5;
    });

    y += 6;
  });

  const slug = (proyecto.autoria.titulo || "patron_crostep").toLowerCase().replace(/[^a-z0-9]+/g, "_");
  doc.save(`${slug}.pdf`);

  // Limpiar referencia temporal de imagen tras descargar
  fotoTemporalDataUrl = null;
  inpPdfFoto.value = "";
  pdfFotoPreviewWrap.style.display = "none";
  modalPdf.classList.remove("open");
  mostrarToast("PDF clásico generado y descargado");
});

// ==========================================
// 14. EVENTOS PRINCIPALES E INICIALIZACIÓN
// ==========================================
document.getElementById("btn-nuevo-proyecto").addEventListener("click", () => abrirModalPaleta("new"));
document.getElementById("btn-abrir-paleta").addEventListener("click", () => abrirModalPaleta("edit"));
document.getElementById("btn-abrir-autoria").addEventListener("click", () => abrirModalAutoria(null));
document.getElementById("btn-nueva-pieza").addEventListener("click", crearNuevaPieza);

txtNombrePieza.addEventListener("input", () => {
  const pieza = getPiezaActiva();
  pieza.nombre = txtNombrePieza.value.trim() || "Sin nombre";
  guardarEnLocalStorage();
  renderizarTabsPiezas();
  const labelPieza = pieza.cantidad > 1 ? `${pieza.nombre} (x${pieza.cantidad})` : pieza.nombre;
  btnPiezaTargetName.textContent = labelPieza;
  lblVistaPreviaTitulo.textContent = `📋 2. Vista Previa: ${labelPieza}`;
});

configurarStepper(
  txtCantidadPieza,
  document.getElementById("btn-dec-pieza-cant"),
  document.getElementById("btn-inc-pieza-cant"),
  1,
  (nuevoVal) => {
    const pieza = getPiezaActiva();
    pieza.cantidad = nuevoVal;
    guardarEnLocalStorage();
    renderizarTabsPiezas();
    actualizarVistaPatron();
  }
);

configurarStepper(txtCantidad, document.getElementById("btn-dec-cant"), document.getElementById("btn-inc-cant"), 1);
configurarStepper(txtRepeticiones, document.getElementById("btn-dec-rep"), document.getElementById("btn-inc-rep"), 1);

// Aplicar vuelta sugerida con 1 clic
document.getElementById("btn-aplicar-sugerencia").addEventListener("click", () => {
  if (!sugerenciaActual) return;
  const pieza = getPiezaActiva();
  const vueltaSugerida = sugerenciaActual.crearVuelta();
  pieza.agregarVuelta(vueltaSugerida);
  guardarEnLocalStorage();
  actualizarVistaPatron();
  mostrarToast(`Vuelta ${vueltaSugerida.numero} aplicada automáticamente`);
});

// Encadenar paso a la secuencia temporal
document.getElementById("btn-add-sub").addEventListener("click", () => {
  const cant = parseInt(txtCantidad.value, 10) || 1;
  secuenciaTemporal.push(new InstruccionPunto(puntoSeleccionadoId, cant, colorPasoActualId));
  actualizarVistaSecuencia();
  mostrarToast("Punto añadido a la secuencia de la vuelta");
});

btnLimpiarSecuencia.addEventListener("click", () => {
  secuenciaTemporal = [];
  actualizarVistaSecuencia();
});

// Guardar vuelta completa
document.getElementById("btn-guardar-vuelta").addEventListener("click", () => {
  const pieza = getPiezaActiva();
  const nota = txtNotaVuelta.value.trim();
  const nuevaV = new Vuelta(pieza.vueltas.length + 1, nota);
  const rep = parseInt(txtRepeticiones.value, 10) || 1;
  const cantPrincipal = parseInt(txtCantidad.value, 10) || 1;

  if (secuenciaTemporal.length > 0) {
    // Si hay secuencia encadenada, incluimos los pasos encadenados (y si el usuario seleccionó un punto extra en el radio sin encadenar, solo si secuenciaTemporal estaba vacía)
    const grupo = new GrupoRepeticion(rep);
    secuenciaTemporal.forEach(el => grupo.agregarElemento(new InstruccionPunto(el.tipo_punto, el.cantidad, el.colorId)));
    nuevaV.agregarInstruccion(grupo);
    secuenciaTemporal = [];
    actualizarVistaSecuencia();
  } else if (rep > 1) {
    const grupo = new GrupoRepeticion(rep);
    grupo.agregarElemento(new InstruccionPunto(puntoSeleccionadoId, cantPrincipal, colorPasoActualId));
    nuevaV.agregarInstruccion(grupo);
  } else {
    nuevaV.agregarInstruccion(new InstruccionPunto(puntoSeleccionadoId, cantPrincipal, colorPasoActualId));
  }

  pieza.agregarVuelta(nuevaV);
  txtNotaVuelta.value = "";
  txtRepeticiones.value = 1;
  guardarEnLocalStorage();
  actualizarVistaPatron();
  mostrarToast(`Vuelta ${nuevaV.numero} guardada en ${pieza.nombre}`);
});

chkVistaClasica.addEventListener("change", actualizarVistaPatron);

// Arranque de la aplicación
(function init() {
  renderizarRadioButtonsPuntos();
  const cargado = cargarDesdeLocalStorage();

  if (!cargado || proyecto.paletaHilos.length === 0) {
    // Si es la primera vez que abre la app, exigir configuración inicial de proyecto y paleta de hilos
    const hiloBase = { id: `hilo_${Date.now()}`, nombre: "Color Base", hex: "#6ec4a7" };
    const piezaBase = new Pieza(null, "Cuerpo Principal", 1, hiloBase.id);
    proyecto.paletaHilos = [hiloBase];
    proyecto.piezas = [piezaBase];
    proyecto.piezaActivaId = piezaBase.id;
    sincronizarInterfazCompleta();
    abrirModalPaleta("new");
  } else {
    sincronizarInterfazCompleta();
  }
})();