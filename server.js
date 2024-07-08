require("dotenv").config();
const express = require("express");
const RED = require("node-red");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 8081;

// Node-RED settings
const settings = {
	httpAdminRoot: "/red",
	httpNodeRoot: "/api",
	userDir: path.join(__dirname, "node-red-data"),
	functionGlobalContext: {},
};

// Initialise the runtime with a server and settings
RED.init(server, settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
	res.status(200).send("OK");
});

app.post("/login", (req, res) => {
	const { username, password } = req.body;
	if (username === "admin" && password === "password") {
		console.log(`Successful login attempt for user: ${username}`);
		res.redirect("/red"); // Redirect to Node-RED
	} else {
		console.warn(`Failed login attempt for user: ${username}`);
		res.send("Invalid credentials");
	}
});

server.listen(port, () => {
	console.log(`Express server is running at http://localhost:${port}`);
	console.log(`Navigate to http://localhost:${port} to access the login page.`);
	console.log(
		"This application serves a login page that redirects to Node-RED upon successful authentication."
	);
	console.log(
		"Ensure Node-RED is running at http://127.0.0.1:1880 before testing the redirection."
	);
});

// Start the Node-RED runtime
RED.start();
