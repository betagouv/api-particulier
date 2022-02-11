import express, {Express, Router} from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import {Issuer, Strategy, TokenSet} from 'openid-client';
import passport from 'passport';
import session from 'express-session';
import {flash} from 'express-flash-message';
import connectRedis from 'connect-redis';
import {urlencoded} from 'body-parser';
import {createPortailApplicationController} from 'src/presentation/controllers/create-portail-application.controller';
import {listUserApplications} from 'src/presentation/controllers/list-user-applications.controller';
import {removePortailApplicationController} from 'src/presentation/controllers/remove-portail-application.controller';
import {createUserApplicationValidationMiddleware} from 'src/presentation/middlewares/create-user-application-validation.middleware';
import {isLoggedInMiddleware} from 'src/presentation/middlewares/is-logged-in.middleware';
import {portailErrorMiddleware} from 'src/presentation/middlewares/portail-error.middleware';
import {redisConnection} from 'src/infrastructure/configuration/redis';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';
import methodOverride from 'method-override';

const RedisStore = connectRedis(session);

export const initPortail = (app: Express) => {
  const nunjuckEnvironment = nunjucks.configure(
    path.join(__dirname, '../frontend/views/'),
    {
      autoescape: true,
      express: app,
      watch: process.env.NODE_ENV !== 'production',
    }
  );
  nunjuckEnvironment.addFilter('date', (date: Date) => {
    return format(date, 'P p', {locale: fr});
  });
  nunjuckEnvironment.addGlobal('sandbox', process.env.SANDBOXED === 'true');
  nunjuckEnvironment.addGlobal(
    'production',
    process.env.NODE_ENV === 'production'
  );
  if (process.env.NODE_ENV === 'production') {
    const manifest = require('../../../public/manifest.json');
    nunjuckEnvironment.addGlobal('manifest', manifest);
  }
  app.set('view engine', 'njk');
  app.use(express.static('public'));
};

Issuer.discover(process.env.ISSUER_URL!).then(issuer => {
  const client = new issuer.Client({
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    redirect_uris: [process.env.REDIRECT_URL!],
    response_types: ['code'],
  });
  passport.use(
    'openid',
    new Strategy(
      {
        client,
        params: {
          scope: 'openid email profile',
        },
      },
      (_token: TokenSet, userInfo: object, done: Function) => {
        done(null, userInfo);
      }
    )
  );
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

export const portailRouter = Router();

portailRouter.use(
  session({
    secret: process.env.SESSION_SECRET!,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({client: redisConnection}),
  })
);
portailRouter.use(methodOverride('_method'));
portailRouter.use(flash());
portailRouter.use(passport.initialize());
portailRouter.use(passport.session());
portailRouter.get('/login', passport.authenticate('openid'));
portailRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect(
    `https://${
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      new URL(process.env.ISSUER_URL!).hostname
    }/oauth/logout`
  );
});
portailRouter.get(
  '/callback',
  passport.authenticate('openid', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
portailRouter.use(isLoggedInMiddleware);
portailRouter.get('/', listUserApplications);
if (process.env.SANDBOXED === 'true') {
  portailRouter.post(
    '/new',
    urlencoded({extended: true}),
    createUserApplicationValidationMiddleware,
    createPortailApplicationController,
    portailErrorMiddleware
  );

  portailRouter.delete(
    '/applications/:id',
    urlencoded({extended: true}),
    removePortailApplicationController
  );
}
