let express = require('express');
let router = express.Router();
let AccountController  = require('../controller/account.controller');

router.post('/create',AccountController.create);
router.delete('/delete/:linkId', AccountController.delete);
router.get('/get/:linkId',AccountController.get);
router.put('/update/:linkId',AccountController.update);
router.put('/inactivateAccount/:linkId',AccountController.inactivateAccount);
router.put('/activateAccount/:linkId',AccountController.activateAccount);
router.get('/searchByName',AccountController.searchbyname);
router.get('/getall',AccountController.getAll);
router.put('/refund/:linkId',AccountController.refund);

module.exports = router;