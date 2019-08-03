import express from 'express';
const path = require('path');
const axios = require('axios');
const http = axios;


export function SetupHttpServer(app) {
    app.use(express.static(path.join(__dirname, '../../public')));

    // Keep heroku free app online
    if (process.env.PORT) {
        setInterval(function () {
            http.get(`http://mystera-reborn.herokuapp.com`);
        }, 300000);
    }

    let port = process.env.PORT || 80;

    app.listen(port);

    console.log('Listening on port ' + port);
}
