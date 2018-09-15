var CurrencyObject; 
var alteredHTML;
window.onload = function(){
    var value;
    alteredHTML = this.document.body.innerHTML;
    alteredHTML.replace(/^\s*\n/gm, "");
    var subscribable = {
        subscribedObjects: [],
        subscribe: function(convertableObject){
            this.subscribedObjects[this.subscribedObjects.length] = convertableObject; 
        },
        notifyAllSubscribed: function(currencyCode){
            for(var i = 0, length = this.subscribedObjects.length;i<length;i++){
                if(CurrencyObject[this.subscribedObjects[i].iAtTheTime].code == currencyCode){
                    embedInWebsite(this.subscribedObjects[i]);
                }
            }
            this.insertIntoWebpage();
        },
        insertIntoWebpage: function(){
            window.document.body.innerHTML = alteredHTML;
        }
    };
    browser.runtime.sendMessage({init:true}).then(function(jsonObject){
        if(jsonObject !== undefined){
            CurrencyObject = jsonObject;
            start();
        }
    });
    function start(){
        for(var i = 0,length = CurrencyObject.length-2;i<length;i++){
            var SymbolPosition = alteredHTML.indexOf(CurrencyObject[i].symbol);
            //if the checked symbol exists(and therefore function doesn't return -1),
            //check if there is a number around the symbol
            while(SymbolPosition !== -1){
                value = checkForNumbers(SymbolPosition);
                //check input for dots or spaces only
                if(value !== "" && !/^\s+/.test(value) && !/^\.+/.test(value)){
                    //save the state of variables so i can use them later in the callback
                    var convertableObject = {
                        iAtTheTime: i,
                        indexofSymbol: SymbolPosition,
                        CurrencyString : value,
                    };
                    /*convertableObject.iAtTheTime = i;
                    convertableObject.indexofSymbol = SymbolPosition;
                    convertableObject.CurrencyString = value;*/
    
                    if(CurrencyObject[convertableObject.iAtTheTime].value === 0 && CurrencyObject[i].isBeingChecked){
                        subscribable.subscribe(convertableObject);
                    }
                    else if(CurrencyObject[convertableObject.iAtTheTime].value !== 0){
                        embedInWebsite(convertableObject);
                        
                    }
                    else{
                        CurrencyObject[i].isBeingChecked = true;
                        checkCurrencyValue("https://free.currencyconverterapi.com/api/v6/convert?q=".concat(CurrencyObject[convertableObject.iAtTheTime].code,"_EUR&compact=y"),JSON.stringify(convertableObject),function(response,object){
                            object = JSON.parse(object);
                            var CurrencyValue = JSON.parse(response)[CurrencyObject[object.iAtTheTime].code.concat("_EUR")].val;
                            var iOfMatchingObject = checkVariablesForMatchingObjects(CurrencyObject[object.iAtTheTime].code);
                            CurrencyObject[iOfMatchingObject].value = CurrencyValue;
                            browser.runtime.sendMessage({"iOfObject":iOfMatchingObject,"valueOfCurrency": CurrencyValue});

                            //this doesn't need to be sent to background since it's going to be on only for a short period of time
                            CurrencyObject[object.iAtTheTime].isBeingChecked = false;
    
                            embedInWebsite(object);
                            subscribable.notifyAllSubscribed(CurrencyObject[object.iAtTheTime].code);
                        });
                    }
                }
                //there may be more symbols in the website, proceed with the start of the last one
                SymbolPosition = alteredHTML.indexOf(CurrencyObject[i].symbol,SymbolPosition+CurrencyObject[i].symbol.length);            
            } 
        }
        subscribable.insertIntoWebpage();
    }
};

function embedInWebsite(convertableObject){
    var convertedCurrencyValue ='('+Number(convertableObject.CurrencyString) * CurrencyObject[convertableObject.iAtTheTime].value+" EUR)";
    alteredHTML = alteredHTML.substr(0,convertableObject.indexofSymbol) + convertedCurrencyValue + alteredHTML.substr(convertableObject.indexofSymbol+convertedCurrencyValue.length);
}

function checkVariablesForMatchingObjects(code){
    for(var i = 0, length = CurrencyObject.length;i<length;i++){
        if(CurrencyObject[i].code == code){
            //return the place in array where the object is stored
            return i;
        }
    }

}
function checkForNumbers(position){
    //start with checking if there are numbers in front of the symbol
    //if there are none, and the variable is still empty
    //try backwards
    var CurrencyVal = "", checkedBackwards = false;
    CurrencyVal = checkAroundSymbol(1,position);
    //try checking backwards around the symbol
    if(CurrencyVal == ""){
        CurrencyVal = checkAroundSymbol(-1,position);
        checkedBackwards = true;
    }
    if(checkedBackwards){
        return CurrencyVal.split("").reverse().join("");
    }
    else{
        return CurrencyVal;
    }
}
function checkAroundSymbol(toMoveKoeficient,position){
    var isANumber = true, StringPosForward = position, CurrencyValue = "";
    while(isANumber){
        StringPosForward += toMoveKoeficient;
        if(!isNaN(alteredHTML[StringPosForward]) || alteredHTML[StringPosForward] == '.'){
            CurrencyValue += alteredHTML[StringPosForward];
            
        }
        else{
            isANumber = false;
        }
    }
    return CurrencyValue;
}
function checkCurrencyValue(url,object,callback){
    let xhttpReq = new XMLHttpRequest();

    xhttpReq.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            callback(xhttpReq.responseText,object);
        }
    };
    xhttpReq.open("GET",url,true);
    xhttpReq.send();
}
