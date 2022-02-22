const ROUTINES = {

  //LOGIN
  login: (phone, password, callback = (() => {})) => {
    const AUTH_DETAILS = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      Username: phone,
      Password: password,
    })
    USER = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      Username: phone,
      Pool: USER_POOL
    })
    USER.authenticateUser(AUTH_DETAILS, {
      onSuccess: (result) => {
        USER = result.user
        callback(null)
      },
      onFailure: (err) => {
        callback(err)
      },
    })
  },

  //LOGOUT
  logout: () => {
    const redirect = () => {
      const anticlears = {}
      for (let anticlear of ANTI_CLEARS) {
        if (localStorage.getItem(LOCAL_STORAGE_TAG + anticlear) !== null) {
          anticlears[anticlear] = localStorage.getItem(LOCAL_STORAGE_TAG + anticlear)
        }
      }
      localStorage.clear()
      for (let anticlear in anticlears) {
        localStorage.setItem(LOCAL_STORAGE_TAG + anticlear, anticlears[anticlear])
      }
      window.location.href = REDIRECTS.noAuth
    }
    if (USER != null) {
      USER.getSession((err, session) => {
        USER.globalSignOut({
          onSuccess: (data) => {
            redirect()
          },
          onFailure: (err) => {
            redirect()
          }
        })
      })
    }
    else {
      localStorage.clear()
      window.location.href = REDIRECTS.noAuth
    }
  },

  //GET ATTRIBUTES
  get: (callback = (() => {})) => {
    USER.getUserAttributes((err, result) => {
      if (err) {
        callback(null)
      }
      else {
        callback(result)
      }
    })
  },
}
