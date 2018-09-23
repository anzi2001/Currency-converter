var select;
browser.runtime.sendMessage({
    getCurrencies:true
}).then(function(response){
    select = document.getElementById("currencies");
    for(var i = 0,length = response.response.length;i<length;i++){
        var option = document.createElement("option");
        option.text = response.response[i].code;
        select.add(option);
    }
}); 
document.addEventListener("click",function(e){
    
});