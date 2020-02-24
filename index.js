const express = require('express')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require("fs")
const PORT = process.env.PORT || 5000


let artists = [];

app.use(express.static(path.join(__dirname,'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

app.get('/', (req,res) => {
    return res.sendFile(path.join(__dirname,'views','index.html'));
});

app.get('/artists/all', (req,res) => {
    return res.sendFile(path.join(__dirname,"/artists.json"));
});

app.post('/artists/add', (req,res) => {
    fs.readFile(path.join(__dirname,"/artists.json"), (err, data) => {
        if (err) throw err;
        artists = JSON.parse(data);
        artists.push({
            id: new Date().getUTCMilliseconds(),
            ...req.body
        });
        newArtists = JSON.stringify(artists, null, 2);
        fs.writeFile('artists.json', newArtists, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
        res.sendFile(path.join(__dirname,"/artists.json"));
    });
});

app.delete('/artists/:id', (req,res)=>{
    fs.readFile(path.join(__dirname,"/artists.json"), (err, data) => {
        if (err) throw err;
        artists = JSON.parse(data);
        //find artist by id
        let _id = req.params.id;
        let index = artists.findIndex(artist => artist.id == _id);
        artists.splice(index,1);
        newArtists = JSON.stringify(artists, null, 2);
        fs.writeFile('artists.json', newArtists, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
        res.sendFile(path.join(__dirname,"/artists.json"));
    });
});

app.post("/artists/search", (req,res)=>{
    fs.readFile(path.join(__dirname,"/artists.json"), (err, data) => {
        if (err) throw err;
        artists = JSON.parse(data);
        artists = artists.filter(artist=>{
            return artist.name.toLowerCase().includes(req.body.query.toLowerCase());
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(artists, null, 3));
    });
})




app.listen(PORT, () => console.log('Server listening on port 3000...'))



