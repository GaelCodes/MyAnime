const episodesContainer = document.getElementById('last-episodes-container');
const lastAnimesContainer = document.getElementById('last-animes-container');
const simulcastAnimesContainer = document.getElementById('simulcast-animes-container');


var animesEnEmision;
var lastAnimes;
var lastEpisodes;

fetch('https://cdn.jsdelivr.net/gh/GaelCodes/MyAnime/DB_Animes/animes-news.json')
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
            )


            let i = 1;
            lastEpisodes.forEach(
                anime => {
                    if (i <= 12) {
                        episodesContainer.innerHTML +=
                            `
                                <a href="episodio.html?anime=${anime.titulo_}&capitulo=24" class="card col-12 col-sm-6 col-md-6 col-lg-3">
                                <div class="aspect-ratio-thumbnail">
                                    <img src="${anime.thumbnail}" class="card-img-top" alt="Image not found">


                                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                                        <h5 class="card-title text-white">${anime.titulo}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">Episodio 10.000</h6>
                                    </div>
                                </div>

                                </a>
                            `;
                        i++;
                    }

                }
            );


            lastAnimes.forEach(
                anime => {

                    lastAnimesContainer.innerHTML +=
                        `
                            <div class="card col-12 col-sm-6 col-md-6 col-lg-3">
                                <div class="aspect-ratio-cartel">
                                <img src="assets/${anime.cartel}" class="card-img-top" alt="Image not found">
                                <div class="card-img-overlay d-flex flex-column justify-content-end align-items-center">
                                    <h5 class="card-title text-white">${anime.titulo}</h5>
                                </div>
                                </div>
                            </div>`;

                }
            )

        })
    .catch(error => {
        console.log(`Something was wrong : ${error}`);
    });