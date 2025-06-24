function signup() {
  const user = document.getElementById("signupUser").value;
  const pass = document.getElementById("signupPass").value;

  if (!user || !pass) return alert("Please fill all fields!");

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[user]) return alert("User already exists!");

  users[user] = pass;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! You can now login.");
}

function login() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[user] === pass) {
    localStorage.setItem("loggedInUser", user);
    window.location.href = "index.html";
  } else {
    alert("Invalid username or password.");
  }
}
