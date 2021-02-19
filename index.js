let app = require('express')();
let server = require('http').createServer(app);
let cors = require('cors')

const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require('./api/router');
routes(app)

const port = process.env.PORT || 3002;

var notification = require('./api/controller/notification');


server.listen(port, function () {
    console.log('http:localhost:' + port);

    setInterval(() => {
        let time = new Date();

        if (time.getHours() == 8)
            if (time.getMinutes() == 0)
                if (time.getSeconds() >= 0 && time.getSeconds() < 60) {
                    notification.checkExpire();
                }
    }, 60000);

})