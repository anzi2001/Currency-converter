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
	var t1 = performance.now();
	var getCurrencies = browser.runtime.sendMessage({
		getCurrencies: true
	})
	var currency = browser.storage.local.get("preferredCurrency")
	Promise.all([getCurrencies,currency]).then(([allCurrencies,prefCurrency]) => {
		console.log("getCurrencies took"+(performance.now()-t1)+"ms")
		CurrencyObject = allCurrencies.response;
		elements = document.body.getElementsByTagName("*");
		preferredCurrency = prefCurrency.preferredCurrency;
		start(filterElements(elements));
		initObserver()
		console.log("total time"+(performance.now()-t1)+"ms");
	});
	
}

function initObserver() {
	observer = new MutationObserver((mutationsList, _) => {
		for (var i = 0; i < mutationsList.length; i++) {
			if (mutationsList[i].addedNodes.length == 0) continue;
			for (var addedNode of mutationsList[i].addedNodes) {
				if (addedNode.children !== undefined) {
					var node = addedNode.getElementsByTagName("*");
					start(filterElements(node));
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
		if (elements[i].textContent != "" && elements[i].children.length == 0 && elements[i].tagName != "SCRIPT" && elements[i].tagName != "LINK" && elements[i].tagName != "IFRAME" && elements[i].tagName != "svg") {
			children.push(elements[i]);
		}
	}
	return children;
}

if (document.readyState !== "interactive" && document.readyState !== "complete" ) {
	window.addEventListener("load", initCurrency, false);
} else initCurrency();

function start(nodeToCheck) {
	var value;
	var t1 = performance.now()
	for (var i = 0; i < CurrencyObject.length; i++) {
		if (CurrencyObject[i].code === preferredCurrency) {
			continue;
		}
		for (var j = 0; j < nodeToCheck.length; j++) {
			var text = nodeToCheck[j].textContent
			if (text.includes("\u205F")) continue;
			var SymbolPosition = text.indexOf(CurrencyObject[i].symbol);
			//if the checked symbol exists(and therefore function doesn't return -1),
			//check if there is a number around the symbol
			while (SymbolPosition !== -1) {
				value = checkForNumbers(SymbolPosition, text);
				//check input for dots or spaces only
				//i don't really need regex because im checking for numbers in checkAroundSymbol
				if (value !== "") {
					//save the state of variables so i can use them later in the callback
					var convertableObject = {
						iAtTheTime: i,
						jAtTheTime: j,
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
						checkCurrencyValue("https://free.currconv.com/api/v7/convert?q=" + CurrencyObject[i].code + "_" + preferredCurrency + "&compact=ultra&apiKey=6294a7e98205235528ff", convertableObject, (response, object) => {
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
	console.log("start took" + (performance.now() - t1) + "ms")
}

function embedInWebsite(convertableObject) {
	var converted = `(${(parseFloat(convertableObject.CurrencyString) * CurrencyObject[convertableObject.iAtTheTime].value).toFixed(2)}\u205F${preferredCurrency})`
	var to = convertableObject.indexofSymbol + convertableObject.CurrencyString.length
	convertableObject.element.textContent = convertableObject.element.textContent.substr(0, to + 1) + converted + convertableObject.element.textContent.substr(to + 1);
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
	var endPos = position + toMoveKoeficient,
		firstBreak = true;
	while (endPos < elementText.length && endPos > 0) {
		if (!((elementText[endPos] >= '0' && elementText[endPos] <= '9') || elementText[endPos] == '.' || elementText[endPos] == "," || elementText[endPos] == " ")) {
			break;
		}
		firstBreak = false
		endPos += toMoveKoeficient;
	}
	var slice;
	if (firstBreak) return ""
	if (toMoveKoeficient == -1) {
		slice = elementText.substr(endPos, position - endPos)
	} else {
		slice = elementText.substr(position + 1, endPos - position);
	}
	return slice.replace(",",".")
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