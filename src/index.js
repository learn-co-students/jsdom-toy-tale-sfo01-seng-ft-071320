let addToy = false;

const allToysURL = 'http://localhost:3000/toys';
const addBtn = document.querySelector('#new-toy-btn');
const toyFormContainer = document.querySelector('.container');
const toyCollectionDiv = document.querySelector('#toy-collection');
const addToyForm = document.querySelector('.add-toy-form');

document.addEventListener("DOMContentLoaded", () => {
  fetchToys();
  listenToToyForm();
  listenToLikeButton();
});


  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = 'block';
    } else {
      toyFormContainer.style.display = 'none';
    }
  });

function listenToToyForm() {
  addToyForm.addEventListener('submit', handleToyForm)
}

function listenToLikeButton() {
  toyCollectionDiv.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
      const toyId = e.target.dataset.id; //returns a string of the id
      const likesTag = e.target.parentElement.querySelector('p'); //returns <p>8 Likes</p>
      const currentLikes = parseInt(likesTag.textContent); //converts the string "8 Likes" and returns 8 as integer.
      const updatedLikes = currentLikes + 1;
      const updatedToy = {
        likes: updatedLikes
      }
      fetchPatch(toyId, updatedToy);

      //UPDATE THE FRONTEND 
        //to do that we need to find the tag that holds the value and set the value to the updated likes value.
        likesTag.textContent = `${updatedLikes} Likes`
    }
  })
}

function handleToyForm(e) {
  e.preventDefault();

  let nameInput = e.target.name;
  let imageInput = e.target.image;
  const name = nameInput.value;
  const image = imageInput.value;

  const newToy = {
    name: name,
    image: image,
    likes: 0,
  };
  fetchPost(newToy);

  nameInput = '';
  imageInput = '';
}

async function fetchPost(newToy) {
  const postResponse = await fetch(allToysURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToy)
  });
  toyCollectionDiv.innerHTML += appendToy(newToy);
  
}

async function fetchPatch(toyId, updatedToy) {
  const singleToy = `http://localhost:3000/toys/${toyId}`
  const patchResponse = await fetch(singleToy, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedToy)
  });
  // toyCollectionDiv.innerHTML += appendToy(updatedToy)
}

async function fetchToys() {
  const toysFetch = await fetch(allToysURL);
  const toys = await toysFetch.json();

  toys.forEach(toy => {
    toyCollectionDiv.innerHTML += appendToy(toy)
    // debugger
  })
}

function appendToy(toy) {
  return `
  <div class="card">
    <h2>${toy.name}</h2>
    <img src="${toy.image}"class="toy-avatar" />
    <p>${toy.likes} Likes </p>
    <button data-id="${toy.id}" class="like-btn">Like <3</button>
  </div>`
}

//do a post request 

//find the add new toy button and add an event listener to the form

// find the information to render a toy to the page