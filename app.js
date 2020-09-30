const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
var axios = require('axios');

const app = express();
const port = 8080;

app.use(cors());

//use cookie parser
app.use(cookieParser());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/getUserDetails', (req, res) => {
    const RLSESSION = req.cookies['RLSESSION'];
    const RETAILLINKSESSION = req.cookies['RETAILLINKSESSION'];
    const cookieString = `RLSESSION=${RLSESSION};RETAILLINKSESSION=${RETAILLINKSESSION}`;
    const fetchUrl = "https://dev.rl2.wal-mart.com/rl_portal_services/api/Site/GetUserDetails"
    //const locationUrl = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=11.941591&longitude=79.808311&localityLanguage=en'
    //const weatherUrl = 'http://api.weatherstack.com/current?access_key=20fadcacb70aef3b94c15fe8ea6dc901&query=11.941591,79.808311&units=m';
    
    //res.cookie('RLSESSION',RLSESSION);
    //res.cookie('RETAILLINKSESSION',RETAILLINKSESSION);
    const callback =(json) => {
        res.json(json);
    }
    axios.get(fetchUrl, {
        withCredentials: true,
        headers: {
            Cookie: cookieString
        }
       })
    .then(response => {
        const data = response ? response.data : {};
        callback(data);
    })
    .catch(error => {
        callback(error);
    });
});

app.listen(port, () => console.log(`get user app listening on port ${port}!`));