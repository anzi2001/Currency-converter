var CurrencyObject;
var preferredCurrency;
var observer;
var subscribable = {
	subscribedObjects: [],
	subscribe: function (convertableObject) {
		this.subscribedObjects.push(convertableObject);
	},
	notifyAllSubscribed: function (currencyCode) {
		for (var i = 0, length = this.subscribedObjects.length; i < length; i++) {
			if (CurrencyObject[this.subscribedObjects[i].iAtTheTime].code == currencyCode) {
				embedInWebsite(this.subscribedObjects[i]);
			}
		}
		this.subscribedObjects = [];
	},
};

function initCurrency() {
	browser.runtime.sendMessage({
		getCurrencies: true
	}).then((currencies) => {
		CurrencyObject = currencies.response;
		browser.storage.local.get("preferredCurrency").then((res) => {
			elements = document.body.getElementsByTagName("*");
			preferredCurrency = res.preferredCurrency;
			start(filterElements(elements));
			initObserver()
		});
	});
}

function initObserver() {
	observer = new MutationObserver((mutationsList, _) => {
		for (var i = 0; i < mutationsList.length; i++) {
			if (mutationsList[i].addedNodes.length != 0) {
				for (var addedNode of mutationsList[i].addedNodes) {
					if (addedNode.children !== undefined) {
						var node = addedNode.getElementsByTagName("*");
						start(filterElements(node));
					}

				}
			}
		}
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
}

function filterElements(elements) {
	var children = [];
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].textContent != "" && elements[i].children.length == 0 && elements[i].tagName != "SCRIPT" && elements[i].tagName != "LINK" && elements[i].tagName != "IFRAME" && elements[i].tagName != "svg" && elements[i].tagName != "symbol" && elements[i].tagName != "path") {
			children.push(elements[i]);
		}
	}
	return children;
}

if (document.readyState !== "complete") {
	window.addEventListener("load",initCurrency,false);
} else initCurrency();

function start(nodeToCheck) {
	var value;
	var t1 = performance.now()
	//var precompiledRegex = /[0-9A-Z]/i;
	for (var i = 0; i < CurrencyObject.length; i++) {
		if (CurrencyObject[i].code === preferredCurrency) {
			continue;
		}
		for (var j = 0; j < nodeToCheck.length; j++) {
			var text = nodeToCheck[j].textContent
			if(text.includes("\u205F")) continue;
			var SymbolPosition = text.indexOf(CurrencyObject[i].symbol);
			//if the checked symbol exists(and therefore function doesn't return -1),
			//check if there is a number around the symbol
			while (SymbolPosition !== -1) {
				value = checkForNumbers(SymbolPosition, text);
				//check input for dots or spaces only
				//im don't really need regex because im checking for numbers in checkAroundSymbol
				if (value !== "" /*&& precompiledRegex.test(value)*/) {
					//save the state of variables so i can use them later in the callback
					var convertableObject = {
						iAtTheTime: i,
						jAtTheTime : j,
						indexofSymbol: SymbolPosition,
						CurrencyString: value,
						element: nodeToCheck[j]
					};

					if (CurrencyObject[i].value === 0 && CurrencyObject[i].isBeingChecked) {
						subscribable.subscribe(convertableObject);
					} else if (CurrencyObject[i].value !== 0) {
						embedInWebsite(convertableObject);
						text = nodeToCheck[j].textContent;
					} else {
						CurrencyObject[i].isBeingChecked = true;
						checkCurrencyValue("https://free.currconv.com/api/v7/convert?q=" + CurrencyObject[i].code + "_" + preferredCurrency + "&compact=ultra&apiKey=6294a7e98205235528ff",convertableObject, (response, object) => {
							var CurrencyValue = response[CurrencyObject[object.iAtTheTime].code + "_" + preferredCurrency];
							CurrencyObject[object.iAtTheTime].value = CurrencyValue;
							browser.runtime.sendMessage({
								"iOfObject": object.iAtTheTime,
								"valueOfCurrency": CurrencyValue
							})
							//this doesn't need to be sent to background since it's going to be on only for a short period of time
							CurrencyObject[object.iAtTheTime].isBeingChecked = false;

							embedInWebsite(object);
							text = nodeToCheck[object.jAtTheTime].textContent;
							subscribable.notifyAllSubscribed(CurrencyObject[object.iAtTheTime].code);
						});

					}
				}
				//there may be more symbols in the website, proceed with the start of the last one
				SymbolPosition = nodeToCheck[j].textContent.indexOf(CurrencyObject[i].symbol, SymbolPosition + CurrencyObject[i].symbol.length);
			}
		}
	}
	var t2 = performance.now()
	console.log("start took"+(t2-t1)+"ms")
}

function embedInWebsite(convertableObject) {
	var converted = '(' + (parseFloat(convertableObject.CurrencyString) * CurrencyObject[convertableObject.iAtTheTime].value).toFixed(2) +"‎\u205F"+ preferredCurrency + ')';
	convertableObject.element.textContent = convertableObject.element.textContent.substr(0, convertableObject.indexofSymbol + convertableObject.CurrencyString.length + 1) + converted + convertableObject.element.textContent.substr(convertableObject.indexofSymbol + convertableObject.CurrencyString.length + 1);
}

function checkForNumbers(position, text) {
	var CurrencyVal;
	CurrencyVal = checkAroundSymbol(1, position, text);
	if (CurrencyVal === "") {
		CurrencyVal = checkAroundSymbol(-1, position, text);
	}
	return CurrencyVal;
}
	
function checkAroundSymbol(toMoveKoeficient, position, elementText) {
	var endPos = position+toMoveKoeficient;
	while (endPos < elementText.length && endPos > 0) {
		if(!(!isNaN(elementText[endPos]) || elementText[endPos] === '.' || elementText[endPos] === ",")){
			break;
		}
		endPos += toMoveKoeficient;
	}
	var slice;
	if(toMoveKoeficient == -1){
		slice = elementText.slice(endPos,position)
	}
	else{
		slice = elementText.slice(position+1,endPos);
	}
	slice = slice.replace(",",".")
	if(isNaN(slice)){
		slice = ""
	}
	return slice
}

function checkCurrencyValue(url, object, callback) {
	fetch(url).then((textVal) => {
		return textVal.json();
	}).then((value) => {
		callback(value, object);
	}).catch((err) => {
		console.log(err);
	});
}