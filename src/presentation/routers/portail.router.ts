import express, {Express, Router, Request, Response} from 'express';
import expressHandlebars from 'express-handlebars';
import path from 'path';
import {listApplications} from 'src/presentation/controllers/list-applications.controller';

export const initPortail = (app: Express) => {
  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, '../frontend/views/'));
  app.use(express.static('public'));
};

export const portailRouter = Router();

portailRouter.get('/', listApplications);
