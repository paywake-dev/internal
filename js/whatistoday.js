document.getElementById("day").innerHTML = moment().tz(TIME_ZONE).diff(moment.tz(EPOCH, TIME_ZONE).hour(2).minute(0).second(0), "days").toString()
