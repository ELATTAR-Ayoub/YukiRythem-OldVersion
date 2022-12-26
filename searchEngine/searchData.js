const { getVideo, getPlaylist, search } = require('@fabricio-191/youtube')
    .setDefaultOptions({
        language: 'en',
        location: 'US',
        quantity: 'all',
        requestsOptions: {}
    });


var songList = [];
var songObject = {};

const searchMusic = (string) => {
    search(string, { quantity: 40 })
        .then(data => {
            let video = data.results.filter(x => x.type === 'video');
            video = data.results[0];
            console.log(video);
            songObject = {
                ytSource: video.URL,
                songTitle: video.title,
                songOwner: video.owner.name,
            };
            songList.push(songObject);
            console.log('songList:' + songList[0].songTitle);

        })
        .catch(console.error);
}

const videoDataSearch = (string) => {
    console.log("userInputInput: " + string);
    console.log('Start');
    if (string != '') {
        searchMusic(string);
        console.log('Done');
    }


}



// videoDataSearch();

module.exports = { videoDataSearch, songObject, songList };
