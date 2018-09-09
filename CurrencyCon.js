var jsonObject; 
window.onload = function(){
    var storedNumbers = [];
    var value;
    checkCurrencyValue("https://free.currencyconverterapi.com/api/v6/convert?q=USD_PHP&compact=y",function(){});
    //loop all of the symbols
    for(var i = 0,length = jsonObject.length;i<length;i++){
        var SymbolPosition = document.body.innerText.indexOf(jsonObject[i].symbol);
        //if the checked symbol exists(and therefore function doesn't return -1)
        //check if there is a number around the symbol
        while(SymbolPosition !== -1){
            value = checkForNumbers(SymbolPosition,document.body.innerText);
            //check input for dots or spaces only
            if(value !== "" && value !== "/^\\s+/" && value !== "^\\.+"){
                var convertableObject = {
                    indexofSymbol: SymbolPosition,
                    CurrencyString : value,
                    symbolObject : jsonObject[i]
                };

                if(convertableObject.symbolObject.value !== 0){
                    var converted = Number(convertableObject.CurrencyString) * convertableObject.symbolObject.value;
                    var convertedConcat = '('.concat(converted,convertableObject.symbolObject.code,')');
                    var innerText = document.body.innerText;
                    document.body.innerText = innerText.substr(0,convertableObject.indexofSymbol) + convertedConcat + innerText.substr(convertableObject.indexofSymbol);
                }
                else{
                    checkCurrencyValue("https://free.currencyconverterapi.com/api/v6/convert?q=".concat(convertableObject.symbolObject.code,"_EUR&compact=y"),convertableObject,function(response,object){
                        alert(response[object.symbolObject.code+"_EUR.val"]);
                        jsonObject[checkVariablesForMatchingObjects(object.symbolObject.code)] = {
                            CurrencyString: response[object.symbolObject.code+"_EUR"].val,
                        };
                    });
                }
            }
            //there may be more symbols in the website, proceed with the start of the last one
            SymbolPosition = document.body.innerText.indexOf(jsonObject[i].symbol,SymbolPosition+jsonObject[i].symbol.length);            
        } 
    }
};

function checkVariablesForMatchingObjects(code){
    for(var i = 0, length = jsonObject.length;i<length;i++){
        if(jsonObject[i].code == code){
            //return the place in array where the object is stored
            return i;
        }
    }

}
function checkForNumbers(position, splitted){
    //start with checking if there are numbers in front of the symbol
    //if there are none, and the variable is still empty
    //try backwards
    var CurrencyVal = "", checkedBackwards = false;
    CurrencyVal = checkAroundSymbol(1,splitted,position);
    //try checking backwards around the symbol
    if(CurrencyVal == ""){
        CurrencyVal = checkAroundSymbol(-1,splitted,position);
        checkedBackwards = true;
    }
    if(checkedBackwards){
        return CurrencyVal.split("").reverse().join("");
    }
    else{
        return CurrencyVal;
    }
}
function checkAroundSymbol(toMoveKoeficient,splitted,position){
    var isANumber = true, StringPosForward = position, CurrencyValue = "";
    while(isANumber){
        StringPosForward += toMoveKoeficient;
        if(!isNaN(splitted[StringPosForward]) || splitted[StringPosForward] == '.' || splitted[StringPosForward] == ','){
            if(splitted[StringPosForward == ',']){
                CurrencyValue += splitted[StringPosForward].replace(',','.');
            }
            else{
                CurrencyValue += splitted[StringPosForward];
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
        "symbol": "$",
		"value" : 0,
        "symbol_native": "$",
        "code": "USD",
    },
    {
        "symbol": "CA$",
		"value" : 0,
        "symbol_native": "$",
        "code": "CAD",
    },
    {
        "symbol": "€",
		"value" : 0,
        "symbol_native": "€",
        "code": "EUR",
    },
    {
        "symbol": "AED",
		"value" : 0,
        "symbol_native": "د.إ.‏",
        "code": "AED",
    },
    {
        "symbol": "Af",
		"value" : 0,
        "symbol_native": "؋",
        "code": "AFN"
    },
    {
        "symbol": "ALL",
		"value" : 0,
        "symbol_native": "Lek",
        "code": "ALL",    
    },
    {
        "symbol": "AMD",
		"value" : 0,
        "symbol_native": "դր.",      
        "code": "AMD",
    },
    {
        "symbol": "AR$",
		"value" : 0,
        "symbol_native": "$",          
        "code": "ARS",          
    },
    {
        "symbol": "AU$",
		"value" : 0,
        "symbol_native": "$",                  
        "code": "AUD",          
    },
    {
        "symbol": "man.",
		"value" : 0,
        "symbol_native": "ман.",                   
        "code": "AZN",          
    },
    {
        "symbol": "KM",
		"value" : 0,
        "symbol_native": "KM",                   
        "code": "BAM",         
    },
    {
        "symbol": "Tk",
		"value" : 0,
        "symbol_native": "৳",                 
        "code": "BDT",         
    },
    {
        "symbol": "BGN",
		"value" : 0,
        "symbol_native": "лв.", 
        "code": "BGN", 
    },
    {
        "symbol": "BD",
		"value" : 0,
        "symbol_native": "د.ب.‏", 
        "code": "BHD", 
    },
    {
        "symbol": "FBu",
		"value" : 0,
        "symbol_native": "FBu",   
        "code": "BIF",
    },
    {
        "symbol": "BN$",
		"value" : 0,
        "symbol_native": "$",
        "code": "BND",
    },
    {
        "symbol": "Bs",
		"value" : 0,
        "symbol_native": "Bs",
        "code": "BOB",
    },
    {
        "symbol": "R$",
		"value" : 0,
        "symbol_native": "R$",
        "code": "BRL",
    },
    {
        "symbol": "BWP",
		"value" : 0,
        "symbol_native": "P",    
        "code": "BWP",
    },
    {
        "symbol": "BYR",
		"value" : 0,
        "symbol_native": "BYR",
        "code": "BYR",
    },
    {
        "symbol": "BZ$",
		"value" : 0,
        "symbol_native": "$",
        "code": "BZD",
    },
    {
        "symbol": "CDF",
		"value" : 0,
        "symbol_native": "FrCD",
        "code": "CDF",
    },
    {
        "symbol": "CHF",
		"value" : 0,
        "symbol_native": "CHF",
        "code": "CHF",
    },
    {
        "symbol": "CL$",
		"value" : 0,
        "symbol_native": "$",
        "code": "CLP",
    },
    {
        "symbol": "CN¥",
		"value" : 0,
        "symbol_native": "CN¥",
        "code": "CNY",
    },
    {
        "symbol": "CO$",
		"value" : 0,
        "symbol_native": "$",
        "code": "COP",
    },
    {
        "symbol": "₡",
		"value" : 0,
        "symbol_native": "₡",
        "code": "CRC",
    },
    {
        "symbol": "CV$",
		"value" : 0,
        "symbol_native": "CV$",
        "code": "CVE",
    },
    {
        "symbol": "Kč",
		"value" : 0,
        "symbol_native": "Kč",
        "code": "CZK",
    },
    {
        "symbol": "Fdj",
		"value" : 0,
        "symbol_native": "Fdj",
        "code": "DJF",
    },
    {
        "symbol": "Dkr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "DKK",
    },
    {
        "symbol": "RD$",
		"value" : 0,
        "symbol_native": "RD$",
        "code": "DOP",
    },
    {
        "symbol": "DA",
		"value" : 0,
        "symbol_native": "د.ج.‏",
        "code": "DZD",
    },
    {
        "symbol": "Ekr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "EEK",
    },
    {
        "symbol": "EGP",
		"value" : 0,
        "symbol_native": "ج.م.‏",
        "code": "EGP",
    },
    {
        "symbol": "Nfk",
		"value" : 0,
        "symbol_native": "Nfk",
        "code": "ERN",
    },
    {
        "symbol": "Br",
		"value" : 0,
        "symbol_native": "Br",
        "code": "ETB",
    },
    {
        "symbol": "£",
		"value" : 0,
        "symbol_native": "£",
        "code": "GBP",
    },
    {
        "symbol": "GEL",
		"value" : 0,
        "symbol_native": "GEL",
        "code": "GEL",
    },
    {
        "symbol": "GH₵",
		"value" : 0,
        "symbol_native": "GH₵",
        "code": "GHS",
    },
    {
        "symbol": "FG",
		"value" : 0,
        "symbol_native": "FG",
        "code": "GNF",
    },
    {
        "symbol": "GTQ",
		"value" : 0,
        "symbol_native": "Q",
        "code": "GTQ",
    },
    {
        "symbol": "HK$",
		"value" : 0,
        "symbol_native": "$",
        "code": "HKD",
    },
    {
        "symbol": "HNL",
		"value" : 0,
        "symbol_native": "L",
        "code": "HNL",
    },
    {
        "symbol": "kn",
		"value" : 0,
        "symbol_native": "kn",
        "code": "HRK",
    },
    {
        "symbol": "Ft",
		"value" : 0,
        "symbol_native": "Ft",
        "code": "HUF",
    },
    {
        "symbol": "Rp",
		"value" : 0,
        "symbol_native": "Rp",
        "code": "IDR",
    },
    {
        "symbol": "₪",
		"value" : 0,
        "symbol_native": "₪",
        "code": "ILS",
    },
    {
        "symbol": "Rs",
		"value" : 0,
        "symbol_native": "টকা",
        "code": "INR",
    },
    {
        "symbol": "IQD",
		"value" : 0,
        "symbol_native": "د.ع.‏",
        "code": "IQD",
    },
    {
        "symbol": "IRR",
		"value" : 0,
        "symbol_native": "﷼",
        "code": "IRR",
    },
    {
        "symbol": "Ikr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "ISK",
    },
    {
        "symbol": "J$",
		"value" : 0,
        "symbol_native": "$",
        "code": "JMD",
    },
    {
        "symbol": "JD",
		"value" : 0,
        "symbol_native": "د.أ.‏",
        "code": "JOD",
    },
    {
        "symbol": "¥",
		"value" : 0,
        "symbol_native": "￥",
        "code": "JPY",
    },
    {
        "symbol": "Ksh",
		"value" : 0,
        "symbol_native": "Ksh",
        "code": "KES",
    },
    {
        "symbol": "KHR",
		"value" : 0,
        "symbol_native": "៛",
        "code": "KHR",
    },
    {
        "symbol": "CF",
		"value" : 0,
        "symbol_native": "FC",
        "code": "KMF",
    },
    {
        "symbol": "₩",
		"value" : 0,
        "symbol_native": "₩",
        "code": "KRW",
    },
    {
        "symbol": "KD",
		"value" : 0,
        "symbol_native": "د.ك.‏",
        "code": "KWD",
    },
    {
        "symbol": "KZT",
		"value" : 0,
        "symbol_native": "тңг.",
        "code": "KZT",
    },
    {
        "symbol": "LB£",
		"value" : 0,
        "symbol_native": "ل.ل.‏",
        "code": "LBP",
    },
    {
        "symbol": "SLRs",
		"value" : 0,
        "symbol_native": "SL Re",
        "code": "LKR",
    },
    {
        "symbol": "Lt",
		"value" : 0,
        "symbol_native": "Lt",
        "code": "LTL",
    },
    {
        "symbol": "Ls",
		"value" : 0,
        "symbol_native": "Ls",
        "code": "LVL",
    },
    {
        "symbol": "LD",
		"value" : 0,
        "symbol_native": "د.ل.‏",
        "code": "LYD",
    },
    {
        "symbol": "MAD",
		"value" : 0,
        "symbol_native": "د.م.‏",
        "code": "MAD",
    },
    {
        "symbol": "MDL",
		"value" : 0,
        "symbol_native": "MDL",
        "code": "MDL",
    },
    {
        "symbol": "MGA",
		"value" : 0,
        "symbol_native": "MGA",
        "code": "MGA",
    },
    {
        "symbol": "MKD",
		"value" : 0,
        "symbol_native": "MKD",
        "code": "MKD",
    },
    {
        "symbol": "MMK",
		"value" : 0,
        "symbol_native": "K",
        "code": "MMK",
    },
    {
        "symbol": "MOP$",
		"value" : 0,
        "symbol_native": "MOP$",
        "code": "MOP",
    },
    {
        "symbol": "MURs",
		"value" : 0,
        "symbol_native": "MURs",
        "code": "MUR",
    },
    {
        "symbol": "MX$",
		"value" : 0,
        "symbol_native": "$",
        "code": "MXN",
    },
    {
        "symbol": "RM",
		"value" : 0,
        "symbol_native": "RM",
        "code": "MYR",
    },
    {
        "symbol": "MTn",
		"value" : 0,
        "symbol_native": "MTn",
        "code": "MZN",
    },
    {
        "symbol": "N$",
		"value" : 0,
        "symbol_native": "N$",
        "code": "NAD",
    },
    {
        "symbol": "₦",
		"value" : 0,
        "symbol_native": "₦",
        "code": "NGN",
    },
    {
        "symbol": "C$",
		"value" : 0,
        "symbol_native": "C$",
        "code": "NIO",
    },
    {
        "symbol": "Nkr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "NOK",
    },
    {
        "symbol": "NPRs",
		"value" : 0,
        "symbol_native": "नेरू",
        "code": "NPR",
    },
    {
        "symbol": "NZ$",
		"value" : 0,
        "symbol_native": "$",
        "code": "NZD",
    },
    {
        "symbol": "OMR",
		"value" : 0,
        "symbol_native": "ر.ع.‏",
        "code": "OMR",
    },
    {
        "symbol": "B/.",
		"value" : 0,
        "symbol_native": "B/.",
        "code": "PAB",
    },
    {
        "symbol": "S/.",
		"value" : 0,
        "symbol_native": "S/.",
        "code": "PEN",
    },
    {
        "symbol": "₱",
		"value" : 0,
        "symbol_native": "₱",
        "code": "PHP",
    },
    {
        "symbol": "PKRs",
		"value" : 0,
        "symbol_native": "₨",
        "code": "PKR",
    },
    {
        "symbol": "zł",
		"value" : 0,
        "symbol_native": "zł",
        "code": "PLN",
    },
    {
        "symbol": "₲",
		"value" : 0,
        "symbol_native": "₲",
        "code": "PYG",
    },
    {
        "symbol": "QR",
		"value" : 0,
        "symbol_native": "ر.ق.‏",
        "code": "QAR",
    },
    {
        "symbol": "RON",
		"value" : 0,
        "symbol_native": "RON",
        "code": "RON",
    },
    {
        "symbol": "din.",
		"value" : 0,
        "symbol_native": "дин.",
        "code": "RSD",
    },
    {
        "symbol": "RUB",
		"value" : 0,
        "symbol_native": "руб.",
        "code": "RUB",
    },
    {
        "symbol": "RWF",
		"value" : 0,
        "symbol_native": "FR",
        "code": "RWF",
    },
    {
        "symbol": "SR",
		"value" : 0,
        "symbol_native": "ر.س.‏",
        "code": "SAR",
    },
    {
        "symbol": "SDG",
		"value" : 0,
        "symbol_native": "SDG",
        "code": "SDG",
    },
    {
        "symbol": "Skr",
		"value" : 0,
        "symbol_native": "kr",
        "code": "SEK",
    },
    {
        "symbol": "S$",
		"value" : 0,
        "symbol_native": "$",
        "code": "SGD",
    },
    {
        "symbol": "Ssh",
		"value" : 0,
        "symbol_native": "Ssh",
        "code": "SOS",
    },
    {
        "symbol": "SY£",
		"value" : 0,
        "symbol_native": "ل.س.‏",
        "code": "SYP",
    },
    {
        "symbol": "฿",
		"value" : 0,
        "symbol_native": "฿",
        "code": "THB",
    },
    {
        "symbol": "DT",
		"value" : 0,
        "symbol_native": "د.ت.‏",
        "code": "TND",
    },
    {
        "symbol": "T$",
		"value" : 0,
        "symbol_native": "T$",
        "code": "TOP",
    },
    {
        "symbol": "TL",
		"value" : 0,
        "symbol_native": "TL",
        "code": "TRY",
    },
    {
        "symbol": "TT$",
		"value" : 0,
        "symbol_native": "$",
        "code": "TTD",
    },
    {
        "symbol": "NT$",
		"value" : 0,
        "symbol_native": "NT$",
        "code": "TWD",
    },
    {
        "symbol": "TSh",
		"value" : 0,
        "symbol_native": "TSh",
        "code": "TZS",
    },
    {
        "symbol": "₴",
		"value" : 0,
        "symbol_native": "₴",
        "code": "UAH",
    },
    {
        "symbol": "USh",
		"value" : 0,
        "symbol_native": "USh",
        "code": "UGX",
    },
    {
        "symbol": "$U",
		"value" : 0,
        "symbol_native": "$",
        "code": "UYU",
    },
    {
        "symbol": "UZS",
		"value" : 0,
        "symbol_native": "UZS",
        "code": "UZS",
    },
    {
        "symbol": "Bs.F.",
		"value" : 0,
        "symbol_native": "Bs.F.",
        "code": "VEF",
    },
    {
        "symbol": "₫",
		"value" : 0,
        "symbol_native": "₫",
        "code": "VND",
    },
    {
        "symbol": "FCFA",
		"value" : 0,
        "symbol_native": "FCFA",
        "code": "XAF",
    },
    {
        "symbol": "CFA",
		"value" : 0,
        "symbol_native": "CFA",
        "code": "XOF",
    },
    {
        "symbol": "YR",
		"value" : 0,
        "symbol_native": "ر.ي.‏",
        "code": "YER",
    },
    {
        "symbol": "R",
		"value" : 0,
        "symbol_native": "R",
        "code": "ZAR",
    },
    {
        "symbol": "ZK",
		"value" : 0,
        "symbol_native": "ZK",
        "code": "ZMK",
    }
];