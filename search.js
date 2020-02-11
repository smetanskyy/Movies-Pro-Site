'use strict'

let searchForm = document.getElementById("searchForm");
//searchForm.onkeypress = function (event) {
//    if (event.keyCode === 13) {
//        searchMovie();
//    return false;
//    }
//}

searchForm.onsubmit = function () {
    event.preventDefault();
    searchMovie();
    // return false;
}


let searchInput = document.getElementById("searchInput");
function searchMovie() {
    let selectGenres = document.getElementById("selectGenres");
    selectGenres.selectedIndex = 0;
    let selectCollection = document.getElementById("selectCollection");
    selectCollection.selectedIndex = 0;
    let urlSearch = "https://api.themoviedb.org/3/search/movie?api_key=43e3450248573d3a155d750b925b32c8&language=en-US&query=";
    if (searchInput.value) {
        urlSearch += searchInput.value + "&page="
        getMoviesInfo(1, urlSearch, "");
    }
    else
        searchInput.setAttribute("placeholder", "enter data");
}