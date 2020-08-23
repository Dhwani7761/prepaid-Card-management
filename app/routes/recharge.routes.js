let express = require('express');
let router = express.Router();
let RechargeController  = require('../controller/recharge.controller');

router.put('/newRecharge',RechargeController.recharge);
router.get('/getall',RechargeController.getAll);
router.get('/get/:linkId',RechargeController.get);

module.exports = router;