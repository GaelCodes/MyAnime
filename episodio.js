const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const anime = urlParams.get('anime').replace(/_/g, ' ').toUpperCase();
const capitlo = urlParams.get('capitulo');
const title = document.getElementById('title');


title.innerText = `${anime} episodio ${capitlo}`