const apiUrl = "https://6823484465ba058033961816.mockapi.io";
let username = document.getElementById("username-input");
let password = document.getElementById("password-input");
let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  login();
});

async function login() {
  console.log(username, password);
  try {
    const res = await fetch(`${apiUrl}/auth`);
    const users = await res.json();
    const userExist = users.find(
      (u) => u.username === username.value && u.password === password.value
    );
    console.log(userExist);
    if (userExist) {
      localStorage.setItem("username", userExist.username);
      alert("تم تسجيل الدخول");
    window.location.href = "./index.html";
    } else {
      alert("username or passowrd err");
    }
  } catch (err) {
    console.log("error login", err);
  }
}
