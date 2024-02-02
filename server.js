const app = require('./app');

const PORT = 8080;

app.listen(PORT, function ()
{
    console.log("Starting flash card program: Node API Server...");
    console.log("The server will listen on port " + PORT + "...");
})