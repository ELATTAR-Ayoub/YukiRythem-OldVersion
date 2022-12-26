const backToPlayerLink = document.getElementById('backToPlayerLink');

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        setTimeout(() => {
            backToPlayerLink.click();
        }, 3000);
    }
};