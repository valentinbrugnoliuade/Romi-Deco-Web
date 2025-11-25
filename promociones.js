// Lista de productos de ejemplo
const productos = [
  { id: "nova", nombre: "Lámpara Nova", precio: 59990 },
  { id: "orbit", nombre: "Sillón Orbit", precio: 249990 },
  { id: "aura", nombre: "Set de vasos Aura (x6)", precio: 14990 }
];

// Helpers
const $ = (id) => document.getElementById(id);

function formatearMoneda(valor) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS"
  });
}

function cargarSelect(selectId) {
  const sel = $(selectId);
  sel.innerHTML = productos
    .map(
      (p) =>
        `<option value="${p.id}">${p.nombre} — ${formatearMoneda(p.precio)}</option>`
    )
    .join("");
}

function obtenerPrecioPorId(idProducto) {
  const prod = productos.find((p) => p.id === idProducto);
  return prod ? prod.precio : 0;
}

function validarCantidad(valor) {
  const n = parseInt(valor, 10);
  if (!Number.isFinite(n) || n <= 0) {
    return null;
  }
  return n;
}

function mostrarResultado(elemento, subtotal, descuento, total) {
  if (subtotal <= 0) {
    elemento.textContent = "No hay datos para calcular.";
    return;
  }
  const ahorroPorcentaje = subtotal > 0 ? (descuento / subtotal) * 100 : 0;

  elemento.innerHTML = `
    <p>Total sin descuento: <span class="strike">${formatearMoneda(subtotal)}</span></p>
    <p>Descuento aplicado: <strong>${formatearMoneda(descuento)}</strong></p>
    <p>Total a pagar: <strong>${formatearMoneda(total)}</strong></p>
    <p>Ahorro: <strong>${ahorroPorcentaje.toFixed(1)}%</strong></p>
  `;
}

// LÓGICA DE CADA PROMO
// Promo 1: 50% en la segunda unidad (por cada par)
function promo1(precio, cantidad) {
  const pares = Math.floor(cantidad / 2);
  const descuento = pares * precio * 0.5;
  const subtotal = precio * cantidad;
  const total = subtotal - descuento;
  return { subtotal, descuento, total };
}

// Promo 2: 3x2
function promo2(precio, cantidad) {
  const trios = Math.floor(cantidad / 3);
  const descuento = trios * precio;
  const subtotal = precio * cantidad;
  const total = subtotal - descuento;
  return { subtotal, descuento, total };
}

// Promo 3: 10% si subtotal > 30000
function promo3(precio, cantidad) {
  const subtotal = precio * cantidad;
  const descuento = subtotal > 30000 ? subtotal * 0.1 : 0;
  const total = subtotal - descuento;
  return { subtotal, descuento, total };
}

// Inicializar selects
["p1_producto", "p2_producto", "p3_producto"].forEach(cargarSelect);

// Listeners
$("p1_btn").addEventListener("click", () => {
  const productoId = $("p1_producto").value;
  const cantidad = validarCantidad($("p1_cantidad").value);
  const salida = $("p1_res");

  if (!cantidad) {
    salida.textContent = "Ingresá una cantidad válida (mayor a 0).";
    return;
  }

  const precio = obtenerPrecioPorId(productoId);
  const { subtotal, descuento, total } = promo1(precio, cantidad);
  mostrarResultado(salida, subtotal, descuento, total);
});

$("p2_btn").addEventListener("click", () => {
  const productoId = $("p2_producto").value;
  const cantidad = validarCantidad($("p2_cantidad").value);
  const salida = $("p2_res");

  if (!cantidad) {
    salida.textContent = "Ingresá una cantidad válida (mayor a 0).";
    return;
  }

  const precio = obtenerPrecioPorId(productoId);
  const { subtotal, descuento, total } = promo2(precio, cantidad);
  mostrarResultado(salida, subtotal, descuento, total);
});

$("p3_btn").addEventListener("click", () => {
  const productoId = $("p3_producto").value;
  const cantidad = validarCantidad($("p3_cantidad").value);
  const salida = $("p3_res");

  if (!cantidad) {
    salida.textContent = "Ingresá una cantidad válida (mayor a 0).";
    return;
  }

  const precio = obtenerPrecioPorId(productoId);
  const { subtotal, descuento, total } = promo3(precio, cantidad);
  mostrarResultado(salida, subtotal, descuento, total);
});
