const express = require('express');
import {fetchDgfipData} from 'src/presentation/controllers/fetch-data.controller';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';

const app = express();

app.use('/croute', dfdipInputValidationMiddleware);
app.get('/croute', fetchDgfipData);
app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port 3000');
});
