function formDataFilter(object) {
  if (typeof object !== "object")
    throw Error("you must pass an object to the formDataFilter function");

  const formData = new FormData();

  Object.entries(object)
    .filter(([key, value]) =>
      Array.isArray(value) ? Boolean(value.length) : Boolean(value)
    )
    .map(([key, value]) => {
      switch (Array.isArray(value)) {
        case true:
          return value.map((item) => formData.append(key, item));
        case false:
          return formData.append(key, value);
      }
    });

  return formData;
}

function objectFilter(obj) {
  let entries = [];
  entries = Object.entries(obj).map((arr) => {
    const [key, value] = arr;
    if (Array.isArray(value)) {
      return arr;
    } else if (typeof value === "object") {
      return [key, objectFilter(value)];
    } else {
      return arr;
    }
  });
  return Object.fromEntries(entries.filter(([key, value]) => Boolean(value)));
}

function filter({ obj = null, output = "object" }) {
  if (!Boolean(obj))
    throw Error("you didn't provide object to clear the nulls");

  switch (output) {
    case "formData":
      return formDataFilter(obj);
    case "object":
      return objectFilter(obj);
    default:
      return objectFilter(obj);
  }
}

export default filter;
