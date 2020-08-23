'use strict'

let mongoose = require('bluebird').promisifyAll(require('mongoose'));
let Schema = mongoose.Schema;
let autopopulate = require('mongoose-autopopulate');
let paginate = require('mongoose-paginate');
let autoIncrement = require('mongoose-sequence')(mongoose);

let transaction = new Schema({
    linkId : { type: Schema.Types.String, ref: 'Account' },
    staffId : Number,
    coupons :[{type : Schema.Types.ObjectId,ref : 'Coupon', autopopulate: true}],
    totalpayable : Number
},
{
    timestamps : true
})

transaction.plugin(paginate);
transaction.plugin(autopopulate);

module.exports = mongoose.model('Transaction', transaction);