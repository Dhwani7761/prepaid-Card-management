let helper = require('F:/MSCIT/iWant/PrepaidCardManagement2/Helper/common.helper');
let Accs = require('../models/account.model');
let moment = require('moment');
let Coupon = require('../models/coupon.model')

module.exports = {
    get : (req,res) =>
    {
        Coupon.find({couponId : req.query.couponId})
        .then(helper.respondAsJSON(res))
        .catch(helper.handleError(res));
    },
    delete : (req,res)=>
    {
        Coupon.deleteMany({})
        .then(helper.respondAsJSON(res))
        .catch(helper.handleError(res));
    },
    getAll : (req,res)=>
    {
        Coupon.find({})
        .then(helper.respondAsJSON(res))
        .catch(helper.handleError(res));
    }
}
