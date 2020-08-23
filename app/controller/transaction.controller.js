let helper = require('F:/MSCIT/iWant/PrepaidCardManagement2/Helper/common.helper');
let Accs = require('../models/account.model');
let moment = require('moment');
let Transaction = require('../models/transaction.model')
let Meal = require('../models/meal.model');
let Coupons = require('../models/coupon.model');
let accountTransaction = require('../models/accountTransaction.model');
var _ = require('lodash');
var mongoose = require('mongoose');

module.exports =
    {
        create: (req, res) => {
            Accs.find({ linkId: req.body.linkId })
                .then(obj => {
                    var status = obj[0].status;
                    if (status === true) {
                        req.body.coupons = req.body.coupons.map(coupon => {
                            coupon.couponId = Math.random().toString(36).substr(2, 6);
                            return coupon;
                        });
                        var dateValidateArr = [];
                        req.body.coupons.forEach(element => {
                            var date = moment(element.date, ['DD-MM-YYYY']).isValid();
                            dateValidateArr.push(date);
                        });
                        if (dateValidateArr.includes(false)) {
                            res.send("You have not entered dates in correct format");
                        }
                        else {
                            Coupons.create(req.body.coupons)
                                .then(couponData => {
                                    if (!couponData) {
                                        res.send("Coupon doesnot have valid data");
                                    }
                                    else {
                                        req.body.coupons = couponData.map(c => c._id);
                                        var date = couponData.map(d => d.date);
                                        var flag = false;
                                        date.forEach(element => {
                                            var date = moment(element).format("YYYY-MM-DD");
                                            var today = moment(Date.now()).format("YYYY-MM-DD");
                                            var pastdates = moment(Date.now()).add(-1, 'days').format("YYYY-MM-DD");
                                            var sevenDays = moment(Date.now()).add(7, 'days').format("YYYY-MM-DD");
                                            if (date == today || date <= pastdates || date >= sevenDays) {
                                                flag = true;
                                            }
                                        });
                                        if (flag === true) {
                                            res.send("you cannot create coupons now.Check Dates.");
                                        }
                                        else {
                                            var meal = couponData.map(m => m.typeOfMeal);
                                            var ids = couponData.map(m => m._id);
                                            Meal.find({}).then(obj => {
                                                var allmeals = obj.map(m => m.name);
                                                /*console.log("All the meal", allmeals);
                                                console.log("meals of coupon", meal);*/
                                                var flag;
                                                var checkMealsArr = [];
                                                meal.map(element => {
                                                    if (allmeals.includes(element))
                                                        flag = true;
                                                    else
                                                        flag = false;
                                                    checkMealsArr.push(flag);
                                                });
                                                if (checkMealsArr.includes(false)) {
                                                    res.send("Entered type of meal not founded.")
                                                }
                                                else {
                                                    Meal.find({ name: meal })
                                                        .then(mealobj => {
                                                            let finalAmount = {};
                                                            var mealOccurances = _.countBy(meal)
                                                            for (let m in mealOccurances) {
                                                                let price = (mealobj.filter(ml => {
                                                                    if (ml.name === m) {
                                                                        return ml;
                                                                    }
                                                                }))[0];

                                                                finalAmount[m] = {
                                                                    price: price.price || 0,
                                                                    count: mealOccurances[m]
                                                                }
                                                            }
                                                            var x = Object.values(finalAmount);
                                                            var arr = [];
                                                            x.forEach(element => {
                                                                var total = element.price * element.count;
                                                                arr.push(total);
                                                            });
                                                            var totalBill = arr.reduce((acc, val) => acc + val, 0);
                                                            Accs.find({ linkId: req.body.linkId })
                                                                .then(obj => {
                                                                    var flag = _.isEmpty(obj);
                                                                    if (flag === true) {
                                                                        res.send("This link Id doesnot exist!");
                                                                    }
                                                                    else {
                                                                        var balance = obj[0].balance;
                                                                        if (balance <= 0) {
                                                                            res.send("You dont have enough balance to generate Coupons!")
                                                                        }
                                                                        else {
                                                                            var updatedBalance = balance - totalBill;
                                                                            Accs.update({ linkId: req.body.linkId }, { $set: { balance: updatedBalance } })
                                                                                .then(obj => {
                                                                                    req.body.totalpayable = totalBill;
                                                                                    var accountTransactionObj = {}
                                                                                    accountTransactionObj.linkId = req.body.linkId;
                                                                                    accountTransactionObj.staffId = req.body.staffId;
                                                                                    accountTransactionObj.amount = totalBill;
                                                                                    accountTransactionObj.transaction = "CREDIT";
                                                                                    accountTransaction.create(accountTransactionObj)
                                                                                        .then().catch("Failed to create transaction in Account");
                                                                                    Transaction.create(req.body)
                                                                                        .then(helper.respondAsJSON(res))
                                                                                        .catch(helper.handleError(res));
                                                                                    Accs.find({ linkId: req.body.linkId })
                                                                                        .then(ob => {
                                                                                            Accs.update({ linkId: req.body.linkId }, { $push: { mycoupons: ids } })
                                                                                                .then().catch("Failed to update my coupons");
                                                                                        }).catch(helper.handleError(res));
                                                                                })
                                                                        }
                                                                    }

                                                                }).catch(helper.handleError(res));
                                                        }).catch(helper.handleError(res));
                                                }
                                            })

                                        }
                                    }
                                }).catch(helper.handleError(res));
                        }
                    }
                    else {
                        res.send("Account status - Inactive detected.Please activate status in order to sale coupon");
                    }
                })
        },
        get: (req, res) => {
            var id = mongoose.Types.ObjectId.isValid(req.params._id);
            if(id === false)
            {
                res.send("Id is not valid");
            }
            else
            {
                Transaction.find({ _id: req.params  ._id })
                .then(helper.respondAsJSON(res))
                .catch(helper.handleError(res));
            }
        },
        CouponUsed: (req, res) => {
            Coupons.find({ couponId: req.query.cid })
                .then(obj => {
                    var couponDate = moment(obj[0].date).format("YYYY-MM-DD");
                    var today = moment(Date.now()).format("YYYY-MM-DD");
                    if (couponDate < today) {
                        Coupons.update({ couponId: req.query.cid }, { $set: { status: 'EXPIRED' } })
                            .then(obj => {
                                res.send("Your coupon expired!");
                            })
                    }
                    else {
                        var couponStatus = obj[0].status;
                        if (couponStatus === "CANCELLED" || couponStatus === "USED" || couponStatus === "EXPIRED") {
                            res.send("Your coupon is already " + couponStatus)
                        }
                        else {
                            if (today === couponDate) {
                                Coupons.update({ couponId: req.query.cid }, { $set: { status: 'USED' } })
                                    .then(obj => {
                                        res.send(obj);
                                    })
                            }
                            else {
                                res.send("You cannot use your coupon today.")
                            }
                        }
                    }
                });
        },
        cancel: (req, res) => {
            Coupons.find({ couponId: req.query.cid })
                .then(obj => {
                    var status = obj[0].status;
                    if (status === "CANCELLED") {
                        res.send("Your coupon is already cancelled")
                    }
                    else {
                        var id = obj[0]._id;
                        var typeOfMeal = obj[0].typeOfMeal;
                        var date = moment(obj[0].date).format("YYYY-MM-DD");
                        var today = moment(Date.now()).format("YYYY-MM-DD");
                        var d = moment(date);
                        var t = moment(today);
                        var pdates = d.diff(t, 'days');
                        if (pdates === 1) {
                            res.send("You cannot delete your coupon now!");
                        }
                        else {
                            Transaction.find({ coupons: id })
                                .then(obj => {
                                    var linkid = obj[0].linkId;
                                    Accs.find({ linkId: linkid })
                                        .then(obj => {
                                            if (obj) {
                                                var balance = obj[0].balance;
                                                Meal.find({ name: typeOfMeal })
                                                    .then(obj => {
                                                        var price = obj[0].price;
                                                        var updatedbalance = balance + price;
                                                        Accs.update({ linkId: linkid }, { $set: { balance: updatedbalance } })
                                                            .then(obj => {
                                                                Coupons.update({ couponId: req.query.cid }, { $set: { status: 'CANCELLED' } })
                                                                    .then(obj => {
                                                                        var accTransactionObj = {}
                                                                        accTransactionObj.linkId = linkid;
                                                                        accTransactionObj.staffId = req.body.staffId;
                                                                        accTransactionObj.amount = price;
                                                                        accTransactionObj.transaction = "DEBIT";
                                                                        accountTransaction.create(accTransactionObj)
                                                                            .then(obj => {
                                                                                res.send("Coupon is cancelled.And balance is refunded.")
                                                                            }).catch("Failed to add to the account");
                                                                    })
                                                            })
                                                    })
                                            }
                                            else {
                                                res.send("This linkId doesnot exists");
                                            }
                                        })
                                })
                        }
                    }
                }).catch(helper.handleError(res));
        }
    }