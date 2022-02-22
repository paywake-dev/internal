const verifyUsername = (obj) => {
  const username = cleanName(obj.value)
  if (username.length) {
    obj.removeAttribute("invalid")
    return username
  }
  obj.setAttribute("invalid", "true")
  return false
}

const verifyPassword = (obj) => {
  const password = obj.value
  if (password.length > 7) {
    obj.removeAttribute("invalid")
    return password
  }
  obj.setAttribute("invalid", "true")
  return false
}

const usernameDoesntExist = () => {
  document.getElementById("message").innerHTML = "No account exists with that username."
  document.getElementById("phone").setAttribute("invalid", "true")
}

const incorrectPassword = () => {
  document.getElementById("message").innerHTML = "Incorrect password."
  document.getElementById("password").setAttribute("invalid", "true")
}

const login = (obj) => {
  const usernameInput = document.getElementById("username")
  const passwordInput = document.getElementById("password")
  const devKeyInput = document.getElementById("devkey")
  if (verifyUsername(usernameInput) && verifyPassword(passwordInput)) {
    const username = cleanName(usernameInput.value)
    const password = passwordInput.value
    $(obj).addClass("loading")
    ROUTINES.login(username, password, (err) => {
      $(obj).removeClass("loading")
      if (err) {
        if (err.code === "UserNotFoundException") {
          usernameDoesntExist()
        }
        else {
          incorrectPassword()
        }
      }
      else {
        window.location.href = REDIRECTS.onAuth
      }
    })
  }
}
