const fetchJSON = (url) => {
    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';

        xhr.onload = () => {
            var status = xhr.status;
            if(status === 200) {
                resolve(xhr.response);
            } else {
                resolve(null);
            }
        };

        xhr.send();
    });
};

function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

window.onscroll = function() {
    if(window.pageYOffset > sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
};
