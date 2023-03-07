let password = document.getElementById('password');
let username = document.getElementById('username');
let btn = document.getElementById('btn');
let message = document.getElementById('message');

btn.addEventListener('click', () => {
  let user = {"user": (username.value).toLowerCase(), "password": password.value};

  fetch('http://localhost:3000/users/add', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then(data => {
      message.innerHTML = data.message;
    })
})

