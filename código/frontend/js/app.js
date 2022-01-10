// const episodesContainer = document.getElementById('last-episodes-container');
// const lastAnimesContainer = document.getElementById('last-animes-container');
// const simulcastAnimesContainer = document.getElementById('simulcast-animes-container');

// var animesEnEmision;
// var lastAnimes;
// var lastEpisodes;

// fetch('https://cdn.jsdelivr.net/gh/GaelCodes/MyAnime/DB_Animes/animes-news.json')
//     .then(response => response.json())
//     .then(

//         animeNews => {

//             lastEpisodes = animeNews['lastEpisodes'];
//             lastAnimes = animeNews['lastAnimes'];
//             animesEnEmision = animeNews['animesEnEmision'];

//             animesEnEmision.forEach(
//                 anime => {
//                     simulcastAnimesContainer.innerHTML += `<li>${anime}</li>`
//                 }
//             );

//             lastEpisodes.forEach(
//                 anime => {

//                     episodesContainer.innerHTML +=
//                         `
//                                 <a href="episodio/episodio.html?anime=${anime.titulo_}&capitulo=${anime.capitulo}" class="card bg-transparent border-0 p-2 col-12 col-sm-6 col-md-6 col-lg-3">
//                                 <div class="aspect-ratio-thumbnail">
//                                     <img src="${anime.thumbnail}" class="card-img-top" alt="Image not found">

//                                     <div class="card-img-overlay d-flex flex-column justify-content-end pb-0">
//                                         <h5 class="anime-title card-title text-white">${anime.titulo}</h5>
//                                         <h6 class="badge mb-2 text-dark bg-info">Episodio ${anime.capitulo}</h6>
//                                     </div>
//                                 </div>

//                                 </a>
//                             `;

//                 }
//             );

//             lastAnimes.forEach(
//                 anime => {

//                     lastAnimesContainer.innerHTML +=
//                         `
//                             <div class="card bg-transparent border-0 p-2 col-12 col-sm-6 col-md-6 col-lg-3">
//                                 <div class="aspect-ratio-cartel">
//                                 <img src="assets/${anime.cartel}" class="card-img-top" alt="Image not found">
//                                 <div class="card-img-overlay d-flex flex-column justify-content-end align-items-center">
//                                     <h5 class="card-title text-white">${anime.titulo}</h5>
//                                 </div>
//                                 </div>
//                             </div>`;

//                 }
//             );

//         })
//     .catch(error => {
//         console.log(`Something was wrong : ${error}`);
//     });

// Obtengo el manejador de la BBDD de firestore
// const db = getFirestore();

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
import {
    getFirestore,
    collection,
    getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyChDe5Ij8qSosKa8R3ProyVPHuOvNqDQZw",
    authDomain: "my-anime-499f8.firebaseapp.com",
    projectId: "my-anime-499f8",
    appId: "1:913818762906:web:a43521afcb1f841492e923",
    measurementId: "G-1841NZKRHL",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

class Anime {
    constructor(title, versions, platform, description, audio, subtitles, smallImgUrl, mediumImgUrl, largeImgUrl) {
        this.title = title;
        this.versions = versions;
        this.platform = platform;
        this.description = description;
        this.audio = audio;
        this.subtitles = subtitles;
        this.smallImgUrl = smallImgUrl;
        this.mediumImgUrl = mediumImgUrl;
        this.largeImgUrl = largeImgUrl;

        this.observers = [];
    }

    set title(title) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    copy() {
        return {
            title: this.title,
            versions: this.versions,
            description: this.description,
            platform: this.platform,
            audio: this.audio,
            subtitles: this.subtitles,
            smallImgUrl: this.smallImgUrl,
            mediumImgUrl: this.mediumImgUrl,
            largeImgUrl: this.largeImgUrl,
        };
    }

    registerObserver(observer) {
        this.observers.push(observer);
    }

    unregisterObserver(observer) {
        let observerIndex = this.observers.findIndex(observer);
        this.observers.splice(observerIndex, 1);
    }

    notifyAll() {
        this.observers.forEach((observer) => {
            observer.update(this.copy());
        });
    }
}

class AnimeView {
    constructor() {}

    static init() {
        AnimeView.animeContainer = document.getElementById("last-animes");
        // Inicio Creación del prototipo de la animeCard
        AnimeView.animeCardPrototype = document.createElement("li");
        AnimeView.animeCardPrototype.classList.add('animeCard');
        let animeVersions = document.createElement("select");
        animeVersions.classList.add("animeVersions");
        let animeThumbnail = document.createElement("img");
        animeThumbnail.classList.add("animeThumbnail");
        let animeDescription = document.createElement("p");
        animeDescription.classList.add("animeDescription");
        let animeAudio = document.createElement("p");
        animeAudio.classList.add("animeAudio");
        let animeSubtitles = document.createElement("p");
        animeSubtitles.classList.add("animeSubtitles");
        let animePlatformButton = document.createElement("button");
        animePlatformButton.classList.add("animePlatformButton");

        AnimeView.animeCardPrototype.append(animeVersions);
        AnimeView.animeCardPrototype.append(animePlatformButton);
        AnimeView.animeCardPrototype.append(animeThumbnail);
        AnimeView.animeCardPrototype.append(animeDescription);
        AnimeView.animeCardPrototype.append(animeAudio);
        AnimeView.animeCardPrototype.append(animeSubtitles);
        // Fin Creación del prototipo de la animeCard
    }

    populate(anime) {
        this.animeCard = AnimeView.animeCardPrototype.cloneNode(true);
        this.animeCard.querySelector(".animePlatformButton").innerText = anime.platform;
        this.animeCard.querySelector(".animeThumbnail").srcset = `${anime.smallImgUrl} 320w,${anime.mediumImgUrl} 480w,${anime.largeImgUrl} 800w`;
        this.animeCard.querySelector(".animeThumbnail").src = anime.smallImgUrl;
        this.animeCard.querySelector(".animeDescription").innerText = anime.description;
        this.animeCard.querySelector(".animeAudio").innerText = anime.audio;
        this.animeCard.querySelector(".animeSubtitles").innerText = anime.subtitles;

        // Por cada versión del anime que haya crearé
        // una opción en el select animeVersions

        anime.versions.forEach((version) => {
            let animeVersion = document.createElement("option");
            animeVersion.classList.add("animeVersion");
            animeVersion.value = version;
            animeVersion.innerText = version;
            this.animeCard.querySelector(".animeVersions").append(animeVersion);
        });

        AnimeView.animeContainer.append(this.animeCard);
    }

    update(anime) {
        this.animeCard.querySelector("animePlatformButton").innerText =
            anime.platform;
        this.animeCard.querySelector("animeThumbnail").src = anime.smallImgUrl;
        this.animeCard.querySelector(
            "animeThumbnail"
        ).srcset = `${anime.smallImgUrl} 320w,${anime.mediumImgUrl} 480w,${anime.largeImgUrl} 800w`;
        this.animeCard.querySelector("animeDescription").innerText =
            anime.description;
        this.animeCard.querySelector("animeAudio").innerText = anime.audio;
        this.animeCard.querySelector("animeSubtitles").innerText = anime.subtitles;

        // Por cada versión del anime que haya crearé
        // una opción en el select animeVersions

        anime.versions.forEach((version) => {
            let animeVersion = document.createElement("option");
            animeVersion.classList.add("animeVersion");
            animeVersion.value = version;
            animeVersion.innerText = version;
            this.animeCard.querySelector("animeVersions").append(animeVersion);
        });
    }
}

class AnimeController {
    constructor(anime, animeView) {
        this.anime = anime;
        this.animeView = animeView;

        this.anime.registerObserver(this.animeView);
        this.animeView.populate(this.anime.copy());
    }

    static init() {
        // TODO: Obtener todos los datos, inicializar la lógica desde aquí
        // subscriberse a cambios de la BBDD

        getDocs(collection(db, "animes")).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                let animeData = doc.data();
                let anime = new Anime(
                    animeData.title,
                    animeData.versions,
                    animeData.platform,
                    animeData.description,
                    animeData.audio,
                    animeData.subtitles,
                    animeData.smallImgUrl,
                    animeData.mediumImgUrl,
                    animeData.largeImgUrl
                );
                let animeView = new AnimeView();
                let animeController = new AnimeController(anime, animeView);
            });
        });
    }

    subscribeToCurrentVersion() {
        // TODO: Desarrollar subscripción a versión actual del anime
    }

    unSubscribeFromCurrentVersion() {
        // TODO: Desarrollar desubscripción a versión actual del anime
    }

    changeVersion() {
        // TODO: Cambiar de versión del anime según los cambios del select
    }

    activateViewForLoggedUser() {
        // TODO: Habilitar vista de subscribciones cuando el usuario está loggeado
    }

    unActivateViewForLoggedUser() {
        // TODO: Deshabilitar lista de subscribciones cuando el usuario no está loggeado
    }
}

class AnimeEpisode {}

class AnimeEpisodeView {}

class AnimeEpisodeController {}

window.addEventListener("load", function() {
    AnimeView.init();
    AnimeController.init();
});