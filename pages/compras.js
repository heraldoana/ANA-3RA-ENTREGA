
let productos = [
  { id: 1, nombre: "Barbijo de polvo", info: "con valvula marca Libus 1740", categoria: "proteccion respiratoria", stock: 20, precio: 5000, rutaImagen: "barbijo-polvo.jpg" },
  { id: 2, nombre: "Mameluco", info: "descartable color blanco marca 3M", categoria: "indumentaria de trabajo", stock: 7, precio: 2650, rutaImagen: "ropadetrabajo.jpg" },
  { id: 3, nombre: "Gafas claras", info: "con proteccion lateral marca Libus modelo ARGON", categoria: "proteccion visual", stock: 4, precio: 4500, rutaImagen: "gafas-claras.jpg" },
  { id: 4, nombre: "Casco", info: "color blanco con arnes y cremallera marca 3M", categoria: "proteccion de cabeza", stock: 1, precio: 2800, rutaImagen: "casco3m.jpg" },
  { id: 5, nombre: "Gafas oscuras", info: "con proteccion lateral y UV marca Libus modelo ARGON", categoria: "proteccion visual", stock: 0, precio: 7300, rutaImagen: "gafas-oscuras.jpg" },
  { id: 6, nombre: "Guantes de vaqueta", info: "de puño corto marca Libus", categoria: "proteccion de manos", stock: 0, precio: 5600, rutaImagen: "guantes-vaqueta.jpg" },
  { id: 7, nombre: "Barbijo de gases", info: "con valvula marca Libus 1840v", categoria: "proteccion respiratoria", stock: 7, precio: 2650, rutaImagen: "barbijo-gases.jpg" },
]

let carrito = []
let carritoRecuperado = localStorage.getItem("carrito")
if (carritoRecuperado) {
  carrito = JSON.parse(carritoRecuperado)
}
renderizarCarrito(carrito)

renderizarProductos(productos, carrito)

let buscador = document.getElementById("buscador")
// buscador.addEventListener("input", () => filtrar(productos))

let botonBuscar = document.getElementById("buscar")
botonBuscar.addEventListener("click", () => filtrarYRenderizar(productos))

let botonesCategorias = document.getElementsByClassName("filtroCategoria")
for (const botonCategoria of botonesCategorias) {
  botonCategoria.addEventListener("click", (e) => filtrarPorCategoria(e, productos))
}

function filtrarPorCategoria(e, productos) {
  if (e.target.id === "mostrarTodos") {
    // Mostrar todos los productos sin filtrar por categoría
    renderizarProductos(productos)
  } else {
    let productosFiltradosCategoria = productos.filter(producto => {
      return producto.categoria === e.target.id
    })
    renderizarProductos(productosFiltradosCategoria)
  }
}

function renderizarProductos(productos) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || []
  let contenedor = document.getElementById("contenedorProductos")
  contenedor.innerHTML = ""

  productos.forEach(({ nombre, rutaImagen, precio, id, info, stock }) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "tarjeta"
    tarjeta.id = "tarjeta" + id

    tarjeta.innerHTML = `
      <div class=nombreImgPrecio>
        <h3>${nombre}</h3>
        <img class=imagenProducto src=../images/${rutaImagen} />
        <p><strong>$${precio}</strong></p>
        <p class="cantidad">Cant. disponible: ${stock}</p>
      </div>
      <div class=oculta>
        <div class=imgInfoPrecio>
        <h3>${nombre}</h3>
        <img class=imagenProducto src=../images/${rutaImagen} />
        <p><strong>$${precio}</strong></p>
        <p>Descripcion de ${nombre} : ${info}</p>
        <button class=agregarCarrito id=${id}>
        <strong>Agregar al carrito </strong>
        <img class=imgCarrito src=../images/carrito-total.jpg />
        </button>
        </div>
      </div> 
    `
    tarjeta.addEventListener("mouseenter", (e) => mostrarInfoExtra(e))
    tarjeta.addEventListener("mouseleave", (e) => mostrarInfoExtra(e))
    contenedor.appendChild(tarjeta)

    // Obtener el elemento del párrafo con la clase "cantidad"
    const cantidadParrafo = tarjeta.querySelector(".cantidad")

    // Cambiar el color del texto según el valor de stock
    if (stock > 10) {
      cantidadParrafo.style.color = "green"
    } else {
      cantidadParrafo.style.color = "red"
    }

    let botonAgregarAlCarrito = document.getElementById(id)
    botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(productos, e))
  })
}

function mostrarInfoExtra(e) {
  e.target.children[0].classList.toggle("oculta")
  e.target.children[1].classList.toggle("oculta")
}

function agregarProductoAlCarrito(productos, e) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || []

  let productoBuscado = productos.find(producto => producto.id === Number(e.target.id))
  let productoEnCarrito = carrito.find(producto => producto.id === productoBuscado.id)

  if (productoBuscado.stock > 0) {
    if (productoEnCarrito) {
      productoEnCarrito.unidades++
      productoEnCarrito.subtotal = productoEnCarrito.unidades * productoEnCarrito.precioUnitario
    } else {
      carrito.push({
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        precioUnitario: productoBuscado.precio,
        unidades: 1,
        subtotal: productoBuscado.precio
      })
    }
    productoBuscado.stock--
    localStorage.setItem("carrito", JSON.stringify(carrito))
  } else {
    alert("No hay más stock del producto seleccionado")
  }

  renderizarCarrito(carrito)
}

function renderizarCarrito(productosEnCarrito) {
  if (productosEnCarrito.length > 0) {
    let divCarrito = document.getElementById("carrito")
    divCarrito.innerHTML = ""

    productosEnCarrito.forEach(producto => {
      let tarjProdCarrito = document.createElement("div")
      tarjProdCarrito.className = "tarjProdCarrito"
      tarjProdCarrito.innerHTML = `
      <p>${producto.unidades} unidades de ${producto.nombre}</p>
      <p>Precio unitario = $${producto.precioUnitario}</p>
      <p>Subtotal = $${producto.subtotal}</p>
      `
      divCarrito.appendChild(tarjProdCarrito)

    })

    let boton = document.createElement("button")
    boton.innerHTML = "Finalizar compra"
    boton.addEventListener("click", finalizarCompra)
    divCarrito.appendChild(boton)
  }
}

function finalizarCompra() {
  let carrito = document.getElementById("carrito")
  let carritoRecuperado = JSON.parse(localStorage.getItem("carrito"))
  carrito.innerHTML = ""

  let total = 0
  if (carritoRecuperado.length === 0) {
    alert("Primero debe agregar productos al carrito")
  } else {
    total = carritoRecuperado.reduce((acum, producto) => acum + producto.subtotal, 0)
    let divCarritoTotal = document.getElementById("carritoTotal")
    divCarritoTotal.innerHTML = ""
    let tarjTotalCarrito = document.createElement("div")
    tarjTotalCarrito.innerHTML = `
  <div class="contenedorTotal">
  <img class="imgCarritoTotal" src=../images/carrito-total.jpg />
  <p>total a pagar $${total}  </p>
  </div>
  `
  divCarritoTotal.appendChild(tarjTotalCarrito)
  localStorage.removeItem("carrito")
  }

}




let botonVerOcultar = document.getElementById("verOcultar")
botonVerOcultar.addEventListener("click", verOcultarCarrito)

function verOcultarCarrito() {
  let carrito = document.getElementById("contenedorCarrito")
  let contenedorProductos = document.getElementById("contenedorProductos")

  carrito.classList.toggle("oculta")
  contenedorProductos.classList.toggle("oculta")
}


