let express = require('express');
let router = express.Router();
let transactionController = require('../controller/transaction.controller');

router.post('/new',transactionController.create);
router.get('/get/:_id',transactionController.get);
router.put('/use',transactionController.CouponUsed);
router.put('/cancel',transactionController.cancel);
// router.delete('/deleteall',transactionController.deleteAll);
// router.get('/getall',transactionController.getAll);
// router.get('/find/:linkId',transactionController.findCouponsByLink);
// router.put('/use',transactionController.useCoupon);
// router.put('/cancel',transactionController.cancel);

module.exports = router;