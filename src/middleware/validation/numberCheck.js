module.exports = (value, errMsg) => {
  if (isNaN(parseFloat(value))) {
    throw new Error(errMsg);
  } else {
    return true;
  }
}
