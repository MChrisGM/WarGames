let form = document.querySelector('form')
let username = document.querySelector('#username')
let password = document.querySelector('#password')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  display.textContent = ''
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: username.value, password: password.value }),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    if (res.status === 400 || res.status === 401) {
      return display.textContent = `${data.message}. ${data.error ? data.error : ''}`
    }
    data.role === "admin" ? location.assign('/admin') : location.assign('/')
  } catch (err) {
    console.log(err.message)
  }

})