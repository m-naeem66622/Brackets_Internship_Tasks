const express = require("express");
const routes = require("./routes");
const { fileInitializer } = require("./controller");

fileInitializer();

// Server Setup
const app = express();
const domain = process.env.DOMAIN || "http://localhost";
const port = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use("/api/users/", routes);

app.get("/", (req, res) => {
    res.send({ msg: "Hello From Server" });
});

app.listen(port, () => {
    console.log("Server is listening at ", domain + ":" + port);
});
