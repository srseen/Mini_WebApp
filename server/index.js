// Import express framework and express-session middleware
const express = require("express");
const session = require("express-session");
const port = 8080;

// Create express application
const app = express();

// Configure session middleware
app.use(
  session({
    secret: "secret", // Secret key for session encryption
    resave: true, // Save session on every change
    saveUninitialized: true, // Save session even when empty
  })
);

// Route for displaying Session ID
app.get("/sessionid", (req, res, next) => {
  // Get session ID from request
  const id = req.sessionID;
  // Send session ID back to display
  res.send(`<h1>Session ID: ${id}</h1>`);
});

// Add middleware for reading form data
app.use(express.urlencoded({ extended: true }));
/*
Without the express.urlencoded({ extended: true }) middleware, these issues would occur:
1. Server cannot read data from HTML POST forms
2. req.body would be undefined
3. When users submit registration form, email and password won't be sent to server

Because:
- express.urlencoded() is middleware that converts HTML form data sent as application/x-www-form-urlencoded into JavaScript-readable format
- The extended: true option allows sending complex data (like nested objects) through forms
*/

app.get("/", (req, res) => {
  res.send("<h1>Home page</h1>");
});

// Route for registration page ('/register')
// Display form for email and password input
app.get("/register", (req, res) => {
  res.send(`
    <form action="/register" method="post">
      <input type="email" name="email" placeholder="Email" autocomplete="off" />
      <input type="password" name="password" placeholder="Password" autocomplete="off" />
      <button type="submit">Register</button>
    </form>
  `);
});

// Registration at http://localhost:8080/register
// Route for registration - receive form data and save to session
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  req.session.data = { email, password };
  res.redirect("/profile");
});

// Route for displaying profile information
app.get("/profile", (req, res) => {
  if (req.session.data) {
    res.json(req.session.data);
  } else {
    res.send("No data");
  }
});

// Route for homepage ('/')
app.get("/", (req, res, next) => {
  // Check if page view count exists
  if (req.session.view) {
    // If exists, increment by 1
    req.session.view += 1;
  } else {
    // If not exists, start at 1
    req.session.view = 1;
  }
  // Send message showing number of times user has visited this page
  res.send(`You have visited this page ${req.session.view} times`);
});

// Start server on port 8080
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
