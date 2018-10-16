var select,selectIndex;
var changed = false;
browser.runtime.sendMessage({
    getCurrencies:true
}).then(function(response){
    select = document.getElementById("currencies");
    for(var i = 0,length = response.response.length;i<length;i++){
        var option = document.createElement("option");
        option.text = response.response[i].code;
        select.add(option);
    }
    var indexStore  = browser.storage.local.get("preferredIndex");
    indexStore.then(function(res){
        select.selectedIndex = res.preferredIndex;
        selectIndex = res.preferredIndex;
    },function(){

    });
}); 
document.addEventListener("click",function(e){
    if(e.target.value == "save"){
        browser.storage.local.set({
            "preferredCurrency":select.options[select.selectedIndex].text,
            "preferredIndex":select.selectedIndex
        });
        if(changed){
            browser.runtime.sendMessage({
                resetValues: true
            });
        }
    }
});
document.addEventListener("change",function(e){
    if(e.target.selectedIndex != selectIndex){
        changed = true;
    }
});