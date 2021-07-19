const express = require('express');
import {logFor} from 'src/domain/logger';
import {fetchDgfipData} from 'src/presentation/controllers/fetch-data.controller';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';

const app = express();
const logger = logFor('Server');

app.use('/croute', dfdipInputValidationMiddleware);
app.get('/croute', fetchDgfipData);
app.listen(process.env.PORT || 3000, () => {
  logger.log('info', 'App listening on port 3000');
});
