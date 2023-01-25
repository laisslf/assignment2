/********************************************************************************* 
 * WEB422 – Assignment 2 
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 *  No part of this assignment has been copied manually or electronically from any other source 
 *  (including web sites) or distributed to other students. 
 *  
 *  Name: Lais da Silva Lopes Furtado Student ID: 127799211 Date:24/01/2023  
 ********************************************************************************/
var page = 1;
var perPage = 10;
function loadMovieData(title = null){
    let url = `${title? `https://cute-rose-xerus-cuff.cyclic.app/api/movies?page=1&perPage=1&title=${title}` 
          : `https://cute-rose-xerus-cuff.cyclic.app/api/movies?page=${page}&perPage=${perPage}`}`;
    
    document.querySelector(".pagination").classList.toggle("d-none", title != null);    
    fetch(url).then((res) => res.json())
    .then((data) => {
        let rows = `${data.map(movie =>(            
          `<tr data-id=${movie._id}>
            <td>${movie.year}</td>
            <td>${movie.title}</td> 
            ${movie.plot? `<td>${movie.plot}</td>` : `<td>N/A</td>` }
            ${movie.rated? `<td>${movie.rated}</td>` : `<td>N/A</td>`} 
            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
            </tr>`
        )).join('')}`;       
        document.querySelector(".table tbody").innerHTML = rows;
        document.querySelector("#current-page").textContent = page;
        document.querySelectorAll(".table tbody tr").forEach(row=>{
            row.addEventListener("click", function(e){
              let clickedID = row.getAttribute("data-id");
              let urlModal = `https://cute-rose-xerus-cuff.cyclic.app/api/movies/${clickedID}`;
              fetch(urlModal).then((res) => res.json()).then((movie) => {
                document.querySelector("#detailsModal .modal-title").textContent = movie.title;
                let withPoster = `<img class="img-fluid w-100" src="${movie.poster}"><br><br>`;
                let text = `<strong>Directed By: </strong>${movie.directors.join(", ")}<br><br>
                <p>${movie.fullplot}</p>
                <strong>Cast: </strong>${movie.cast.join(", ")}<br><br>
                <strong>Awards: </strong>${movie.awards.text}<br>
                <strong>IMDB Rating: </strong>${movie.imdb.rating} (${movie.imdb.votes}) votes`
                let movies = movie.poster? withPoster + text : text;
                document.querySelector("#detailsModal .modal-body").innerHTML = movies;
                let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                    backdrop: 'static', 
                    keyboard: false, 
                    focus: true, 
                });
                myModal.show();
            });
        })});
    });
}
document.addEventListener("DOMContentLoaded", function(){    
    loadMovieData();
    document.querySelector("#searchForm").addEventListener("submit", function(e){
      e.preventDefault();
      let title = document.querySelector("#title").value;     
      loadMovieData(title);
    });
    document.querySelector("#previous-page").addEventListener("click", function(e){
      if(page > 1){
        page--;
        loadMovieData();
      }
    });
    document.querySelector("#next-page").addEventListener("click", function(e){
        page++;
        loadMovieData();      
    });
    document.querySelector("#clearForm").addEventListener("click", function(e){
      document.querySelector("#title").value = "";
      page = 1;      
      loadMovieData();
    });
  });