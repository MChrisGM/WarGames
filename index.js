const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth, userInfo } = require("./middleware/auth.js");

const PORT = 5000;

app.set("view engine", "ejs");

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(express.static(__dirname + '/views'));

// Routes
app.use("/api/auth", require("./Auth/route"));

app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});
app.get("/admin", adminAuth, (req, res) => res.render("admin"));

app.get("/new", userAuth, (req, res) => res.render("new"));
app.get("/games", userAuth, (req, res) => res.render("games"));

app.get("/profile", userAuth, (req, res) => res.render("profile"));

app.get("/game", userAuth, (req, res) => res.render("game"));

app.post("/userInfo", userInfo, (req, res) => {
  res.json(res.locals.decodedToken);
})

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});