// IDs
const items = document.getElementById('items');
const templateCard = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment()
let carrito = {};
// Captura de los datos:
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

// Event delegation con el boton de compra
items.addEventListener('click', e => {
    addCarrito(e);
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json') // buscamos para obtener una respuesta
        const data = await res.json() // guardamos los datos e indicamos el tipo de respuesta (.json())
        // console.log(data)
        pintarCard(data)
    } catch (error) {
        console.log(error)
    }
}

// Renderizamos los cards
const pintarCard = data => {

    // Colección de arrays
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('.img-card-top').setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = producto.id;

        const clone = templateCard.cloneNode(true); // clonamos nuestro template
        fragment.appendChild(clone); // Agregamos clone a fragment
    });
    items.appendChild(fragment); // Pasamos el fragment
}

const addCarrito = e => {
    // console.log(e.target);
    // console.log(e.target.classList.contains('btn-dark'));
    if(e.target.classList.contains('btn-dark')) {
        // console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation(); // Para evitar que se hereden fuera del nodo seleccionado
}

const setCarrito = objeto => { // recibimos un objeto
    // console.log(objeto);
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1, // Unidad del producto
    }
    
    console.log(producto);
}

// 37:01min logica de la cantidad de los productos