const format = (date) => {
  return `${parseInt(date.split("T")[1].split(":")[0]) > 12 ? "م" : "ص"} ${
    parseInt(date.split("T")[1].split(":")[0]) > 12
      ? parseInt(date.split("T")[1].split(":")[0]) - 12
      : date.split("T")[1].split(":")[0]
  }:${date.split("T")[1].split(":")[1]} ${date
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/")}`;
};

export default format;
