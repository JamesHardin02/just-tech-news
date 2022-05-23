const express = require('express');
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

// handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

// session packages
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// session object, instantiates Expr. session store into db through sequelize
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

const app = express();
const PORT = process.env.PORT || 3001;

// server use handlebars as template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// server use sess as session obj
app.use(session(sess));

//middleware for json handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});