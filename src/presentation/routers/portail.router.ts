import express, {Express, Router, Request, Response} from 'express';
import expressHandlebars from 'express-handlebars';
import path from 'path';

export const initPortail = (app: Express) => {
  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, '../frontend/views/'));
  app.use(express.static('public'));
};

export const portailRouter = Router();

portailRouter.get('/', (req: Request, res: Response) => {
  res.render('index', {subscriptions: [], user: {email: 'croute@lol.fr'}});
});
