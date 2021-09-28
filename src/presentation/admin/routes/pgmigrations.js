const express = require('express');
const {PermissionMiddlewareCreator} = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(
  'pgmigrations'
);

// This file contains the logic of every route in Forest Admin for the collection pgmigrations:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a Pgmigration
router.post(
  '/pgmigrations',
  permissionMiddlewareCreator.create(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
    next();
  }
);

// Update a Pgmigration
router.put(
  '/pgmigrations/:recordId',
  permissionMiddlewareCreator.update(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
    next();
  }
);

// Delete a Pgmigration
router.delete(
  '/pgmigrations/:recordId',
  permissionMiddlewareCreator.delete(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
    next();
  }
);

// Get a list of Pgmigrations
router.get(
  '/pgmigrations',
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
    next();
  }
);

// Get a number of Pgmigrations
router.get(
  '/pgmigrations/count',
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
    next();
  }
);

// Get a Pgmigration
router.get(
  '/pgmigrations/\\b(?!count\\b):recordId',
  permissionMiddlewareCreator.details(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
    next();
  }
);

// Export a list of Pgmigrations
router.get(
  '/pgmigrations.csv',
  permissionMiddlewareCreator.export(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
    next();
  }
);

// Delete a list of Pgmigrations
router.delete(
  '/pgmigrations',
  permissionMiddlewareCreator.delete(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
    next();
  }
);

module.exports = router;
