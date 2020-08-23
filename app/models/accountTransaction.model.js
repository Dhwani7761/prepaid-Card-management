'use strict'

let mongoose = require('bluebird').promisifyAll(require('mongoose'));
let Schema = mongoose.Schema;
let autopopulate = require('mongoose-autopopulate');
let paginate = require('mongoose-paginate');
let AutoIncrement = require('mongoose-sequence')(mongoose);

let AccountTransaction = new Schema({
    linkId: { type: Schema.Types.String, ref: 'Account' },
    staffId: Number,
    amount: Number,
    transaction: {
        type: String,
        enum: ['CREDIT', 'DEBIT']
    }
},
    {
        timestamps: true
    })

AccountTransaction.plugin(paginate);
AccountTransaction.plugin(autopopulate);
AccountTransaction.plugin(AutoIncrement, { inc_field: 'transctionId', disable_hooks: false });

module.exports = mongoose.model('AccountTransaction', AccountTransaction);