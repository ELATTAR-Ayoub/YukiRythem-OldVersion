//requires
// var div = document.createElement('div');
// div.id = '0';
// div.className = 'song';
// document.body.appendChild(div);

// input
const abc = document.getElementById('musicSourceSubmit');
// 
const queries_opener = document.getElementById('queries-opener');
const queries = document.getElementById('queries');
const queries_ol = document.getElementById('queries-ol');
const queries_ol_items = document.getElementsByClassName('queries-list-items');
const no_queries = document.getElementById('no-queries');
const list_items_play_Btn = document.getElementsByClassName('play-li-btn');
const list_items_remove_Btn = document.getElementsByClassName('remove-li-btn');
const hearth = document.getElementById('hearth');
const loved = document.getElementById('loved-like');
const normal_like = document.getElementById('normal-like');
const play = document.getElementById('play');
const play_phase = document.getElementById('play-phase');
const pause_phase = document.getElementById('pause-phase');
const next_song = document.getElementById('next');
const next_song_icon = document.getElementsByClassName('fa-forward')[0];
const before_song_icon = document.getElementsByClassName('fa-backward')[0];
const before_song = document.getElementById('before');
const loop_song = document.getElementById('loop-infi');
const copie = document.getElementById('copie');
// spiners
const spiner = document.getElementById('spiner');
const load_spiner = document.getElementById('load-spiner');
const default_thumbnail = document.getElementById('default-thumbnail');

// audio
const song = document.getElementById('song');
const song_range = document.getElementById('song-range-inp');
const song_timer = document.querySelector('.tools-section .song-range .time span');
const song_volume = document.getElementById('song-volume');
// input
const user_input_form = document.getElementById('user_input_form');
const delete_song_form = document.getElementById('delete_song_form');
// Lists
var songIDList = document.getElementById('songIDList').innerHTML;
songIDList = songIDList.split("-thenwehave-");

var songTitleList = document.getElementById('songTitleList').innerHTML;
songTitleList = songTitleList.split("-thenwehave-");

var ownerNameList = document.getElementById('ownerNameList').innerHTML;
ownerNameList = ownerNameList.split("-thenwehave-");

var ownerURLList = document.getElementById('ownerURLList').innerHTML;
ownerURLList = ownerURLList.split("-thenwehave-");

var videoURLList = document.getElementById('videoURLList').innerHTML;
videoURLList = videoURLList.split("-thenwehave-");

var thumbnailList = document.getElementById('thumbnailList').innerHTML;
thumbnailList = thumbnailList.split("-thenwehave-");




var index = 0;
var IDs = [];
var songTitles = [];
var ownerNames = [];
var ownerURLs = [];
var songURLs = [];
var songThumbnails = [];
var loopingTimes = 0;


function trimArray(arr1) {
    let arr2 = [];
    for (let i = 0; i < arr1.length; i++) {
        let id = arr1[i].trim();
        arr2.push(id);
    }
    return arr2;
}


IDs = trimArray(songIDList);
songTitles = trimArray(songTitleList);
ownerNames = trimArray(ownerNameList);
ownerURLs = trimArray(ownerURLList);
songURLs = trimArray(videoURLList);
songThumbnails = trimArray(thumbnailList);


console.log(IDs);
console.log(songTitles);
console.log(ownerNames);
console.log(ownerURLs);
console.log(songURLs);
console.log(songThumbnails);
manageQueriesList(index);

if (songTitles[index] == '') {
    document.querySelector('.container .article .main-controller .song-info .song-title span').innerHTML = 'Enter a Song name and enjoy!!!';
    document.querySelector('.container .article .main-controller .song-info .song-owner a').innerHTML = 'Use the Input bellow ヽ( ・_・)~_~)ノ';
}
else {
    document.querySelector('.container .article .main-controller .song-info .song-title span').innerHTML = songTitles[index];
    document.querySelector('.container .article .main-controller .song-info .song-owner a').innerHTML = ownerNames[index];
}



var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('song', {
        width: 600,
        height: 400,
        videoId: IDs[index],
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}

function loadSpiner(playerStatus) {
    if (playerStatus == -1) {
        load_spiner.style.display = 'none'; // unstarted
        default_thumbnail.style.display = 'block';
    } else if (playerStatus == 0) {
        load_spiner.style.display = 'none'; // ended 
        playNextAuto();
    } else if (playerStatus == 1) {
        load_spiner.style.display = 'none'; // playing 
        default_thumbnail.style.display = 'none';
    } else if (playerStatus == 2) {
        load_spiner.style.display = 'none'; // paused
        default_thumbnail.style.display = 'none';
    } else if (playerStatus == 3) {
        load_spiner.style.display = 'inline-block'; // buffering
    } else if (playerStatus == 5) {
        load_spiner.style.display = 'none'; // video cued 
    }
}

function playNextAuto() {
    if (!loop_song.classList.contains('infinity-loop') && IDs[index] != "") {
        if (IDs[index + 1] == 'undefined' || IDs[index + 1] == '') {
            pauseVideo();
        }
        else {
            nextSong();
        }
    }
}

function onPlayerStateChange(event) {
    loadSpiner(event.data);
    queries_ol.addEventListener('mouseover', playRemoveByIndex(getThingsDone));

}

function onPlayerReady(event) {

    setThumbnail(index);
    openOwnerSource(index);
    copySongUrl(index);
    copyOwnerUrl(index);
    shareSong(index);
    manageQueriesList(index);


    next_song.addEventListener('click', nextSong);
    before_song.addEventListener('click', beforeSong);
    loop_song.addEventListener('click', loopSong);

    play.addEventListener('click', (e) => {
        playSong();
    });

    song_range.addEventListener('click', rangeJump);

    // setInterval
    window.setInterval(() => {
        try {
            setTime();
        } catch (e) {
            console.log(e);
        }
    }, 500);

    window.setInterval(() => {
        try {
            let value = song_volume.value;
            event.target.setVolume(volume = value);
            var volume_num = document.querySelector('.tools-section .volume span');
            volume_num.innerHTML = value;
        } catch (e) {
            console.log(e);
        }
    }, 100);

    playSong();
}

function playVideo() {
    player.playVideo();
    document.querySelector('.controller .play .popupComment').innerHTML = 'pause';

}

function pauseVideo() {
    player.pauseVideo();
    document.querySelector('.controller .play .popupComment').innerHTML = 'play';
}

function loadNextbyID(index) {
    player.loadVideoById({
        'videoId': IDs[index],
        'startSeconds': 0,
        'endSeconds': 0
    });
    manageQueriesList(index);
    // 
    document.querySelector('.container .article .main-controller .song-info .song-title span').innerHTML = songTitles[index];
    document.querySelector('.container .article .main-controller .song-info .song-owner a').innerHTML = ownerNames[index];

}

function playSong() {
    if (pause_phase.style.display != "block") {
        pause_phase.style.display = "block";
        play_phase.style.display = "none";
        play.setAttribute('data-icon', 'u');
        playVideo();
    }
    else {
        pause_phase.style.display = "none";
        play_phase.style.display = "block";
        play.setAttribute('data-icon', 'P');
        pauseVideo();
    }
}

function nextSong() {
    normal_like.style.display = "block";
    loved.style.display = "none";
    if (IDs[index + 1] == 'undefined' || IDs[index + 1] == '') {
        pauseVideo();
    } else {
        index++;
    }
    loadNextbyID(index);
    setThumbnail(index);
    openOwnerSource(index);
    copySongUrl(index);
    copyOwnerUrl(index);
    shareSong(index);
    manageQueriesList(index);
    pause_phase.style.display = "block";
    play_phase.style.display = "none";
    // css
    window.setInterval(function () {
        next_song_icon.style.animation = 'shade-away-right  1s ease-in-out alternate';
    }, 100);
    next_song_icon.style.animation = 'none';

}

function beforeSong() {
    normal_like.style.display = "block";
    loved.style.display = "none";
    if (index - 1 == -1) {
        player.seekTo(seconds = 0, allowSeekAhead = true);
    } else {
        index--;
    }
    loadNextbyID(index);
    setThumbnail(index);
    openOwnerSource(index);
    copyOwnerUrl(index);
    copySongUrl(index);
    shareSong(index);
    manageQueriesList(index);
    pause_phase.style.display = "block";
    play_phase.style.display = "none";
    // css
    window.setInterval(function () {
        before_song_icon.style.animation = 'shade-away-left  1s ease-in-out alternate';
    }, 100);
    before_song_icon.style.animation = 'none';
}


function loopSong() {
    let loop_comment = document.getElementById('loop-comment');
    let bracket = document.querySelector('.tools-section .song-tools .loop i .forward-bracket');
    let loopE14 = document.querySelector('.tools-section .song-tools .loop');
    let currentTime;
    let duration;
    if (IDs[index] != "") {
        loop_song.classList.add('infinity-loop');
        loopingTimes++;
        if (loopingTimes === 2) {
            bracket.style.display = 'none';
            loopE14.classList.remove('pseudo');
            loop_comment.innerHTML = 'loop song ∞';

            loopForever();
        }
        else if (loopingTimes === 1) {
            bracket.style.display = 'none';
            loopE14.classList.add('pseudo');
            loop_comment.innerHTML = 'loop song x1';

            loopOnce();
        }
        else {
            setToNormale();
        }
    }

    function setToNormale() {
        bracket.style.display = 'block';
        loopE14.classList.remove('pseudo');
        loop_comment.innerHTML = 'start looping';
        loopingTimes = 0;
        loop_song.classList.remove('infinity-loop');
    }

    function loopOnce() {
        window.setInterval(() => {
            currentTime = player.getCurrentTime();
            duration = player.getDuration() - 0.5;
            if (currentTime >= duration && loop_song.classList.contains('infinity-loop')) {
                setToNormale();
                console.log("remove('infinity-loop')");
                player.seekTo(seconds = 0, allowSeekAhead = true);
                player.playVedio();
            }
        }, 1000);
    }

    function loopForever() {
        window.setInterval(() => {
            currentTime = player.getCurrentTime();
            duration = player.getDuration() - 0.5;
            if (currentTime >= duration && loop_song.classList.contains('infinity-loop')) {
                player.seekTo(seconds = 0, allowSeekAhead = true);
                player.playVedio();
            }
        }, 1000);
    }

}


var lovedSongList = [];
console.log('lovedSongList: ' + lovedSongList);


hearth.addEventListener('click', (e) => {
    loveSong(songObject); // it will be the current song that plays
});


function loveSong(song) {
    if (normal_like.style.display != "none") {
        normal_like.style.display = "none";
        loved.style.display = "block";
        window.setInterval(function () {
            loved.style.animation = "animateHearth 0.3s ease-in-out";
        }, 100);
        if (songObject.videoId != "") {
            lovedSongList.push(songObject.videoId);
        }
        console.log(lovedSongList);
    }
    else {
        normal_like.style.display = "block";
        loved.style.display = "none";
        lovedSongList.pop(song);
        console.log(lovedSongList);
    }
}


function manageQueriesList(index) {
    const queries_liList = [];
    queries_ol.innerHTML = "";
    if (songTitles.length > 1) {
        for (let i = 0; i < songTitles.length; i++) {
            const queries_li = document.createElement('li');
            if (songTitles[i] != "") {
                no_queries.classList.add('hide');
                queries_li.appendChild(document.createTextNode(songTitles[i]));
                queries_ol.appendChild(queries_li);
                queries_li.classList.add('queries-list-items');
                // li controller
                var button1 = document.createElement('BUTTON');
                button1.classList.add('play-li-btn', 'li-controle');
                button1.innerHTML = 'play';
                queries_li.appendChild(button1);
                var button2 = document.createElement('BUTTON');
                button2.classList.add('remove-li-btn', 'li-controle')
                button2.innerHTML = 'remove';
                queries_li.appendChild(button2);
                // 
                queries_liList.push(queries_li);
                if (songTitles[i] == songTitles[index]) {
                    queries_li.style.opacity = '1';
                }
            }
        }
    }
    else {
        no_queries.classList.remove('hide');
    }

}


function playRemoveByIndex(callback) {
    var li_Array = [];
    var li_play_Array = [];
    var li_remove_Array = [];
    for (let i = 0; i < queries_ol_items.length; i++) {
        li_Array.push(queries_ol_items[i]);
        li_play_Array.push(list_items_play_Btn[i]);
        li_remove_Array.push(list_items_remove_Btn[i]);
    }
    // get selected element index
    for (let i = 0; i < queries_ol_items.length; i++) {
        list_items_play_Btn[i].addEventListener('click', (e) => {
            let indexE45 = li_Array.indexOf(queries_ol_items[i]);
            if (indexE45 != -1) {
                index = indexE45;
                console.log('play ' + (index + 1));
                callback();
            }
        });
        list_items_remove_Btn[i].addEventListener('click', (e) => {
            let indexE46 = li_Array.indexOf(queries_ol_items[i]) + 1;
            document.getElementById('delete-song-div').style.display = 'block';
            document.getElementById('deleteSongIndex').value = indexE46;
        });
    }

}

function getThingsDone() {
    loadNextbyID(index);
    setThumbnail(index);
    openOwnerSource(index);
    copySongUrl(index);
    copyOwnerUrl(index);
    shareSong(index);
    manageQueriesList(index);
}

function reactOnController(item1, item2) {
    if (item1.style.display != "none") {
        item1.style.display = "none";
        item2.style.display = "block"
    }
    else {
        item1.style.display = "block";
        item2.style.display = "none"
    }
}

function volume() {
    let value = song_volume.value;
    // song.volume = value;
    player.setVolume(volume = value);
}

function rangeJump() {
    let value = song_range.value;
    let jumpValue = player.getDuration() * value / 100;
    // player.getCurrentTime() = jumpValue;
    player.seekTo(seconds = jumpValue, allowSeekAhead = true);
    playVideo();
}

function shareSong(index) {
    let share_song = document.getElementById('share-song');
    share_song.addEventListener('click', event => {
        if (navigator.share) {
            navigator.share({
                title: 'YukiRythem Song Share',
                url: songURLs[index],
                text: 'Your friend shared a song with you <3!'
            }).then(() => {
                console.log('Thanks for sharing!');
            })
                .catch(console.error);
        }
        // else {
        //     hearth.style.backgroundColor = 'red'
        // }
    });

}

function copySongUrl(index) {
    let copy_songUrl = document.getElementById('copy-songUrl');
    copy_songUrl.addEventListener('click', (e) => {
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(songURLs[index]);
        if (songURLs[index] != "") {
            copie.classList.add('show');
            setInterval(() => {
                copie.classList.remove('show');
            }, 3000);
        }
    })


}

function copyOwnerUrl(index) {
    let copy_ownerUrl = document.getElementById('copy-ownerUrl');
    copy_ownerUrl.addEventListener('click', (e) => {
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(ownerURLs[index]);
        if (songURLs[index] != "") {
            copie.classList.add('show');
            setInterval(() => {
                copie.classList.remove('show');
            }, 3000);
        }
    });

}

function openOwnerSource(index) {
    document.querySelector('.container .article .main-controller .song-info .song-owner a').href = ownerURLs[index];
};

function setThumbnail(index) {
    document.getElementById("thumbnail").src = songThumbnails[index];
};

function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    let hrs = ~~(duration / 3600);
    let mins = ~~((duration % 3600) / 60);
    let secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function setTime() {
    let songDurationSec = fancyTimeFormat(player.getDuration());
    let songCurrentSec = fancyTimeFormat(player.getCurrentTime());

    let mediaTime = songCurrentSec + '-' + songDurationSec;
    song_timer.innerHTML = mediaTime;

    song_range.value = MediaSecPercent();
};

function MediaSecPercent() {
    return (player.getCurrentTime() * 100) / player.getDuration();
}





