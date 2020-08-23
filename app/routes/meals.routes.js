let express = require('express');
let router = express.Router();
let mealController = require('../controller/meal.controller');

router.post('/createNewMeal',mealController.create);
router.put('/updateMeal',mealController.update);
router.delete('/delete',mealController.delete);
router.get('/getall',mealController.getAll);
router.get('/searchbyname',mealController.searchByName);

module.exports = router;