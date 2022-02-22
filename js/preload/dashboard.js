const fillAttributes = () => {
  const UNFILLED = "--"
  ROUTINES.get((data) => {
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
  })
}

fillAttributes()
