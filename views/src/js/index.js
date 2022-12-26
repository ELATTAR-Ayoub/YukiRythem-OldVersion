// inputs
const queries_opener_xSign = document.getElementById('queries-opener-x-Sign');
const queries_opener_vSign = document.getElementById('queries-opener-v-Sign');
const header_menu = document.getElementById('header-menu');
const header_menu_content = document.getElementById('header-menu-content');
const remove_song_btn = document.getElementById('remove-song-btn');
const remove_all_btn = document.getElementById('remove-all-btn');
const delete_song_div = document.getElementById('delete-song-div');
const remove_all_div = document.getElementById('remove-all-div');
const hide_warning = document.getElementById('hide-warning');
const queries_list_div = document.getElementsByClassName('queries-list')[0];
const navMenu_btn = document.getElementById('OpenSideNav-btn');
const sideNav = document.getElementById('sideNav');
const thumbnail_container = document.getElementById('thumbnail-container');
const closeNav_btn = document.getElementById('closeSideNav-btn');
const aside = document.querySelectorAll('aside');


// vars
var thumbWidth = thumbnail_container.style.width;
var thumbHeight = thumbnail_container.style.height;


user_input_form.addEventListener('submit', (e) => {
    let x = document.forms["user_input_form"]["musicSource"].value;
    if (x != "") {
        spiner.style.display = 'block';
        load_spiner.style.display = 'inline-block';
        default_thumbnail.style.display = 'none';

    }
});

header_menu.addEventListener('click', (e) => {
    header_menu_content.classList.toggle('show');
});

remove_song_btn.addEventListener('click', (e) => {
    if (delete_song_div.style.display == 'block') {
        delete_song_div.style.display = 'none';
    }
    else {
        delete_song_div.style.display = 'block';
    }
})

remove_all_btn.addEventListener('click', (e) => {
    remove_all_div.style.display = 'block';
});
hide_warning.addEventListener('click', (e) => {
    remove_all_div.style.display = 'none';
})

queries_opener.addEventListener("click", (e) => {

    if (queries.style.height == '70%') {
        setTimeout(() => {
            // document.querySelector('.queries-opener .popupComment').innerHTML = 'open queries';

        }, 500)
        queries_opener_vSign.style.display = 'block';
        queries_opener_xSign.style.display = 'none';
        queries.style.width = '0px';
        queries.style.height = '0px';
        // thumbnail_container.style.width = thumbWidth;
        // thumbnail_container.style.height = thumbHeight;
    }
    else {
        setTimeout(() => {
            // document.querySelector('.queries-opener .popupComment').innerHTML = 'close queries';

        }, 500)
        queries.style.width = '100%';
        queries.style.height = '70%';
        queries_opener_xSign.style.display = 'block';
        queries_opener_vSign.style.display = 'none';
        // thumbnail_container.style.width = '150px';
        // thumbnail_container.style.height = '150px';
    }
});




// sideBar Functions
navMenu_btn.addEventListener('click', (e) => {
    navMenu_btn.classList.toggle("rotateBaricn");
    if (navMenu_btn.classList.contains('rotateBaricn')) {
        openNav();
    }
    else {
        closeNav();
    }
});

closeNav_btn.addEventListener('click', (e) => {
    closeNav();
    navMenu_btn.classList.remove("rotateBaricn");
});

document.querySelector('main').addEventListener('click', (e) => {
    closeNav();
    navMenu_btn.classList.remove("rotateBaricn");
});
// sideBar Functions (end)

/* Set the width of the side navigation to 250px */
function openNav() {
    sideNav.style.width = "250px";
    // document.querySelector('main').style.marginLeft = "250px";
    // document.body.style.filter = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    sideNav.style.width = "0";
    // document.querySelector('main').style.marginLeft = "0";
}

function show(item1) {
    item1.classList.toggle('show');
}