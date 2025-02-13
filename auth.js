const jwt = require('jsonwebtoken');

function builder(req, res) {
  if(req.headers.Authorization) {
    const decoded = jwt.verify(req.headers.Authorization, 'shhhhh');
  }
  return false;
}

module.exports = builder;