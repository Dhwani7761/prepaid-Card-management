let express = require('express');
let router = express.Router();
let couponcontroller = require('../controller/coupon.controller');

router.get('/get',couponcontroller.get);
router.delete('/delete',couponcontroller.delete);
router.get('/getAll',couponcontroller.getAll);
module.exports = router;