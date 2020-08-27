let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

listenToFormSubmit()
listenToLikeClick()

function getToys() {
  fetch('http://localhost:3000/toys')
  .then((resp) => resp.json())
  .then((andyToys) => {
    console.log(andyToys)
    appendToys(andyToys)
  })
}

getToys() // returns us back the toy data from the server

function appendToys(andyToys) {
  const toyCollectionDiv = document.getElementById('toy-collection');
  // console.log(toyCollectionDiv) verified its returning this div back

  andyToys.forEach((andyToy) => {
    const cardDiv = document.createElement('div')
    cardDiv.class = 'card'

    cardDiv.innerHTML = renderSingleToy(andyToy);

    // console.log(cardDiv) Verified that it created a div!
    // cardDiv.src = andyToys
    toyCollectionDiv.appendChild(cardDiv)
    // console.log(cardDiv) This showed us the divs!
  });
}

function appendSingleToy(toy){
  const toyCollectionDiv = document.getElementById('toy-collection');
  const cardDiv = document.createElement('div')
  cardDiv.class = 'card'

  cardDiv.innerHTML = renderSingleToy(toy)
  toyCollectionDiv.appendChild(cardDiv)
}

function renderSingleToy(toy){
  return `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class='toy-avatar'/>
    <p>${toy.likes}</p>
    <button data-id=${toy.id} data-likes=${toy.likes} class='like-btn'>Like<3</button>
  `;
}

//function that handles user submit form

function listenToFormSubmit() {
  const form = document.querySelector('.add-toy-form');
  // 1. event listener for form submit
  form.addEventListener('submit', handleFormSubmit);
  // console.log('event')
}

function handleFormSubmit(event){
  // console.log(event)
  event.preventDefault();
  const toyInput = getToyInfoForm(event)
  // console.log(toyInput)
  persistNewToy(toyInput)
}

function getToyInfoForm(event){
const name = event.target.name
const image = event.target.image
return {
  name: name.value,
  image: image.value,
  likes: 0
  }
}

function persistNewToy(toyInput){
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toyInput),
  };

  fetch('http://localhost:3000/toys', options)
  .then((resp) => resp.json())
  .then((toy) => {
    // pessimistic render
    appendSingleToy(toy);
  });

}

function listenToLikeClick() {
  const toyCollectionDiv = document.getElementById('toy-collection');
  toyCollectionDiv.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
      // If we want to turn our string into a number
      // use parseInt - parseInt(e.target.dataset.id)
      // or the unary plus - +e.target.dataset.id

      const toyId = e.target.dataset.id;
      const toyLikes = parseInt(e.target.dataset.likes) || 0;

      // Update backend
      fetch(`http://localhost:3000/toys/${toyId}`, { method: 'PATCH', body: JSON.stringify({
        likes: toyLikes + 1
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
      
    });

      // Update frontend
      e.target.dataset.likes = toyLikes + 1
      e.target.previousElementSibling.innerHTML = toyLikes + 1
    }
  });
}