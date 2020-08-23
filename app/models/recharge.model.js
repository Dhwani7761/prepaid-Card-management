'use strict'

let mongoose = require('bluebird').promisifyAll(require('mongoose'));
let Schema = mongoose.Schema;
let autopopulate = require('mongoose-autopopulate');
let paginate = require('mongoose-paginate');
let AutoIncrement = require('mongoose-sequence')(mongoose);


let Recharge = new Schema({
    linkId: { type: Schema.Types.String, ref: 'Account' },
    amount: Number,
    staffId: Number
},
{
    timestamps : true
})

Recharge.plugin(autopopulate);
Recharge.plugin(paginate);
Recharge.plugin(AutoIncrement, { inc_field: 'transactionId', disable_hooks: false });

module.exports = mongoose.model('Recharge', Recharge);