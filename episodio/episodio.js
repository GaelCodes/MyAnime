const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const anime_ = urlParams.get('anime');
const anime = urlParams.get('anime').replace(/_/g, ' ').toUpperCase();
const capitulo = urlParams.get('capitulo');
const title = document.getElementById('title');

title.innerText = `${anime} episodio ${capitulo}`

var episodio;



fetch(`https://cdn.jsdelivr.net/gh/GaelCodes/MyAnime@v0.1.3/DB_Animes/${anime_}/cap${capitulo}.json`)
    .then(
        data => {
            console.log(data);
        }
    ).catch(
        error => {
            console.log(error);
        }
    )