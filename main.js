
let formContainer = document.getElementById('form');
localStorage.removeItem('username');

renderLoginForm();

function renderLoginForm(){

  formContainer.innerHTML = `
  <h2>Log in</h2>
  <input id="username" placeholder="username" /><br>
  <input id="password" placeholder="password" type="password"/><br>
  <button id="btn">login</button>
  <p id="message"></p>
  <h2> Not a member? </h2>
  <button id="createNewUserBtn">Create a new user</button>
  `
  let loginBtn = document.getElementById('btn');
  let createNewUserBtn = document.getElementById('createNewUserBtn');

  loginBtn.addEventListener('click', () => {
      let password = document.getElementById('password');
      let username = document.getElementById('username');
      let message = document.getElementById('message');
  
      
      let user = {"user": (username.value).toLowerCase(), "password": password.value};
  
      fetch('http://localhost:3000/users/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(data => {
          message.innerHTML = data.message;
          if (data.message == "Login successfull!"){
            localStorage.setItem("username", username.value);
            renderLoggedinPage()
          }
        })
      })
  createNewUserBtn.addEventListener('click', renderNewUserForm)
}

// localStorage.removeItem('username');
function renderNewUserForm(){
  formContainer.innerHTML = `
  <h2>Become a member</h2>
  <input id="newUsername" placeholder="username" /><br>
  <input id="newPassword" type="password" placeholder="password" /><br>
  <p id="newUserMessage"></p>
  <button id="newUserBtn">create user</button>
  <button id="goBack">back to login</button>

  `

  let newUserBtn = document.getElementById('newUserBtn');
  let goBackBtn = document.getElementById('goBack');

  newUserBtn.addEventListener('click', () => {
    let newUsername = document.getElementById('newUsername');
    let newPassword = document.getElementById('newPassword');
    let newUserMessage = document.getElementById('newUserMessage');
  
    let user = {"user": (newUsername.value).toLowerCase(), "password": newPassword.value};
  
    fetch('http://localhost:3000/users/add', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        if(data.message == "added new"){
          renderCreatedUser()
        } else{
          newUserMessage.innerText = 'Try another username';
        };
      })
  })

  goBackBtn.addEventListener('click', renderLoginForm)
}

function renderCreatedUser(){
  formContainer.innerHTML = `
  <h2>Congratulations, you are now a member!</h2>
  <button id="backToLogin">back to login</button>`;

  let backToLogin = document.getElementById('backToLogin');

  backToLogin.addEventListener('click', renderLoginForm)
}

function renderLoggedinPage(){
  formContainer.innerHTML = `
  <h2>Congratulations, you are now logged in!</h2>
  <p>But there is nothing to do here...</p>
  <button id="logOutBtn">Log out</button>`;

  let logOutBtn = document.getElementById('logOutBtn');

  logOutBtn.addEventListener('click', () => {
    localStorage.removeItem('username');
    renderLoginForm();
  })
}

