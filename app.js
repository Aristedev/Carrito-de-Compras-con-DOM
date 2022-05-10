// IDs
const items = document.getElementById('items');
const templateCard = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment()

// Captura de los datos:
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
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

// 27:11min