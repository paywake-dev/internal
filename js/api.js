const API_KEY = "pwk_702297ce-39a0-4738-b9f8-7166e6c0f93f"
const US_POOL = "us_0"

const DATA_API = {
  constants: {
    launchDay: 19038,
    today: moment().tz(TIME_ZONE).diff(moment.tz(EPOCH, TIME_ZONE).hour(2).minute(0).second(0), "days"),
    minWakeupTime: 120,
    maxWakeupTime: 660,
  },
  utilities: {
    time: () => {
      const m = moment(Date.now()).tz(TIME_ZONE)
      return ((m.hours() * 60) + m.minutes())
    },
  },
  datasets: {
    reset: () => {
      DATA_API.datasets.feedback = []
      DATA_API.datasets.wakeup = []
      DATA_API.datasets.balances = []
    },
    get: {
      feedback: (callback = (r) => {}) => {
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
            DATA_API.datasets.feedback = data
            callback(data)
          }
        })
      },
      wakeups: (callback = (r) => {}) => {
        $.ajax({
          url: (API + "/api/scan/all"),
          type: "PUT",
          data: {
            params: JSON.stringify({
              TableName: "wakeups"
            }),
            key: API_KEY,
          },
          success: (data) => {
            DATA_API.datasets.wakeups = data
            callback(data)
          }
        })
      },
      balances: (callback = (r) => {}) => {
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
            DATA_API.datasets.balances = data
            callback(data)
          }
        })
      },
    },
    feedback: [],
    wakeups: [],
    balances: [],
  },
  getOutstandingBalances: (callback = (r) => {}) => {
    const onData = () => {
      let sum = 0
      let balances = []
      for (let balance of DATA_API.datasets.balances) {
        sum += parseInt(balance.balance.N)
        balances.push(parseInt(balance.balance.N))
      }
      callback(sum / 100)
    }
    if (DATA_API.datasets.balances.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.balances(onData)
    }
  },
  getAvgOutstandingBalance: (callback = (r) => {}) => {
    const onData = () => {
      let sum = 0
      let c = 0
      let max = 0
      let maxID = ""
      for (let balance of DATA_API.datasets.balances) {
        sum += parseInt(balance.balance.N)
        if (parseInt(balance.balance.N)) {
          c++
        }
        if (parseInt(balance.balance.N) > max) {
          max = parseInt(balance.balance.N)
          maxID = balance.id.S
        }
      }
      callback((sum / 100) / c)
    }
    if (DATA_API.datasets.balances.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.balances(onData)
    }
  },
  getMaxOutstandingBalance: (callback = (r) => {}) => {
    const onData = () => {
      let max = 0
      let maxID = ""
      for (let balance of DATA_API.datasets.balances) {
        if (parseInt(balance.balance.N) > max) {
          max = parseInt(balance.balance.N)
          maxID = balance.id.S
        }
      }
      callback(max / 100)
    }
    if (DATA_API.datasets.balances.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.balances(onData)
    }
  },
  getMaxOutstandingBalanceHolder: (callback = (r) => {}) => {
    const onData = () => {
      let max = 0
      let maxID = ""
      for (let balance of DATA_API.datasets.balances) {
        if (parseInt(balance.balance.N) > max) {
          max = parseInt(balance.balance.N)
          maxID = balance.id.S
        }
      }
      callback(maxID)
    }
    if (DATA_API.datasets.balances.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.balances(onData)
    }
  },
  getAllFeedbackStrings: (callback = (r) => {}) => {
    const onData = () => {
      let arr = []
      for (let point of DATA_API.datasets.feedback) {

        let input = ""
        try {
          input = point.input.S
        } catch (e) {}
        if (input.length) {
          arr.push(input)
        }
      }
      callback(arr.reverse())
    }
    if (DATA_API.datasets.feedback.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.feedback(onData)
    }
  },
  getAllFeedback: (callback = (r) => {}) => {
    const onData = () => {
      let sum = 0
      let c = 0
      for (let point of DATA_API.datasets.feedback) {
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
    if (DATA_API.datasets.feedback.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.feedback(onData)
    }
  },
  getFeedbackOnDay: (day, callback = (r) => {}) => {
    const onData = () => {
      let sum = 0
      let c = 0
      for (let point of DATA_API.datasets.feedback) {
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
    if (DATA_API.datasets.feedback.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.feedback(onData)
    }
  },
  getFeedbackToday: (callback = (r) => {}) => {
    DATA_API.getFeedbackOnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  },
  getFeedbackYesterday: (callback = (r) => {}) => {
    DATA_API.getFeedbackOnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  },
  getWakeupDepositsOnDay: (day, callback = (r) => {}) => {
    const onData = () => {
      let sum = 0
      for (let point of DATA_API.datasets.wakeups) {
        if (parseInt(point.id.S.split("-")[1]) === day) {
          if (parseInt(point.is2x.N)) {
            sum += (parseInt(point.deposit.N) / 2)
          }
          else {
            sum += parseInt(point.deposit.N)
          }
        }
      }
      callback(sum / 100)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getDAUsOnDay: (day, callback = (r) => {}) => {
    const onData = () => {
      let sum = 0
      for (let point of DATA_API.datasets.wakeups) {
        if (parseInt(point.id.S.split("-")[1]) === day) {
          sum++
        }
      }
      callback(sum)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getWuFROnDay: (day, callback = (r) => {}) => {
    const onData = () => {
      let failed = 0
      let total = 0
      for (let point of DATA_API.datasets.wakeups) {
        if (parseInt(point.id.S.split("-")[1]) === day) {
          if (!(day > DATA_API.constants.today) && (day !== DATA_API.constants.today || DATA_API.utilities.time() > (parseInt(point.time.N) + 3))) {
            if (!parseInt(point.verified.N)) {
              failed++
            }
            total++
          }
        }
      }
      callback(failed / total)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getReturnsOnDay: (day, callback = (r) => {}) => {
    const onData = () => {
      let failed = 0
      let total = 0
      for (let point of DATA_API.datasets.wakeups) {
        if (parseInt(point.id.S.split("-")[1]) === day) {
          if (!(day > DATA_API.constants.today) && (day !== DATA_API.constants.today || DATA_API.utilities.time() > (parseInt(point.time.N) + 3))) {
            if (!parseInt(point.verified.N)) {
              failed += (Math.floor(parseInt(point.deposit.N) * (1 - 0.029)) - 30)
            }
            else {
              total += parseInt(point.deposit.N)
            }
          }
        }
      }
      callback((failed / total) * 0.85)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getRevenueOnDay: (day, callback = (r) => {}) => {
    const onData = () => {
      let revenue = 0
      for (let point of DATA_API.datasets.wakeups) {
        if (parseInt(point.id.S.split("-")[1]) === day) {
          if (!(day > DATA_API.constants.today) && (day !== DATA_API.constants.today || DATA_API.utilities.time() > (parseInt(point.time.N) + 3))) {
            if (!parseInt(point.verified.N)) {
              revenue += Math.floor((parseInt(point.deposit.N) * (1 - 0.029)) - 30)
            }
          }
        }
      }
      callback(revenue / 100)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getProfitPerDAUOnDay: (day, callback = (r) => {}) => {
    DATA_API.getProfitOnDay(day, (p) => {
      DATA_API.getDAUsOnDay(day, (d) => {
        callback(p / d)
      })
    })
  },
  getProfitPerDAUToday: (callback = (r) => {
    DATA_API.getProfitPerDAUOnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  }),
  getProfitPerDAUYesterday: (callback = (r) => {
    DATA_API.getProfitPerDAUOnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  }),
  getProfitPerDAUAllTime: (callback = (r) => {}) => {
    let sum = 0
    let c = 0
    const recurse = (day) => {
      DATA_API.getProfitOnDay(day, (r) => {
        sum += r;
        c++;
        if (day === DATA_API.constants.today) {
          callback(sum / c)
        }
        else {
          recurse(day + 1)
        }
      })
    }
    recurse(DATA_API.constants.launchDay)
  },
  getProfitOnDay: (day, callback = (r) => {}) => {
    DATA_API.getRevenueOnDay(day, (r) => {
      callback(Math.floor(r * 15) / 100)
    })
  },
  getMeanDepositOnDay: (day, callback = (r) => {}) => {
    DATA_API.getDAUsOnDay(day, (daus) => {
      DATA_API.getWakeupDepositsOnDay(day, (deposits) => {
        callback(Math.round((deposits / daus) * 100) / 100)
      })
    })
  },
  getWakeupDepositsToday: (callback = (r) => {}) => {
    DATA_API.getWakeupDepositsOnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  },
  getWakeupDepositsYesterday: (callback = (r) => {}) => {
    DATA_API.getWakeupDepositsOnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  },
  getWakeupDepositsTomorrow: (callback = (r) => {}) => {
    DATA_API.getWakeupDepositsOnDay(DATA_API.constants.today + 1, (r) => {
      callback(r)
    })
  },
  getDAUsToday: (callback = (r) => {}) => {
    DATA_API.getDAUsOnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  },
  getDAUsYesterday: (callback = (r) => {}) => {
    DATA_API.getDAUsOnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  },
  getMeanDepositToday: (callback = (r) => {}) => {
    DATA_API.getMeanDepositOnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  },
  getMeanDepositYesterday: (callback = (r) => {}) => {
    DATA_API.getMeanDepositOnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  },
  getMeanDepositAllTime: (callback = (r) => {}) => {
    let sum = 0
    let c = 0
    const recurse = (day) => {
      DATA_API.getMeanDepositOnDay(day, (r) => {
        sum += r;
        c++;
        if (day === DATA_API.constants.today) {
          callback(sum / c)
        }
        else {
          recurse(day + 1)
        }
      })
    }
    recurse(DATA_API.constants.launchDay)
  },
  getWuFRToday: (callback = (r) => {}) => {
    DATA_API.getWuFROnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  },
  getWuFRYesterday: (callback = (r) => {}) => {
    DATA_API.getWuFROnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  },
  getWuFRAllTime: (callback = (r) => {}) => {
    let sum = 0
    let c = 0
    const recurse = (day) => {
      DATA_API.getWuFROnDay(day, (r) => {
        sum += r;
        c++;
        if (day === DATA_API.constants.today) {
          callback(sum / c)
        }
        else {
          recurse(day + 1)
        }
      })
    }
    recurse(DATA_API.constants.launchDay)
  },
  getReturnsToday: (callback = (r) => {}) => {
    DATA_API.getReturnsOnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  },
  getReturnsYesterday: (callback = (r) => {}) => {
    DATA_API.getReturnsOnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  },
  getReturnsAllTime: (callback = (r) => {}) => {
    let sum = 0
    let c = 0
    const recurse = (day) => {
      DATA_API.getReturnsOnDay(day, (r) => {
        sum += r;
        c++;
        if (day === DATA_API.constants.today) {
          callback(sum / c)
        }
        else {
          recurse(day + 1)
        }
      })
    }
    recurse(DATA_API.constants.launchDay)
  },
  getRevenueToday: (callback = (r) => {}) => {
    DATA_API.getRevenueOnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  },
  getRevenueYesterday: (callback = (r) => {}) => {
    DATA_API.getRevenueOnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  },
  getProfitToday: (callback = (r) => {}) => {
    DATA_API.getProfitOnDay(DATA_API.constants.today, (r) => {
      callback(r)
    })
  },
  getProfitYesterday: (callback = (r) => {}) => {
    DATA_API.getProfitOnDay(DATA_API.constants.today - 1, (r) => {
      callback(r)
    })
  },
  getTotalRevenue: (callback = (r) => {}) => {
    let revenue = 0
    const recurse = (day) => {
      if (day === DATA_API.constants.launchDay - 2) {
        callback(revenue)
      }
      else {
        DATA_API.getRevenueOnDay(day, (r) => {
          revenue += r;
          recurse(day - 1)
        })
      }
    }
    recurse(DATA_API.constants.today)
  },
  getTotalProfit: (callback = (r) => {}) => {
    DATA_API.getTotalRevenue((r) => {
      callback(Math.floor(r * 15) / 100)
    })
  },
  getMonthRevenue: (callback = (r) => {}) => {
    let revenue = 0
    const recurse = (day) => {
      if (day === DATA_API.constants.today - 31) {
        callback(revenue)
      }
      else {
        DATA_API.getRevenueOnDay(day, (r) => {
          revenue += r;
          recurse(day - 1)
        })
      }
    }
    recurse(DATA_API.constants.today)
  },
  getMonthProfit: (callback = (r) => {}) => {
    DATA_API.getMonthRevenue((r) => {
      callback(Math.floor(r * 15) / 100)
    })
  },
  getYearRevenue: (callback = (r) => {}) => {
    DATA_API.getMonthRevenue((r) => {
      callback(r * 12)
    })
  },

  getYearProfit: (callback = (r) => {}) => {
    DATA_API.getMonthProfit((r) => {
      callback(r * 12)
    })
  },
  getTotalWakeupDeposits: (callback = (r) => {}) => {
    const onData = () => {
      let sum = 0
      for (let point of DATA_API.datasets.wakeups) {
        if (parseInt(point.id.S.split("-")[1]) > (DATA_API.constants.launchDay - 1)) {
          if (parseInt(point.is2x.N)) {
            sum += (parseInt(point.deposit.N) / 2)
          }
          else {
            sum += parseInt(point.deposit.N)
          }
        }
      }
      callback(sum / 100)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getTotalUsers: (callback = (r) => {}) => {
    const onData = () => {
      let users = []
      for (let point of DATA_API.datasets.wakeups) {
        if (parseInt(point.id.S.split("-")[1]) > (DATA_API.constants.launchDay - 1)) {
          const arr = point.id.S.split("-")
          arr.shift()
          arr.shift()
          const user = arr.join("-")
          if (!users.includes(user)) {
            users.push(user)
          }
        }
      }
      callback(users.length)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getWuFRByWakeupTime: (granularity, callback = (r) => {}) => {
    const onData = () => {
      const totalWakeups = []
      const failedWakeups = []
      const grainSize = ((DATA_API.constants.maxWakeupTime - DATA_API.constants.minWakeupTime) / granularity)
      for (let i = 0; i < granularity; i++) {
        totalWakeups.push(0)
        failedWakeups.push(0)
      }
      for (let wakeup of DATA_API.datasets.wakeups) {
        const day = parseInt(wakeup.id.S.split("-")[1])
        if (day > (DATA_API.constants.launchDay - 1) && day < (DATA_API.constants.today + 1)) {
          const index = Math.floor((parseInt(wakeup.time.N) - DATA_API.constants.minWakeupTime) / grainSize)
          totalWakeups[index]++;
          if (!parseInt(wakeup.verified.N)) {
            failedWakeups[index]++;
          }
        }
      }
      const res = {}
      for (let i = 0; i < granularity; i++) {
        const time1 = DATA_API.constants.minWakeupTime + (i * grainSize)
        const time2 = DATA_API.constants.minWakeupTime + ((i + 1) * grainSize)
        const t1 = moment.tz([1970, 0, 1], "America/Los_Angeles").add(Math.floor(time1 / 60), "hours").add(time1 % 60, "minutes").tz("America/Los_Angeles").format("h:mm")
        const t2 = moment.tz([1970, 0, 1], "America/Los_Angeles").add(Math.floor(time2 / 60), "hours").add((time2 % 60) - 1, "minutes").tz("America/Los_Angeles").format("h:mm")
        let rate = (failedWakeups[i] / totalWakeups[i])
        if (rate === Infinity || isNaN(rate)) {
          rate = 0
        }
         res[(t1 + " to " + t2)] = (Math.round(rate * 100) / 100)
      }
      callback(res)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getMeanDepositByWakeupTime: (granularity, callback = (r) => {}) => {
    const onData = () => {
      const totalWakeups = []
      const deposits = []
      const grainSize = ((DATA_API.constants.maxWakeupTime - DATA_API.constants.minWakeupTime) / granularity)
      for (let i = 0; i < granularity; i++) {
        totalWakeups.push(0)
        deposits.push(0)
      }
      for (let wakeup of DATA_API.datasets.wakeups) {
        const day = parseInt(wakeup.id.S.split("-")[1])
        if (day > (DATA_API.constants.launchDay - 1) && day < (DATA_API.constants.today + 1)) {
          const index = Math.floor((parseInt(wakeup.time.N) - DATA_API.constants.minWakeupTime) / grainSize)
          totalWakeups[index]++;
          deposits[index] += parseInt(wakeup.deposit.N);
        }
      }
      const res = {}
      for (let i = 0; i < granularity; i++) {
        const time1 = DATA_API.constants.minWakeupTime + (i * grainSize)
        const time2 = DATA_API.constants.minWakeupTime + ((i + 1) * grainSize)
        const t1 = moment.tz([1970, 0, 1], "America/Los_Angeles").add(Math.floor(time1 / 60), "hours").add(time1 % 60, "minutes").tz("America/Los_Angeles").format("h:mm")
        const t2 = moment.tz([1970, 0, 1], "America/Los_Angeles").add(Math.floor(time2 / 60), "hours").add((time2 % 60) - 1, "minutes").tz("America/Los_Angeles").format("h:mm")
        let rate = (deposits[i] / totalWakeups[i])
        if (rate === Infinity || isNaN(rate)) {
          rate = 0
        }
         res[(t1 + " to " + t2)] = (Math.round(rate * 1) / 100)
      }
      callback(res)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getWeightedWuFRByWakeupTime: (granularity, callback = (r) => {}) => {
    const onData = () => {
      const totalWakeups = []
      const failedWakeups = []
      const grainSize = ((DATA_API.constants.maxWakeupTime - DATA_API.constants.minWakeupTime) / granularity)
      for (let i = 0; i < granularity; i++) {
        totalWakeups.push(0)
        failedWakeups.push(0)
      }
      for (let wakeup of DATA_API.datasets.wakeups) {
        const day = parseInt(wakeup.id.S.split("-")[1])
        if (day > (DATA_API.constants.launchDay - 1) && day < (DATA_API.constants.today + 1)) {
          const index = Math.floor((parseInt(wakeup.time.N) - DATA_API.constants.minWakeupTime) / grainSize)
          totalWakeups[index] += parseInt(wakeup.deposit.N);
          if (!parseInt(wakeup.verified.N)) {
            failedWakeups[index] += parseInt(wakeup.deposit.N);
          }
        }
      }
      const res = {}
      for (let i = 0; i < granularity; i++) {
        const time1 = DATA_API.constants.minWakeupTime + (i * grainSize)
        const time2 = DATA_API.constants.minWakeupTime + ((i + 1) * grainSize)
        const t1 = moment.tz([1970, 0, 1], "America/Los_Angeles").add(Math.floor(time1 / 60), "hours").add(time1 % 60, "minutes").tz("America/Los_Angeles").format("h:mm")
        const t2 = moment.tz([1970, 0, 1], "America/Los_Angeles").add(Math.floor(time2 / 60), "hours").add((time2 % 60) - 1, "minutes").tz("America/Los_Angeles").format("h:mm")
        let rate = (failedWakeups[i] / totalWakeups[i])
        if (rate === Infinity || isNaN(rate)) {
          rate = 0
        }
         res[(t1 + " to " + t2)] = (Math.round(rate * 10000) / 10000)
      }
      callback(res)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getTotalWakeupsByWakeupTime: (granularity, callback = (r) => {}) => {
    const onData = () => {
      const totalWakeups = []
      const grainSize = ((DATA_API.constants.maxWakeupTime - DATA_API.constants.minWakeupTime) / granularity)
      for (let i = 0; i < granularity; i++) {
        totalWakeups.push(0)
      }
      for (let wakeup of DATA_API.datasets.wakeups) {
        const day = parseInt(wakeup.id.S.split("-")[1])
        if (day > (DATA_API.constants.launchDay - 1) && day < (DATA_API.constants.today + 1)) {
          const index = Math.floor((parseInt(wakeup.time.N) - DATA_API.constants.minWakeupTime) / grainSize)
          totalWakeups[index]++;
        }
      }
      const res = {}
      for (let i = 0; i < granularity; i++) {
        const time1 = DATA_API.constants.minWakeupTime + (i * grainSize)
        const time2 = DATA_API.constants.minWakeupTime + ((i + 1) * grainSize)
        const t1 = moment.tz([1970, 0, 1], "America/Los_Angeles").add(Math.floor(time1 / 60), "hours").add(time1 % 60, "minutes").tz("America/Los_Angeles").format("h:mm")
        const t2 = moment.tz([1970, 0, 1], "America/Los_Angeles").add(Math.floor(time2 / 60), "hours").add((time2 % 60) - 1, "minutes").tz("America/Los_Angeles").format("h:mm")
        res[(t1 + " to " + t2)] = totalWakeups[i]
      }
      callback(res)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getWuFRByDeposit: (granularity, callback = (r) => {}) => {
    const onData = () => {
      const totalWakeups = []
      const failedWakeups = []
      const grainSize = (100 / granularity)
      for (let i = 0; i < granularity; i++) {
        totalWakeups.push(0)
        failedWakeups.push(0)
      }
      for (let wakeup of DATA_API.datasets.wakeups) {
        const day = parseInt(wakeup.id.S.split("-")[1])
        if (day > (DATA_API.constants.launchDay - 1) && day < (DATA_API.constants.today + 1)) {
          const index = Math.floor((parseInt(wakeup.deposit.N) / 100) / grainSize)
          totalWakeups[index]++;
          if (!parseInt(wakeup.verified.N)) {
            failedWakeups[index]++;
          }
        }
      }
      const res = {}
      for (let i = 0; i < granularity; i++) {
        let rate = (failedWakeups[i] / totalWakeups[i])
        if (rate === Infinity || isNaN(rate)) {
          rate = 0
        }
         res[(Math.round(i * grainSize).toString() + " to " + Math.round(((i + 1) * grainSize) - 1).toString())] = (Math.round(rate * 10000) / 10000)
      }
      callback(res)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
  getTotalWakeupsByDeposit: (granularity, callback = (r) => {}) => {
    const onData = () => {
      const totalWakeups = []
      const grainSize = (100 / granularity)
      for (let i = 0; i < granularity; i++) {
        totalWakeups.push(0)
      }
      for (let wakeup of DATA_API.datasets.wakeups) {
        const day = parseInt(wakeup.id.S.split("-")[1])
        if (day > (DATA_API.constants.launchDay - 1) && day < (DATA_API.constants.today + 1)) {
          const index = Math.floor((parseInt(wakeup.deposit.N) / 100) / grainSize)
          totalWakeups[index]++;
        }
      }
      const res = {}
      for (let i = 0; i < granularity; i++) {
         res[(Math.round(i * grainSize).toString() + " to " + Math.round(((i + 1) * grainSize) - 1).toString())] = totalWakeups[i]
      }
      callback(res)
    }
    if (DATA_API.datasets.wakeups.length) {
      onData()
    }
    else {
      DATA_API.datasets.get.wakeups(onData)
    }
  },
}
