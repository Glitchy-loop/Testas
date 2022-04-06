// URLs

const activitiesUrl = 'http://18.193.250.181:1337/api/activities?populate=*'
const countriesUrl = 'http://18.193.250.181:1337/api/countries?populate=*'
const getPeopleUrl = 'http://18.193.250.181:1337/api/people?populate=*'
const deletePeopleUrl = 'http://18.193.250.181:1337/api/people/'

// Consts, variables

const rightSideContent = document.querySelector('#right .content')
const formActivities = document.forms.activitiesForm
const formDetails = document.forms.details
const formPagination = document.querySelector('#right .content .pagination')
const formQuestion = document.querySelector('#right .content h3')
const greenSeperator = document.querySelector('#right .content .greenHr')
const detailsConfirmation = document.querySelector('.detailsConfirmation')
const lastNote = document.getElementById('lastNote')

let userID

// Fetch activities from the server

const getActivities = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    displayActivities(data.data)
  } catch (err) {
    console.log(err.message)
    rightSideContent.innerHTML = err.message || 'Something went wrong'
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
      activities.push(checkBoxes[i].name)
    }
  }

  //   Check if at least 1 activity selected

  if (activities.length < 1) {
    alert('You have to select at least 1 activity to proceed')
  } else {
    localStorage.setItem('Activities', activities)
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
          option.id = country.id

          select.append(option)
        })
      } catch (err) {
        console.log(err.message)
        rightSideContent.innerHTML = err.message || 'Something went wrong'
      }
    }

    getCountries(countriesUrl)
  }
})

// Submit and send form details to the back-end server

formDetails.addEventListener('submit', e => {
  e.preventDefault()

  // Details
  const firstName = e.target.elements.firstName.value
  const lastName = e.target.elements.lastName.value
  const email = e.target.elements.email.value
  const country = Number(e.target.elements.countries.selectedIndex)
  const countryName = e.target.elements.countries.value
  const activities = localStorage
    .getItem('Activities')
    .split(',')
    .map(Number)

  localStorage.setItem('CountryName', countryName)
  localStorage.setItem('CountryID', country)

  // Post details to back-end

  const postDetails = async () => {
    try {
      const res = await fetch(getPeopleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            country: country,
            activities: activities
          }
        })
      })

      const data = await res.json()

      localStorage.setItem('userID', data.data.id)

      // Confirm or detele details

      const confirmOrDeleteDetails = async id => {
        try {
          const res = await fetch(
            `http://18.193.250.181:1337/api/people?filters[id][$eq]=${localStorage.getItem(
              'userID'
            )}`
          )
          const data = await res.json()

          if (data.data.length > 0) {
            confirmUser(data.data)

            formDetails.classList.add('hide')
            detailsConfirmation.classList.remove('hide')
          } else {
            rightSideContent.innerHTML = `Request impossible`
          }
        } catch (err) {
          console.log(err.message)
          rightSideContent.innerHTML = err.message || 'Something went wrong'
        }
      }

      confirmOrDeleteDetails()

      // Display user details

      const confirmUser = data => {
        const confirmFirstName = document.getElementById('confirmFirstName')
        const confirmLastName = document.getElementById('confirmLastName')
        const confirmEmail = document.getElementById('confirmEmail')
        const confirmCountry = document.getElementById('confirmCountry')

        formPagination.textContent = '3/5'
        formQuestion.textContent = 'Are these details correct?'

        data.forEach(item => {
          confirmFirstName.textContent = item.attributes.first_name
          confirmLastName.textContent = item.attributes.last_name
          confirmEmail.textContent = item.attributes.email
          confirmCountry.textContent = localStorage.getItem('CountryName')
        })
      }
    } catch (err) {
      console.log(err.message)
      rightSideContent.innerHTML = err.message || 'Something went wrong'
    }
  }

  postDetails()
})

const deleteUserBtn = document.getElementById('deleteUser')
const confirmUserBtn = document.getElementById('confirmUser')

// Delete user

deleteUserBtn.addEventListener('click', async () => {
  try {
    const res = await fetch(
      `${deletePeopleUrl}${localStorage.getItem('userID')}`,
      {
        method: 'DELETE'
      }
    )

    const data = await res.json()

    detailsConfirmation.classList.add('hide')
    formDetails.classList.remove('hide')
    formPagination.textContent = '2/5'
    formQuestion.textContent = 'Please fill in your details'
  } catch (err) {
    console.log(err.message)
    rightSideContent.innerHTML = err.message || 'Something went wrong'
  }
})

// Confirm User

confirmUserBtn.addEventListener('click', () => {
  formPagination.textContent = '4/5'
  detailsConfirmation.classList.add('hide')
  formQuestion.textContent = 'Please check your email'
  lastNote.classList.remove('hide')
  greenSeperator.style.width = '100%'
})
