'use strict';

let mongoose = require('bluebird').promisifyAll(require('mongoose'));
let Schema = mongoose.Schema;
let autopopulate = require('mongoose-autopopulate');
let paginate = require('mongoose-paginate');
let autoIncrement = require('mongoose-sequence')(mongoose);

let Meal = new Schema({
    name: String,
    price: Number,
    staffId: Number
},
{
    timestamps : true
})

Meal.plugin(autopopulate);
Meal.plugin(paginate);
Meal.plugin(autoIncrement, { inc_field: 'id', disable_hooks: false });

module.exports = mongoose.model('Meal', Meal);