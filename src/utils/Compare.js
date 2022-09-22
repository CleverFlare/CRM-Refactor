import _ from "lodash";

const compare = (array, complete) => {
  return array[complete ? "every" : "some"](([item1, item2]) => {
    return _.isEqual(item1, item2);
  });
};

export default compare;
