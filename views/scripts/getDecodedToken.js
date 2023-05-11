let reglog = document.querySelector('.rightnav')
let display = document.querySelector('.log')

const getLoginInfo = async () => {
  const res = await fetch("/userInfo", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {"Content-Type": "application/json",},
    // body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  const data = await res.json()
  if (data){
    reglog.innerText = "Logged in as: "+data.username;
    reglog.href = "/profile";
  }
}
getLoginInfo()