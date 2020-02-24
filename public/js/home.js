
var artists = [];
var searchQuery = "";

//adding new artist
document.querySelector(".addArtistForm .btn").addEventListener("click", function(){
    let form = document.querySelector(".addArtistForm");
    let formData = new FormData(form);
    var object = {};
    formData.forEach((value, key) => {object[key] = value});
    
    postData('/artists/add', object)
        .then((data) => {
        addArtist(object);
    });
    
    form.reset();
    form.style.display = "none";
});

//post new artist to server
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'same-origin', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response; // parses JSON response into native JavaScript objects
}

// delete artist from server
async function delArtist(e) {
    var artist = e.target.parentNode
    artist.parentNode.removeChild(artist);
    let artistDesc = artist.getElementsByClassName("artistDesc")[0].innerText;
    
    if(artists != null){
        for(let i = 0 ; i < artists.length; ++i){
            if(artists[i].desc == artistDesc){
                id = artists[i].id;
                const response = await fetch('/artists/' + id, {
                    method: 'DELETE',
                    mode: 'same-origin', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', 
                })
                .then(res => console.log("res: ",res))
                .catch(err=>{
                    console.log("Error: ", err)
                });
                return response;
            }
        }
    }
}

//get all artists from server
async function getArtists(){
    let artists = [];
    return await fetch('/artists/all')
    .then(res => res.json())
    .then((data) => {
        console.log('Request successful');
        artists = data;
        renderArtists(artists);
        return artists;
     })
    .catch(error => console.log('Request failed', error));
}

//search server for specific artist
document.querySelector("#searchSubmit").addEventListener("click", function(e){
    postData('/artists/search', {query: searchQuery})
    .then((res) => {
        // console.log(res);
        return res.json();;
    })
    .then(data=>{
        // console.log(data);
        artists = data;
        clearArtists();
        renderArtists(artists);
    });
});

let clearArtists = () => {
    const list = document.getElementById("artistList");
    while (list.firstChild) {
        list.removeChild(list.lastChild);
    }
}

let renderArtists = (artists) => {
    if(artists != null && artists.length > 0){
        for(let i = 0; i < artists.length;++i){
            if (artists[i].name != null){
                addArtist(artists[i]);
            }
        }
    }
}


getArtists().then(res=>{
    artists = res;
});


/******************
 * DOM manipulation
 ******************/
document.querySelector("#searchArtist").addEventListener("input", function(e){
    searchQuery = e.target.value.toLowerCase();
});

 //toggle showing add artist form
document.querySelector("#artistSearch #addArtist").addEventListener("click", function(){
    let form = document.querySelector(".addArtistForm");
    if (form.style.display == "none" || form.style.display == "") {
        form.style.display = "block";
      } else {
        form.style.display = "none";
      }
});

let addArtist = object => {
    //main div for artist item
    var artistDiv = document.createElement("div");
    artistDiv.className = "artist";
    
    //image of artist from form url
    var imgNode = document.createElement("img");
    imgNode.className = "artistImage";
    imgNode.src = object["url"];

    //artist info section
    var artistInfoDiv = document.createElement("div");
    artistInfoDiv.className = "artistInfo";
    
    var artistName = document.createElement("p");
    artistName.className = "artistName";
    var artistDesc = document.createElement("p");
    artistDesc.className = "artistDesc";
    
    //delete artist button
    var delArtistBtn = document.createElement("button");
    delArtistBtn.addEventListener("click", delArtist);
    delArtistBtn.className = "deleteBtn";

    //setting text of each tag
    var nameTextNode = document.createTextNode(object["name"]);
    var descTextNode = document.createTextNode(object["desc"]);
    var delBtnTextNode = document.createTextNode("Delete");
    
    //appending all elements to dom in right order
    artistDiv.appendChild(imgNode);
    artistDiv.appendChild(artistInfoDiv);
    artistDiv.appendChild(delArtistBtn);
    artistInfoDiv.appendChild(artistName);
    artistInfoDiv.appendChild(artistDesc);
    artistName.appendChild(nameTextNode);
    artistDesc.appendChild(descTextNode);
    delArtistBtn.appendChild(delBtnTextNode);

    //adding new artist to artist list, reseting and closing form
    var element = document.querySelector("#artistList");
    element.appendChild(artistDiv);
}