let ul = document.getElementById('users_list')
let display = document.querySelector('.log')

const getNormalUsers = async () => {
  const res = await fetch('/api/auth/getUsers')
  const data = await res.json()
  data.user.map((mappedUser) => {
    if (mappedUser.username !== 'admin') {
      let li = `<li> <b>Username</b> => ${mappedUser.username} <br> <b>Role</b> => ${mappedUser.role} </li>`
      ul.innerHTML += li
    } else {
      return null
    }
  })
}
getNormalUsers()