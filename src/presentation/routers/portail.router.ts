import express, {Express, Router} from 'express';
import expressHandlebars from 'express-handlebars';
import path from 'path';
import {listApplications} from 'src/presentation/controllers/list-applications.controller';
import {Issuer, Strategy, TokenSet} from 'openid-client';
import passport from 'passport';
import session from 'express-session';
import connectRedis from 'connect-redis';
import {redisConnection} from 'src/infrastructure/configuration/redis';

const RedisStore = connectRedis(session);

export const initPortail = (app: Express) => {
  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, '../frontend/views/'));
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
portailRouter.use(passport.initialize());
portailRouter.use(passport.session());
portailRouter.get('/', listApplications);
portailRouter.get('/login', passport.authenticate('openid'));
portailRouter.get(
  '/callback',
  passport.authenticate('openid', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
