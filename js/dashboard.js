// Consts, variables

const url =
  'http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100'
const onlyCountriesUrl = 'http://18.193.250.181:1337/api/countries'
const visitors = document.getElementById('visitors')
const signups = document.getElementById('signups')
const signupCountries = document.getElementById('signupCountries')
const howManyNotCap = document.getElementById('howManyNotCap')
const users = document.querySelector('.users')
const search = document.querySelector('.searchBar input[type=search]')
const select = document.querySelector('.searchBar select')

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

// How many registrations with unique country // TODO Šita funkcija veikia ne iki galo teisingai, kadangi nėra galimybės paiimti visų vartotojų, tik 100 pirmų. Kitam puslapyje su kitais vartotojais rodys kitą statistiką.

const howManyRegistrationsWithCountries = async () => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    let countries = []

    if (data.data.length > 0) {
      data.data.forEach(item => {
        if (item.attributes.country.data) {
          countries.push(item.attributes.country.data.attributes.country)
        }
      })
    }

    countries = countries.filter((item, index) => {
      return countries.indexOf(item) == index
    })

    signupCountries.textContent = countries.length
  } catch (err) {
    console.log(err.message)
    signupCountries.textContent = err.message || `Failed to fetch`
  }
}

howManyRegistrationsWithCountries(url)

// How many first names or last names are not capitalized

const howManyNotCapitalized = async () => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.data.length > 0) {
      let count = 0

      data.data.forEach(item => {
        if (
          item.attributes.first_name[0] ===
          item.attributes.first_name[0].toLowerCase()
        ) {
          count++
        }
      })

      howManyNotCap.textContent = count
    }
  } catch (err) {
    console.log(err.message)
    howManyNotCap.textContent = err.message || `Failed to fetch`
  }
}

howManyNotCapitalized(url)

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

    if (user.attributes.country.data) {
      country.textContent = user.attributes.country.data.attributes.country
    } else {
      country.textContent = 'Not specified'
    }

    details.append(fullName, email)

    div.append(initials, details, country)

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

displayCountries(onlyCountriesUrl)

// Search by country

select.addEventListener('change', () => {
  searchUser()
})

// Search by firstname and lastname

search.addEventListener('keyup', () => {
  searchUser()
})

// Search

const searchUser = () => {
  let countryOption = select.value

  let searchQuery = search.value

  let splittedSearchQuery = searchQuery.trim().split(' ')

  let finalSearchQuery = `&filters[country][country][$eq]=${countryOption}`

  if (splittedSearchQuery.length > 0) {
    if (splittedSearchQuery.length === 1) {
      let firstNameQuery = splittedSearchQuery[0]

      finalSearchQuery += `&filters[$or][0][first_name][$containsi]=${firstNameQuery}&filters[$or][1][last_name][$containsi]=${firstNameQuery}`
    } else if (splittedSearchQuery.length > 1) {
      let firstNameQuery = splittedSearchQuery[0]
      let lastNameQuery = splittedSearchQuery[1]

      finalSearchQuery += `&filters[$and][0][first_name][$containsi]=${firstNameQuery}&filters[$and][1][last_name][$containsi]=${lastNameQuery}`
    }
  }

  return getUsers(`${url}${finalSearchQuery}`)
}
