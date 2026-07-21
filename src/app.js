const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

let users = [];
let currentUser = null;

let events = [
  { id: 1, title: "Tech Innovation Summit 2026", seats: 100, price: 49.99 },
  { id: 2, title: "DevOps & Cloud Masterclass", seats: 50, price: 29.99 }
];

let bookings = [];

app.get("/healthz", (req, res) => res.status(200).send("OK"));
app.get("/ready", (req, res) => res.status(200).send("READY"));

app.post("/api/auth/register", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please provide username and password" });
  }
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }
  const newUser = { id: users.length + 1, username, password, role: role || "user" };
  users.push(newUser);
  res.status(201).json({ success: true, message: "User registered successfully!" });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  currentUser = { username: user.username, role: user.role };
  res.status(200).json({ success: true, message: "Login successful", user: currentUser });
});

app.get("/api/auth/me", (req, res) => {
  res.status(200).json({ success: true, user: currentUser });
});

app.post("/api/auth/logout", (req, res) => {
  currentUser = null;
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

app.get("/api/events", (req, res) => {
  res.status(200).json({ success: true, data: events });
});

app.post("/api/events", (req, res) => {
  if (!currentUser || currentUser.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  const { title, seats, price } = req.body;
  if (!title || !seats || !price) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  const newEvent = { id: events.length + 1, title, seats: Number(seats), price: Number(price) };
  events.push(newEvent);
  res.status(201).json({ success: true, data: newEvent });
});

app.delete("/api/events/:id", (req, res) => {
  if (!currentUser || currentUser.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  const eventId = Number(req.params.id);
  events = events.filter(e => e.id !== eventId);
  res.status(200).json({ success: true, message: "Event deleted" });
});

app.post("/api/bookings", (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ success: false, message: "Please login first" });
  }
  const { eventId } = req.body;
  const event = events.find(e => e.id === Number(eventId));

  if (!event || event.seats <= 0) {
    return res.status(400).json({ success: false, message: "Event sold out or invalid" });
  }

  event.seats -= 1;
  const newBooking = {
    id: bookings.length + 1,
    username: currentUser.username,
    eventTitle: event.title,
    price: event.price,
    date: new Date().toLocaleString()
  };
  bookings.push(newBooking);

  res.status(201).json({ success: true, message: "Ticket booked successfully!", booking: newBooking });
});

app.get("/api/bookings", (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ success: false, message: "Please login first" });
  }
  const userBookings = bookings.filter(b => b.username === currentUser.username);
  res.status(200).json({ success: true, data: userBookings });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
