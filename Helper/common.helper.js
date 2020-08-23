'use strict'

module.exports = {
    respondAsJSON: (res, statusCode) => {
        statusCode = statusCode || 200;
        return (items) => {
          res.status(statusCode).json(items);
        }
      },
      handleError: (res, statusCode) => {
        statusCode = statusCode || 500;
        return (err) => res.status(statusCode).send(err);
      }
}