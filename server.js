// Dependencies
const express = require('express');
const path = require('path');
// Sets up the Express App
const app = express();
const PORT = 3000;

const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// serve static files
app.use(express.static(__dirname + '/public'));





// Routes
// get notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {

    readFileAsync('./db/db.json', "utf8")
        .then((result, err) => {
            if (err) console.log(err);
            return res.json(JSON.parse(result));
        });
});

// get index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});




//save note and read note
app.post("/api/notes", (req, res) => {
    let newNote = req.body;

    readFileAsync("./db/db.json", "utf8")
        .then((result, err) => {
            if (err) console.log(err);
            return Promise.resolve(JSON.parse(result));
        })

        .then(data => {
            newNote.id = getLastIndex(data) + 1;
            (data.length > 0) ? data.push(newNote) : data = [newNote];
            return Promise.resolve(data);
        })

        .then(data => {
            writeFileAsync("./db/db.json", JSON.stringify(data));
            res.json(newNote);
        })

        .catch(err => {
            if (err) throw err;
        });
});


function getLastIndex(data) {
    if (data.length > 0) return data[data.length - 1].id;
    return 0;
}


//deleteNote
app.delete('/api/notes/:id', (req, res) => {

    let id = req.params.id;

    readFileAsync("./db/db.json", "utf8")
        .then((result, err) => {

            if (err) console.log(err);
            return Promise.resolve(JSON.parse(result));
        })

        .then(data => {
            data.splice(data.indexOf(data.find(element => element.id == id)), 1);
            return Promise.resolve(data);

        })

        .then(data => {
            writeFileAsync("./db/db.json", JSON.stringify(data));
            res.send("success");

        })

        .catch(err => {
            if (err) throw err;

        });
});



// Starts the server to begin listening
app.listen(process.env.PORT || 3000, () => console.log(`App listening on PORT ${PORT}`));
