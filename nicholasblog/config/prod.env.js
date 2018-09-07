if (process.env.NODE_ENV === 'deploy') {
  var prod = 'deploy'
} else {
  var prod = process.env.NODE_ENV
}

module.exports = {
  NODE_ENV: `"${process.env.NODE_ENV}"`    //'"production"'
}
