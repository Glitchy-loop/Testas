// Consts, variables

const activitiesUrl = 'http://18.193.250.181:1337/api/activities'
const countriesUrl = 'http://18.193.250.181:1337/api/countries'
const peopleUrl = 'http://18.193.250.181:1337/api/people'

const rightSideContent = document.querySelector('#right > .content')
const formActivities = document.forms.activitiesForm
const formDetails = document.forms.details
const formPagination = document.querySelector('#right > .content > .pagination')
const formQuestion = document.querySelector('#right > .content > h3')
const greenSeperator = document.querySelector('#right .content .greenHr')

let randomID = Math.floor(Math.random() * 100000)

// Fetch activities from the server

const getActivities = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    displayActivities(data.data)
  } catch (err) {
    console.log(err.message)
    rightSideContent.innerHTML = err.message || 'Failed to fetch'
  }
}

getActivities(activitiesUrl)

// Display activities

const displayActivities = data => {
  data.forEach(activity => {
    const div = document.createElement('div')

    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.name = activity.id

    const label = document.createElement('label')
    label.setAttribute('for', activity.id)
    label.textContent = activity.attributes.title

    div.append(checkbox, label)

    formActivities.prepend(div)
  })
}

// Submit activties to local storage and go to next form

formActivities.addEventListener('submit', e => {
  e.preventDefault()

  let checkBoxes = e.target.elements
  let activities = []

  checkBoxes[0].parentNode.children[1].textContent.trim()
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].type === 'checkbox' && checkBoxes[i].checked) {
      activities.push(Number(checkBoxes[i].name))
    }
  }
  //   Check if at least 1 activity selected

  if (activities.length < 1) {
    alert('You have to select at least 1 activity')
  } else {
    localStorage.setItem('Activities', activities)
    localStorage.setItem('ID', randomID)
    formActivities.classList.add('hide')
    formDetails.classList.remove('hide')
    formPagination.textContent = '2/5'
    formQuestion.textContent = 'Please fill in your details'
    greenSeperator.style.display = 'block'
    //   Get Countries
    const getCountries = async url => {
      try {
        const res = await fetch(url)
        const data = await res.json()
        data.data.forEach(country => {
          const select = document.querySelector('#formDetails select')
          const option = document.createElement('option')
          option.value = country.attributes.country
          option.textContent = country.attributes.country
          select.append(option)
        })
      } catch (err) {
        console.log(err.message)
        rightSideContent.innerHTML = err.message || 'Failed to fetch'
      }
    }
    getCountries(countriesUrl)
  }
})
// console.log(localStorage.getItem('ID'))
// // Submit and send form details to the back-end server

// formDetails.addEventListener('submit', e => {
//   e.preventDefault()

//   const firstName = e.target.elements.firstName.value
//   const lastName = e.target.elements.lastName.value
//   const email = e.target.elements.email.value
//   const country = e.target.elements.countries.value
//   const activities = localStorage.getItem('Activities').split(',')
//   const id = Number(localStorage.getItem('ID'))

//   const allDetails = {
//     id,
//     attributes: {
//       first_name: firstName,
//       last_name: lastName,
//       email,
//       country,
//       activities
//     }
//   }

//   console.log(JSON.stringify(allDetails))

//   // Send details to back-end

//   const postDetails = async details => {
//     try {
//       const res = await fetch(peopleUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           data: {
//             id: id,
//             first_name: firstName,
//             last_name: lastName,
//             email: email,
//             country: 8
//             //   activities: activities
//           }
//         })
//       })
//       const data = await res.json()

//       console.log(data)
//     } catch (err) {
//       console.log(err.message)
//       rightSideContent.innerHTML = err.message || 'Failed to fetch'
//     }
//   }

//   postDetails(allDetails)
// })
