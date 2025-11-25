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

function mostrarResultado(elemento, precioUnit, cantidad, subtotal, descuento, total, detalle) {
  if (subtotal <= 0) {
    elemento.textContent = "No hay datos para calcular.";
    return;
  }
  const ahorroPorcentaje = subtotal > 0 ? (descuento / subtotal) * 100 : 0;

  elemento.innerHTML = `
    <p>Cantidad: <strong>${cantidad}</strong></p>
    <p>Precio unitario: <strong>${formatearMoneda(precioUnit)}</strong></p>
    <hr>
    <p>Total sin descuento: <span class="strike">${formatearMoneda(subtotal)}</span></p>
    <p>Descuento aplicado: <strong>${formatearMoneda(descuento)}</strong></p>
    <p>Total a pagar: <strong>${formatearMoneda(total)}</strong></p>
    <p>Ahorro: <strong>${ahorroPorcentaje.toFixed(1)}%</strong></p>
    ${detalle ? `<hr><p><em>Detalle:</em> ${detalle}</p>` : ""}
  `;
}

function promo1(precio, cantidad) {
  const pares = Math.floor(cantidad / 2);
  const unidadesConDescuento = pares; // en cada par 1 unidad al 50%
  const descuento = unidadesConDescuento * precio * 0.5;
  const subtotal = precio * cantidad;
  const total = subtotal - descuento;

  const detalle = pares > 0
    ? `Se aplican ${pares} par(es). ${unidadesConDescuento} unidad(es) al 50% de descuento.`
    : "No hay pares suficientes para aplicar descuento.";

  return { subtotal, descuento, total, detalle };
}

function promo2(precio, cantidad) {
  const trios = Math.floor(cantidad / 3);
  const unidadesGratis = trios; // por cada 3, 1 gratis
  const descuento = unidadesGratis * precio;
  const subtotal = precio * cantidad;
  const total = subtotal - descuento;

  const detalle = trios > 0
    ? `Se aplican ${trios} promoción(es) 3x2. ${unidadesGratis} unidad(es) gratis.`
    : "No alcanza para 3x2.";

  return { subtotal, descuento, total, detalle };
}

function promo3(precio, cantidad, umbral = 30000, porcentaje = 0.10) {
  const subtotal = precio * cantidad;
  const aplica = subtotal > umbral;
  const descuento = aplica ? subtotal * porcentaje : 0;
  const total = subtotal - descuento;

  const detalle = aplica
    ? `Se aplica ${Math.round(porcentaje * 100)}% porque el subtotal supera ${formatearMoneda(umbral)}.`
    : `No aplica ${Math.round(porcentaje * 100)}%. El subtotal debe superar ${formatearMoneda(umbral)}.`;

  return { subtotal, descuento, total, detalle };
}

["p1_producto", "p2_producto", "p3_producto"].forEach(cargarSelect);

$("p1_btn").addEventListener("click", () => {
  const productoId = $("p1_producto").value;
  const cantidad = validarCantidad($("p1_cantidad").value);
  const salida = $("p1_res");

  if (!cantidad) {
    salida.textContent = "Ingresá una cantidad válida (mayor a 0).";
    return;
  }

  const precio = obtenerPrecioPorId(productoId);
  if (!precio) {
    salida.textContent = "Producto no encontrado.";
    return;
  }

  const { subtotal, descuento, total, detalle } = promo1(precio, cantidad);
  mostrarResultado(salida, precio, cantidad, subtotal, descuento, total, detalle);
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
  if (!precio) {
    salida.textContent = "Producto no encontrado.";
    return;
  }

  const { subtotal, descuento, total, detalle } = promo2(precio, cantidad);
  mostrarResultado(salida, precio, cantidad, subtotal, descuento, total, detalle);
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
  if (!precio) {
    salida.textContent = "Producto no encontrado.";
    return;
  }

  const { subtotal, descuento, total, detalle } = promo3(precio, cantidad, 30000, 0.10);
  mostrarResultado(salida, precio, cantidad, subtotal, descuento, total, detalle);
});
