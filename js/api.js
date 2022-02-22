const API_KEY = "pwk_702297ce-39a0-4738-b9f8-7166e6c0f93f"

const DATA_API = {
  getOutstandingBalances: (callback = (r) => {}) => {
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
  },
  getAllFeedback: (callback = (r) => {}) => {
    $.ajax({
      url: (API + "/api/scan/all"),
      type: "PUT",
      data: {
        params: JSON.stringify({
          TableName: "feedback"
        }),
        key: API_KEY,
      },
      success: (data) => {
        let sum = 0
        let c = 0
        for (let point of data) {
          const factor = parseInt(point.factor.N)
          if (factor === (-2)) {
            sum += 0.59 //F
          }
          if (factor === (-1)) {
            sum += ((0.7 + 0.73) / 2) //C-
          }
          else if (factor === 1) {
            sum += ((0.87 + 0.9) / 2) //B+
          }
          else if (factor === 2) {
            sum += ((0.97 + 1) / 2) //A+
          }
          c++
        }
        callback(sum / c)
      }
    })
  },
  getFeedbackOnDay: (day, callback = (r) => {}) => {
    $.ajax({
      url: (API + "/api/scan/all"),
      type: "PUT",
      data: {
        params: JSON.stringify({
          TableName: "feedback"
        }),
        key: API_KEY,
      },
      success: (data) => {
        let sum = 0
        let c = 0
        for (let point of data) {
          if (parseInt(point.id.S.split("-").reverse()[0]) === day) {
            const factor = parseInt(point.factor.N)
            if (factor === (-2)) {
              sum += 0.59 //F
            }
            if (factor === (-1)) {
              sum += ((0.7 + 0.73) / 2) //C-
            }
            else if (factor === 1) {
              sum += ((0.87 + 0.9) / 2) //B+
            }
            else if (factor === 2) {
              sum += ((0.97 + 1) / 2) //A+
            }
            c++
          }
        }
        callback(sum / c)
      }
    })
  },
}
