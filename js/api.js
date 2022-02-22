const API_KEY = "pwk_702297ce-39a0-4738-b9f8-7166e6c0f93f"

const DATA_API = {
  getOutstandingBalances: (callback = (r) => { console.log(r) }) => {
    $.ajax({
      url: (API + "/api/scan/all"),
      type: "PUT",
      data: {
        params: JSON.stringify({
          TableName: "balances"
        }),
        key: API_KEY,
      },
      success: (data) => {
        let sum = 0
        for (let balance of data) {
          sum += parseInt(balance.balance.N)
        }
        callback(sum / 100)
      }
    })
  }
}
