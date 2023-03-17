
let formContainer = document.getElementById('form');
let postsContainer = document.getElementById('posts');
localStorage.removeItem('username');

renderLoginForm();

function renderLoginForm(){

  formContainer.innerHTML = `
  <h2>Log in to leave a greeting</h2>
  <form>
    <input id="username" placeholder="username" /><br>
    <input id="password" placeholder="password" type="password"/><br>
    <button id="btn" type="button">login</button>
  </form>
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
  
      
      let user = {"username": (username.value).toLowerCase(), "password": password.value};
  
      fetch('http://localhost:4000/api/users/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(data => {
          message.innerHTML = data.message;
          if (data.message == "Logged in"){
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
  <form>
    <input id="newUsername" placeholder="username" /><br>
    <input id="newPassword" type="password" placeholder="password" /><br>
    <p id="newUserMessage"></p>
    <button id="newUserBtn" type="button">create user</button>
    <button id="goBack" type="button">back to login</button>
  </form>

  `

  let newUserBtn = document.getElementById('newUserBtn');
  let goBackBtn = document.getElementById('goBack');

  newUserBtn.addEventListener('click', () => {
    let newUsername = document.getElementById('newUsername');
    let newPassword = document.getElementById('newPassword');
    let newUserMessage = document.getElementById('newUserMessage');
  
    let user = {"username": (newUsername.value).toLowerCase(), "password": newPassword.value};
  
    fetch('http://localhost:4000/api/users/add', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        if(data.message == "created user"){
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
  <h2>Congratulations, you can leave a greeting!</h2>
  <h3>What do you want to say?</h3>
  <form>
  <input type="text" placeholder="write here" id="content" required>
  <button id="postBtn" type="button">Post</button>
  <button id="logOutBtn" type="button">Log out</button>
  </form>`;

  let postBtn = document.getElementById('postBtn');

  postBtn.addEventListener('click', newPost)

  let logOutBtn = document.getElementById('logOutBtn');

  logOutBtn.addEventListener('click', () => {
    let userLocal = localStorage.getItem('username');
    let user = {"username": userLocal, "password": "secret"}
    console.log(user);

    fetch('http://localhost:4000/api/users/logout', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          localStorage.removeItem('username');
          renderLoginForm();
        })
  })
}

function newPost(){
  let postField = document.getElementById('content');
  let post = postField.value;
  let author = localStorage.getItem('username');
  let newPost = {"author": author, "blogPost": post}

  fetch('http://localhost:4000/api/blogs', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost)
  })
    .then(res => res.json())
    .then(data => {
      renderposts();
    })

}

function renderposts(){
  let postsHtml = `<div><h2>Latest posts</h2>`
  let postArr = []
  let postHtml;

  fetch('http://localhost:4000/api/blogs')
    .then(res => res.json())
    .then(data => {
      data.map(post => {
        postHtml= `
        <h3>Author: ${post.author}</h3>
        <p>${post.blogPost}</p><hr>
      `
        postArr.push(postHtml);
      })
      postArr.reverse()

      postArr.map(post => {
        postsHtml += post;
      })
      postsHtml += `</div>`
      postsContainer.innerHTML = postsHtml; 
    }) 
}

renderposts()
