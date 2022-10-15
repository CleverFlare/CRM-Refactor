import _ from "lodash";

const compare = (array, complete) => {
  const array2 = array.map(([first, last]) => {
    if (first === null) {
      switch (typeof last) {
        case "string":
          return ["", last];
        case "number":
          return [0, last];
        case "boolean":
          return [false, last];
      }
    } else if (last === null) {
      switch (typeof first) {
        case "string":
          return [first, ""];
        case "number":
          return [first, 0];
        case "boolean":
          return [first, false];
      }
    } else {
      return [first, last];
    }
  });

  return array2[complete ? "every" : "some"](([item1, item2]) => {
    return _.isEqual(item1, item2);
  });
};

export default compare;
