const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const translateColorCodes = require('./utils.js');
const bodyParser = require('body-parser');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hypixelrank'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware function to validate the token
function validateToken(req, res, next) {
  const token = req.params.token;
  const tokenQuery = 'SELECT token FROM webeditor WHERE token = ?';
  
  connection.query(tokenQuery, [token], (err, result) => {
    if (err) {
      console.error('Error validating token:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (result.length === 0) {
      res.status(403).send('Forbidden: Invalid Token');
      return;
    }

    next();
  });
}

// Use the validateToken middleware for the /editor/:token route
app.post('/editor/:token/create-rank', validateToken, (req, res) => {
  const { rankname, prefix, weight } = req.body;
  
  if (!rankname || !prefix || !weight) {
    res.status(400).send('Rankname, prefix, and weight are mandatory fields.');
    return;
  }

  const insertQuery = 'INSERT INTO ranks (rankname, prefix, weight) VALUES (?, ?, ?)';
  connection.query(insertQuery, [rankname, prefix, weight], (err, result) => {
    if (err) {
      console.error('Error inserting new rank:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('New rank inserted successfully.');
    const successMessage = 'Rank Created Successfully';

    res.redirect(`/editor/${req.params.token}?success=${encodeURIComponent(successMessage)}`);
  });
});

app.get('/editor/:token', validateToken, (req, res) => {
  const token = req.params.token;

  const rankQuery = 'SELECT * FROM ranks';
  const userQuery = 'SELECT username, group_concat(rankname) AS `groups`, permissions FROM users GROUP BY username';

  connection.query(rankQuery, (err, ranks) => {
    if (err) {
      console.error('Error fetching ranks from the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(userQuery, (err, users) => {
      if (err) {
        console.error('Error fetching users from the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      ranks.forEach(rank => {
        rank.rankname = translateColorCodes(rank.rankname);
      });

      users.forEach(user => {
        user.groups = translateColorCodes(user.groups);
      });

      const success = req.query.success;
      res.render('index', { ranks, users, success });
    });
  });
});

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
