const excel = require("read-excel-file/node");
const express = require("express");
const body = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
const port = process.env.PORT || 8080;
const app = express();
dotenv.config();


let temp = null;
let fetchData = false;
let count = 0;
app.use(cors())
app.use(body.json()); // to support JSON-encoded bodies
app.use(body.urlencoded({ // to support URL-encoded bodies
    extended: false
}));

app.get("/", (req, res) => {
    res.sendfile("./views/index.html");
});
excel("./windows.xlsx").then(rows => {
    if (temp != null) {
        temp.push(rows);
    } else {
        temp = rows;
    }
    fetchData = true;
});
excel("./linux.xlsx").then(rows => {
    if (temp != null) {
        temp.push(rows);
    } else {
        temp = rows;
    }

    fetchData = true;
});

let question = (index) => {
    let data = {
        quesNum: temp[index][0],
        question: temp[index][2],
        answer1: temp[index][3],
        answer2: temp[index][4],
        answer3: temp[index][5],
        answer4: temp[index][6],
    };
    return data;
}


app.post("/check", (req, res) => {
    let ans = req.body.ans;
    let ques = req.body.ques;
    (temp[ques][7] == ans) ? res.send("OK"): res.send("Fail");
});

app.post("/next", (req, res) => {
    if (fetchData) {
        if (count == temp.length) count = 0;
        count = Math.floor(Math.random() * temp.length);
        res.json(question(count));
    }
});

app.listen(port, () => {
    console.log("Running at port " + port);
});