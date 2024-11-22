let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <button class="cantidad-disminuir" data-id="${producto.id}">-</button>
                    <p>${producto.cantidad}</p>
                    <button class="cantidad-aumentar" data-id="${producto.id}">+</button>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesCantidad();
        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesCantidad() {
    const botonesAumentar = document.querySelectorAll(".cantidad-aumentar");
    const botonesDisminuir = document.querySelectorAll(".cantidad-disminuir");

    botonesAumentar.forEach(boton => {
        boton.addEventListener("click", () => actualizarCantidad(boton.dataset.id, 1));
    });

    botonesDisminuir.forEach(boton => {
        boton.addEventListener("click", () => actualizarCantidad(boton.dataset.id, -1));
    });
}

function actualizarCantidad(id, cantidad) {
    const producto = productosEnCarrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad += cantidad;
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    }
}

function actualizarBotonesEliminar() {
    document.querySelectorAll(".carrito-producto-eliminar").forEach(boton => {
        boton.addEventListener("click", () => eliminarDelCarrito(boton.id));
    });
}

function eliminarDelCarrito(id) {
    productosEnCarrito = productosEnCarrito.filter(p => p.id !== id);
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito = [];
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", () => {
    if (productosEnCarrito.length > 0) {
        const mensaje = productosEnCarrito.map(producto => 
            `*${producto.titulo}* (x${producto.cantidad}): $${producto.precio * producto.cantidad}`
        ).join("\n");
        
        const total = productosEnCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
        const mensajeCompleto = `¡Hola!, quiero realizar el siguiente pedido:\n\n${mensaje}\n\n*Total: $${total}*`;
        
        const numeroWhatsApp = "5493735401893"; 
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeCompleto)}`;
        window.open(url, "_blank");
    } else {
        Swal.fire({
            title: "Carrito vacío",
            text: "Por favor, agrega productos antes de realizar el pedido.",
            icon: "error",
            confirmButtonText: "Ok"
        });
    }
});


