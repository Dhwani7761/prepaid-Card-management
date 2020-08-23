'use strict';

let mongoose = require('bluebird').promisifyAll(require('mongoose'));
let Schema = mongoose.Schema;
let autopopulate = require('mongoose-autopopulate');
let paginate = require('mongoose-paginate');
let randomize = require('randomatic');

let Account = new Schema({
    linkId: String,
    firstName: String,
    lastName: String,
    gender: {
        type:String,
        enum : ['MALE','FEMALE']
    },
    DOB: Date,
    idType: String,
    status: {
        type: Boolean,
        default:  true // 1 for active status
    },
    balance: {
        type: Number,
        default: 0
    },
    mycoupons:[{type: Schema.Types.ObjectId, ref: 'Coupon',autopopulate : true}]
},
{
    timestamps : true
})

Account.plugin(autopopulate);
Account.plugin(paginate);

module.exports = mongoose.model('Account', Account);