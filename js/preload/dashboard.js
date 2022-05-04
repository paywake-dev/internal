const METRICS = {}
const METRIC_FUNCS = {

  //WAKEUPS
  totalWakeupDeposits: DATA_API.getTotalWakeupDeposits,
  wakeupDepositsToday: DATA_API.getWakeupDepositsToday,
  wakeupDepositsYesterday: DATA_API.getWakeupDepositsYesterday,
  wakeupDepositsTomorrow: DATA_API.getWakeupDepositsTomorrow,
  returnsToday: DATA_API.getReturnsToday,
  returnsYesterday: DATA_API.getReturnsYesterday,
  returnsAllTime: DATA_API.getReturnsAllTime,
  wufrToday: DATA_API.getWuFRToday,
  wufrYesterday: DATA_API.getWuFRYesterday,
  wufrAllTime: DATA_API.getWuFRAllTime,
  meanDepositToday: DATA_API.getMeanDepositToday,
  meanDepositYesterday: DATA_API.getMeanDepositYesterday,
  meanDepositTomorrow: DATA_API.getMeanDepositTomorrow,
  meanDepositAllTime: DATA_API.getMeanDepositAllTime,

  //FINANCIAL
  totalRevenue: DATA_API.getTotalRevenue,
  totalProfit: DATA_API.getTotalProfit,
  revenueToday: DATA_API.getRevenueToday,
  revenueYesterday: DATA_API.getRevenueYesterday,
  profitToday: DATA_API.getProfitToday,
  profitYesterday: DATA_API.getProfitYesterday,
  profitPerDAUToday: DATA_API.getProfitPerDAUToday,
  profitPerDAUYesterday: DATA_API.getProfitPerDAUYesterday,
  profitPerDAUAllTime: DATA_API.getProfitPerDAUAllTime,
  monthRevenue: DATA_API.getMonthRevenue,
  monthProfit: DATA_API.getMonthProfit,
  yearlyRevenue: DATA_API.getYearRevenue,
  yearlyProfit: DATA_API.getYearProfit,

  //USER BASE
  activeUsers: DATA_API.getTotalUsers,
  activeUsersToday: DATA_API.getDAUsToday,
  activeUsersYesterday: DATA_API.getDAUsYesterday,
  activeUsersTomorrow: DATA_API.getDAUsTomorrow,
  feedbackToday: DATA_API.getFeedbackToday,
  feedbackYesterday: DATA_API.getFeedbackYesterday,
  feedbackAll: DATA_API.getAllFeedback,
  feedbackStrings: DATA_API.getAllFeedbackStrings,

  //BALANCES
  outstandingBalances: DATA_API.getOutstandingBalances,
  averageOutstandingBalance: DATA_API.getAvgOutstandingBalance,
  maxBalance: DATA_API.getMaxOutstandingBalance,
  maxBalanceHolder: DATA_API.getMaxOutstandingBalanceHolder,

}

const CURRENCY_METRICS = [
  "totalRevenue",
  "totalProfit",
  "yearlyRevenue",
  "yearlyProfit",
  "monthRevenue",
  "monthProfit",
  "revenueToday",
  "revenueYesterday",
  "profitToday",
  "profitYesterday",
  "totalWakeupDeposits",
  "wakeupDepositsToday",
  "wakeupDepositsYesterday",
  "wakeupDepositsTomorrow",
  "meanDepositToday",
  "meanDepositYesterday",
  "meanDepositTomorrow",
  "meanDepositAllTime",
  "outstandingBalances",
  "averageOutstandingBalance",
  "maxBalance",
  "profitPerDAUToday",
  "profitPerDAUYesterday",
  "profitPerDAUAllTime"
]
const PERCENTAGE_METRICS = [
  "returnsToday",
  "returnsYesterday",
  "returnsAllTime",
  "wufrToday",
  "wufrYesterday",
  "wufrAllTime",
  "feedbackToday",
  "feedbackYesterday",
  "feedbackAll",
]

const initMetrics = () => {
  for (let metric of Object.keys(METRIC_FUNCS)) {
    METRICS[metric] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TAG + metric) || "0")
  }
}

const loadMetrics = (callback = () => {}) => {
  DATA_API.datasets.reset()
  let i = 0
  const recurse = () => {
    if (i === Object.keys(METRIC_FUNCS).length) {
      callback()
    }
    else {
      const metric = Object.keys(METRIC_FUNCS)[i];
      (METRIC_FUNCS[metric])((r) => {
        METRICS[metric] = r
        localStorage.setItem(LOCAL_STORAGE_TAG + metric, JSON.stringify(METRICS[metric]))
        i++;
        recurse()
      })
    }
  }
  recurse()
}

const formatCurrency = (n) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n)
}

const formatPercentage = (n) => {
  return ((Math.round(n * 100 * 100) / 100).toFixed(2).toString() + "%")
}

const formatNumber = (n) => {
  return new Intl.NumberFormat("en-US").format(n)
}

const buildPage = () => {
  const NO_METRIC = "N/A"
  for (let metric of Object.keys(METRIC_FUNCS)) {
    let text = (METRICS[metric] || NO_METRIC).toString()
    if (text != NO_METRIC) {
      if (CURRENCY_METRICS.includes(metric)) {
        text = formatCurrency(METRICS[metric])
      }
      else if (PERCENTAGE_METRICS.includes(metric)) {
        text = formatPercentage(METRICS[metric])
      }
      else {
        text = formatNumber(METRICS[metric])
      }
    }
    try {
      $("#__METRIC-" + metric.toString())[0].innerHTML = text
    } catch (e) {}
  }
  generateCanvas()
}

const fillAttributes = () => {
  ROUTINES.get((data) => {
    if (!data) {
      ROUTINES.logout()
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_TAG + "name-data", JSON.stringify(data))
    setNameData()
  })
}

const setNameData = () => {
  const UNFILLED = "--"
  const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TAG + "name-data") || "[]")
  let name = UNFILLED
  let title = UNFILLED
  for (let attribute of data) {
    if (attribute.Name === "name") {
      name = attribute.Value
    }
    else if (attribute.Name === "custom:title") {
      title = attribute.Value
    }
  }
  for (let element of (document.getElementsByClassName("__full-name-fill") || [])) {
    element.innerHTML = name
  }
  for (let element of (document.getElementsByClassName("__first-name-fill") || [])) {
    element.innerHTML = name.split(" ")[0].trim()
  }
  for (let element of (document.getElementsByClassName("__title-fill") || [])) {
    element.innerHTML = title
  }
}


const initPage = () => {
  fillAttributes()
  initMetrics()
  buildPage()
  loadMetrics(() => {
    buildPage()
  })
}

const reloadMetrics = () => {
  /*
  loadMetrics(() => {
    buildPage()
  })
  */
  window.location.reload()
}

$(document).ready(() => {
  initPage()
})


let __AJAX_STACK = 0

const putAjaxLoader = () => {
  $("#refresh-big")[0].style = "display: none"
  $("#refresh-small")[0].style = "display: none"
  $("#data-loading")[0].style = ""
}

const killAjaxLoader = () => {
  $("#refresh-big")[0].style = ""
  $("#refresh-small")[0].style = ""
  $("#data-loading")[0].style = "display: none"
}

$(document).ajaxStart(() => {
  if (__AJAX_STACK === 0) {
    putAjaxLoader()
  }
  __AJAX_STACK++;
})
$(document).ajaxComplete(() => {
  __AJAX_STACK--;
  setTimeout(() => {
    if (__AJAX_STACK < 1) {
      killAjaxLoader()
    }
  }, 300)
})
$(document).ajaxError(() => {
  __AJAX_STACK--;
  setTimeout(() => {
    if (__AJAX_STACK < 1) {
      killAjaxLoader()
    }
  }, 300)
})

let CANVAS = null
const generateCanvas = (CANVAS_BLOCK_WIDTH = 8) => {
  const getUsernameFromID = (id) => {
    let a = id.toString().trim().split("-")
    a.shift()
    a.shift()
    return a.join("-").toString().trim()
  }
  CANVAS = document.createElement("canvas")
  CANVAS.id = "visualization"
  CANVAS.width = Math.min((window.innerWidth * 0.6) + 75, (window.innerHeight * 0.6) + 150)
  const width = Math.ceil(CANVAS.width / CANVAS_BLOCK_WIDTH)
  let wakeups = []
  let users = {}
  for (let wakeup of DATA_API.datasets.wakeups) {
    const day = parseInt(wakeup.id.S.split("-")[1])
    if (day <= DATA_API.constants.today && day > DATA_API.constants.today - width) {
      wakeups.push(wakeup)
    }
  }
  for (let wakeup of wakeups) {
    const user = getUsernameFromID(wakeup.id.S)
    if (!users[user]) {
      users[user] = []
    }
    users[user].push(wakeup)
  }
  CANVAS.height = (Object.keys(users).length * CANVAS_BLOCK_WIDTH)
  let ctx = CANVAS.getContext("2d")
  ctx.fillStyle = "white"
  ctx.fillRect(0,0,CANVAS.width,CANVAS.height)
  const drawPixel = (x,y,color) => {
    ctx.fillStyle = color
    ctx.fillRect(CANVAS.width - ((x + 1) * CANVAS_BLOCK_WIDTH), y * CANVAS_BLOCK_WIDTH, CANVAS_BLOCK_WIDTH, CANVAS_BLOCK_WIDTH)
  }
  const getColorFromDeposit = (deposit) => {
    return ("rgba(0,0,0," + Math.sqrt(deposit / 99) + ")")
  }
  const getMissedColorFromDeposit = (deposit) => {
    return ("rgba(255,0,0," + Math.sqrt(deposit / 99) + ")")
  }
  const getPendingColorFromDeposit = (deposit) => {
    return ("rgba(0,0,255," + Math.sqrt(deposit / 99) + ")")
  }
  let y = 0
  for (let user in users) {
    for (let wakeup of users[user]) {
      let x = DATA_API.constants.today - parseInt(wakeup.id.S.split("-")[1])
      let color = getMissedColorFromDeposit(parseInt(wakeup.deposit.N) / 100)
      if (DATA_API.constants.today < parseInt(wakeup.day.N)) {
        color = getPendingColorFromDeposit(parseInt(wakeup.deposit.N) / 100)
      }
      else if (DATA_API.constants.today === parseInt(wakeup.day.N)) {
        if (DATA_API.utilities.time() < (parseInt(wakeup.time.N) + 3)) {
          color = getPendingColorFromDeposit(parseInt(wakeup.deposit.N) / 100)
        }
      }
      if (parseInt(wakeup.verified.N)) {
        color = getColorFromDeposit(parseInt(wakeup.deposit.N) / 100)
      }
      drawPixel(x,y,color)
    }
    y++
  }
  CANVAS.style.marginTop = "24px"
  try {
    $("#visualization")[0].remove()
  } catch (e) {}
  $("#visualization-container")[0].appendChild(CANVAS)
  $("#visualization-description")[0].innerHTML = ("Viewing " + formatNumber(Object.keys(users).length) + " users, " + moment().subtract(width, "days").format("MM/DD") + " to present")
}

window.onresize = () => {
  if (Math.min((window.innerWidth * 0.6) + 75, (window.innerHeight * 0.6) + 150) !== CANVAS.width) {
    generateCanvas()
  }
}
