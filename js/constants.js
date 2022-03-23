const YEAR = (new Date()).getFullYear()
const API = "https://0zynwo3qw4.execute-api.us-east-1.amazonaws.com/dev"
const REDIRECTS = {
  home: "./dashboard",
  onAuth: "./dashboard",
  noAuth: "./login"
}
const TIME_ZONE = "America/Los_Angeles"
const EPOCH = [1970, 0, 1]
const LOCAL_STORAGE_TAG = "paywake-internal-"
const ANTI_CLEARS = []

console.log("\u00A9 " + YEAR.toString() + " Paywake Corporation")

const logout = () => {
  if (USER) {
    ROUTINES.logout()
  }
}

const cleanPhone = (string) => {
  return string.toString().trim().toLowerCase().replace(/[^0-9]+/g, "")
}

const cleanName = (string) => {
  return string.toString().trim().replace(/[^a-zA-Z\.\- ]+/g, "")
}

const formatPhone = (value) => {
  if (!value) {
    return value
  }
  const number = value.replace(/[^\d]/g, "")
  const n = number.length
  if (n < 4) {
    return number
  }
  if (n < 7) {
    return `(${number.slice(0, 3)}) ${number.slice(3)}`
  }
  return `(${number.slice(0, 3)}) ${number.slice(3,6)}-${number.slice(6, 10)}`
}

const phoneFormatter = (obj) => {
  const value = formatPhone(obj.value)
  obj.value = value
}

$(document).ready(() => {
  try {
    $("#__YEAR")[0].innerHTML = YEAR.toString()
  } catch (e) {}
})

$(document).ready(() => {
  try {
    const showPassword = $("#__show-password")[0]
    if (showPassword) {
      const showPasswordTarget = $(showPassword.getAttribute("target"))[0]
      showPassword.onclick = () => {
        if (showPasswordTarget.type === "password") {
          showPasswordTarget.type = "text"
          $(showPassword).addClass("visible")
          $("#__show-password-container").addClass("visible")
        }
        else {
          showPasswordTarget.type = "password"
          $(showPassword).removeClass("visible")
          $("#__show-password-container").removeClass("visible")
        }
      }
    }
  } catch (e) {}
});
