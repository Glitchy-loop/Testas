// Consts, variables

const url = 'http://18.193.250.181:1337/api/people?populate=*'
const countriesUrl = 'http://18.193.250.181:1337/api/countries'
const visitors = document.getElementById('visitors')
const signups = document.getElementById('signups')
const signupCountries = document.getElementById('signupCountries')
const users = document.querySelector('.users')
const search = document.querySelector('.searchBar input[type=search]')

// http://18.193.250.181:1337/api/people?populate=*&pagination[page]=1

// How many visitors

const howManyVisitors = () => {
  visitors.textContent = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000
}

howManyVisitors()

// How many users in total

const howManyUsersInTotal = async () => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.data.length > 0) {
      signups.textContent = data.meta.pagination.total
    } else {
      signups.textContent = `No data`
    }
  } catch (error) {
    console.log(error)
    users.textContent = err.message || `Failed to fetch`
  }
}

howManyUsersInTotal(url)

// How many registrations with country

const howManyRegistrationsWithCountries = async () => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.data.length > 0) {
      console.log(data)
      data.data.forEach(item => {
        console.log(item.attributes.country.data.attributes.country)
      })
    }
  } catch (err) {
    console.log(err.message)
    signupCountries.textContent = err.message || `Failed to fetch`
  }
}

howManyRegistrationsWithCountries(url)

// Get users from the server

const getUsers = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    // createPagination(data.meta.pagination.pageCount)

    if (data.data.length > 0) {
      displayUsers(data.data)
    } else {
      users.textContent = `Such user doesn't exist`
    }
  } catch (error) {
    console.log(error)
    users.textContent = err.message || `Failed to fetch`
  }
}

getUsers(url)

// Display user data

const displayUsers = async data => {
  users.innerHTML = ''
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

    const country = document.createElement('div')
    country.className = 'country'

    // if (
    //   !user.attributes.country.data ||
    //   !user.attributes.country ||
    //   !user.attributes.country.data.attributes.country ||
    //   !user.attributes.country.data.attributes ||
    //   !user.attributes
    // ) {
    //   country.textContent = `No country specified`
    // } else {
    //   country.textContent = user.attributes.country.data.attributes.country
    // }

    details.append(fullName, email)

    div.append(initials, details)

    users.append(div)
  })
}

//   Get Countries

const displayCountries = async url => {
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
    alert(err.message || 'Something went wrong')
  }
}

displayCountries(countriesUrl)

// Pagination

search.addEventListener('keyup', e => {
  let searchQuery = e.target.value.trim()

  console.log(
    `${url}?filters[first_name][$containsi]=${searchQuery}[$or]filters[last_name][$containsi]=${searchQuery}`
  )
  return getUsers(
    `${url}?filters[first_name][$containsi]=${searchQuery}[$or]?&filters[last_name][$containsi]=${searchQuery}`
  )
})

// http://18.193.250.181:1337/api/people?populate=*?
// filters[first_name][$containsi]=a&filters[last_name][$containsi]=smith
