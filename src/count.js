var val = 3
function addOne () {
  this.val++;
}

module.exports = {
  val,
  addOne
}