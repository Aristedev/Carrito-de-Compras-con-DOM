// Captura de los datos:
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json') // buscamos para obtener una respuesta
        const data = await res.json() // guardamos los datos e indicamos el tipo de respuesta (.json())
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}