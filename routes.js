
'use strict';

let accountRoutes = require('./app/routes/account.routes');
let rechargeRoutes = require('./app/routes/recharge.routes');
let mealRoutes = require('./app/routes/meals.routes');
let transactionRoutes = require('./app/routes/transaction.routes.js');
let couponroutes = require('./app/routes/coupon.routes')
let accountTransactionRoutes = require('./app/routes/accountTransaction.routes');

module.exports = (app) => {
  app.use('/prepaidcardmanagement/account', accountRoutes);
  app.use('/prepaidcardmanagement/recharge',rechargeRoutes);
  app.use('/prepaidcardmanagement/meals',mealRoutes);
  app.use('/prepaidcardmanagement/sale',transactionRoutes);
  app.use('/prepaidcardmanagement/coupon',couponroutes);
  app.use('/prepaidcardmanagement/accountTransaction',accountTransactionRoutes);
};