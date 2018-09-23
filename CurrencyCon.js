window.onload = function(){
    browser.runtime.sendMessage({
        DOM:document.body.innerHTML
    }).then(function(alteredHTML){
        console.log("recieved");
        document.body.innerHTML = alteredHTML.response;
    },
    function(){
        console.log("error occured");
    });
};