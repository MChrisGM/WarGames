let ul = document.getElementById('users_list')
let display = document.querySelector('.log')

const getUsers = async () => {
  const res = await fetch('/api/auth/getUsers')
  const data = await res.json()
  data.user.map((mappedUser) => {
    if (mappedUser.username !== 'admin') {
      let li = `<li> <b>Username</b> => ${mappedUser.username} <br> <b>Role</b> => ${mappedUser.role} </li> <button class="edit">Edit Role</button> <button class="delete">Delete User</button>`
      ul.innerHTML += li
    } else {
      return null
    }
    const editRole = document.querySelectorAll('.edit')
    const deleteUser = document.querySelectorAll('.delete')

    editRole.forEach((button, i) => {
      button.addEventListener('click', async () => {
        display.textContent = ''
        const id = data.user[i + 1].id
        const res = await fetch('/api/auth/update', {
          method: 'PUT',
          body: JSON.stringify({ role: 'admin', id }),
          headers: { 'Content-Type': 'application/json' }
        })
        const dataUpdate = await res.json()
        if (res.status === 400 || res.status === 401) {
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
          return display.textContent = `${dataUpdate.message}. ${dataUpdate.error ? dataUpdate.error : ''}`
        }
        location.assign('/admin')
      })
    });
    deleteUser.forEach((button, i) => {
      button.addEventListener('click', async () => {
        display.textContent = ''
        const id = data.user[i + 1].id
        const res = await fetch('/api/auth/deleteUser', {
          method: 'DELETE',
          body: JSON.stringify({ id }),
          headers: { 'Content-Type': 'application/json' }
        })
        const dataDelete = await res.json()
        if (res.status === 401) {
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
          return display.textContent = `${dataUpdate.message}. ${dataUpdate.error ? dataUpdate.error : ''}`
        }
        location.assign('/admin')
      })
    })
  })
}
getUsers()