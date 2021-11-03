const express = require('express');
const path = require('path');
const app = express();

app.use("/public",express.static(__dirname + "/public"));

app.get("/",async function(req,res){
    res.sendFile(path.resolve("public/homepage.html"))
})
app.get("*",async function(req,res){
    res.sendFile(path.resolve("public/404.html"))
})


const port = 3000;
app.listen(port, () => {
    console.log(`The routes are running on http://localhost:${port}`);
});