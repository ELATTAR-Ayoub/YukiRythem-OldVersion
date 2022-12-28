// Copyright (c) 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
process.env.PWD = process.cwd()

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
// const bodyParser = require('body-parser');
// const encoder = bodyParser.urlencoded();
const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'yukiRythem'
// })




const methodOverride = require('method-override');
const { getVideo, getPlaylist, search } = require('@fabricio-191/youtube')
    .setDefaultOptions({
        language: 'en',
        location: 'US',
        quantity: 'all',
        requestsOptions: {}
    });

var userInput;
var deleteSongIndex;
var songObject = {};
// var songObject = {
//     videoId: '',
//     videoURL: '',
//     songTitle: 'Abyss Muta | Type your favorite song\'s name and enjoy!!!',
//     songOwner: 'ELATTAR Ayoub',
//     ownerURL: 'https://github.com/ELATTAR-Ayoub',
//     thumbnail1: 'src/img/pexels-henry-&-co-6936860.jpg',
//     thumbnail2: '',
// };
var songList = [];
const PORT = process.env.PORT || 3000;

// 
const initializePassport = require('./passport-config');
initializePassport(
    passport,
    // name => users.find(user => user.name === name),
    // id => users.find(user => user.id === id)
);

// our fantastic database
const users = [];
var passLength = 0;

// connect to the database

// connection.connect(function (error) {
//     if (error) console.log(error)
//     else console.log("connect to the database!")
// });


 
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./views'));
app.use(express.static('./public'));
app.use(express.static('./searchEngine'));
app.use(express.static('./'));
app.use(express.static(process.env.PWD + './views/src/css'));
app.use(express.static(process.env.PWD + './views/src/js'));
app.use(express.static(process.env.PWD + './views/src/webfonts'));
app.use(express.static(process.env.PWD + './views/src/css-webfonts'));
app.use(express.static(process.env.PWD + './public/audio'));
app.use(express.static(process.env.PWD + './public/img'));
app.use(express.static(process.env.PWD + './public/fonts'));
app.use(express.static(process.env.PWD + './public/video'));
app.use(flash());
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: true,
    saveUninitialized: true,
    name: 'YukiRythem',
    proxy: true,
    secret: 'cat',
}))
// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: false
// }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('player.ejs', { songList: songList, });
    // res.redirect('/player')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    // res.render('login.ejs');
});

// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }));

// app.get('/login', encoder, checkNotAuthenticated, (req, res) => {
//     var username = req.body.username;
//     var useremail = req.body.email;
//     var userpassword = hashedPassword;
//     connection.query("select * from users where user_name = ? user_email = ? user_password = ?", [username, useremail, userpassword], function (err, result) {
//         if (result.length > 0) {
//             res.redirect('/');
//         } else {
//             res.redirect('/register');
//         }
//     })
// });


// app.get('/register', checkNotAuthenticated, (req, res) => {
//     res.render('register.ejs');
// });

// app.post('/register', checkNotAuthenticated, async (req, res) => {
//     // passLength = req.body.password.length;
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     var username = req.body.username;
//     var useremail = req.body.email;
//     var userpassword = hashedPassword;
//     connection.query("INSERT INTO users SET user_name = ?, user_email = ?, user_password = ?", [username, useremail, userpassword], function (err, result) {
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             res.redirect('/register');
//             return;
//         }
//         else {
//             console.log('connected as id ' + connection.threadId);
//             res.redirect('/');
//         }

//     })

//     // try {
//     //     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     //     users.push({
//     //         id: Date.now().toString(),
//     //         name: req.body.username,
//     //         email: req.body.email,
//     //         password: hashedPassword
//     //     })
//     //     res.redirect('/login');
//     // }
//     // catch {
//     //     res.redirect('/register');
//     // }
//     // console.log(users);
//     // console.log('users.name: ' + users[0].name)
// });

// app.delete('/logout', (req, res) => {
//     req.logOut();
//     res.redirect('/login');
// })

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}

app.get('/player', (req, res) => {
    res.render('player.ejs', {
        songList: songList,
        // title: songObject.songTitle,
        // owner: songObject.songOwner,
        // videoURL: songObject.videoURL,
        // ownerURL: songObject.ownerURL,
        // songUrl: songObject.videoId,
        // thumbnail1: songObject.thumbnail1,
        // thumbnail2: songObject.thumbnail2
    });
});

app.get('/resetPlayer', (req, res) => {
    songList = [];
    console.log('Delete ALL DONE');
    res.render('resetPlayer.ejs');
});

app.post('/player', (req, res) => {
    try {
        userInput = req.body.musicSource;
        console.log('got user input: => ' + userInput);
        if (userInput != '' && userInput) {
            console.log('start from server');
            if (userInput.includes("https://www.youtube.com/watch?v=") && userInput.includes("&list=")) {
                PlaylistData(userInput, res);
            }
            else if (userInput.includes("https://www.youtube.com/watch?v=")) {
                videoData(userInput, res, redirect);
            }
            else {
                searchData(userInput, res, redirect);
            }
        }
    }
    catch {
        res.redirect('/player');
    }
    // 
    // if (isNaN(req.body.deleteSongIndex) == false || typeof req.body.deleteSongIndex != undefined) {
    //     try {
    //         deleteSongIndex = req.body.deleteSongIndex;
    //         deleteSongIndex--;
    //         console.log('got user deleteSongIndex: => ' + deleteSongIndex);
    //         songList.splice(deleteSongIndex, 1);
    //         res.redirect('./player');
    //     }
    //     catch {
    //         res.redirect('./player');
    //     }
    // }

});

function searchData(string, res, callback) {
    search(string, { quantity: 40 })
        .then(data => {
            let video = data.results.filter(x => x.type === 'video');
            video = data.results[0];
            console.log(video);
            checkThumbnails(video);
            callback();
            res.redirect('/player');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/player');
        });

}

function videoData(string, res, callback) {
    getVideo(string)
        .then(data => {
            console.log(data);
            checkThumbnails(data);
            songObject = {
                videoId: data.ID,
                videoURL: data.URL,
                songTitle: data.name,
                songOwner: data['owner'].name,
                ownerURL: data['owner'].URL,
                thumbnail1: data.thumbnails[0].url,
                thumbnail2: data.thumbnails[1].url,
            };
            res.redirect('/player');
            callback();
        })
        .catch(err => {
            console.log(err);
            res.redirect('/player');
        });
}

function PlaylistData(string, res) {
    getPlaylist(string)
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.videos.length; i++) {
                checkThumbnailsPlaylist(data, i);
                songList.push(songObject);
            }
            res.redirect('/player');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/player');
        });
}

function redirect() {
    console.log('songTitle:' + songObject.songTitle);
    console.log('videoId:' + songObject.videoId);
    songList.push(songObject);
    console.log(songList);
    console.log('songListLengthSERVER: ' + songList.length);
    console.log('songList[0]SERVER: ' + songList[0]);
}

function checkThumbnails(video) {
    if (video.thumbnails.length == 1) {
        songObject = {
            videoId: video.ID,
            videoURL: video.URL,
            songTitle: video.title,
            songOwner: video.owner.name,
            ownerURL: video.owner.URL,
            thumbnail1: video.thumbnails[0].url,
        };
    } else if (video.thumbnails.length >= 1) {
        songObject = {
            videoId: video.ID,
            videoURL: video.URL,
            songTitle: video.title,
            songOwner: video.owner.name,
            ownerURL: video.owner.URL,
            thumbnail1: video.thumbnails[0].url,
            thumbnail2: video.thumbnails[1].url,
        };
    } else {
        songObject = {
            videoId: video.ID,
            videoURL: video.URL,
            songTitle: video.title,
            songOwner: video.owner.name,
            ownerURL: video.owner.URL,
        }
    }
}

function checkThumbnailsPlaylist(data, i) {
    if (data.videos[i].thumbnails.length == 1) {
        songObject = {
            videoId: data.videos[i].ID,
            videoURL: data.videos[i].URL,
            songTitle: data.videos[i].title,
            songOwner: data.videos[i]['owner'].name,
            ownerURL: data.videos[i]['owner'].URL,
            thumbnail1: data.videos[i].thumbnails[0].url,
        };
    } else if (data.videos[i].thumbnails.length >= 1) {
        songObject = {
            videoId: data.videos[i].ID,
            videoURL: data.videos[i].URL,
            songTitle: data.videos[i].title,
            songOwner: data.videos[i]['owner'].name,
            ownerURL: data.videos[i]['owner'].URL,
            thumbnail1: data.videos[i].thumbnails[0].url,
            thumbnail2: data.videos[i].thumbnails[1].url,
        };
    } else {
        songObject = {
            videoId: data.videos[i].ID,
            videoURL: data.videos[i].URL,
            songTitle: data.videos[i].title,
            songOwner: data.videos[i]['owner'].name,
            ownerURL: data.videos[i]['owner'].URL,
            thumbnail1: 'o thumbnail',
            thumbnail2: 'o thumbnail',
        }
    }
}

app.listen(PORT);