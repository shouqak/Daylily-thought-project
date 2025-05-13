const apiUrl = "https://6823484465ba058033961816.mockapi.io";

const username = document.getElementById("username-input");
const password = document.getElementById("password-input");
const confirmPassword = document.getElementById("confirm-password");
const submitButton = document.getElementById("submit");

submitButton.addEventListener("click", (e) => {
    e.preventDefault();

    const userInput = username.value.trim();
    const passInput = password.value;
    const confirmInput = confirmPassword.value;

    if (userInput.length < 4) {
        return alert("Username must be more than 4.");
    }
    if (passInput.length < 6) {
        return alert("Password must be more than 6.");
    }
    if (passInput !== confirmInput) {
        return alert("Password not match");
    }

    let userExists = false;
    fetch(`${apiUrl}/auth?username=${encodeURIComponent(userInput)}`)
        .then((checkUser) => {
            if (checkUser.ok) {
                return checkUser.json().then((matches) => {
                    if (matches.length > 0) {
                        userExists = true;
                        alert("Username already exist");
                    }
                });
            } 
        })
        .then(() => {
            if (userExists) return;

            return fetch(`${apiUrl}/auth`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json; charset=UTF-8"
                 },
                body: JSON.stringify({ username: userInput, password: passInput }),
            });
        })
       
        .then(() => {
            alert("Register has been successful");
            window.location.href = "./login.html";
        })

});