var CurrencyObject;
var preferredCurrency;
var children=[];
var observer;
var subscribable = {
    subscribedObjects: [],
    subscribe: (convertableObject)=>{
        this.subscribedObjects.push(convertableObject); 
    },
    notifyAllSubscribed: (currencyCode)=>{
        for(var i = 0, length = this.subscribedObjects.length;i<length;i++){
            var object = this.subscribedObjects[i];
            if(CurrencyObject[object.iAtTheTime].code == currencyCode){
                embedInWebsite(object,object.element);
            }
        }
    },
};
function init(){
    browser.runtime.sendMessage({
        getCurrencies:true
    }).then((currencies)=>{
        CurrencyObject = currencies.response;
        browser.storage.local.get("preferredCurrency").then((res)=>{
            elements = document.body.getElementsByTagName("*");
            preferredCurrency = res.preferredCurrency;
            for(var i = 0,length = elements.length;i<length;i++){
                if(elements[i].children.length==0 && elements[i].tagName != "SCRIPT"){
                    children.push(elements[i]);
                }
            }
            start(children);
        
        
        },()=>{
            console.log("error occured");
        });
    },()=>{
        console.log("error occured");
    });
}
function initObserver(){
    if(CurrencyObject == undefined){
        browser.runtime.sendMessage({
            getCurrencies:true,
        }).then((currencies)=>{
            CurrencyObject = currencies.response;
            if(preferredCurrency == undefined){
                browser.storage.local.get("preferredCurrency").then((res)=>{
                    preferredCurrency = res.preferredCurrency;

                    var body = document.getElementsByTagName("body");
                    var config = {childList:true,subtree:true};
                    observer = new MutationObserver((mutationsList,observable)=>{
                        for(var mutation of mutationsList) {
                            if(mutation.addedNodes.length != 0){
                                for(var addedNode of mutation.addedNodes){
                                    if(addedNode.children !== undefined){
                                        var node = addedNode.getElementsByTagName("*");
                                        var nodeChildren = [];
                                        for(var j = 0,addedLength = node.length;j<addedLength;j++){
                                            if(node[j].children.length == 0 && node[j].tagName != "SCRIPT"){
                                                nodeChildren.push(node[j]);
    
                                            }
                                        }
                                        start(nodeChildren);
                                    }
                                    
                                }
                            }
                        }
                    });
                    observer.observe(body[0],config);
                });
            }
        });
    }
}

if(document.readyState !== "complete"){
    window.addEventListener("load",function load(event){
        window.removeEventListener("load",load,false);
        init();
        
        initObserver();
    },false);
}
else{
    init();
    initObserver();
    
}
function start(nodeToCheck){
    var value;
    var precompiledRegex = /[A-Za-z0-9]/;
    for(var i = 0,length = CurrencyObject.length-2;i<length;i++){
        if(CurrencyObject[i].code == preferredCurrency){
            continue;
        }
        for(var j = 0,childLength = nodeToCheck.length;j<childLength;j++){
            var SymbolPosition = nodeToCheck[j].textContent.indexOf(CurrencyObject[i].symbol);
            //if the checked symbol exists(and therefore function doesn't return -1),
            //check if there is a number around the symbol
            while(SymbolPosition !== -1){
                value = checkForNumbers(SymbolPosition,nodeToCheck[j]);
                //check input for dots or spaces only
                if(value !== "" && precompiledRegex.test(value)){
                    //save the state of variables so i can use them later in the callback
                    var convertableObject = {
                        iAtTheTime: i,
                        indexofSymbol: SymbolPosition,
                        CurrencyString : value,
                        element:nodeToCheck[j]
                    };

                    if(CurrencyObject[convertableObject.iAtTheTime].value === 0 && CurrencyObject[i].isBeingChecked){
                        subscribable.subscribe(convertableObject);
                    }
                    else if(CurrencyObject[convertableObject.iAtTheTime].value !== 0){
                        embedInWebsite(convertableObject,nodeToCheck[j]);

                    }
                    else{
                        CurrencyObject[i].isBeingChecked = true;
                        checkCurrencyValue("https://free.currencyconverterapi.com/api/v6/convert?q="+ CurrencyObject[convertableObject.iAtTheTime].code+"_"+preferredCurrency+"&compact=y",JSON.stringify(convertableObject),(response,object)=>{
                            object = JSON.parse(object);
                            var CurrencyValue = JSON.parse(response)[CurrencyObject[object.iAtTheTime].code+"_"+preferredCurrency].val;
                            var iOfMatchingObject = checkVariablesForMatchingObjects(CurrencyObject[object.iAtTheTime].code);
                            CurrencyObject[iOfMatchingObject].value = CurrencyValue;
                            browser.runtime.sendMessage({"iOfObject":iOfMatchingObject,"valueOfCurrency": CurrencyValue});
                            //this doesn't need to be sent to background since it's going to be on only for a short period of time
                            CurrencyObject[object.iAtTheTime].isBeingChecked = false;

                            embedInWebsite(object,nodeToCheck[j]);
                            subscribable.notifyAllSubscribed(CurrencyObject[object.iAtTheTime].code);
                        });

                    }
                }
                //there may be more symbols in the website, proceed with the start of the last one
                SymbolPosition = nodeToCheck[j].textContent.indexOf(CurrencyObject[i].symbol,SymbolPosition+CurrencyObject[i].symbol.length);            
            } 
        }
        
    }
}

function embedInWebsite(convertableObject,element){
    var converted = '('+(parseFloat(convertableObject.CurrencyString)* CurrencyObject[convertableObject.iAtTheTime].value).toFixed(2)+preferredCurrency+')';
    element.textContent = element.textContent.substr(0,convertableObject.indexofSymbol+convertableObject.CurrencyString.length+1)+converted+element.textContent.substr(convertableObject.indexofSymbol+convertableObject.CurrencyString.length+1);
}

function checkVariablesForMatchingObjects(code){
    for(var i = 0, length = CurrencyObject.length;i<length;i++){
        if(CurrencyObject[i].code == code){
            //return the place in array where the object is stored
            return i;
        }
    }

}
function checkForNumbers(position,element){
    //start with checking if there are numbers in front of the symbol
    //if there are none, and the variable is still empty
    //try backward
    var CurrencyVal = "", checkedBackwards = false;
    CurrencyVal = checkAroundSymbol(1,position,element);
    //try checking backwards around the symbol
    if(CurrencyVal == ""){
        CurrencyVal = checkAroundSymbol(-1,position,element);
        checkedBackwards = true;
    }
    if(checkedBackwards){
        return CurrencyVal.split("").reverse().join("");
    }
    else{
        return CurrencyVal;
    }
}

function checkAroundSymbol(toMoveKoeficient,position,element){
    var isANumber = true, StringPosForward = position, CurrencyValue = "";
    while(isANumber){
        StringPosForward += toMoveKoeficient;
        if(!isNaN(element.textContent[StringPosForward]) || element.textContent[StringPosForward] == '.'||element.textContent[StringPosForward] == ","){
            CurrencyValue += element.textContent[StringPosForward];
            
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


