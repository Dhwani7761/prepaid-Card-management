let Meal = require('../models/meal.model');
let helper = require('F:/MSCIT/iWant/PrepaidCardManagement2/Helper/common.helper');
let regex = require('mongoose-regex');
module.exports = {
    create: (req, res) => {
        var x = req.body.name;
        req.body.name  = x.toLowerCase();
        console.log(req.body.name);
        Meal.create(req.body)
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
    },
    update: (req, res) => {
        Meal.findOneAndUpdate({ name: req.query.name }, req.body, { new: true })
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
    },
    delete: (req, res) => {
        Meal.deleteOne({ name: req.query.name })
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
    },
    getAll: (req, res) => {
        Meal.find({})
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
    },
    searchByName: (req, res) => {
        Meal.findOne({ name: req.query.name })
            .then(helper.respondAsJSON(res))
            .catch(helper.handleError(res));
    }
};