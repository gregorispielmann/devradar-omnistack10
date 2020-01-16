module.exports = function parseStringAsArray(array) {
  return array.split(",").map(t => t.trim());
};
