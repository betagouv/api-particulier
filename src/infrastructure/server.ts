import * as express from 'express';
import {fetchDgfipData} from 'src/presentation/controllers/fetch-data.controller';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';

const app = express();

app.use('/croute', dfdipInputValidationMiddleware);
app.get('/croute', fetchDgfipData);
app.listen(3000, () => {
  console.log('App listening on port 3000');
});
