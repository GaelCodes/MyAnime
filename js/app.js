const episodesContainer = document.getElementById('last-episodes-container');
const lastAnimesContainer = document.getElementById('last-animes-container');
const simulcastAnimesContainer = document.getElementById('simulcast-animes-container');


var animesEnEmision;
var lastAnimes;
var lastEpisodes;

fetch('https://cdn.jsdelivr.net/gh/GaelCodes/MyAnime@v0.1.4/DB_Animes/animes-news.json')
    .then(response => response.json())
    .then(

        animeNews => {

            lastEpisodes = animeNews['lastEpisodes'];
            lastAnimes = animeNews['lastAnimes'];
            animesEnEmision = animeNews['animesEnEmision'];

            animesEnEmision.forEach(
                anime => {
                    simulcastAnimesContainer.innerHTML += `<li>${anime}</li>`
                }
            );

            lastEpisodes.forEach(
                anime => {

                    episodesContainer.innerHTML +=
                        `
                                <a href="episodio/episodio.html?anime=one_piece&capitulo=1" class="card bg-transparent border-0 p-2 col-12 col-sm-6 col-md-6 col-lg-3">
                                <div class="aspect-ratio-thumbnail">
                                    <img src="${anime.thumbnail}" class="card-img-top" alt="Image not found">


                                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                                        <h5 class="card-title text-white">${anime.titulo}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">Episodio 10.000</h6>
                                    </div>
                                </div>

                                </a>
                            `;


                }
            );


            lastAnimes.forEach(
                anime => {

                    lastAnimesContainer.innerHTML +=
                        `
                            <div class="card bg-transparent border-0 p-2 col-12 col-sm-6 col-md-6 col-lg-3">
                                <div class="aspect-ratio-cartel">
                                <img src="assets/${anime.cartel}" class="card-img-top" alt="Image not found">
                                <div class="card-img-overlay d-flex flex-column justify-content-end align-items-center">
                                    <h5 class="card-title text-white">${anime.titulo}</h5>
                                </div>
                                </div>
                            </div>`;

                }
            );

        })
    .catch(error => {
        console.log(`Something was wrong : ${error}`);
    });