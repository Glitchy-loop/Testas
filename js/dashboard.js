// Consts, variables

const peopleUrl = 'http://18.193.250.181:1337/api/people/'
const countriesUrl = 'http://18.193.250.181:1337/api/countries'
const users = document.querySelector('.users')

// Get users from the server

const getUsers = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    console.log(data.data)
    if (data.data.length > 0) {
      displayUsers(data.data)
    }
  } catch (err) {
    console.log(err.message)
    users.textContent = err.message
  }
}

getUsers(peopleUrl)

// Display user data

const displayUsers = async data => {
  data.forEach(user => {
    const div = document.createElement('div')
    div.className = 'user'

    const initials = document.createElement('div')
    initials.className = 'initials'
    initials.textContent =
      user.attributes.first_name[0] + user.attributes.last_name[0]

    const details = document.createElement('div')
    details.className = 'details'

    const fullName = document.createElement('div')
    fullName.className = 'fullName'
    fullName.textContent = `${user.attributes.first_name} ${user.attributes.last_name}`

    const email = document.createElement('div')
    email.className = 'email'
    email.textContent = user.attributes.email

    details.append(fullName, email)

    div.append(initials, details)

    users.append(div)
  })
}

//   Get Countries

const getCountries = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    data.data.forEach(country => {
      const select = document.querySelector('.searchBar select')
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
