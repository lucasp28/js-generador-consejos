//variables
const parrafoFrase = document.getElementById('frase');
const botonNueva = document.getElementById('btn-nueva');
const listaHistorial = document.getElementById('lista-historial');
const botonTraducir = document.getElementById('btn-traducir');

let fraseActual = "";

//funciones
document.addEventListener('DOMContentLoaded', () => {
    renderizarHistorial();
});

botonNueva.addEventListener("click", () => {
    obtenerFrase();
});

botonTraducir.addEventListener("click", () => {
    traducirFrase();
})

async function obtenerFrase() {
    parrafoFrase.textContent = "Cargando sabiduría...";

    const respuesta = await fetch('https://api.adviceslip.com/advice');
    const datosJSON = await respuesta.json();

    //console.log(datosJSON);

    fraseActual = datosJSON.slip.advice;

    parrafoFrase.textContent = `"${fraseActual}"`;

    guardarEnHistorial(fraseActual);
    renderizarHistorial();
}


function guardarEnHistorial(nuevaFrase){
    //JS me permite simplificar un if() en una sola linea.
    let historial = JSON.parse( localStorage.getItem('mis-frases') ) || [];
    
    historial.unshift(nuevaFrase);

    if(historial.length > 5){
        historial.pop();
    }

    localStorage.setItem('mis-frases', JSON.stringify(historial));
}

function renderizarHistorial(){
    let historial = JSON.parse( localStorage.getItem('mis-frases') );
    listaHistorial.innerHTML = "";
    
    historial.forEach(frase => {
        
        const itemLi = document.createElement('li');
        itemLi.textContent = frase;
        listaHistorial.appendChild(itemLi);
    });
}

async function traducirFrase(){
    if(!fraseActual) return;

    parrafoFrase.textContent = "Traduciendo...";

    try{

        const fraseCodificada = encodeURIComponent(fraseActual);
        const url = `https://api.mymemory.translated.net/get?q=${fraseCodificada}&langpair=en|es`;

        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        console.log(datos);
        //la API me devuelve en el objeto datosJSON.responseData.translatedText
        const traduccion = datos.responseData.translatedText;

        parrafoFrase.textContent = `"${traduccion}"`;

    }catch(error) {
        parrafoFrase.textContent = "Error al traducir. ";
        console.log(error);
    }
}