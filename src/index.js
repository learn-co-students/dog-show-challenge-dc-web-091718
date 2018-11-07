const DOG_URL = "http://localhost:3000/dogs"

document.addEventListener('DOMContentLoaded', () => {
  goFetch();
})

function goFetch() {
  fetch(DOG_URL)
    .then(response => response.json())
    .then(dogs => renderDogs(dogs))
}

function dogsTable() {
  return document.querySelector("#table-body")
}

function clearDogsTable() {
  const newDogsTable = document.createElement('tbody')
  newDogsTable.id = "table-body"

  const containingTable = dogsTable().parentElement

  containingTable.children[1].remove();
  containingTable.appendChild(newDogsTable)
}

function renderDogs(dogs) {
  clearDogsTable()

  for(const dog of dogs) {
    dogsTable().appendChild(renderDog(dog))
  }
}

function renderDog(dog) {
  let dogRow = document.createElement('tr')
  dogRow.dataset.dogId = dog.id

  let colOne = document.createElement('td')
  colOne.innerText = dog.name

  let colTwo = document.createElement('td')
  colTwo.innerText = dog.breed

  let colThree = document.createElement('td')
  colThree.innerText = dog.sex

  let colFour = document.createElement('td')

  let editButton = document.createElement('button')
  editButton.innerText = "Edit"
  editButton.addEventListener('click', populateEditForm)
  colFour.appendChild(editButton)


  dogRow.appendChild(colOne)
  dogRow.appendChild(colTwo)
  dogRow.appendChild(colThree)
  dogRow.appendChild(colFour)

  return dogRow
}

function editForm() {
  return document.querySelector("#dog-form")
}

function populateEditForm(event) {
  const dogRow = event.target.parentElement.parentElement

  const dogId = dogRow.dataset.dogId
  const dogName = dogRow.children[0].innerHTML
  const dogBreed = dogRow.children[1].innerHTML
  const sex = dogRow.children[2].innerHTML

  editForm().children[0].value = dogName
  editForm().children[1].value = dogBreed
  editForm().children[2].value = sex

  editForm().addEventListener('submit', onFormSubmit.bind(dogRow, dogId))
}


function onFormSubmit(dogId, event) {
  event.preventDefault()

  name = editForm().children[0].value
  breed = editForm().children[1].value
  sex = editForm().children[2].value

  data = {name: name, breed: breed, sex: sex}

  fetchStr = DOG_URL + `/${dogId}`

  fetch(fetchStr, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then((updatedDog) => {
      goFetch()
    })
}