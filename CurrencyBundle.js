(function () {
    'use strict';

    let wasm;

    const heap = new Array(32).fill(undefined);

    heap.push(undefined, null, true, false);

    function getObject(idx) { return heap[idx]; }

    let heap_next = heap.length;

    function dropObject(idx) {
        if (idx < 36) return;
        heap[idx] = heap_next;
        heap_next = idx;
    }

    function takeObject(idx) {
        const ret = getObject(idx);
        dropObject(idx);
        return ret;
    }

    let WASM_VECTOR_LEN = 0;

    let cachegetUint8Memory0 = null;
    function getUint8Memory0() {
        if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory0;
    }

    let cachedTextEncoder = new TextEncoder('utf-8');

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length);
            getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len);

        const mem = getUint8Memory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3);
            const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    let cachegetInt32Memory0 = null;
    function getInt32Memory0() {
        if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
            cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
        }
        return cachegetInt32Memory0;
    }

    let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder.decode();

    function getStringFromWasm0(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
    }
    /**
    * @param {number} position
    * @param {string} text
    * @returns {string}
    */
    function check_for_numbers(position, text) {
        try {
            var ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.check_for_numbers(8, position, ptr0, len0);
            var r0 = getInt32Memory0()[8 / 4 + 0];
            var r1 = getInt32Memory0()[8 / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_free(r0, r1);
        }
    }

    function addHeapObject(obj) {
        if (heap_next === heap.length) heap.push(heap.length + 1);
        const idx = heap_next;
        heap_next = heap[idx];

        heap[idx] = obj;
        return idx;
    }

    async function load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {

            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {

            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    async function init(input) {
        if (typeof input === 'undefined') {
            input = (document.currentScript && document.currentScript.src || new URL('CurrencyBundle.js', document.baseURI).href).replace(/\.js$/, '_bg.wasm');
        }
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_new_59cb74e423758ede = function() {
            var ret = new Error();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
            var ret = getObject(arg1).stack;
            var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
            try {
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(arg0, arg1);
            }
        };
        imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
            takeObject(arg0);
        };

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        const { instance, module } = await load(await input, imports);

        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    }

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



    async function initCurrency() {
    	console.log("hello");
    	await init(browser.runtime.getURL("wasm_test_bg.wasm"));

    	browser.runtime.sendMessage({
    		getCurrencies: true
    	}).then((currencies) => {
    		CurrencyObject = currencies.response;
    		browser.storage.local.get("preferredCurrency").then((res) => {
    			var elements = document.body.getElementsByTagName("*");
    			preferredCurrency = res.preferredCurrency;
    			start(filterElements(elements));
    			initObserver();
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
    	var t1 = performance.now();
    	//var precompiledRegex = /[0-9A-Z]/i;
    	for (var i = 0; i < CurrencyObject.length; i++) {
    		if (CurrencyObject[i].code === preferredCurrency) {
    			continue;
    		}
    		for (var j = 0; j < nodeToCheck.length; j++) {
    			var text = nodeToCheck[j].textContent;
    			var SymbolPosition = text.indexOf(CurrencyObject[i].symbol);
    			//if the checked symbol exists(and therefore function doesn't return -1),
    			//check if there is a number around the symbol
    			while (SymbolPosition !== -1) {
    				value = check_for_numbers(SymbolPosition,text);
    				//value = checkForNumbers(SymbolPosition, text);
    				//check input for dots or spaces only
    				//im don't really need regex because im checking for numbers in checkAroundSymbol
    				if (value !== "" /*&& precompiledRegex.test(value)*/) {
    					//save the state of variables so i can use them later in the callback
    					var convertableObject = {
    						iAtTheTime: i,
    						indexofSymbol: SymbolPosition,
    						CurrencyString: value,
    						element: nodeToCheck[j]
    					};

    					if (CurrencyObject[i].value === 0 && CurrencyObject[i].isBeingChecked) {
    						subscribable.subscribe(convertableObject);
    					} else if (CurrencyObject[i].value !== 0) {
    						embedInWebsite(convertableObject);
    					} else {
    						CurrencyObject[i].isBeingChecked = true;
    						checkCurrencyValue("https://free.currconv.com/api/v7/convert?q=" + CurrencyObject[i].code + "_" + preferredCurrency + "&compact=ultra&apiKey=6294a7e98205235528ff",convertableObject, (response, object) => {
    							var CurrencyValue = response[CurrencyObject[object.iAtTheTime].code + "_" + preferredCurrency];
    							CurrencyObject[object.iAtTheTime].value = CurrencyValue;
    							browser.runtime.sendMessage({
    								"iOfObject": object.iAtTheTime,
    								"valueOfCurrency": CurrencyValue
    							});
    							//this doesn't need to be sent to background since it's going to be on only for a short period of time
    							CurrencyObject[object.iAtTheTime].isBeingChecked = false;

    							embedInWebsite(object);
    							subscribable.notifyAllSubscribed(CurrencyObject[object.iAtTheTime].code);
    						});

    					}
    				}
    				//there may be more symbols in the website, proceed with the start of the last one
    				SymbolPosition = nodeToCheck[j].textContent.indexOf(CurrencyObject[i].symbol, SymbolPosition + CurrencyObject[i].symbol.length);
    			}
    		}
    	}
    	var t2 = performance.now();
    	console.log("start took"+(t2-t1)+"ms");
    }

    function embedInWebsite(convertableObject) {
    	var converted = '(' + (parseFloat(convertableObject.CurrencyString) * CurrencyObject[convertableObject.iAtTheTime].value).toFixed(2) + preferredCurrency + ')';
    	convertableObject.element.textContent = convertableObject.element.textContent.substr(0, convertableObject.indexofSymbol + convertableObject.CurrencyString.length + 1) + converted + convertableObject.element.textContent.substr(convertableObject.indexofSymbol + convertableObject.CurrencyString.length + 1);
    }

    /*function checkForNumbers(position, text) {
    	//start with checking if there are numbers in front of the symbol
    	//if there are none, and the variable is still empty
    	//try backward
    	
    	var CurrencyVal = "",
    		checkedBackwards = false;
    	CurrencyVal = checkAroundSymbol(1, position, text);
    	//try checking backwards around the symbol
    	if (CurrencyVal === "") {
    		CurrencyVal = checkAroundSymbol(-1, position, text);
    		checkedBackwards = true;
    	}
    	if (checkedBackwards) {
    		return CurrencyVal.split("").reverse().join("");
    	} else {
    		return CurrencyVal;
    	}
    }*/
    	

    /*function checkAroundSymbol(toMoveKoeficient, position, elementText) {
    	var isANumber = true,
    		StringPosForward = position,
    		CurrencyValue = "";
    	while (isANumber) {
    		StringPosForward += toMoveKoeficient;
    		if (!isNaN(elementText[StringPosForward]) || elementText[StringPosForward] === '.' || elementText[StringPosForward] === ",") {
    			CurrencyValue += elementText[StringPosForward];

    		} else isANumber = false;
    	}
    	return CurrencyValue;
    }*/

    function checkCurrencyValue(url, object, callback) {
    	fetch(url).then((textVal) => {
    		return textVal.json();
    	}).then((value) => {
    		callback(value, object);
    	}).catch((err) => {
    		console.log(err);
    	});
    }

}());
