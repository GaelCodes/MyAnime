import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-analytics.js"
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyChDe5Ij8qSosKa8R3ProyVPHuOvNqDQZw",
    projectId: "my-anime-499f8",
    appId: "1:913818762906:web:a43521afcb1f841492e923",
    authDomain: "my-anime-499f8.firebaseapp.com",
    measurementId: "G-1841NZKRHL",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

class Anime {
    constructor(title, platform, description, mediaThumbnails) {
        this.observers = [];
        this.title = title;
        this.platform = platform;
        this.description = description;
        this.mediaThumbnails = mediaThumbnails;
        this.versions = [];

        this.getVersions();

    }

    set title(title) {
        this._title = title;

    }

    get title() {
        return this._title;

    }

    set versions(newVersions) {
        this._versions = newVersions;
        this.notifyAll();

    }

    get versions() {
        return this._versions;

    }

    set version(newVersion) {
        this._version = newVersion;
        this.notifyAll();

    }

    get version() {
        return this._version;

    }

    copy() {
        return {
            title: this.title,
            versions: this.versions,
            version: this.version,
            description: this.description,
            platform: this.platform,
            audio: this.audio,
            mediaThumbnails: this.mediaThumbnails
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
        // Si no hay observers no hará nada
        if (this.observers.length) {
            this.observers.forEach((observer) => {
                observer.update(this.copy());
            });

        }
    }

    updatedUser() {
        this.notifyAll();
    }

    getVersions() {
        // Obtener todas las versiones del anime

        getDocs(collection(db, `animes/${this.title}/versions`)).then(
            (querySnapshot) => {

                querySnapshot.forEach((versionDoc) => {
                    let versionRef = versionDoc.ref;
                    let versionData = versionDoc.data();

                    // TODO: Reto - investigar porque el push no 
                    // detona el setter de la propiedad
                    // 
                    let newVersions = this.versions;
                    newVersions.push({
                        reference: versionRef,
                        data: versionData
                    });
                    this.versions = newVersions;

                });

                this.version = this.versions[0];
            }
        );
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

        // Audio Div




        let animeAudioDiv = document.createElement('div');
        animeAudioDiv.classList.add('animeAudioDiv');
        animeAudioDiv.innerHTML = '<span class="animeIndex"> Idioma </span>';

        let animeAudio = document.createElement("p");
        animeAudio.classList.add("animeAudio");

        animeAudioDiv.append(animeAudio);

        // Subscription Div
        let animeSubscriptionDiv = document.createElement('div');
        animeSubscriptionDiv.classList.add('animeSubscriptionDiv');

        let animeSubscriptionText = document.createElement("p");
        animeSubscriptionText.innerText = 'Subscribete a este maravilloso anime';
        animeSubscriptionText.classList.add('animeSubscriptionText', 'animeIndex');

        let animeSubscriptionBox = document.createElement("input");
        animeSubscriptionBox.type = "checkbox";
        animeSubscriptionBox.classList.add("animeSubscriptionBox");

        animeSubscriptionDiv.append(animeSubscriptionBox);
        animeSubscriptionDiv.append(animeSubscriptionText);

        // Botón de plataforma
        let animePlatformButton = document.createElement("button");
        animePlatformButton.classList.add("animePlatformButton");

        AnimeView.animeCardPrototype.append(animeVersions);
        AnimeView.animeCardPrototype.append(animeThumbnail);
        AnimeView.animeCardPrototype.append(animeDescription);
        AnimeView.animeCardPrototype.append(animeAudioDiv);
        AnimeView.animeCardPrototype.append(animeSubscriptionDiv);
        AnimeView.animeCardPrototype.append(animePlatformButton);
        // Fin Creación del prototipo de la animeCard
    }

    populate(anime) {
        this.animeCard = AnimeView.animeCardPrototype.cloneNode(true);
        this.animeCard.querySelector(".animeThumbnail").srcset = `${anime.mediaThumbnails.small.url} ${anime.mediaThumbnails.small.width}w,${anime.mediaThumbnails.medium.url} ${anime.mediaThumbnails.medium.width}w,${anime.mediaThumbnails.full.url} ${anime.mediaThumbnails.full.width}w`;
        this.animeCard.querySelector(".animeThumbnail").sizes =
            "(max-width: 320px) 280px, (max-width: 480px) 440px, 800px";
        this.animeCard.querySelector(".animeThumbnail").src = anime.mediaThumbnails.full.url;
        this.animeCard.querySelector(".animeDescription").innerText = anime.description;
        this.animeCard.querySelector(".animeAudio").innerText = anime.audio;
        this.animeCard.querySelector(".animePlatformButton").innerText = anime.platform;

        // Por cada versión del anime que haya crearé
        // una opción en el select animeVersions
        // 
        // TODO: Reto - ¿ Es este razonamiento correcto ? -> Las versiones del anime se obtendrán en tiempos distintos
        // estableceré las versiones en el update en cuanto se hayan obtenido


        // Mostrar o ocultar el checkbox dependiendo de si el usuario
        // está loggeado o no
        if (myAnimeUser.status === 'logged') {
            let animeSubscriptionBox = this.animeCard.querySelector('.animeSubscriptionBox');
            animeSubscriptionBox.removeAttribute('disabled');
            let animeSubscriptionText = this.animeCard.querySelector('.animeSubscriptionText');
            animeSubscriptionText.classList.remove('text-muted');

        } else if (myAnimeUser.status === 'non-logged') {
            let animeSubscriptionBox = this.animeCard.querySelector('.animeSubscriptionBox');
            animeSubscriptionBox.setAttribute('disabled', '');
            let animeSubscriptionText = this.animeCard.querySelector('.animeSubscriptionText');
            animeSubscriptionText.classList.add('text-muted');
        }


        AnimeView.animeContainer.append(this.animeCard);
    }

    update(anime) {
        this.animeCard.querySelector(".animePlatformButton").innerText =
            anime.platform;

        this.animeCard.querySelector(".animeThumbnail").srcset = `${anime.mediaThumbnails.small.url} ${anime.mediaThumbnails.small.width}w,${anime.mediaThumbnails.medium.url} ${anime.mediaThumbnails.medium.width}w,${anime.mediaThumbnails.full.url} ${anime.mediaThumbnails.full.width}w`;
        this.animeCard.querySelector(".animeThumbnail").sizes =
            "(max-width: 320px) 280px, (max-width: 480px) 440px, 800px";
        this.animeCard.querySelector(".animeThumbnail").src = anime.mediaThumbnails.full.url;
        this.animeCard.querySelector(".animeDescription").innerText =
            anime.description;

        // Si el anime ya ha obtenido alguna versión muestra los datos
        if (anime.version) {
            this.animeCard.querySelector(".animeAudio").innerText = anime.version.data.audio;

        }

        // Por cada versión del anime que haya crearé
        // una opción en el select animeVersions
        // 

        // Marcaré como seleccionado el option que corresponda
        // con la versión actual del anime 1/2
        let versionIndex = (anime.version) ? anime.versions.indexOf(anime.version) : '';

        this.animeCard.querySelector(".animeVersions").innerHTML = '';
        for (let i = 0; i < anime.versions.length; i++) {
            const version = anime.versions[i];

            let animeVersion = document.createElement("option");
            animeVersion.classList.add("animeVersion");
            animeVersion.setAttribute('data-version-index', i);
            animeVersion.value = version.data.title;
            animeVersion.innerText = version.data.title;

            // Marcaré como seleccionado el option que corresponda
            // con la versión actual del anime 2/2
            if (versionIndex === i) {
                animeVersion.setAttribute('selected', '');
            }

            this.animeCard.querySelector(".animeVersions").append(animeVersion);

        }

        // Habilitar o deshabilitar el checkbox dependiendo de si el usuario
        // está loggeado o no
        if (myAnimeUser.status === 'logged') {
            let animeSubscriptionBox = this.animeCard.querySelector('.animeSubscriptionBox');
            animeSubscriptionBox.removeAttribute('disabled');
            let animeSubscriptionText = this.animeCard.querySelector('.animeSubscriptionText');
            animeSubscriptionText.classList.remove('text-muted');

            // Checkear o no el checkbox dependiendo de si el usuario está subscrito a la versión del anime
            //  if myAnimeUser.subscriptions contains this.version.reference checked else not checked
            if (anime.version) {

                // TODO: Reto - Averiguar porque reference 
                // 

                let subscribed = false;

                for (let i = 0; i < myAnimeUser.subscriptions.length; i++) {
                    const subscribedVersionRef = myAnimeUser.subscriptions[i];

                    if (subscribedVersionRef.id === anime.version.reference.id) {
                        subscribed = true;
                        break;
                    }

                }

                // TODO: 
                animeSubscriptionBox.checked = (subscribed) ? true : false;

            }


        } else if (myAnimeUser.status === 'non-logged') {
            let animeSubscriptionBox = this.animeCard.querySelector('.animeSubscriptionBox');
            animeSubscriptionBox.setAttribute('disabled', '');
            let animeSubscriptionText = this.animeCard.querySelector('.animeSubscriptionText');
            animeSubscriptionText.classList.add('text-muted');

        }



    }
}

class AnimeController {
    constructor(anime, animeView) {
        this.anime = anime;
        this.animeView = animeView;

        this.animeView.populate(this.anime.copy());
        this.anime.registerObserver(this.animeView);

        // Eventos
        let animeSubscriptionBox = this.animeView.animeCard.querySelector('.animeSubscriptionBox');
        animeSubscriptionBox.addEventListener('change', this.changeSubscription.bind(this));

        let animeSelect = this.animeView.animeCard.querySelector('.animeVersions');
        animeSelect.addEventListener('change', this.changeVersion.bind(this));
    }

    static init() {
        // TODO: Obtener todos los datos, inicializar la lógica desde aquí
        // subscriberse a cambios de la BBDD
        AnimeController.episodesPromises = [];
        getDocs(collection(db, "animes")).then((querySnapshot) => {

            querySnapshot.forEach((animeDoc) => {
                let animeData = animeDoc.data();
                // TODO: Backend - Conseguir miniaturas del anime
                animeData.mediaThumbnails = {};
                animeData.mediaThumbnails.full = {
                    url: 'https://dummyimage.com/640x360/0a0040/d1d4f0',
                    width: 640,
                    heigh: 360
                }

                animeData.mediaThumbnails.medium = {
                    url: 'https://dummyimage.com/100x56/0a0040/d1d4f0',
                    width: 100,
                    heigh: 56
                }

                animeData.mediaThumbnails.small = {
                    url: 'https://dummyimage.com/50x28/0a0040/d1d4f0',
                    width: 50,
                    heigh: 28
                }

                let anime = new Anime(
                    animeData.title,
                    'Crunchyroll',
                    'Descripción del anime: lorem Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
                    animeData.mediaThumbnails
                );
                let animeView = new AnimeView();
                let animeController = new AnimeController(anime, animeView);

                // Registro a los animes como observers de myAnimeUser
                // En caso que el status de myAnimeUser cambie, los animes también tienen que cambiar
                myAnimeUser.registerObserver(anime);


                // Reuno las promesas de los episodios de la versión original
                AnimeController.episodesPromises.push(animeController.getEpisodes());
            });

        }).finally(() => {
            Promise.all(AnimeController.episodesPromises).then(
                (querySnapshots) => {

                    // A partir de los querySnapshots que devuelven las promesas
                    // obtengo los documentos de los episodes y creo los episodes a partir de ellos

                    querySnapshots.forEach(
                        (querySnapshot) => {

                            querySnapshot.forEach(
                                (episodeDoc) => {
                                    let episodeData = episodeDoc.data();

                                    let episode = new Episode(episodeData.availableVersions, episodeData.crunchyrollEpisodeNumber, episodeData.link, episodeData.mediaThumbnail, episodeData.crunchyrollPremiumPubDate, episodeData.crunchyrollFreePubDate, episodeData.subtitles);
                                    let episodeView = new EpisodeView();
                                    let episodeController = new EpisodeController(episode, episodeView);

                                    // Registro a los episodes como observers de myAnimeUser
                                    // En caso que el status de myAnimeUser cambie, los episodes también tienen que cambiar
                                    myAnimeUser.registerObserver(episode);

                                    // Guardo los episodios para después ordenarlos y 
                                    // mostrarlos en orden
                                    EpisodeController.episodes.push({ 'model': episode, 'view': episodeView, 'controller': episodeController });
                                }
                            );
                        }
                    );
                }
            ).finally(
                () => {
                    // TODO: Buscar forma abreviada de ejecutar esto
                    EpisodeController.showEpisodes();
                }
            );
        });
    }

    getEpisodes() {
        return getDocs(collection(db, `animes/${this.anime.title}/versions/${this.anime.title}/episodes`));
    }

    subscribeToCurrentVersion() {
        // TODO: Desarrollar subscripción a versión actual del anime
    }

    unSubscribeFromCurrentVersion() {
        // TODO: Desarrollar desubscripción a versión actual del anime
    }

    changeVersion(event) {
        let versionIndex = event.target.selectedOptions[0].dataset.versionIndex;
        versionIndex = parseInt(versionIndex);


        this.anime.version = this.anime.versions[versionIndex];

    }

    changeSubscription(event) {
        let checked = event.target.checked;

        if (checked) {
            // Añadir subscription a la versión seleccionada del anime
            // 
            let versionRef = this.anime.version.reference;
            let userRef = doc(db, "users", myAnimeUser.id);

            updateDoc(userRef, {
                subscriptions: arrayUnion(versionRef)
            });

        } else {
            // Quitar subscription a la versión seleccionada del anime
            // 
            let versionRef = this.anime.version.reference;
            let userRef = doc(db, "users", myAnimeUser.id);

            updateDoc(userRef, {
                subscriptions: arrayRemove(versionRef)
            });

        }
    }

}

class Episode {
    constructor(availableVersionsRefs = [], number, link, mediaThumbnail, premiumPubDate, freePubDate, subtitles) {
        this.observers = [];
        this.number = number;
        this.link = link;
        this.premiumPubDate = premiumPubDate;
        this.freePubDate = freePubDate;
        this.subtitles = subtitles;
        this.thumbnails = this.filterThumbnails(mediaThumbnail);

        // Obtengo los documentos de las versiones del episodio
        // posteriormento se los asigno a la propiedad this.availableVersions
        this.availableVersions = []
        this.getVersions(availableVersionsRefs);

    }

    set premiumPubDate(stringDate) {
        this._premiumPubDate = new Date(stringDate);
    }

    get premiumPubDate() {
        return this._premiumPubDate;
    }

    set freePubDate(stringDate) {
        this._freePubDate = new Date(stringDate);
    }

    get freePubDate() {
        return this._freePubDate;
    }

    set version(newVersion) {
        this._version = newVersion;

        // TODO: Al cambiar la versión del capítulo
        // Obtener los datos del episodio de la nueva versión
        // 
        // Datos relevantes: link, subtitles, fechas de publicación 1/2

        this.getVersionEpisode();
        this.notifyAll();
    }

    get version() {
        return this._version;
    }

    registerObserver(observer) {
        this.observers.push(observer);
    }

    unregisterObserver(observer) {
        let observerIndex = this.observers.findIndex(observer);
        this.observers.splice(observerIndex, 1);
    }

    copy() {
        return {
            versionTitle: this.versionTitle,
            version: this.version,
            availableVersions: this.availableVersions,
            thumbnails: this.thumbnails,
            number: this.number,
            premiumPubDate: this.premiumPubDate,
            freePubDate: this.freePubDate,
            subtitles: this.subtitles,
            link: this.link,
        }
    }

    notifyAll() {

        for (let i = 0; i < this.observers.length; i++) {
            const observer = this.observers[i];
            observer.update(this.copy());

        }
    }

    updatedUser() {
        this.notifyAll();
    }

    filterThumbnails(mediaThumbnail) {
        // TODO: Es necesario formatear los datos desde el backend


        let thumbnails = {
            'thumb': '',
            'full': '',
            'large': '',
            'medium': '',
            'small': '',
        };

        mediaThumbnail.forEach((thumbnail) => {

            let url = thumbnail['@attributes'].url;

            if (url.includes('thumb')) {

                thumbnails.thumb = {
                    'url': thumbnail['@attributes'].url,
                    'width': thumbnail['@attributes'].width,
                    'height': thumbnail['@attributes'].heigh,
                }

            } else if (url.includes('full')) {

                thumbnails.full = {
                    'url': thumbnail['@attributes'].url,
                    'width': thumbnail['@attributes'].width,
                    'height': thumbnail['@attributes'].heigh,
                }

            } else if (url.includes('large')) {

                thumbnails.large = {
                    'url': thumbnail['@attributes'].url,
                    'width': thumbnail['@attributes'].width,
                    'height': thumbnail['@attributes'].heigh,
                }

            } else if (url.includes('medium')) {

                thumbnails.medium = {
                    'url': thumbnail['@attributes'].url,
                    'width': thumbnail['@attributes'].width,
                    'height': thumbnail['@attributes'].heigh,
                }

            } else if (url.includes('small')) {

                thumbnails.small = {
                    'url': thumbnail['@attributes'].url,
                    'width': thumbnail['@attributes'].width,
                    'height': thumbnail['@attributes'].heigh,
                }

            }


        });

        return thumbnails;
    }

    async getVersions(availableVersionsRefs) {

        for (let i = 0; i < availableVersionsRefs.length; i++) {
            const versionRef = availableVersionsRefs[i];
            let versionDoc = await getDoc(versionRef);

            this.availableVersions.push({
                reference: versionRef,
                data: versionDoc.data()
            });

        }
        this.version = this.availableVersions[0];
    }

    getVersionEpisode() {
        // TODO: Al cambiar la versión del capítulo
        // Obtener los datos del episodio de la nueva versión
        // 
        // Datos relevantes: link, subtitles, fechas de publicación 2/2

        let episodesRef = this.version.reference.path + "/episodes";

        getDoc(doc(db, episodesRef, "Episode " + this.number)).then(
            (episodeDoc) => {
                let episodeData = episodeDoc.data();

                this.link = episodeData.link;
                this.premiumPubDate = episodeData.crunchyrollPremiumPubDate;
                this.freePubDate = episodeData.crunchyrollFreePubDate;
                this.subtitles = episodeData.subtitles;

                this.notifyAll();

            }
        )
    }
}

class EpisodeView {
    constructor() {

    }

    static init() {

        EpisodeView.episodesContainer = document.getElementById('last-episodes');

        // Inicio creación prototipo episodeCard
        EpisodeView.episodeCardPrototype = document.createElement('li');
        EpisodeView.episodeCardPrototype.classList.add('episodeCard');

        let episodeVersions = document.createElement('select');
        episodeVersions.classList.add('episodeVersions');

        let episodeThumbnail = document.createElement('img');
        episodeThumbnail.classList.add('episodeThumbnail');

        let episodeVersionTitle = document.createElement('p');
        episodeVersionTitle.classList.add('episodeVersionTitle');

        let episodeNumber = document.createElement('p');
        episodeNumber.classList.add('episodeNumber');

        // Language & subtitles div

        let episodeLanguagesDiv = document.createElement('div');
        episodeLanguagesDiv.classList.add('episodeLanguagesDiv');

        // Audio div
        let episodeAudioDiv = document.createElement('div');
        episodeAudioDiv.classList.add('episodeAudioDiv');
        episodeAudioDiv.innerHTML = '<span class="episodeIndex"> Idioma </span>';

        let episodeVersionAudio = document.createElement('p');
        episodeVersionAudio.classList.add('episodeVersionAudio');

        episodeAudioDiv.append(episodeVersionAudio);

        // Subtitles div
        let episodeSubtitlesDiv = document.createElement('div');
        episodeSubtitlesDiv.classList.add('episodeSubtitlesDiv');
        episodeSubtitlesDiv.innerHTML = '<span class="episodeIndex"> Subtítulos </span>';

        let episodeSubtitles = document.createElement('ul');
        episodeSubtitles.classList.add('episodeSubtitles');

        episodeSubtitlesDiv.append(episodeSubtitles);


        episodeLanguagesDiv.append(episodeAudioDiv);
        episodeLanguagesDiv.append(episodeSubtitlesDiv);


        // Dates div
        let episodeDatesDiv = document.createElement('div');
        episodeDatesDiv.classList.add('episodeDatesDiv');

        // Premium Pub Date div
        let episodePremiumDateDiv = document.createElement('div');
        episodePremiumDateDiv.classList.add('episodePremiumDateDiv');
        episodePremiumDateDiv.innerHTML = '<span class="episodeIndex"> Premium </span>';

        let episodePremiumPubDate = document.createElement('p');
        episodePremiumPubDate.classList.add('episodePremiumPubDate');

        episodePremiumDateDiv.append(episodePremiumPubDate);


        // Free Pub Date div
        let episodeFreeDateDiv = document.createElement('div');
        episodeFreeDateDiv.classList.add('episodeFreeDateDiv');
        episodeFreeDateDiv.innerHTML = '<span class="episodeIndex"> Gratis </span>';

        let episodeFreePubDate = document.createElement('p');
        episodeFreePubDate.classList.add('episodeFreePubDate');

        episodeFreeDateDiv.append(episodeFreePubDate);


        episodeDatesDiv.append(episodePremiumDateDiv);
        episodeDatesDiv.append(episodeFreeDateDiv);

        // Subscription Div
        let episodeSubscriptionDiv = document.createElement('div');
        episodeSubscriptionDiv.classList.add('episodeSubscriptionDiv');

        let episodeSubscriptionText = document.createElement("p");
        episodeSubscriptionText.innerText = 'Subscribete a este maravilloso anime';
        episodeSubscriptionText.classList.add('episodeSubscriptionText', 'episodeIndex');

        let episodeSubscriptionBox = document.createElement("input");
        episodeSubscriptionBox.type = "checkbox";
        episodeSubscriptionBox.classList.add("episodeSubscriptionBox");

        episodeSubscriptionDiv.append(episodeSubscriptionBox);
        episodeSubscriptionDiv.append(episodeSubscriptionText);

        // Botón ver ahora
        let episodeViewNowButton = document.createElement('a');
        episodeViewNowButton.setAttribute('target', '_blank');
        episodeViewNowButton.classList.add('episodeViewNowButton');

        EpisodeView.episodeCardPrototype.append(episodeVersions);
        EpisodeView.episodeCardPrototype.append(episodeThumbnail);
        EpisodeView.episodeCardPrototype.append(episodeVersionTitle);
        EpisodeView.episodeCardPrototype.append(episodeNumber);
        EpisodeView.episodeCardPrototype.append(episodeLanguagesDiv);
        EpisodeView.episodeCardPrototype.append(episodeDatesDiv);
        EpisodeView.episodeCardPrototype.append(episodeSubscriptionDiv);
        EpisodeView.episodeCardPrototype.append(episodeViewNowButton);
        // Fin creación prototipo episodeCard
    }

    populate(episode) {

        this.episodeCard = EpisodeView.episodeCardPrototype.cloneNode(true);


        // Genero las versiones disponibles en forma de options
        // dentro del select episodeVersions

        for (let i = 0; i < episode.availableVersions.length; i++) {
            const availableVersion = episode.availableVersions[i];

            let episodeVersion = document.createElement('option');
            episodeVersion.value = availableVersion.data.title;
            episodeVersion.innerText = availableVersion.data.title;

            this.episodeCard.querySelector('.episodeVersions').append(episodeVersion);
        }

        // Los datos referentes a la versión (versionTitle y versionAudio)
        // los inicio en el update (en cuanto se haya obtenido la versión)
        // 
        this.episodeCard.querySelector('.episodeThumbnail').src = episode.thumbnails.full.url;
        this.episodeCard.querySelector('.episodeNumber').innerText = 'Episodio ' + episode.number;

        // Subtitles y dates
        for (let i = 0; i < episode.subtitles.length; i++) {
            const subtitle = episode.subtitles[i];

            let episodeSubtitle = document.createElement('li');
            episodeSubtitle.classList.add('episodeSubtitle');
            episodeSubtitle.innerText = subtitle;

            this.episodeCard.querySelector('.episodeSubtitles').append(episodeSubtitle);
        }
        this.episodeCard.querySelector('.episodePremiumPubDate').innerText = episode.premiumPubDate.toLocaleString();
        this.episodeCard.querySelector('.episodeFreePubDate').innerText = episode.freePubDate.toLocaleString();


        // TODO: Declarar el contenido del botón en la creación del element
        this.episodeCard.querySelector('.episodeViewNowButton').innerText = 'Ver ahora';
        this.episodeCard.querySelector('.episodeViewNowButton').href = episode.link;


        // Habilitar o deshabilitar el checkbox dependiendo de si el usuario
        // está loggeado o no
        if (myAnimeUser.status === 'logged') {
            let episodeSubscriptionBox = this.episodeCard.querySelector('.episodeSubscriptionBox');
            episodeSubscriptionBox.removeAttribute('disabled');
            let episodeSubscriptionText = this.episodeCard.querySelector('.episodeSubscriptionText');
            episodeSubscriptionText.classList.remove('text-muted');

        } else if (myAnimeUser.status === 'non-logged') {
            let episodeSubscriptionBox = this.episodeCard.querySelector('.episodeSubscriptionBox');
            episodeSubscriptionBox.setAttribute('disabled', '');
            let episodeSubscriptionText = this.episodeCard.querySelector('.episodeSubscriptionText');
            episodeSubscriptionText.classList.add('text-muted');

        }

        EpisodeView.episodesContainer.append(this.episodeCard);

    }

    update(episode) {
        this.episodeCard.querySelector('.episodeThumbnail').src = episode.thumbnails.full.url;
        this.episodeCard.querySelector('.episodeNumber').innerText = 'Episodio ' + episode.number;


        // Si el episode ya ha obtenido alguna versión muestra los datos
        if (episode.version) {
            this.episodeCard.querySelector(".episodeVersionTitle").innerText = episode.version.data.title;
            this.episodeCard.querySelector(".episodeVersionAudio").innerText = episode.version.data.audio;

        }

        // Marcaré como seleccionado el option que corresponda
        // con la versión actual del anime 1/2
        let versionIndex = (episode.version) ? episode.availableVersions.indexOf(episode.version) : '';

        this.episodeCard.querySelector('.episodeVersions').innerHTML = '';
        for (let i = 0; i < episode.availableVersions.length; i++) {
            const availableVersion = episode.availableVersions[i];

            let episodeVersion = document.createElement('option');
            episodeVersion.setAttribute('data-version-index', i);
            episodeVersion.value = availableVersion.data.title;
            episodeVersion.innerText = availableVersion.data.title;

            // Marcaré como seleccionado el option que corresponda
            // con la versión actual del anime 2/2
            if (versionIndex === i) {
                episodeVersion.setAttribute('selected', '');
            }

            this.episodeCard.querySelector('.episodeVersions').append(episodeVersion);
        }


        // Subtitles y dates
        this.episodeCard.querySelector('.episodeSubtitles').innerHTML = '';
        for (let i = 0; i < episode.subtitles.length; i++) {
            const subtitle = episode.subtitles[i];

            let episodeSubtitle = document.createElement('li');
            episodeSubtitle.classList.add('episodeSubtitle');
            episodeSubtitle.innerText = subtitle;

            this.episodeCard.querySelector('.episodeSubtitles').append(episodeSubtitle);
        }
        this.episodeCard.querySelector('.episodePremiumPubDate').innerText = episode.premiumPubDate.toLocaleString();
        this.episodeCard.querySelector('.episodeFreePubDate').innerText = episode.freePubDate.toLocaleString();

        // TODO: Mostrar el idioma dependiendo de la versión del anime


        // Mostrar o ocultar el checkbox dependiendo de si el usuario
        // está loggeado o no
        if (myAnimeUser.status === 'logged') {
            let episodeSubscriptionBox = this.episodeCard.querySelector('.episodeSubscriptionBox');
            episodeSubscriptionBox.removeAttribute('disabled', '');
            let episodeSubscriptionText = this.episodeCard.querySelector('.episodeSubscriptionText');
            episodeSubscriptionText.classList.remove('text-muted');

            // Checkear o no el checkbox dependiendo de si el usuario está subscrito a la versión del anime
            //  if myAnimeUser.subscriptions contains this.version.reference checked else not checked
            if (episode.version) {

                // TODO: Reto - Averiguar porque reference 
                // 

                let subscribed = false;

                for (let i = 0; i < myAnimeUser.subscriptions.length; i++) {
                    const subscribedVersionRef = myAnimeUser.subscriptions[i];

                    if (subscribedVersionRef.id === episode.version.reference.id) {
                        subscribed = true;
                        break;
                    }

                }

                // TODO: 
                episodeSubscriptionBox.checked = (subscribed) ? true : false;

            }

        } else if (myAnimeUser.status === 'non-logged') {
            let episodeSubscriptionBox = this.episodeCard.querySelector('.episodeSubscriptionBox');
            episodeSubscriptionBox.setAttribute('disabled', '');
            let episodeSubscriptionText = this.episodeCard.querySelector('.episodeSubscriptionText');
            episodeSubscriptionText.classList.add('text-muted');

        }

    }

    episodeCardDisable() {
        // TODO: Tornar la episodeCard gris
    }

    episodeCardEnable() {
        // TODO: Tornar la episodeCard al color por defecto
    }
}

class EpisodeController {
    constructor(episode, episodeView) {
        this.episode = episode;
        this.episodeView = episodeView;

        this.episodeView.populate(this.episode.copy());
        this.episode.registerObserver(this.episodeView);

        // Eventos
        let episodeSubscriptionBox = this.episodeView.episodeCard.querySelector('.episodeSubscriptionBox');
        episodeSubscriptionBox.addEventListener('change', this.changeSubscription.bind(this));

        let episodeSelect = this.episodeView.episodeCard.querySelector('.episodeVersions');
        episodeSelect.addEventListener('change', this.changeVersion.bind(this));
    }

    static set userStatus(newUserStatus) {
        this._userStatus = newUserStatus;
        EpisodeController.notifyAllEpisodes();
    }

    static get userStatus() {
        return this._userStatus;
    }

    static init() {
        EpisodeController.episodes = [];
    }

    static showEpisodes() {
        EpisodeController.orderEpisodes();
        EpisodeController.episodes.forEach(
            (episodeComponent) => {
                EpisodeView.episodesContainer.append(episodeComponent.view.episodeCard);
            }
        )
    }

    static orderEpisodes() {
        EpisodeController.episodes.sort(function(episodeA, episodeB) {

            // Los ordeno de más reciente a más antiguo
            // 
            return -(episodeA.model.premiumPubDate - episodeB.model.premiumPubDate);

        })
    }

    changeSubscription(event) {
        let checked = event.target.checked;

        if (checked) {
            // Añadir subscription a la versión seleccionada del anime
            // 
            let versionRef = this.episode.version.reference;
            let userRef = doc(db, "users", myAnimeUser.id);

            updateDoc(userRef, {
                subscriptions: arrayUnion(versionRef)
            });

        } else {
            // Quitar subscription a la versión seleccionada del anime
            // 
            let versionRef = this.episode.version.reference;
            let userRef = doc(db, "users", myAnimeUser.id);

            updateDoc(userRef, {
                subscriptions: arrayRemove(versionRef)
            });

        }
    }

    changeVersion(event) {
        let versionIndex = event.target.selectedOptions[0].dataset.versionIndex;
        versionIndex = parseInt(versionIndex);

        this.episode.version = this.episode.availableVersions[versionIndex];
    }
}

class User {
    constructor() {
        this.observers = [];
        this.email = '';
        this.id = '';
        this.status = 'non-logged';
        this.subscriptions = []
    }

    set status(status) {
        this._status = status;
        this.notifyAll();
    }

    get status() {
        return this._status;
    }

    set subscriptions(subscriptions) {
        this._subscriptions = subscriptions;
        this.notifyAll();
    }

    get subscriptions() {
        return this._subscriptions;
    }

    registerObserver(observer) {
        this.observers.push(observer);
    }

    unregisterObserver(observer) {
        let observerIndex = this.observers.findIndex(observer);
        this.observers.splice(observerIndex, 1);
    }

    copy() {
        return {
            status: this.status,
            subscriptions: this.subscriptions
        }
    }

    notifyAll() {
        for (let i = 0; i < this.observers.length; i++) {
            const observer = this.observers[i];
            observer.updatedUser();

        }
    }
}

class UserController {
    constructor() {

    }

    static init() {
        // Control del estado de la sesión
        UserController.controlLoginStatus();

        // Login
        UserController.showLoginModalButton = document.getElementById('showLoginModalButton');
        UserController.loginModal = document.getElementById('loginModal');
        UserController.loginForm = document.getElementById('loginForm');
        UserController.inputLoginEmail = document.getElementById('inputLoginEmail');
        UserController.inputLoginPassword = document.getElementById('inputLoginPassword');
        UserController.loginButton = document.getElementById('loginButton');

        UserController.loginModal.addEventListener('keyup', UserController.logIn);
        UserController.loginButton.addEventListener('click', UserController.logIn);

        // Register

        UserController.showRegisterModalButton = document.getElementById('showRegisterModalButton');
        UserController.registerModal = document.getElementById('registerModal');
        UserController.registerForm = document.getElementById('registerForm');
        UserController.inputRegisterEmail = document.getElementById('inputRegisterEmail');
        UserController.inputRegisterPassword = document.getElementById('inputRegisterPassword');
        UserController.inputRegisterPassword2 = document.getElementById('inputRegisterPassword2');
        UserController.registerButton = document.getElementById('registerButton');

        UserController.registerModal.addEventListener('keyup', UserController.register);
        UserController.registerButton.addEventListener('click', UserController.register);

        // Logout
        UserController.logoutButton = document.getElementById('logoutButton');
        UserController.logoutButton.addEventListener('click', UserController.logOut);
    }

    static controlLoginStatus() {
        onAuthStateChanged(auth, async function(user) {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User

                myAnimeUser.id = user.uid;
                myAnimeUser.email = user.email;
                myAnimeUser.status = 'logged';

                // Me subscribo al doc del usuario y
                // Obtengo la lista de subscripciones

                const unsubUserDoc = onSnapshot(doc(db, "users", myAnimeUser.id),
                    (userDoc) => {
                        let userData = userDoc.data();
                        myAnimeUser.subscriptions = userData.subscriptions;
                    });


                // Cambio la barra de navegación
                UserController.showLoggedUserNavbar(user);

            } else {
                // User is signed out

                // TODO: Rename to showNonLoggedUserNavbar
                UserController.showNonLoggedUserNavbar();

                myAnimeUser.subscriptions = [];
                myAnimeUser.status = 'non-logged';
            }
        });
    }

    static showLoggedUserNavbar(user) {
        // Oculto los botones "Login" y "Registro"
        UserController.showRegisterModalButton.classList.add('hide');
        UserController.showLoginModalButton.classList.add('hide');

        // Muestro el botón de Desconectar
        UserController.logoutButton.classList.remove('hide');
    }

    static showNonLoggedUserNavbar() {
        // Oculto el botón de Desconectar
        UserController.logoutButton.classList.add('hide');

        // Muestro los botones "Login" y "Registro"
        UserController.showRegisterModalButton.classList.remove('hide');
        UserController.showLoginModalButton.classList.remove('hide');
    }

    static hideLoginModal() {
        // Ocultar TODO: resetear  

        const myClick = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        let closeModalButton = document.getElementById('dismissLoginModalButton');
        closeModalButton.dispatchEvent(myClick);
    }

    static hideRegisterModal() {
        // Ocultar el RegisterModal

        const myClick = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        let closeModalButton = document.getElementById('dismissRegisterModalButton');
        closeModalButton.dispatchEvent(myClick);
    }

    static logIn(e) {

        if (e.keyCode === 13 || e.type === "click") {

            let email = UserController.inputLoginEmail.value;
            let password = UserController.inputLoginPassword.value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    // const user = userCredential.user;

                    UserController.loginForm.reset();
                    UserController.hideLoginModal();
                })
                .catch((error) => {
                    // const errorCode = error.code;
                    // const errorMessage = error.message;

                    let authErrorsNode = document.getElementById('authErrors');
                    authErrorsNode.innerText = 'Por favor, revise que los datos sean correctos y la cuenta de usuario exista.';

                });

        }

    }

    static logOut() {

        // Firestore desconectame
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.

        });

    }

    static register(e) {

        if (e.keyCode === 13 || e.type === "click") {

            let email = UserController.inputRegisterEmail.value;
            let password = UserController.inputRegisterPassword.value;
            let password2 = UserController.inputRegisterPassword2.value;

            if (password === password2) {

                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed in
                        myAnimeUser.id = userCredential.user.uid;
                        myAnimeUser.email = userCredential.user.email;

                        // const user = userCredential.user;
                        UserController.registerForm.reset();
                        UserController.hideRegisterModal();
                        UserController.sendEmailVerification();
                        UserController.createUserDocument();

                    })
                    .catch((error) => {
                        // const errorCode = error.code;
                        // const errorMessage = error.message;

                        let registerErrorsNode = document.getElementById('registerErrors');
                        registerErrorsNode.innerText = 'No se ha podido crear la cuenta de usuario.\n Por favor, revise que los datos sean correctos y que la cuenta de usuario no exista.';

                    });

            } else {
                let registerErrorsNode = document.getElementById('registerErrors');
                registerErrorsNode.innerText = 'No se ha podido crear la cuenta de usuario.\n Las contraseñas no coinciden.';

            }

        }

    }

    static createUserDocument() {
        return setDoc(doc(db, "users", myAnimeUser.id), {
            email: myAnimeUser.email,
            subscriptions: myAnimeUser.subscriptions
        });
    }

    static sendEmailVerification() {

        sendEmailVerification(auth.currentUser)
            .then(() => {
                // TODO: Notificar al usuario que se le ha enviado un
                // email de verificación mediante un alert

                alert('Te hemos enviado un correo de verificación, sigue el enlace del correo para verificar tu cuenta.');
            }).catch(() => {
                // TODO: Notificar al usuario de que no se le ha podido enviar
                // el email de verificación
            });
    }

}

// Variable que se usará en todo lo largo de la aplicación
// para acceder a datos del usuario
// 
var myAnimeUser;

window.addEventListener("load", function() {
    // Estos inits inicializan variables
    AnimeView.init();
    EpisodeView.init();
    EpisodeController.init();

    // Creo el objeto User que cumplimentararé luego en UserController.init()
    myAnimeUser = new User();
    UserController.init();

    // Este init obtiene todos los datos
    AnimeController.init();
});