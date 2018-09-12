const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const app = express();
const MAINTENANCE_MODE = false;
const port = process.env.PORT || 5000;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.use((req, res, next) => {
  if(MAINTENANCE_MODE){
    res.render('maintenance.hbs');
  } else {
    next();
  }
});

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});



app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'About Page',
    welcomeMessage: 'Welcome to the Home Page'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMsg: 'Error Handling Request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
