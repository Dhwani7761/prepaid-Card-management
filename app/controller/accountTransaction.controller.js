let AccountTransaction = require('../models/accountTransaction.model');
let helper = require('F:/MSCIT/iWant/PrepaidCardManagement2/Helper/common.helper');

module.exports = {
  getAll: (req, res) => {
    AccountTransaction.find({})
      .then(helper.respondAsJSON(res))
      .catch(helper.handleError(res));
  },
  get: (req, res) => {
    AccountTransaction.find({ linkId: req.params.linkId })
      .then(helper.respondAsJSON(res))
      .catch(helper.handleError(res));
  },
  delete: (req, res) => {
    AccountTransaction.deleteMany({})
      .then(helper.respondAsJSON(res))
      .catch(helper.handleError);
  }
}