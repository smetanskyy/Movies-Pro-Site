"use strict"

let moviesPartElem = document.getElementById("moviesPart");
let pagesTotal = 0;
let activePage = 1;

setGenres();
let urlStart = "https://api.themoviedb.org/3/movie/popular?api_key=43e3450248573d3a155d750b925b32c8&language=en-US&page=";
let urlTemp = "";
let urlExtraTemp = "";
getMoviesInfo(activePage, urlStart, urlExtraTemp);

let selectGenres = document.getElementById("selectGenres");
let selectCollection = document.getElementById("selectCollection");

selectGenres.onchange = function () {
    if (this.selectedIndex == 0)
        return;
    selectCollection.selectedIndex = 0;    
    let idGenre = this.options[this.selectedIndex].getAttribute("data-idGenre");
    let url = "https://api.themoviedb.org/3/discover/movie?api_key=43e3450248573d3a155d750b925b32c8&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=";
    let urlExtra = "&with_genres=" + idGenre;
    
    getMoviesInfo(1, url, urlExtra);
}


selectCollection.onchange = function () {
    if (this.selectedIndex == 0)
        return;
    selectGenres.selectedIndex = 0;
    activePage = 1;
    let url = "";
    switch (this.options[this.selectedIndex].text) {
        case "Popular":
            url = "https://api.themoviedb.org/3/movie/popular?api_key=43e3450248573d3a155d750b925b32c8&language=en-US&page=";
            break;
        case "Top Rated":
            url = "https://api.themoviedb.org/3/movie/top_rated?api_key=43e3450248573d3a155d750b925b32c8&language=en-US&page=";
            break;
        default:
            url = "https://api.themoviedb.org/3/movie/popular?api_key=43e3450248573d3a155d750b925b32c8&language=en-US&page=";
    }
    getMoviesInfo(1, url, "");
}

async function setGenres() {
    let urlGenres = "https://api.themoviedb.org/3/genre/movie/list?api_key=43e3450248573d3a155d750b925b32c8&language=en-US";
    let response = await fetch(urlGenres);
    let commits = await response.json();

    for (let genre of commits.genres) {
        let option = document.createElement("option");
        option.text = genre.name;
        option.setAttribute("data-idGenre", genre.id);
        selectGenres.add(option);
    }
}

async function getMoviesInfo(page, url, urlExtra) {
    urlTemp = url;
    urlExtraTemp = urlExtra;
    document.getElementById("searchInput").setAttribute("placeholder", "search");
    let paginations = document.getElementsByClassName("pagination");
    for (let item of paginations) {
        item.innerHTML = "";
    }
    moviesPartElem.innerHTML = "";

    let urlAndPage = url + page + urlExtraTemp;
    let response = await fetch(urlAndPage);
    let commits = await response.json();
    //console.log(commits);
    pagesTotal = commits.total_pages;
    if (commits.total_results == 0) {
        let notFound = document.createElement("label");
        notFound.textContent = "not found";
        notFound.style.color = "darkblue";
        notFound.style.fontWeight = "600";
        notFound.style.fontSize = "20px";
        moviesPartElem.appendChild(notFound);
        return;
    }
    let movies = commits.results;

    for (let movie of movies) {
        let tagDiv = document.createElement("div");
        tagDiv.className = "container";
        let tagImg = document.createElement("img");
        tagImg.className = "imgMoviePart";

        let tagVote = document.createElement("div");
        tagVote.className = "top-left";

        let tagImgStar = document.createElement("img");
        tagImgStar.src = "star.png";
        tagVote.appendChild(tagImgStar);

        let tagVoteRateed = document.createElement("strong");
        if (movie.vote_average >= 8)
            tagImgStar.style.backgroundColor = 'gold';
        else if (movie.vote_average >= 7)
            tagImgStar.style.backgroundColor = 'silver';
        else if (movie.vote_average >= 6)
            tagImgStar.style.backgroundColor = '#cd7f32';

        tagVoteRateed.textContent = movie.vote_average.toFixed(1);
        tagVote.appendChild(tagVoteRateed);

        if (movie.poster_path)
            tagImg.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
        else
            tagImg.src = "imagePoster.jpg";

        tagDiv.title = movie.title;
        tagDiv.appendChild(tagImg);
        tagDiv.appendChild(tagVote);
        tagDiv.setAttribute("data-idFilm", movie.id);
        tagDiv.onclick = showModal;
        moviesPartElem.appendChild(tagDiv);
    }
    await myPagination();
}

// Pagination
function myPagination() {
    let colorActive = 'blue';

    let previousButton = document.createElement("button");
    previousButton.textContent = "previous";
    previousButton.onclick = clickOnBtn;
    setElementInPagination(previousButton);

    for (let i = 0; i < pagesTotal; i++) {
        if (i == activePage - 3 && activePage >= 6 && pagesTotal >= 6) {
            let label = document.createElement("label");
            label.textContent = " . . . ";
            setElementInPagination(label);
        }
        else if (i < 3) {
            let button = document.createElement("button");
            button.textContent = `${i + 1}`;
            if (i == activePage - 1) {

                button.style.color = colorActive;
            }
            button.onclick = clickOnBtn;
            setElementInPagination(button);
        }
        else if (i <= activePage && (activePage > 2 && activePage < 7)) {
            let button = document.createElement("button");
            button.textContent = `${i + 1}`;
            if (i == activePage - 1) {

                button.style.color = colorActive;
            }
            button.onclick = clickOnBtn;
            setElementInPagination(button);
        }
        else if (i == pagesTotal - 2 && activePage <= pagesTotal - 3) {
            let label = document.createElement("label");
            label.textContent = " . . . ";
            setElementInPagination(label);

        }
        else if (i >= activePage - 2 && i <= activePage) {
            let button = document.createElement("button");
            button.textContent = `${i + 1}`;
            if (i == activePage - 1) {

                button.style.color = colorActive;
            }
            button.onclick = clickOnBtn;
            setElementInPagination(button);
        }
        else if (i == pagesTotal - 1) {
            let button = document.createElement("button");
            button.textContent = `${i + 1}`;
            if (i == activePage - 1) {

                button.style.color = colorActive;
            }
            button.onclick = clickOnBtn;
            setElementInPagination(button);
        }

        if (i == pagesTotal - 1) {
            let nextButton = document.createElement("button");
            nextButton.textContent = "next";
            nextButton.onclick = clickOnBtn;
            setElementInPagination(nextButton);
        }
    }
}

function setElementInPagination(elem) {
    let paginations = document.getElementsByClassName("pagination");
    for (let i = 0; i < paginations.length; i++) {
        if (i == 0) {
            paginations[i].appendChild(elem);
        }
        else {
            let clone = elem.cloneNode(true);
            clone.onclick = clickOnBtn;
            paginations[i].appendChild(clone);
        }
    }
}

function clickOnBtn() {
    if (this.textContent === "previous")
        activePage = activePage == 1 ? 1 : --activePage;
    else if (this.textContent === "next")
        activePage = activePage == pagesTotal ? pagesTotal : ++activePage;
    else
        activePage = +this.textContent;

    getMoviesInfo(activePage, urlTemp, urlExtraTemp);
}