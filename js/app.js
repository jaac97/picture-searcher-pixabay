const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion');
const registrosPorPagina = 10;
let totalPaginas;
let iterador;
let paginaActual = 1
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}
const validarFormulario = (e) => {
    e.preventDefault()
    const busqueda = document.querySelector('#termino').value

    if (busqueda === '') {
        mostrarAlerta("Agrega un término de busqueda");
        return;
    }
    buscarImagenes();
}

const buscarImagenes = () => {
    const busqueda = document.querySelector('#termino').value

    const key = '16520157-11607e0a9ee7384a6aabe822d'
    const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${registrosPorPagina}&page=${paginaActual}`
    console.log(url)
    fetch(url)
        .then(result => result.json())
        .then(result => {
            totalPaginas =  Math.ceil(result.totalHits / registrosPorPagina)
            mostrarImagenes(result.hits)
      
        })
        .catch(error => console.log(error))
}
// Generador que va a registar la cantidad de elementos
function *crearPaginador(total){
    for (let i = 1; i<= total; i++){
        yield i;
    }
}
const mostrarImagenes = (imagenes) => {
   
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
    //  Iterar sobre arreglo de imagenes e iterar sobre html
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;
        resultado.innerHTML += `
         <div class="w-1/2 md:w-1/3 lg:w1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-black">${likes} <span class="font-light"> Me gusta</span></p>
                    <p class="font-black">${views} <span class="font-light"> Veces vista esta imagen</span></p>
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen</a>
                </div>
            </div>
         </div>
         `;
        
    })
    imprimirPaginador()
}
function imprimirPaginador() {
    const busqueda = document.querySelector('#termino').value

    iterador = crearPaginador(totalPaginas);
    while (paginacion.firstChild) {
        paginacion.removeChild(paginacion.firstChild)
    }
    while(true){
        const {value, done} = iterador.next();
        if(done) return;
       
        // caso contrario, genera un botón para cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.onclick = () => {
          paginaActual = value;
          buscarImagenes()
        }
        boton.classList.add("siguiente", "bg-yellow-400", "px-4", "py-1", "mr-2", "font-bold", "mb-10", "uppercase", "rounded");
        paginacion.appendChild(boton)
    }
}


const mostrarAlerta = (mensaje) => {
    const alerta = document.createElement('div');
    const divAlerta = document.querySelector('.alerta')
    if (!divAlerta) {
        alerta.classList.add("alerta", 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta)
        setTimeout(() => {
            alerta.remove();
        }, 3000)
    }

}