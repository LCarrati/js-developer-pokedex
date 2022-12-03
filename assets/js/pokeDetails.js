const targetDiv = document.getElementById('target');
const pokeName = window.location.search.slice(1); //pokemonDetalhe.html?bulbasaur => bulbasaur

let thisPokemon = {};
let evoChain = [];
let arrayImagens = [];

class PokemonDetalhes { //modelo dos detalhes de um pokemon
    peso;
    hp;
    imagem;
    attack;
    defense;
    spAtack;
    spDefense;
    speed;
    altura;
    id;
    family;
    evoList;
    cor;
    frase;
    tipo;
}

(async function getPokemonDetails(){
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`
    const response = await fetch(url);
    const objResponse = await (response.json());
    return pegarValores(objResponse); //pegarValores() recebe o objeto, que pode ser um array, objeto, string, number...
})();


function pegarValores(objResponse) {
    thisPokemon = new PokemonDetalhes()
    thisPokemon.peso = objResponse.weight
    thisPokemon.hp = objResponse.stats[0].base_stat
    thisPokemon.imagem = objResponse.sprites.other.dream_world.front_default
    thisPokemon.attack = objResponse.stats[0].base_stat
    thisPokemon.defense = objResponse.stats[1].base_stat
    thisPokemon.spAtack = objResponse.stats[2].base_stat
    thisPokemon.spDefense = objResponse.stats[3].base_stat
    thisPokemon.speed = objResponse.stats[4].base_stat
    thisPokemon.altura = objResponse.height
    thisPokemon.id = objResponse.id
    thisPokemon.family = objResponse.species.url
    thisPokemon.tipo = objResponse.types.map((typeSlot) => typeSlot.type.name)
    return thisPokemon,loadPokeFamily(thisPokemon.family)
}

function loadPokeFamily(thisPokemonFamily) {
    return fetch(thisPokemonFamily) //https://pokeapi.co/api/v2/pokemon-species/${id da especie}/
    .then((resp) => (resp.json())) // .json() takes a JSON as input and parse it to produce a JavaScript object
    .then(getEvoChain) //getEvoChain() recebe o objeto, que pode ser um array, objeto, string, number...
}

function getEvoChain(family) {
    const url = family.evolution_chain.url
    thisPokemon.cor = family.color.name
    thisPokemon.frase = family.flavor_text_entries[44].flavor_text
    return fetch(url)
    .then((resp) => (resp.json())) // takes and parses the Json response into an object
    .then((result) => (result.chain)) // inside de object, get the .chain value 
    .then(getEvo) // send the .chain value to getEvo()
}

function getEvo(array) { // vai percorrer a cadeia evolutiva verificando se existe uma próxima evolução disponível para o nível atual
    evoChain.push(array.species.name); // evoChain[] recebe o nome da espécie atual na cadeia evolutiva
    if (array.evolves_to.length > 0) { //se array.evolves_to.length maior que 0 então existe uma próxima espécie na cadeia evolutiva
        getEvo(array.evolves_to[0]); // nesse caso, chamo a função novamente passando como parâmetro o nível evolutivo atual
    } else {
        thisPokemon.evoList = evoChain // quando não existe mais próximo nível evolutivo, evoList recebe evoChain
        return thisPokemon.evoList, getEvolvedImage(thisPokemon.evoList)}
    }

    function getEvolvedImage(array) {
         // console.log(array)
        for (let i = 0; i < array.length; i++) { 
            fetch(`https://pokeapi.co/api/v2/pokemon/${array[i]}`) // a cada iteração de i recebo um pokemon
            .then((resp)=>(resp.json()))
            .then((img)=>(arrayImagens[i]=(img.sprites.other.dream_world.front_default))) // para cada pokemon alimento o array de imagens, obtendo assim um array com as imagens de toda a cadeia evolutiva da espécie
            .finally(atualizaTela)        
        }    
    }


function atualizaTela() {
    return targetDiv.innerHTML = `
        <div class="card ${thisPokemon.tipo[0]}">
            <div class="header"><a href="javascript:history.back()">Voltar</a></div>
            <div class="nome">
                <div>
                    <p class="nomePokemon">${pokeName}</p>
                    <ul class="bulletTypes">
                        ${thisPokemon.tipo.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ul> 
                </div>
                <p>#
                    ${thisPokemon.id.toLocaleString(undefined, {
                        minimumIntegerDigits: 3,
                        useGrouping: false
                    })}
                </p>
                
            </div>
            <div class="imagem">
                <img src="${thisPokemon.imagem}" alt="">
            </div>
            <div class="minicard">
                <div class="menu">
                    <ul id="menuUl">
                        <li onclick="navMenuNavigation(about)" class="active">About</li>
                        <li onclick="navMenuNavigation(baseStats)">Base Stats</li>
                        <li onclick="navMenuNavigation(evolution)">Evolution</li>
                    </ul>
                    <hr>
                </div>
                <div id="about">
                    <p>${thisPokemon.frase}</p>
                    <div class="pesoAltura">
                        <div class="peso">
                            <p>Peso: ${thisPokemon.peso/10}kg</p>
                        </div>
                        <div class="altura">
                            <p>Altura: ${thisPokemon.altura*10}cm</p>
                        </div>
                    </div>
                </div>
                <div id="baseStats">
                    <table>
                        <tr>
                            <td>HP:</td>
                            <td>${thisPokemon.hp}</td>
                            <td>
                                <div class="barraSkill"><span class="skillFill skillHP">&nbsp;</span></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Attack:</td>
                            <td>${thisPokemon.attack}</td>
                            <td>
                                <div class="barraSkill"><span class="skillFill skillAtk">&nbsp;</span></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Defense:</td>
                            <td>${thisPokemon.defense}</td>
                            <td>
                                <div class="barraSkill"><span class="skillFill skillDef">&nbsp;</span></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Sp. Atck:</td>
                            <td>${thisPokemon.spAtack}</td>
                            <td>
                                <div class="barraSkill"><span class="skillFill skillSpAtk">&nbsp;</span></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Sp. Def:</td>
                            <td>${thisPokemon.spDefense}</td>
                            <td>
                                <div class="barraSkill"><span class="skillFill skillSpDef">&nbsp;</span></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Speed:</td>
                            <td>${thisPokemon.speed}</td>
                            <td>
                                <div class="barraSkill"><span class="skillFill skillSpeed">&nbsp;</span></div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="evolution">
                    ${arrayImagens.map((imagem) => `<p>${thisPokemon.evoList[arrayImagens.indexOf(imagem)]}</p><p><img src="${imagem}" alt=""></p>&darr;`).join('').slice(0, -6)}
                </div>
            </div>
        </div>
        <style>
        .skillHP {
            width: ${thisPokemon.hp*100/150}%;
            background-color: ${thisPokemon.hp >= 50 ? 'green' : 'red'}
        }
        .skillAtk {
            width: ${thisPokemon.attack*100/150}%;
            background-color: ${thisPokemon.attack >= 50 ? 'green' : 'red'}
        }
        .skillDef {
            width: ${thisPokemon.defense*100/150}%;
            background-color: ${thisPokemon.defense >= 50 ? 'green' : 'red'}
        }
        .skillSpAtk {
            width: ${thisPokemon.spAtack*100/150}%;
            background-color: ${thisPokemon.spAtack >= 50 ? 'green' : 'red'}
        }
        .skillSpDef {
            width: ${thisPokemon.spDefense*100/150}%;
            background-color: ${thisPokemon.spDefense >= 50 ? 'green' : 'red'}
        }
        .skillSpeed {
            width: ${thisPokemon.speed*100/150}%;
            background-color: ${thisPokemon.speed >= 50 ? 'green' : 'red'}
        }        
        </style>
`,about = document.getElementById('about'),
baseStats = document.getElementById('baseStats'),
evolution = document.getElementById('evolution'),
btnContainer = document.getElementById("menuUl"),
btns = btnContainer.getElementsByTagName("li"),
navMenuEffect(),
navMenuNavigation(about)
}

// Mostra div relativa ao item de menu selecionado
function navMenuNavigation(target) {
    if (target !== 'about') {
        about.classList.remove('visible')
    }
    if (target !== 'baseStats') {
        baseStats.classList.remove('visible')
    }
    if (target !== 'evolution') {
        evolution.classList.remove('visible')
    }
    target.classList.add('visible')
}

// Loop em todos os botões e adiciona 'active' ao botão selecionado atual
function navMenuEffect() {
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace("active", "");
      this.className += " active";
    });
  }
}