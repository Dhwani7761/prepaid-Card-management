let express = require('express');
let router = express.Router();
let accountTransactionController = require('../controller/accountTransaction.controller');

router.get('/getall', accountTransactionController.getAll);
router.get('/get/:linkId', accountTransactionController.get);
router.delete('/delete', accountTransactionController.delete);
module.exports = router;