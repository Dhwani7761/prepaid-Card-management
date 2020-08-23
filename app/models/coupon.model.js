'use strict'

let mongoose = require('bluebird').promisifyAll(require('mongoose'));
let Schema = mongoose.Schema;
let autopopulate = require('mongoose-autopopulate');
let paginate = require('mongoose-paginate');

let Coupon = new Schema({
    status : {type : String,enum:['ACTIVE','USED','EXPIRED','CANCELLED'],default : 'ACTIVE'},
    date : Date,
    couponId : String,
    typeOfMeal : String
},
{
    timestamps: true
})

Coupon.plugin(paginate);
Coupon.plugin(autopopulate);

module.exports = mongoose.model('Coupon', Coupon);