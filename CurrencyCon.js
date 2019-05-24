var CurrencyObject;
var preferredCurrency;
var children=[];
var observer;
var subscribable = {
    subscribedObjects: [],
    subscribe: function(convertableObject){
        this.subscribedObjects.push(convertableObject); 
    },
    notifyAllSubscribed: function(currencyCode){
        for(var i = 0, length = this.subscribedObjects.length;i<length;i++){
            if(CurrencyObject[this.subscribedObjects[i].iAtTheTime].code == currencyCode){
                embedInWebsite(this.subscribedObjects[i],this.subscribedObjects[i].element);
			}
			
		}
		subscribedObjects = [];
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
                if(elements[i].children.length===0 && elements[i].tagName != "SCRIPT" && elements[i].tagName !="LINK" && elements[i].tagName != "IFRAME" && elements[i].tagName != "svg" && elements[i].tagName != "symbol" && elements[i].tagName != "path" && elements[i].tagName != "IMG"){
                    children.push(elements[i]);
                }
            }
            start(children);
		});
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
                    observer = new MutationObserver((mutationsList,_)=>{
                        for(var i=0;i<mutationsList.length;i++) {
                            if(mutationsList[i].addedNodes.length != 0){
                                for(var addedNode of mutationsList[i].addedNodes){
                                    if(addedNode.children !== undefined){
                                        var node = addedNode.getElementsByTagName("*");
                                        var nodeChildren = [];
                                        for(var j = 0,addedLength = node.length;j<addedLength;j++){
                                            if(node[j].children.length == 0 && node[j].tagName != "SCRIPT" && elements[i].tagName !="LINK" && elements[i].tagName != "IFRAME" && elements[i].tagName != "svg" && elements[i].tagName != "symbol" && elements[i].tagName != "path" && elements[i].tagName != "IMG"){
                                                nodeChildren.push(node[j]);
                                            }
                                        }
                                        start(nodeChildren);
                                    }
                                    
                                }
                            }
                        }
                    });
                    observer.observe(document.body,{childList:true,subtree:true});
                });
            }
        });
    }
}

if(document.readyState !== "complete"){
    window.addEventListener("load",function load(event){
		//window.removeEventListener("DOMContentLoaded",load,false);
		
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
    var precompiledRegex = /[0-9A-Z]/i;
    for(var i = 0,length = CurrencyObject.length-2;i<length;i++){
        if(CurrencyObject[i].code === preferredCurrency){
            continue;
        }
        for(var j = 0;j<nodeToCheck.length;j++){
            var SymbolPosition = nodeToCheck[j].textContent.indexOf(CurrencyObject[i].symbol);
            //if the checked symbol exists(and therefore function doesn't return -1),
            //check if there is a number around the symbol
            while(SymbolPosition !== -1){
                value = checkForNumbers(SymbolPosition,nodeToCheck[j]);
				//check input for dots or spaces only
				//im don't really need regex because im checking for numbers in checkAroundSymbol
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
                        checkCurrencyValue("https://free.currconv.com/api/v7/convert?q="+ CurrencyObject[convertableObject.iAtTheTime].code+"_"+preferredCurrency+"&compact=ultra&apiKey=6294a7e98205235528ff",Object.assign({},convertableObject),(response,object)=>{
                            var CurrencyValue = response[CurrencyObject[object.iAtTheTime].code+"_"+preferredCurrency];
                            CurrencyObject[object.iAtTheTime].value = CurrencyValue;
                            browser.runtime.sendMessage({"iOfObject":object.iAtTheTime,"valueOfCurrency": CurrencyValue})
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
function checkForNumbers(position,element){
    //start with checking if there are numbers in front of the symbol
    //if there are none, and the variable is still empty
    //try backward
    var CurrencyVal = "", checkedBackwards = false;
    CurrencyVal = checkAroundSymbol(1,position,element);
    //try checking backwards around the symbol
    if(CurrencyVal === ""){
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
        if(!isNaN(element.textContent[StringPosForward]) || element.textContent[StringPosForward] === '.'||element.textContent[StringPosForward] === ","){
            CurrencyValue += element.textContent[StringPosForward];
            
        }
        else{
            isANumber = false;
        }
    }
    return CurrencyValue;
}
function checkCurrencyValue(url,object,callback){
	fetch(url).then((textVal)=>{
		return textVal.json();
	}).then((value)=>{
		callback(value,object);
	}).catch((err)=>{
		console.log(err);
	});
}
