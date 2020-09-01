let addToy = false;

const allToysURL = 'http://localhost:3000/toys';
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const toyCollectionDiv = document.getElementById('toy-collection');
const newToyForm = document.querySelector('.add-toy-form');
const likeBtn = document.querySelector('.like-btn');

document.addEventListener("DOMContentLoaded", () => {
  toggleButton();
  getToys();
  submitNewToy();
  likeAToy();
});
  
function toggleButton() {
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

function submitNewToy() {
  newToyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let nameInput = e.target.name;
    let imageInput = e.target.image;
    const name = nameInput.value;
    const image = imageInput.value;
    nameInput = '';
    imageInput = '';

    const newToy = {
      name: name,
      image: image,
      likes: 0
    }
    createToy(newToy)
  })
}

function likeAToy() {
  toyCollectionDiv.addEventListener('click', function(e) {

    if (e.target.tagName === 'BUTTON') {
      const toyId = e.target.id;
      const likeTag = e.target.previousElementSibling;
      const currentNumLikes = parseInt(e.target.previousSibling.textContent);
      const newNumLikes = currentNumLikes + 1;
      const updatedLikes = {
        likes: newNumLikes,
      };
      likeToy(toyId, updatedLikes)
      likeTag.textContent = `${newNumLikes} Likes`;
    }
  });
}

async function getToys() {
  const response = await fetch(allToysURL)
  const allToys = await response.json()

  allToys.forEach(toy => {
    createElements(toy)
  })
}

async function createToy(newToy) {
  const response = await fetch(allToysURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToy)
  })
  createElements(newToy)
}

async function likeToy(toyId, updatedLikes) {
  const response = await fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedLikes)
  })
}

function createElements(toy) {
  const div = document.createElement('div');
  div.className = 'card';
  toyCollectionDiv.append(div)
  const h2 = document.createElement('h2');
  h2.textContent = toy.name
  const img = document.createElement('img');
  img.className = 'toy-avatar';
  img.src = toy.image;

  const p = document.createElement('p');
  p.textContent = `${toy.likes} Likes`;
  const btn = document.createElement('BUTTON');
  btn.className = 'like-btn';
  btn.id = toy.id
  btn.textContent = 'Like <3';

  div.append(h2, img, p, btn)
}