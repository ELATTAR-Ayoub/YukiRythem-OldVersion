const { getVideo, getPlaylist, search } = require('@fabricio-191/youtube')
    .setDefaultOptions({
        location: 'AR',
        language: 'es-419'
    });

var songObject = {
    ytSource,
    musicTitle,
    musicOwner,
    musicLengthSec
};
var ytSource;
var musicTitle;
var musicOwner;
var musicLengthSec

const getMusic = (string) => {
    getVideo(string)
        .then(data => {
            console.log(data);
            musicTitle = video.name;
            musicOwner = video.owner.name;
            ytSource = video.URL;
            musicLengthSec = video.duration[0].number;
        })
        .catch(console.error);
}

const videoDataSearch = (string) => {
    console.log("userInputInput: " + string);
    console.log('Start');
    if (string != '') {
        getMusic(string);
        console.log('Done');
    }
    songObject.musicTitle = musicTitle;
    songObject.musicOwner = musicOwner;
    songObject.musicLengthSec = musicLengthSec;
    songObject.ytSource = ytSource;

}

// videoDataSearch('https://www.youtube.com/watch?v=0IBkQw0Gfcc&list=RDyX0i5LcBgjs&index=9');
console.log('Start');

getVideo('https://www.youtube.com/watch?v=0IBkQw0Gfcc&list=RDyX0i5LcBgjs&index=9')
    .then(data => {
        console.log(data);
        console.log('Done');

    })
    .catch(console.error);

module.exports = { videoDataSearch, songObject };