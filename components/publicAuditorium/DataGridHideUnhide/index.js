export function addNumbers(
  method,
  localStorageName,
  setColsState,
  setItem = ""
) {
  console.log("common comp", method, setItem, localStorageName);

  if (method == "get" || method == "Get" || method == "GET") {
    let HiddenCols = localStorage.getItem(localStorageName);
    let mnopq = JSON.parse(HiddenCols);

    if (mnopq) {
      setColsState((prev) =>
        prev.map((val) => {
          return {
            ...val,
            hide: !mnopq[val?.field],
          };
        })
      );
    }
  } else if (method == "set" || method == "Set" || method == "SET") {
    let abc = JSON.stringify(setItem);
    localStorage.setItem(localStorageName, abc);
  }
}
