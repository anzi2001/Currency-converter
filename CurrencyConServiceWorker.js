var allCurrencies;
var preferredCurrency;
var observer;
var subscribable = {
	subscribedObjects: [],
	subscribe: function (convertableObject) {
		this.subscribedObjects.push(convertableObject);
	},
	notifyAllSubscribed: function (currencyCode) {
		for (var i = 0; i < this.subscribedObjects.length; i++) {
			if (allCurrencies[this.subscribedObjects[i].iAtTheTime].code == currencyCode) {
				embedInWebsite(this.subscribedObjects[i]);
			}

		}
		subscribedObjects = [];
	},
};
var allObjects = {}

function init() {
	console.log("test")
	browser.runtime.sendMessage({
		getCurrencies: true
	}).then((currencies) => {
		allCurrencies = currencies.response;
		browser.storage.local.get("preferredCurrency").then(res => {
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
	children = [];
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].textContent != "" && elements[i].children.length == 0 && elements[i].tagName != "SCRIPT" && elements[i].tagName != "LINK" && elements[i].tagName != "IFRAME" && elements[i].tagName != "svg" && elements[i].tagName != "symbol" && elements[i].tagName != "path") {
			children.push(elements[i]);
		}
	}
	return children;
}

if (document.readyState !== "complete") {
	window.addEventListener("load", init, false);
} else init();

//var worker = new Worker("currencyWorker.js")
browser.runtime.onMessage.addListener(function(tempObj){
	var object = allObjects[tempObj.ID]
	if (allCurrencies[object.iAtTheTime].value === 0 && allCurrencies[object.iAtTheTime].isBeingChecked) {
		subscribable.subscribe(object);
	} else if (allCurrencies[object.iAtTheTime].value !== 0) {
		embedInWebsite(object);
	} else {
		allCurrencies[object.iAtTheTime].isBeingChecked = true;
		checkCurrencyValue("https://free.currconv.com/api/v7/convert?q=" + allCurrencies[i].code + "_" + preferredCurrency + "&compact=ultra&apiKey=6294a7e98205235528ff", object, async (response, passedObject) => {
			var CurrencyValue = response[allCurrencies[passedObject.iAtTheTime].code + "_" + preferredCurrency];
			allCurrencies[passedObject.iAtTheTime].value = CurrencyValue;

			//this doesn't need to be sent to background since it's going to be on only for a short period of time
			allCurrencies[passedObject.iAtTheTime].isBeingChecked = false;
			//update the data-script.js values of the currency
			await browser.runtime.sendMessage({
				"iOfObject": passedObject.iAtTheTime,
				"valueOfCurrency": CurrencyValue
			})

			embedInWebsite(passedObject);
			subscribable.notifyAllSubscribed(allCurrencies[passedObject.iAtTheTime].code);
		});
	}
})
async function start(nodeToCheck) {
	for(var i = 0, length = allCurrencies.length - 2; i < length; i++) {
		if (allCurrencies[i].code === preferredCurrency) {
			continue;
		}
		for (var j = 0; j < nodeToCheck.length; j++) {
			var convertableObject = {
				ID: ""+i+j,
				iAtTheTime: i,
				element: nodeToCheck[j],
				textContent: nodeToCheck[j].textContent,
				symbol : allCurrencies[i].symbol
			};
			allObjects[convertableObject.ID] = convertableObject
			browser.runtime.sendMessage({ID: ""+i+j,textContent:nodeToCheck[j].textContent,symbol: allCurrencies[i].symbol}).then(val=>{
			}).catch(err=>{
				console.log(err)
			})
			//worker.postMessage(convertableObject)
		}
	}
}

function embedInWebsite(convertableObject) {
	var converted = '(' + (parseFloat(convertableObject.CurrencyString) * allCurrencies[convertableObject.iAtTheTime].value).toFixed(2) + preferredCurrency + ')';
	convertableObject.element.textContent = convertableObject.element.textContent.substr(0, convertableObject.indexofSymbol + convertableObject.CurrencyString.length + 1) + converted + convertableObject.element.textContent.substr(convertableObject.indexofSymbol + convertableObject.CurrencyString.length + 1);
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