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
  meanDepositAllTime: DATA_API.getMeanDepositAllTime,

  //FINANCIAL
  totalRevenue: DATA_API.getTotalRevenue,
  totalProfit: DATA_API.getTotalProfit,
  revenueToday: DATA_API.getRevenueToday,
  revenueYesterday: DATA_API.getRevenueYesterday,
  profitToday: DATA_API.getProfitToday,
  profitYesterday: DATA_API.getProfitYesterday,

  //USER BASE
  activeUsers: DATA_API.getTotalUsers,
  activeUsersToday: DATA_API.getDAUsToday,
  activeUsersYesterday: DATA_API.getDAUsYesterday,
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
  "meanDepositAllTime",
  "outstandingBalances",
  "averageOutstandingBalance",
  "maxBalance",
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
    }
    try {
      $("#__METRIC-" + metric.toString())[0].innerHTML = text
    } catch (e) {}
  }
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
