var jsonObject; 
window.onload = function(){
    var wasSplit = this.document.body.innerText.replace(/\s+/g, '');
    jsonObject = JSON.stringify(jsonObject);
    var objectArray = JSON.parse(jsonObject);
    var value;
    var length = objectArray.length;
    //loop all of the symbols
    for(var i = 0;i<length;i++){
        var SymbolPosition = wasSplit.indexOf(objectArray[i].symbol);
        //if the checked symbol exists(and therefore function doesn't return -1)
        //check if there is a number around the symbol
        while(SymbolPosition !== -1){
            value = checkForNumbers(SymbolPosition,wasSplit);
            if(value !== ""){
                this.alert(value);
            }
            //there may be more symbols in the website, proceed with the start of the last one
            SymbolPosition = wasSplit.indexOf(objectArray[i].symbol,SymbolPosition+objectArray[i].symbol.length);
        }
    }
};


function checkForNumbers(position, splitted){
    //start with checking if there are numbers in front of the symbol
    //if there are none, and the variable is still empty
    //try backwards
    var isANumber = true, StringPosForward = position,checkedBackwards = false;
    var CurrencyValue = "";
    while(isANumber){
        StringPosForward +=1;
        if(!isNaN(splitted[StringPosForward]) || splitted[StringPosForward] == '.' || splitted[StringPosForward] == ','){
            CurrencyValue += splitted[StringPosForward].toString();
        }
        else{
            isANumber = false;
        }
    }
    //try checking backwards around the symbol
    if(CurrencyValue == ""){
        isANumber = true;
        var StringPosBackward = position;
        while(isANumber){
            StringPosBackward -= 1;
            if(!isNaN(splitted[StringPosBackward]) || splitted[StringPosBackward] == '.' || splitted[StringPosBackward] == ','){
                CurrencyValue += splitted[StringPosBackward].toString();
            }
            else{
                isANumber = false;
            }
        }
        checkedBackwards == true;
    }
    if(checkedBackwards){
        return CurrencyValue.split("").reverse().join("");
    }
    else{
        return CurrencyValue;
    }
    
}
var jsonObject = [
    {
        "symbol": "$",
        
        "symbol_native": "$",
        "code": "USD",
    },
    {
        "symbol": "CA$",
        
        "symbol_native": "$",
        "code": "CAD",
    },
    {
        "symbol": "€",
        
        "symbol_native": "€",
        "code": "EUR",
    },
    {
        "symbol": "AED",
        
        "symbol_native": "د.إ.‏",
        "code": "AED",
    },
    {
        "symbol": "Af",
        
        "symbol_native": "؋",
        "code": "AFN"
    },
    {
        "symbol": "ALL",
        
        "symbol_native": "Lek",
        "code": "ALL",    
    },
    {
        "symbol": "AMD",
        
        "symbol_native": "դր.",      
        "code": "AMD",
    },
    {
        "symbol": "AR$",
        
        "symbol_native": "$",          
        "code": "ARS",          
    },
    {
        "symbol": "AU$",
        
        "symbol_native": "$",                  
        "code": "AUD",          
    },
    {
        "symbol": "man.",
        
        "symbol_native": "ман.",                   
        "code": "AZN",          
    },
    {
        "symbol": "KM",
        
        "symbol_native": "KM",                   
        "code": "BAM",         
    },
    {
        "symbol": "Tk",
        
        "symbol_native": "৳",                 
        "code": "BDT",         
    },
    {
        "symbol": "BGN",
        
        "symbol_native": "лв.", 
        "code": "BGN", 
    },
    {
        "symbol": "BD",
        
        "symbol_native": "د.ب.‏", 
        "code": "BHD", 
    },
    {
        "symbol": "FBu",
        
        "symbol_native": "FBu",   
        "code": "BIF",
    },
    {
        "symbol": "BN$",
        
        "symbol_native": "$",
        "code": "BND",
    },
    {
        "symbol": "Bs",
        
        "symbol_native": "Bs",
        "code": "BOB",
    },
    {
        "symbol": "R$",
        
        "symbol_native": "R$",
        "code": "BRL",
    },
    {
        "symbol": "BWP",
        
        "symbol_native": "P",    
        "code": "BWP",
    },
    {
        "symbol": "BYR",
        
        "symbol_native": "BYR",
        "code": "BYR",
    },
    {
        "symbol": "BZ$",
        
        "symbol_native": "$",
        "code": "BZD",
    },
    {
        "symbol": "CDF",
        
        "symbol_native": "FrCD",
        "code": "CDF",
    },
    {
        "symbol": "CHF",
        
        "symbol_native": "CHF",
        "code": "CHF",
    },
    {
        "symbol": "CL$",
        
        "symbol_native": "$",
        "code": "CLP",
    },
    {
        "symbol": "CN¥",
        
        "symbol_native": "CN¥",
        "code": "CNY",
    },
    {
        "symbol": "CO$",
        
        "symbol_native": "$",
        "code": "COP",
    },
    {
        "symbol": "₡",
        
        "symbol_native": "₡",
        "code": "CRC",
    },
    {
        "symbol": "CV$",
        
        "symbol_native": "CV$",
        "code": "CVE",
    },
    {
        "symbol": "Kč",
        
        "symbol_native": "Kč",
        "code": "CZK",
    },
    {
        "symbol": "Fdj",
        
        "symbol_native": "Fdj",
        "code": "DJF",
    },
    {
        "symbol": "Dkr",
        
        "symbol_native": "kr",
        "code": "DKK",
    },
    {
        "symbol": "RD$",
        
        "symbol_native": "RD$",
        "code": "DOP",
    },
    {
        "symbol": "DA",
        
        "symbol_native": "د.ج.‏",
        "code": "DZD",
    },
    {
        "symbol": "Ekr",
        
        "symbol_native": "kr",
        "code": "EEK",
    },
    {
        "symbol": "EGP",
        
        "symbol_native": "ج.م.‏",
        "code": "EGP",
    },
    {
        "symbol": "Nfk",
        
        "symbol_native": "Nfk",
        "code": "ERN",
    },
    {
        "symbol": "Br",
        
        "symbol_native": "Br",
        "code": "ETB",
    },
    {
        "symbol": "£",
        
        "symbol_native": "£",
        "code": "GBP",
    },
    {
        "symbol": "GEL",
        
        "symbol_native": "GEL",
        "code": "GEL",
    },
    {
        "symbol": "GH₵",
        
        "symbol_native": "GH₵",
        "code": "GHS",
    },
    {
        "symbol": "FG",
        
        "symbol_native": "FG",
        "code": "GNF",
    },
    {
        "symbol": "GTQ",
        
        "symbol_native": "Q",
        "code": "GTQ",
    },
    {
        "symbol": "HK$",
        
        "symbol_native": "$",
        "code": "HKD",
    },
    {
        "symbol": "HNL",
        
        "symbol_native": "L",
        "code": "HNL",
    },
    {
        "symbol": "kn",
        
        "symbol_native": "kn",
        "code": "HRK",
    },
    {
        "symbol": "Ft",
        
        "symbol_native": "Ft",
        "code": "HUF",
    },
    {
        "symbol": "Rp",
        
        "symbol_native": "Rp",
        "code": "IDR",
    },
    {
        "symbol": "₪",
        
        "symbol_native": "₪",
        "code": "ILS",
    },
    {
        "symbol": "Rs",
        
        "symbol_native": "টকা",
        "code": "INR",
    },
    {
        "symbol": "IQD",
        
        "symbol_native": "د.ع.‏",
        "code": "IQD",
    },
    {
        "symbol": "IRR",
        
        "symbol_native": "﷼",
        "code": "IRR",
    },
    {
        "symbol": "Ikr",
        
        "symbol_native": "kr",
        "code": "ISK",
    },
    {
        "symbol": "J$",
        
        "symbol_native": "$",
        "code": "JMD",
    },
    {
        "symbol": "JD",
        
        "symbol_native": "د.أ.‏",
        "code": "JOD",
    },
    {
        "symbol": "¥",
        
        "symbol_native": "￥",
        "code": "JPY",
    },
    {
        "symbol": "Ksh",
        
        "symbol_native": "Ksh",
        "code": "KES",
    },
    {
        "symbol": "KHR",
        
        "symbol_native": "៛",
        "code": "KHR",
    },
    {
        "symbol": "CF",
        
        "symbol_native": "FC",
        "code": "KMF",
    },
    {
        "symbol": "₩",
        
        "symbol_native": "₩",
        "code": "KRW",
    },
    {
        "symbol": "KD",
        
        "symbol_native": "د.ك.‏",
        "code": "KWD",
    },
    {
        "symbol": "KZT",
        
        "symbol_native": "тңг.",
        "code": "KZT",
    },
    {
        "symbol": "LB£",
        
        "symbol_native": "ل.ل.‏",
        "code": "LBP",
    },
    {
        "symbol": "SLRs",
        
        "symbol_native": "SL Re",
        "code": "LKR",
    },
    {
        "symbol": "Lt",
        
        "symbol_native": "Lt",
        "code": "LTL",
    },
    {
        "symbol": "Ls",
        
        "symbol_native": "Ls",
        "code": "LVL",
    },
    {
        "symbol": "LD",
        
        "symbol_native": "د.ل.‏",
        "code": "LYD",
    },
    {
        "symbol": "MAD",
        
        "symbol_native": "د.م.‏",
        "code": "MAD",
    },
    {
        "symbol": "MDL",
        
        "symbol_native": "MDL",
        "code": "MDL",
    },
    {
        "symbol": "MGA",
        
        "symbol_native": "MGA",
        "code": "MGA",
    },
    {
        "symbol": "MKD",
        
        "symbol_native": "MKD",
        "code": "MKD",
    },
    {
        "symbol": "MMK",
        
        "symbol_native": "K",
        "code": "MMK",
    },
    {
        "symbol": "MOP$",
        
        "symbol_native": "MOP$",
        "code": "MOP",
    },
    {
        "symbol": "MURs",
        
        "symbol_native": "MURs",
        "code": "MUR",
    },
    {
        "symbol": "MX$",
        
        "symbol_native": "$",
        "code": "MXN",
    },
    {
        "symbol": "RM",
        
        "symbol_native": "RM",
        "code": "MYR",
    },
    {
        "symbol": "MTn",
        
        "symbol_native": "MTn",
        "code": "MZN",
    },
    {
        "symbol": "N$",
        
        "symbol_native": "N$",
        "code": "NAD",
    },
    {
        "symbol": "₦",
        
        "symbol_native": "₦",
        "code": "NGN",
    },
    {
        "symbol": "C$",
        
        "symbol_native": "C$",
        "code": "NIO",
    },
    {
        "symbol": "Nkr",
        
        "symbol_native": "kr",
        "code": "NOK",
    },
    {
        "symbol": "NPRs",
        
        "symbol_native": "नेरू",
        "code": "NPR",
    },
    {
        "symbol": "NZ$",
        
        "symbol_native": "$",
        "code": "NZD",
    },
    {
        "symbol": "OMR",
        
        "symbol_native": "ر.ع.‏",
        "code": "OMR",
    },
    {
        "symbol": "B/.",
        
        "symbol_native": "B/.",
        "code": "PAB",
    },
    {
        "symbol": "S/.",
        
        "symbol_native": "S/.",
        "code": "PEN",
    },
    {
        "symbol": "₱",
        
        "symbol_native": "₱",
        "code": "PHP",
    },
    {
        "symbol": "PKRs",
        
        "symbol_native": "₨",
        "code": "PKR",
    },
    {
        "symbol": "zł",
        
        "symbol_native": "zł",
        "code": "PLN",
    },
    {
        "symbol": "₲",
        
        "symbol_native": "₲",
        "code": "PYG",
    },
    {
        "symbol": "QR",
        
        "symbol_native": "ر.ق.‏",
        "code": "QAR",
    },
    {
        "symbol": "RON",
        
        "symbol_native": "RON",
        "code": "RON",
    },
    {
        "symbol": "din.",
        
        "symbol_native": "дин.",
        "code": "RSD",
    },
    {
        "symbol": "RUB",
        
        "symbol_native": "руб.",
        "code": "RUB",
    },
    {
        "symbol": "RWF",
        
        "symbol_native": "FR",
        "code": "RWF",
    },
    {
        "symbol": "SR",
        
        "symbol_native": "ر.س.‏",
        "code": "SAR",
    },
    {
        "symbol": "SDG",
        
        "symbol_native": "SDG",
        "code": "SDG",
    },
    {
        "symbol": "Skr",
        
        "symbol_native": "kr",
        "code": "SEK",
    },
    {
        "symbol": "S$",
        
        "symbol_native": "$",
        "code": "SGD",
    },
    {
        "symbol": "Ssh",
        
        "symbol_native": "Ssh",
        "code": "SOS",
    },
    {
        "symbol": "SY£",
        
        "symbol_native": "ل.س.‏",
        "code": "SYP",
    },
    {
        "symbol": "฿",
        
        "symbol_native": "฿",
        "code": "THB",
    },
    {
        "symbol": "DT",
        
        "symbol_native": "د.ت.‏",
        "code": "TND",
    },
    {
        "symbol": "T$",
        
        "symbol_native": "T$",
        "code": "TOP",
    },
    {
        "symbol": "TL",
        
        "symbol_native": "TL",
        "code": "TRY",
    },
    {
        "symbol": "TT$",
        
        "symbol_native": "$",
        "code": "TTD",
    },
    {
        "symbol": "NT$",
        
        "symbol_native": "NT$",
        "code": "TWD",
    },
    {
        "symbol": "TSh",
        
        "symbol_native": "TSh",
        "code": "TZS",
    },
    {
        "symbol": "₴",
        
        "symbol_native": "₴",
        "code": "UAH",
    },
    {
        "symbol": "USh",
        
        "symbol_native": "USh",
        "code": "UGX",
    },
    {
        "symbol": "$U",
        
        "symbol_native": "$",
        "code": "UYU",
    },
    {
        "symbol": "UZS",
        
        "symbol_native": "UZS",
        "code": "UZS",
    },
    {
        "symbol": "Bs.F.",
        
        "symbol_native": "Bs.F.",
        "code": "VEF",
    },
    {
        "symbol": "₫",
        
        "symbol_native": "₫",
        "code": "VND",
    },
    {
        "symbol": "FCFA",
        
        "symbol_native": "FCFA",
        "code": "XAF",
    },
    {
        "symbol": "CFA",
        
        "symbol_native": "CFA",
        "code": "XOF",
    },
    {
        "symbol": "YR",
        
        "symbol_native": "ر.ي.‏",
        "code": "YER",
    },
    {
        "symbol": "R",
        
        "symbol_native": "R",
        "code": "ZAR",
    },
    {
        "symbol": "ZK",
        
        "symbol_native": "ZK",
        "code": "ZMK",
    }
];