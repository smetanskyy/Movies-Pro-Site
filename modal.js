"use strict"

// Get the modal
let modal = document.getElementById("myModal");

// Get the element that closes the modal
var closeIcon = document.getElementById("closeModal");

let text = document.getElementById("textModal");

// When the user clicks, open the modal
function showModal() {
    let id = this.getAttribute("data-idFilm");
    getMovieInfo(id);
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeIcon.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

async function getMovieInfo(id) {
    let url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=43e3450248573d3a155d750b925b32c8&language=en-US";
    let response = await fetch(url);
    let movieInfo = await response.json();
    console.log(movieInfo);

    let backImgPath = movieInfo.backdrop_path;
    let tagBackImg = document.getElementById("imgForModal");
    if (backImgPath) {
        tagBackImg.src = "https://image.tmdb.org/t/p/w500" + backImgPath;
    }
    else {
        tagBackImg.src = "image.jpg";
    }

    let posterModalPath = movieInfo.poster_path;
    let tagPosterModalImg = document.getElementById("posterModal");
    if (posterModalPath) {
        tagPosterModalImg.src = "https://image.tmdb.org/t/p/w500" + posterModalPath;
    }
    else {
        tagPosterModalImg.src = "imagePoster.jpg";
    }

    document.getElementById("movieTitle").textContent = movieInfo.title;
    document.getElementById("movieOriginalTitle").style.fontStyle = "italic";
    document.getElementById("movieOriginalTitle").textContent = movieInfo.original_title;
    document.getElementById("movieRate").textContent = movieInfo.vote_average;
    document.getElementById("movieRate").style.fontWeight = "600";

    let movieGenres = document.getElementById("movieGenres");
    movieGenres.textContent = "";
    for (let genre of movieInfo.genres) {
        movieGenres.textContent += genre.name + ", ";
    }
    movieGenres.textContent = movieGenres.textContent.slice(0, -2);

    let movieProduction = document.getElementById("movieProduction");
    movieProduction.textContent = ""
    for (let countrie of movieInfo.production_countries) {
        movieProduction.textContent += countrie.name + ", ";
    }
    movieProduction.textContent = movieProduction.textContent.slice(0, -2);

    let movieHomepage = document.getElementById("movieHomepage");
    movieHomepage.text = movieInfo.title;
    movieHomepage.setAttribute('href', movieInfo.homepage);

    document.getElementById("movieOverview").textContent = movieInfo.overview;
    document.getElementById("movieRelease").textContent = movieInfo.release_date;
    let movieCompanies = document.getElementById("movieCompanies");

    movieCompanies.innerHTML = "";
    for (let company of movieInfo.production_companies) {
        if (company.logo_path) {
            let path = "https://image.tmdb.org/t/p/w500" + company.logo_path;
            let img = document.createElement("img");
            img.src = path;
            movieCompanies.appendChild(img);
        }
    }
}