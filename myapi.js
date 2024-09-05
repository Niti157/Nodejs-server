import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello');
});

//http://localhost:3000/api/myProfile
app.get('/api/myProfile', (req, res) => {
    let myHtml = '<h1>My Profile</h1>';
    myHtml += '<p>Name: Niti Pakjamsai</p>';
    myHtml += '<p>E-mail: <a href="mailto:niti.pak@rmutto.ac.th">niti.pak@rmutto.ac.th<a></p>';
    res.set('Content-Type', 'text/html');
    res.end(myHtml);
});

//http://localhost:3000/api/getProfile/u100/o200
app.get('/api/getProfile/:userId/:orderId', (req, res) => {
    let { userId, orderId } = req.params 
    res.send(req.params);
});

//http://localhost:3000/api/getProfiles
app.get('/api/getProfiles', (req, res) => {
    let myProf = {
        '_id': 1000,
        'fname': 'Niti',
        'lname': 'Pakjamsai',
        'major': 'Information Technology',
        'image': '/public/img3.jpg'
    };
    res.jsonp(myProf);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`);
});