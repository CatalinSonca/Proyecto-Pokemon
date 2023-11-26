const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

// Html generado por cada pokemon
    const div = document.createElement("div");
    div.classList.add("pokemon", poke.types[0].type.name);
    div.innerHTML = `
    <!--  <p class="pokemon-id-back">#${pokeId}</p> -->
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat"><b>Altura:&nbsp; </b>${poke.height}&nbsp;Ft</p>
                <p class="stat"><b></n>Peso:&nbsp; </b>${poke.weight}&nbsp;Lb</p>
                <p class="stat"><b>Experiencia Base: &nbsp;</b>${poke.base_experience}</p>
                <p class="stat"><b>Ataque: &nbsp; </b>${poke.stats.find(stat => stat.stat.name === 'attack').base_stat} Dmg</p>
                <p class="stat"><b>Habilidad:&nbsp; </b>${poke.abilities[0].ability.name}</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 500; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))


//Barra de busqueda pokemon
const buscador = document.getElementById('buscador');
// llamada a la api
async function fetchPokemonNames() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=500');
        const data = await response.json();
        return data.results.map(pokemon => pokemon.name);
    } catch (error) {
        console.error('Error al obtener la lista de nombres de Pokémon:', error);
        return [];
    }
}
function showPredictions(inputValue, allPokemonNames) {
    const filteredNames = allPokemonNames.filter(name => name.includes(inputValue));

    // Limpiar la lista de Pokémon existente
    listaPokemon.innerHTML = "";

    // Mostrar solo los Pokémon filtrados
    filteredNames.forEach(async (pokemonName) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();
        mostrarPokemon(data);
    });
}

buscador.addEventListener('input', async function () {
    const inputValue = buscador.value.toLowerCase();

    const allPokemonNames = await fetchPokemonNames();
    showPredictions(inputValue, allPokemonNames);
});