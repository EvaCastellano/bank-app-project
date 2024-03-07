'use strict'

// Elements
const labelWelcome = document.querySelector('.welcome')
const labelError = document.querySelector('.error')
const labelDate = document.querySelector('.date')
const labelBalance = document.querySelector('.balance__value')
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')
const labelTimer = document.querySelector('.timer')

const containerApp = document.querySelector('.app')
const containerMovements = document.querySelector('.movements')

const btnLogin = document.querySelector('.login__btn')
const btnTransfer = document.querySelector('.form__btn--transfer')
const btnLoan = document.querySelector('.form__btn--loan')
const btnClose = document.querySelector('.form__btn--close')
const btnSort = document.querySelector('.btn--sort')

const inputLoginUsername = document.querySelector('.login__input--user')
const inputLoginPin = document.querySelector('.login__input--pin')
const inputTransferTo = document.querySelector('.form__input--to')
const inputTransferAmount = document.querySelector('.form__input--amount')
const inputLoanAmount = document.querySelector('.form__input--loan-amount')
const inputCloseUsername = document.querySelector('.form__input--user')
const inputClosePin = document.querySelector('.form__input--pin')
let currentAccount, token

btnLogin.addEventListener('click', async function (e) {
  e.preventDefault()
  // ask ajax request to server for login
  const username = inputLoginUsername.value // juan_s
  const pin = inputLoginPin.value // 1111
  const response = await fetch(
    `http://localhost:4000/login?username=${username}&pin=${pin}`
  )
  const datos = await response.json()
  currentAccount = datos.account
  token = datos.token

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('login correcto')
    // Mostramos bienvenido $username
    containerApp.style.opacity = 100
    labelWelcome.textContent = `Bienvenido ${
      currentAccount.owner.split(' ')[0]
    }`
    updateUI(currentAccount)
  } else {
    console.log('login incorrecto')
    // Mostramos Usuario o contraseña incorrectos
    containerApp.style.opacity = 0
    labelError.textContent = 'Usuario o contraseña incorrectos'
  }

  function updateUI({ movements }) {
    displayMovements(movements)
    displayBalance(movements)
    displaySummary(movements)
  }

  function displayMovements(movements) {
    containerMovements.innerHTML = ''
    movements.forEach(function (mov, i) {
      const type = mov > 0 ? 'deposit' : 'withdrawal'
      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
      `
      containerMovements.insertAdjacentHTML('afterbegin', html)
    })
  }

  inputLoginUsername.value = inputLoginPin.value = ''
  inputLoginPin.blur()
})

const displayBalance = function (movements) {
  const balance = movements.reduce((amount, mov) => amount + mov.amount, 0)
  labelBalance.textContent = `${balance.toFixed(2)}€`
}

const displaySummary = function (movements) {
  const sumIn = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${sumIn.toFixed(2)}€`

  const sumOut = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(sumOut).toFixed(2)}€`
}
