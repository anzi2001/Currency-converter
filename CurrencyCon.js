var jsonObject; 
var alteredHTML;
window.onload = function(){
    var value;
    alteredHTML = this.document.body.innerHTML;
    var subscribable = {
        subscribedObjects: [],
        subscribe: function(convertableObject){
            this.subscribedObjects[this.subscribedObjects.length] = convertableObject; 
        },
        notifyAllSubscribed: function(currencyCode){
            for(var i = 0, length = this.subscribedObjects.length;i<length;i++){
                if(jsonObject[this.subscribedObjects[i].iAtTheTime].code == currencyCode){
                    embedInWebsite(this.subscribedObjects[i]);
                }
            }
            this.insertIntoWebpage(alteredHTML);
        },
        insertIntoWebpage: function(html){
            window.document.body.innerHTML = html;
        }
    };
    /*var convertableObject = {
        iAtTheTime: i,
        indexofSymbol: SymbolPosition,
        CurrencyString : value,
    };*/
    //loop all of the symbols
    for(var i = 0,length = jsonObject.length;i<length;i++){
        var SymbolPosition = alteredHTML.indexOf(jsonObject[i].symbol);
        //if the checked symbol exists(and therefore function doesn't return -1),
        //check if there is a number around the symbol
        while(SymbolPosition !== -1){
            value = checkForNumbers(SymbolPosition);
            //check input for dots or spaces only
            if(value !== "" && value !== "/^\\s+/" && value !== "^\\.+"){
                //save the state of variables so i can use them later in the callback
                var convertableObject = {
                    iAtTheTime: i,
                    indexofSymbol: SymbolPosition,
                    CurrencyString : value,
                };
                /*convertableObject.iAtTheTime = i;
                convertableObject.indexofSymbol = SymbolPosition;
                convertableObject.CurrencyString = value;*/

                if(jsonObject[convertableObject.iAtTheTime].value === 0 && jsonObject[i].isBeingChecked){
                    subscribable.subscribe(convertableObject);
                }
                else if(jsonObject[convertableObject.iAtTheTime].value !== 0){
                    embedInWebsite(convertableObject);
                    subscribable.insertIntoWebpage(alteredHTML);
                }
                else{
                    jsonObject[i].isBeingChecked = true;
                    checkCurrencyValue("https://free.currencyconverterapi.com/api/v6/convert?q=".concat(jsonObject[convertableObject.iAtTheTime].code,"_EUR&compact=y"),convertableObject,function(response,object){
                        alert(JSON.parse(response)[jsonObject[object.iAtTheTime].code+"_EUR"].val);
                        jsonObject[checkVariablesForMatchingObjects(jsonObject[object.iAtTheTime].code)].CurrencyString = JSON.parse(response)[jsonObject[object.iAtTheTime].code.concat("_EUR")].val;
                        jsonObject[object.iAtTheTime].isBeingChecked = false;

                        embedInWebsite(object);
                        subscribable.notifyAllSubscribed(jsonObject[object.iAtTheTime].code);
                    });
                }
            }
            //there may be more symbols in the website, proceed with the start of the last one
            SymbolPosition = alteredHTML.indexOf(jsonObject[i].symbol,SymbolPosition+jsonObject[i].symbol.length);            
        } 
    }
};

function embedInWebsite(convertableObject){
    var convertedCurrencyValue = Number(convertableObject.CurrencyString) * jsonObject[convertableObject.iAtTheTime].value;
    var convertedConcat = '('.concat(convertedCurrencyValue,"EUR",')');
    alteredHTML = alteredHTML.substr(0,convertableObject.indexofSymbol + convertedConcat.length) + convertedConcat + alteredHTML.substr(convertableObject.indexofSymbol+convertedConcat.length*2);
}

function checkVariablesForMatchingObjects(code){
    for(var i = 0, length = jsonObject.length;i<length;i++){
        if(jsonObject[i].code == code){
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
        if(!isNaN(alteredHTML[StringPosForward]) || alteredHTML[StringPosForward] == '.' || alteredHTML[StringPosForward] == ','){
            if(alteredHTML[StringPosForward == ',']){
                CurrencyValue += alteredHTML[StringPosForward].replace(',','.');
            }
            else{
                CurrencyValue += alteredHTML[StringPosForward];
            }
            
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
var jsonObject = [
    {
		"isBeingChecked":false,
        "symbol": "$",
		"value" : 0,
        "symbol_native": "$",
        "code": "USD",
    },
    {
		"isBeingChecked":false,
        "symbol": "CA$",
		"value" : 0,
        "symbol_native": "$",
        "code": "CAD",
    },
    {
		"isBeingChecked":false,
        "symbol": "€",
		"value" : 0,
        "symbol_native": "€",
        "code": "EUR",
    },
    {
		"isBeingChecked":false,
        "symbol": "Af",
		"value" : 0,
        "symbol_native": "؋",
        "code": "AFN"
    },
    {
		"isBeingChecked":false,
        "symbol": "ALL",
		"value" : 0,
        "symbol_native": "Lek",
        "code": "ALL",    
    },
    {
		"isBeingChecked":false,
        "symbol": "AMD",
		"value" : 0,
        "symbol_native": "դր.",      
        "code": "AMD",
    },
    {
		"isBeingChecked":false,
        "symbol": "AR$",
		"value" : 0,
        "symbol_native": "$",          
        "code": "ARS",          
    },
    {
		"isBeingChecked":false,
        "symbol": "AU$",
		"value" : 0,
        "symbol_native": "$",                  
        "code": "AUD",          
    },
    {
		"isBeingChecked":false,
        "symbol": "man.",
		"value" : 0,
        "symbol_native": "ман.",                   
        "code": "AZN",          
    },
    {
		"isBeingChecked":false,
        "symbol": "KM",
		"value" : 0,
        "symbol_native": "KM",                   
        "code": "BAM",         
    },
    {
		"isBeingChecked":false,
        "symbol": "Tk",
		"value" : 0,
        "symbol_native": "৳",                 
        "code": "BDT",         
    },
    {
		"isBeingChecked":false,
        "symbol": "BGN",
		"value" : 0,
        "symbol_native": "лв.", 
        "code": "BGN", 
    },
    {
		"isBeingChecked":false,
        "symbol": "FBu",
		"value" : 0,
        "symbol_native": "FBu",   
        "code": "BIF",
    },
    {
		"isBeingChecked":false,
        "symbol": "BN$",
		"value" : 0,
        "symbol_native": "$",
        "code": "BND",
    },
    {
		"isBeingChecked":false,
        "symbol": "Bs",
		"value" : 0,
        "symbol_native": "Bs",
        "code": "BOB",
    },
    {
		"isBeingChecked":false,
        "symbol": "R$",
		"value" : 0,
        "symbol_native": "R$",
        "code": "BRL",
    },
    {
		"isBeingChecked":false,
        "symbol": "BWP",
		"value" : 0,
        "symbol_native": "P",    
        "code": "BWP",
    },
    {
		"isBeingChecked":false,
        "symbol": "BYR",
		"value" : 0,
        "symbol_native": "BYR",
        "code": "BYR",
    },
    {
		"isBeingChecked":false,
        "symbol": "BZ$",
		"value" : 0,
        "symbol_native": "$",
        "code": "BZD",
    },
    {
		"isBeingChecked":false,
        "symbol": "CDF",
		"value" : 0,
        "symbol_native": "FrCD",
        "code": "CDF",
    },
    {
		"isBeingChecked":false,
        "symbol": "CHF",
		"value" : 0,
        "symbol_native": "CHF",
        "code": "CHF",
    },
    {
		"isBeingChecked":false,
        "symbol": "CL$",
		"value" : 0,
        "symbol_native": "$",
        "code": "CLP",
    },
    {
		"isBeingChecked":false,
        "symbol": "CN¥",
		"value" : 0,
        "symbol_native": "CN¥",
        "code": "CNY",
    },
    {
		"isBeingChecked":false,
        "symbol": "CO$",
		"value" : 0,
        "symbol_native": "$",
        "code": "COP",
    },
    {
		"isBeingChecked":false,
        "symbol": "₡",
		"value" : 0,
        "symbol_native": "₡",
        "code": "CRC",
    },
    {
		"isBeingChecked":false,
        "symbol": "CV$",
		"value" : 0,
        "symbol_native": "CV$",
        "code": "CVE",
    },
    {
		"isBeingChecked":false,
        "symbol": "Kč",
		"value" : 0,
        "symbol_native": "Kč",
        "code": "CZK",
    },
    {
		"isBeingChecked":false,
        "symbol": "Fdj",
		"value" : 0,
        "symbol_native": "Fdj",
        "code": "DJF",
    },
    {
		"isBeingChecked":false,
        "symbol": "Dkr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "DKK",
    },
    {
		"isBeingChecked":false,
        "symbol": "RD$",
		"value" : 0,
        "symbol_native": "RD$",
        "code": "DOP",
    },
    {
		"isBeingChecked":false,
        "symbol": "Ekr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "EEK",
    },
    {
		"isBeingChecked":false,
        "symbol": "Nfk",
		"value" : 0,
        "symbol_native": "Nfk",
        "code": "ERN",
    },
    {
		"isBeingChecked":false,
        "symbol": "Br",
		"value" : 0,
        "symbol_native": "Br",
        "code": "ETB",
    },
    {
		"isBeingChecked":false,
        "symbol": "£",
		"value" : 0,
        "symbol_native": "£",
        "code": "GBP",
    },
    {
		"isBeingChecked":false,
        "symbol": "GEL",
		"value" : 0,
        "symbol_native": "GEL",
        "code": "GEL",
    },
    {
		"isBeingChecked":false,
        "symbol": "GH₵",
		"value" : 0,
        "symbol_native": "GH₵",
        "code": "GHS",
    },
    {
		"isBeingChecked":false,
        "symbol": "FG",
		"value" : 0,
        "symbol_native": "FG",
        "code": "GNF",
    },
    {
		"isBeingChecked":false,
        "symbol": "GTQ",
		"value" : 0,
        "symbol_native": "Q",
        "code": "GTQ",
    },
    {
		"isBeingChecked":false,
        "symbol": "HK$",
		"value" : 0,
        "symbol_native": "$",
        "code": "HKD",
    },
    {
		"isBeingChecked":false,
        "symbol": "HNL",
		"value" : 0,
        "symbol_native": "L",
        "code": "HNL",
    },
    {
		"isBeingChecked":false,
        "symbol": "kn",
		"value" : 0,
        "symbol_native": "kn",
        "code": "HRK",
    },
    {
		"isBeingChecked":false,
        "symbol": "Ft",
		"value" : 0,
        "symbol_native": "Ft",
        "code": "HUF",
    },
    {
		"isBeingChecked":false,
        "symbol": "Rp",
		"value" : 0,
        "symbol_native": "Rp",
        "code": "IDR",
    },
    {
		"isBeingChecked":false,
        "symbol": "₪",
		"value" : 0,
        "symbol_native": "₪",
        "code": "ILS",
    },
    {
		"isBeingChecked":false,
        "symbol": "Rs",
		"value" : 0,
        "symbol_native": "টকা",
        "code": "INR",
    },
    {
		"isBeingChecked":false,
        "symbol": "IRR",
		"value" : 0,
        "symbol_native": "﷼",
        "code": "IRR",
    },
    {
		"isBeingChecked":false,
        "symbol": "Ikr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "ISK",
    },
    {
		"isBeingChecked":false,
        "symbol": "J$",
		"value" : 0,
        "symbol_native": "$",
        "code": "JMD",
    },
    {
		"isBeingChecked":false,
        "symbol": "¥",
		"value" : 0,
        "symbol_native": "￥",
        "code": "JPY",
    },
    {
		"isBeingChecked":false,
        "symbol": "Ksh",
		"value" : 0,
        "symbol_native": "Ksh",
        "code": "KES",
    },
    {
		"isBeingChecked":false,
        "symbol": "KHR",
		"value" : 0,
        "symbol_native": "៛",
        "code": "KHR",
    },
    {
		"isBeingChecked":false,
        "symbol": "CF",
		"value" : 0,
        "symbol_native": "FC",
        "code": "KMF",
    },
    {
		"isBeingChecked":false,
        "symbol": "₩",
		"value" : 0,
        "symbol_native": "₩",
        "code": "KRW",
    },
    {
		"isBeingChecked":false,
        "symbol": "KZT",
		"value" : 0,
        "symbol_native": "тңг.",
        "code": "KZT",
    },
    {
		"isBeingChecked":false,
        "symbol": "SLRs",
		"value" : 0,
        "symbol_native": "SL Re",
        "code": "LKR",
    },
    {
		"isBeingChecked":false,
        "symbol": "Lt",
		"value" : 0,
        "symbol_native": "Lt",
        "code": "LTL",
    },
    {
		"isBeingChecked":false,
        "symbol": "Ls",
		"value" : 0,
        "symbol_native": "Ls",
        "code": "LVL",
    },
    {
		"isBeingChecked":false,
        "symbol": "MDL",
		"value" : 0,
        "symbol_native": "MDL",
        "code": "MDL",
    },
    {
		"isBeingChecked":false,
        "symbol": "MGA",
		"value" : 0,
        "symbol_native": "MGA",
        "code": "MGA",
    },
    {
		"isBeingChecked":false,
        "symbol": "MKD",
		"value" : 0,
        "symbol_native": "MKD",
        "code": "MKD",
    },
    {
		"isBeingChecked":false,
        "symbol": "MMK",
		"value" : 0,
        "symbol_native": "K",
        "code": "MMK",
    },
    {
		"isBeingChecked":false,
        "symbol": "MOP$",
		"value" : 0,
        "symbol_native": "MOP$",
        "code": "MOP",
    },
    {
		"isBeingChecked":false,
        "symbol": "MURs",
		"value" : 0,
        "symbol_native": "MURs",
        "code": "MUR",
    },
    {
		"isBeingChecked":false,
        "symbol": "MX$",
		"value" : 0,
        "symbol_native": "$",
        "code": "MXN",
    },
    {
		"isBeingChecked":false,
        "symbol": "RM",
		"value" : 0,
        "symbol_native": "RM",
        "code": "MYR",
    },
    {
		"isBeingChecked":false,
        "symbol": "MTn",
		"value" : 0,
        "symbol_native": "MTn",
        "code": "MZN",
    },
    {
		"isBeingChecked":false,
        "symbol": "N$",
		"value" : 0,
        "symbol_native": "N$",
        "code": "NAD",
    },
    {
		"isBeingChecked":false,
        "symbol": "₦",
		"value" : 0,
        "symbol_native": "₦",
        "code": "NGN",
    },
    {
		"isBeingChecked":false,
        "symbol": "C$",
		"value" : 0,
        "symbol_native": "C$",
        "code": "NIO",
    },
    {
		"isBeingChecked":false,
        "symbol": "Nkr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "NOK",
    },
    {
		"isBeingChecked":false,
        "symbol": "NPRs",
		"value" : 0,
        "symbol_native": "नेरू",
        "code": "NPR",
    },
    {
		"isBeingChecked":false,
        "symbol": "NZ$",
		"value" : 0,
        "symbol_native": "$",
        "code": "NZD",
    },
    {
		"isBeingChecked":false,
        "symbol": "B/.",
		"value" : 0,
        "symbol_native": "B/.",
        "code": "PAB",
    },
    {
		"isBeingChecked":false,
        "symbol": "S/.",
		"value" : 0,
        "symbol_native": "S/.",
        "code": "PEN",
    },
    {
		"isBeingChecked":false,
        "symbol": "₱",
		"value" : 0,
        "symbol_native": "₱",
        "code": "PHP",
    },
    {
		"isBeingChecked":false,
        "symbol": "PKRs",
		"value" : 0,
        "symbol_native": "₨",
        "code": "PKR",
    },
    {
		"isBeingChecked":false,
        "symbol": "zł",
		"value" : 0,
        "symbol_native": "zł",
        "code": "PLN",
    },
    {
		"isBeingChecked":false,
        "symbol": "₲",
		"value" : 0,
        "symbol_native": "₲",
        "code": "PYG",
    },
    {
		"isBeingChecked":false,
        "symbol": "RON",
		"value" : 0,
        "symbol_native": "RON",
        "code": "RON",
    },
    {
		"isBeingChecked":false,
        "symbol": "din.",
		"value" : 0,
        "symbol_native": "дин.",
        "code": "RSD",
    },
    {
		"isBeingChecked":false,
        "symbol": "RUB",
		"value" : 0,
        "symbol_native": "руб.",
        "code": "RUB",
    },
    {
		"isBeingChecked":false,
        "symbol": "RWF",
		"value" : 0,
        "symbol_native": "FR",
        "code": "RWF",
    },
    {
		"isBeingChecked":false,
        "symbol": "SDG",
		"value" : 0,
        "symbol_native": "SDG",
        "code": "SDG",
    },
    {
		"isBeingChecked":false,
        "symbol": "Skr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "SEK",
    },
    {
		"isBeingChecked":false,
        "symbol": "S$",
		"value" : 0,
        "symbol_native": "$",
        "code": "SGD",
    },
    {
		"isBeingChecked":false,
        "symbol": "Ssh",
		"value" : 0,
        "symbol_native": "Ssh",
        "code": "SOS",
    },
    {
		"isBeingChecked":false,
        "symbol": "฿",
		"value" : 0,
        "symbol_native": "฿",
        "code": "THB",
    },
    {
		"isBeingChecked":false,
        "symbol": "T$",
		"value" : 0,
        "symbol_native": "T$",
        "code": "TOP",
    },
    {
		"isBeingChecked":false,
        "symbol": "TL",
		"value" : 0,
        "symbol_native": "TL",
        "code": "TRY",
    },
    {
		"isBeingChecked":false,
        "symbol": "TT$",
		"value" : 0,
        "symbol_native": "$",
        "code": "TTD",
    },
    {
		"isBeingChecked":false,
        "symbol": "NT$",
		"value" : 0,
        "symbol_native": "NT$",
        "code": "TWD",
    },
    {
		"isBeingChecked":false,
        "symbol": "TSh",
		"value" : 0,
        "symbol_native": "TSh",
        "code": "TZS",
    },
    {
		"isBeingChecked":false,
        "symbol": "₴",
		"value" : 0,
        "symbol_native": "₴",
        "code": "UAH",
    },
    {
		"isBeingChecked":false,
        "symbol": "USh",
		"value" : 0,
        "symbol_native": "USh",
        "code": "UGX",
    },
    {
		"isBeingChecked":false,
        "symbol": "$U",
		"value" : 0,
        "symbol_native": "$",
        "code": "UYU",
    },
    {
		"isBeingChecked":false,
        "symbol": "UZS",
		"value" : 0,
        "symbol_native": "UZS",
        "code": "UZS",
    },
    {
		"isBeingChecked":false,
        "symbol": "Bs.F.",
		"value" : 0,
        "symbol_native": "Bs.F.",
        "code": "VEF",
    },
    {
		"isBeingChecked":false,
        "symbol": "₫",
		"value" : 0,
        "symbol_native": "₫",
        "code": "VND",
    },
    {
		"isBeingChecked":false,
        "symbol": "FCFA",
		"value" : 0,
        "symbol_native": "FCFA",
        "code": "XAF",
    },
    {
		"isBeingChecked":false,
        "symbol": "CFA",
		"value" : 0,
        "symbol_native": "CFA",
        "code": "XOF",
    },
    {
		"isBeingChecked":false,
        "symbol": "R",
		"value" : 0,
        "symbol_native": "R",
        "code": "ZAR",
    },
    {
		"isBeingChecked":false,
        "symbol": "ZK",
		"value" : 0,
        "symbol_native": "ZK",
        "code": "ZMK",
    }
];