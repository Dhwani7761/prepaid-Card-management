let Account = require('../models/account.model');
let helper = require('F:/MSCIT/iWant/PrepaidCardManagement2/Helper/common.helper');
let randomize = require('randomatic');
let transaction = require('../models/accountTransaction.model');
let moment = require('moment');
module.exports = {
  create: (req, res) => {
    req.body.linkId = randomize('0', 16);
    var dob = moment(req.body.DOB, ['YYYY-MM-DD', 'YYYY-DD-MM', 'MM-DD-YYYY', 'DD-MM-YYYY']).isValid();
    if (dob === false) {
      res.send("Your entered date is wrong.Please enter in one of these formats : YYYY-MM-DD','YYYY-DD-MM','MM-DD-YYYY','DD-MM-YYYY'");
    }
    else {
      Account.create(req.body)
        .then(helper.respondAsJSON(res))
        .catch(helper.handleError(res));
    }
  },
  delete: (req, res) => {
    Account.find({ linkId: req.params.linkId })
      .then(obj => {
        if (obj.length === 0) {
          res.send("Link Id doesnot exist!");
        }
        else {
          Account.deleteOne({ linkId: req.params.linkId })
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
        }
      })
  },
  get: (req, res) => {
    Account.findOne({ linkId: req.params.linkId })
      .then(obj => {
        if (obj) {
          res.send(obj);
        }
        else {
          res.send("This link Id doesnot exist")
        }
      })
      .catch(helper.handleError(res));
  },
  update: (req, res) => {
    Account.findOneAndUpdate({ linkId: req.params.linkId }, req.body, { new: true })
      .then(helper.respondAsJSON(res))
      .catch(helper.handleError(res));
  },
  inactivateAccount: (req, res) => {
    Account.find({ linkId: req.params.linkId })
      .then(obj => {
        if (obj.length === 0) {
          res.send("This link Id doesnot exist");
        }
        else {
          Account.update({ linkId: req.params.linkId }, { $set: { status: false } })
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
        }
      })
  },
  activateAccount: (req, res) => {
    Account.find({ linkId: req.params.linkId })
      .then(obj => {
        if (obj.length === 0) {
          res.send("Link Id doesnot exist")
        }
        else {
          Account.update({ linkId: req.params.linkId }, { $set: { status: true } })
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
        }
      })
  },
  searchbyname: (req, res) => {
    Account.findOne({ firstName: req.query.firstName })
      .then(obj=>
        {
          if(obj === null)
          {
            res.send("Account with entered name doesnot exist!")
          }
          else
          {
            res.send(obj);
          }
        })
      .catch(helper.handleError(res));
  },
  getAll: (req, res) => {
    Account.find({})
      .then(helper.respondAsJSON(res))
      .catch(helper.handleError(res));
  },
  refund: (req, res) => {
    Account.find({ linkId: req.params.linkId })
      .then(obj => {
        if(obj)
        {
        var transactionObj = {};
        transactionObj.linkId = obj[0].linkId;
        transactionObj.staffId = req.body.staffId;
        transactionObj.amount = obj[0].balance;
        transactionObj.transaction = "CREDIT";
        transaction.create(transactionObj)
          .then(obj => {
            Account.updateOne({ linkId: req.params.linkId }, { $set: { balance: 0 } })
              .then(obj => {
                res.send("Your balance is now 0.");
              }).catch(helper.handleError(res));
          }).catch(helper.handleError(res));
        }
        else
        {
          res.send("This link Id doesnot exist");
        }
        })
  }
};