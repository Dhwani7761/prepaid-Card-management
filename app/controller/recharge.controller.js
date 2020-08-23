let Recharge = require('../models/recharge.model');
let helper = require('F:/MSCIT/iWant/PrepaidCardManagement2/Helper/common.helper');
let Accs = require('../models/account.model');
let transaction = require('../models/accountTransaction.model');

module.exports = {
    recharge: (req, res) => {
        Accs.findOne({ linkId: req.body.linkId }).then(data => {
            var status = data.status;
            if (!data) {
                res.send("This link id doesnot exist!")
            }
            else {
                if (status === true) {
                    var x = data.balance;
                    var bal = req.body.amount;
                    var y = bal + x;
                    Recharge.create(req.body)
                        .then(rechargeobj => {
                            Accs.findOneAndUpdate({ linkId: req.body.linkId }, { balance: y })
                                .then(obj => {
                                    transactionObj = {};
                                    transactionObj.linkId = req.body.linkId;
                                    transactionObj.staffId = req.body.staffId;
                                    transactionObj.amount = req.body.amount;
                                    transactionObj.transaction = 'DEBIT';
                                    transaction.create(transactionObj)
                                        .then(obj => {
                                            res.send(rechargeobj);
                                        })
                                })
                                .catch({ "error": true, "message": "Internal Error 500" })
                        })
                        .catch({ "error": true, "message": "Internal Error 500" });
                }
                else {
                    res.send("Account status - Inactive detected. Please activate account in order to recharge");
                }
            }
        }).catch(helper.handleError(res));
    },
    getAll: (req, res) => {
        Recharge.find({})
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
    },
    get: (req, res) => {
        Accs.find({ linkId: req.params.linkId })
            .then(obj => {
                if (obj.length === 0) {
                    res.send("This link Id doesnot exist!");
                }
                else {
                    Recharge.find({ linkId: req.params.linkId })
                        .then(helper.respondAsJSON(res))
                        .catch(helper.handleError(res));
                }
            })
    }
};