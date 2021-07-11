const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const anime_ = urlParams.get('anime');
// const anime = urlParams.get('anime').replace(/_/g, ' ').toUpperCase();
const num = urlParams.get('capitulo');



const title = document.getElementById('title');
const video = document.getElementById('video');
const videoAuthor = document.getElementById('videoAuthor');
const comments = document.getElementById('comments');


// title.innerText = `${anime} episodio ${num}`;

var episode;



fetch(`https://cdn.jsdelivr.net/gh/GaelCodes/MyAnime@v0.1.6/DB_Animes/${anime_}/cap${num}.json`)
    .then(response => response.json())
    .then(
        data => {
            console.log(data);
            episode = data;
            // Pintar titulo y episodio
            title.innerText = `${episode.title} episodio ${episode.num}`

            // Definir video src with author
            video.src = episode.file;
            videoAuthor.innerText = episode.author;

            // Mostrar comentarios
            episode.comments.forEach(
                comment => {

                    comments.innerHTML =
                        `
                     <li>
                        <div class="d-flex flex-row align-items-center">
                            <div class="flex-shrink-0">
                                <img src="${comment.picture}" alt="Image not found" class="img-fluid">
                            </div>
                            <div class="flex-grow-1 ms-4">
                                <p class="m-0">${comment.author}</p>
                                <p class="m-0">${comment.text}</p>
                            </div>
                        </div>
                     </li>                        
                        `

                    if (comment.responses) {
                        comments.innerHTML += '<ul class="response-list">';


                        comment.responses.forEach(

                            response => {
                                comment.innerHTML +=


                                    `
                                    <li>
                                        <div class="d-flex flex-row align-items-center">
                                            <div class="flex-shrink-0">
                                                <img src="${response.picture}" alt="Image not found" class="img-fluid">
                                            </div>
                                            <div class="flex-grow-1 ms-4">
                                                <p class="m-0">${response.author}</p>
                                                <p class="m-0">${response.text}</p>
                                            </div>
                                        </div>
                                    </li>
                                    `
                            }
                        )

                        ;
                        comments.innerHTML += '</ul>';

                    };

                });


        })
    .catch(
        error => {
            console.log(error);
        }
    )
