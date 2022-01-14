import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-analytics.js"
import { getFirestore, collection, getDocs, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js"
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
    constructor(title, platform, description, audio, mediaThumbnails) {
        this.observers = [];
        this.title = title;
        this.platform = platform;
        this.description = description;
        this.audio = audio;
        this.mediaThumbnails = mediaThumbnails;
        this.versions = [];

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

    copy() {
        return {
            title: this.title,
            versions: this.versions,
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

        let animeSubscriptionText = document.createElement("p");
        animeSubscriptionText.innerText = 'Subscribete a este maravilloso anime';
        animeSubscriptionText.classList.add('animeSubscriptionText');
        let animeSubscriptionBox = document.createElement("input");
        animeSubscriptionBox.type = "checkbox";
        animeSubscriptionBox.classList.add("animeSubscriptionBox");

        let animePlatformButton = document.createElement("button");
        animePlatformButton.classList.add("animePlatformButton");

        AnimeView.animeCardPrototype.append(animeVersions);
        AnimeView.animeCardPrototype.append(animeThumbnail);
        AnimeView.animeCardPrototype.append(animeDescription);
        AnimeView.animeCardPrototype.append(animeAudio);
        AnimeView.animeCardPrototype.append(animeSubtitles);
        AnimeView.animeCardPrototype.append(animeSubscriptionText);
        AnimeView.animeCardPrototype.append(animeSubscriptionBox);
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
        // Las versiones del anime se obtendrán en tiempos distintos
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
        this.animeCard.querySelector(".animeAudio").innerText = anime.audio;
        this.animeCard.querySelector(".animeSubtitles").innerText = anime.subtitles;

        // Por cada versión del anime que haya crearé
        // una opción en el select animeVersions

        this.animeCard.querySelector(".animeVersions").innerHTML = '';
        if (anime.versions.length) {
            anime.versions.forEach((version) => {
                let animeVersion = document.createElement("option");
                animeVersion.classList.add("animeVersion");
                animeVersion.value = version.title;
                animeVersion.innerText = version.title;
                this.animeCard.querySelector(".animeVersions").append(animeVersion);
            });
        }


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
    }
}

class AnimeController {
    constructor(anime, animeView) {
        this.anime = anime;
        this.animeView = animeView;

        this.animeView.populate(this.anime.copy());
        this.anime.registerObserver(this.animeView);
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
                    animeData.audio,
                    animeData.mediaThumbnails
                );
                let animeView = new AnimeView();
                let animeController = new AnimeController(anime, animeView);

                // Registro a los animes como observers de myAnimeUser
                // En caso que el status de myAnimeUser cambie, los animes también tienen que cambiar
                myAnimeUser.registerObserver(anime);

                // Obtener todas las versiones del anime

                getDocs(collection(db, `animes/${anime.title}/versions`)).then(
                    (querySnapshot) => {

                        querySnapshot.forEach((versionDoc) => {
                            let versionData = versionDoc.data();

                            // TODO: Reto - investigar porque el push no 
                            // detona el setter de la propiedad
                            // 
                            let newVersions = anime.versions;
                            newVersions.push(versionData);
                            anime.versions = newVersions;

                        })
                    }
                );

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

                                    let episode = new Episode(episodeData.title, episodeData.availableVersions, episodeData.number, episodeData.link, episodeData.mediaThumbnail, episodeData.premiumPubDate, episodeData.freePubDate);
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

class Episode {
    constructor(title, availableVersionsRefs = [], number, link, mediaThumbnail, premiumPubDate, freePubDate) {
        this.observers = [];
        this.title = title;
        this.number = number;
        this.link = link;
        this.premiumPubDate = premiumPubDate;
        this.freePubDate = freePubDate;
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

    set version(newVersion) {
        this._version = newVersion;
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
            title: this.title,
            version: this.version,
            availableVersions: this.availableVersions,
            number: this.number,
            thumbnails: this.thumbnails,
            premiumPubDate: this.premiumPubDate,
            freePubDate: this.freePubDate,
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

        let episodeTitle = document.createElement('p');
        episodeTitle.classList.add('episodeTitle');

        let episodeNumber = document.createElement('p');
        episodeNumber.classList.add('episodeNumber');

        let episodeSubscriptionText = document.createElement("p");
        episodeSubscriptionText.innerText = 'Subscribete a este maravilloso anime';
        episodeSubscriptionText.classList.add('episodeSubscriptionText');

        let episodeSubscriptionBox = document.createElement("input");
        episodeSubscriptionBox.type = "checkbox";
        episodeSubscriptionBox.classList.add("episodeSubscriptionBox");

        let episodeViewNowButton = document.createElement('button');
        episodeViewNowButton.classList.add('episodeViewNowButton');

        EpisodeView.episodeCardPrototype.append(episodeVersions);
        EpisodeView.episodeCardPrototype.append(episodeThumbnail);
        EpisodeView.episodeCardPrototype.append(episodeTitle);
        EpisodeView.episodeCardPrototype.append(episodeNumber);
        EpisodeView.episodeCardPrototype.append(episodeSubscriptionBox);
        EpisodeView.episodeCardPrototype.append(episodeSubscriptionText);
        EpisodeView.episodeCardPrototype.append(episodeViewNowButton);
        // Fin creación prototipo episodeCard
    }

    populate(episode) {
        this.episodeCard = EpisodeView.episodeCardPrototype.cloneNode(true);
        this.episodeCard.querySelector('.episodeViewNowButton').innerText = 'Ver ahora';
        this.episodeCard.querySelector('.episodeThumbnail').src = episode.thumbnails.full.url;
        this.episodeCard.querySelector('.episodeTitle').innerText = episode.title;
        this.episodeCard.querySelector('.episodeNumber').innerText = episode.number;

        // Only for debug (según el modelo de datos availableVersions debería estar siempre definido)
        // en datos antiguos todavía no lo esta.
        // 

        for (let i = 0; i < episode.availableVersions.length; i++) {
            const availableVersion = episode.availableVersions[i];

            let episodeVersion = document.createElement('option');
            episodeVersion.value = availableVersion.data.title;
            episodeVersion.innerText = availableVersion.data.title;

            this.episodeCard.querySelector('.episodeVersions').append(episodeVersion);
        }
        // Seleccionar la versión actual del episodio en el select
        this.selectVersion(episode.version);

        // Mostrar o ocultar el checkbox dependiendo de si el usuario
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
        this.episodeCard.querySelector('.episodeTitle').innerText = episode.title;
        this.episodeCard.querySelector('.episodeNumber').innerText = episode.number;

        for (let i = 0; i < episode.availableVersions.length; i++) {
            const availableVersion = episode.availableVersions[i];

            let episodeVersion = document.createElement('option');
            episodeVersion.value = availableVersion.data.title;
            episodeVersion.innerText = availableVersion.data.title;

            this.episodeCard.querySelector('.episodeVersions').append(episodeVersion);
        }

        // Seleccionar la versión actual del episodio en el select
        this.selectVersion(episode.version);


        // Mostrar o ocultar el checkbox dependiendo de si el usuario
        // está loggeado o no
        if (myAnimeUser.status === 'logged') {
            console.log('User en update del episode :', myAnimeUser);
            let episodeSubscriptionBox = this.episodeCard.querySelector('.episodeSubscriptionBox');
            episodeSubscriptionBox.removeAttribute('disabled', '');
            let episodeSubscriptionText = this.episodeCard.querySelector('.episodeSubscriptionText');
            episodeSubscriptionText.classList.remove('text-muted');

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

    selectVersion(version) {
        // Útil para cambiar versiones
        // Ejecutar en la expulsión del evento change del select para actualizar el 
        // atributo version del modelo

        if (version) {
            let optionValue = version.data.title;
            let optionNode = this.episodeCard.querySelector(`.episodeVersions [value="${optionValue}"]`);
            optionNode.setAttribute("selected", "");

        }
    }


}

class EpisodeController {
    constructor(episode, episodeView) {
        this.episode = episode;
        this.episodeView = episodeView;

        this.episodeView.populate(this.episode.copy());
        this.episode.registerObserver(this.episodeView);
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

            return episodeA.model.premiumPubDate - episodeB.model.premiumPubDate;

        })
    }

    changeVersion() {
        // TODO: Cambiar de versión según el valor del select
    }

    changeSubscription() {
        // TODO: Cambiar la subscripción al anime según el estado
        // del checkbox
    }

    subscribeToAnimeVersion() {
        // TODO: Subscribirse a la versión del anime actual
    }

    unsubscribeFromAnimeVersion() {
        // TODO: Desuscribirse de la versión del anime actual
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

        UserController.showLoginModalButton.addEventListener('click', UserController.showLoginModal);
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

        UserController.showRegisterModalButton.addEventListener('click', UserController.showRegisterModal);
        UserController.registerModal.addEventListener('keyup', UserController.register);
        UserController.registerButton.addEventListener('click', UserController.register);

        // Logout
        UserController.logoutButton = document.getElementById('logoutButton');
        UserController.logoutButton.addEventListener('click', UserController.logOut);
    }

    static controlLoginStatus() {
        onAuthStateChanged(auth, async function(user) {
            if (user) {
                console.log("User is logged");
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User

                myAnimeUser.id = user.uid;
                myAnimeUser.email = user.email;
                myAnimeUser.status = 'logged';
                // TODO: Rename to showLoggedUserNavbar
                UserController.showLoggedUserNavbar(user);

                // TODO: Obtener la lista de subscripciones
                // let userData = await getDoc(`users/${myAnimeUser.id}`);
                // userData = userData.data();
                // myAnimeUser.subscriptions = userData.subscriptions;



            } else {
                console.log('User isn\'t logged');
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

    static showLoginModal() {
        // Show modal, 
        console.log('Mostrando modal login');
    }

    static showRegisterModal() {
        // Show modal, 
        console.log('Mostrando modal registro');
    }

    static hideLoginModal() {
        // Show modal, 
        console.log('Ocultando modal login');

        const myClick = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        let closeModalButton = document.getElementById('dismissLoginModalButton');
        closeModalButton.dispatchEvent(myClick);
    }

    static hideRegisterModal() {
        // Show modal, 
        console.log('Ocultando modal login');

        const myClick = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        let closeModalButton = document.getElementById('dismissRegisterModalButton');
        closeModalButton.dispatchEvent(myClick);
    }

    static logIn(e) {

        console.log('Trying to login');

        if (e.keyCode === 13 || e.type === "click") {

            let email = UserController.inputLoginEmail.value;
            let password = UserController.inputLoginPassword.value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    // ...
                    console.log('Logeado correctamente');
                    UserController.loginForm.reset();
                    UserController.hideLoginModal();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('Logeado INcorrectamente');
                });

        }

    }

    static logOut() {

        console.log('Trying to logout');
        // Firestore desconectame
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log('DESLogeado correctamente');
        }).catch((error) => {
            // An error happened.
            console.log('DESLogeado INcorrectamente');
        });

    }

    static register(e) {

        console.log('Trying to register', e);

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
                        console.log('Datos del usuario recien registrado: ', userCredential);
                        // const user = userCredential.user;
                        UserController.registerForm.reset();
                        UserController.hideRegisterModal();
                        UserController.sendEmailVerification();
                        UserController.createUserDocument();

                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log('Register failed!');
                        console.log('Código de error: ', errorCode);
                        console.log('Mensaje de error: ', errorMessage);

                    });

            } else {
                console.log('Las passwords deben ser iguales');

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
        console.log('Trying to send email verification');
        sendEmailVerification(auth.currentUser)
            .then(() => {
                // Email verification sent!
                // ...
                console.log('Email verification sent!');
            }).catch(() => {
                // Email verification not sent!
                // ...
                console.log('Email verification not sent!');
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