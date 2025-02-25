const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express.js!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
