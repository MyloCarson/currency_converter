/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import idb from 'idb';

if (navigator.serviceWorker) {

    navigator.serviceWorker.register('/sw/sw.js').then(function (registration) {
        console.log("Registration Successful");
    }).catch(function (err) {
        console.log("Registration failed", err);
    });
}

var base_url = "https://free.currencyconverterapi.com/api/v5";

var listOfCountries = [];
var countries = [];
var firstCurrency_Select = document.getElementById("firstCurrency_Select");
var secondCurrency_Select = document.getElementById("secondCurrency_Select");
var amonutInput = document.getElementById("amount");
var resultDiv = document.getElementById("result");

var storeName = "currencies_country_list";

// let dbPromise = idb.open('currency_converterDB',1,(upgradeDB)=>{
//     let store = upgradeDB.createObjectStore(storeName);
//     store.put(listOfCountries, "first");
//   });

// dbPromise
//     .then((db)=>{
//     let transaction = db.transaction(storeName);
//     let store = transaction.objectStore(storeName);
//     return store.get('first');
//     })
//     .then((val)=>{
//         console.log("[IDB] ",val)
//     });


getCountriesAndCurrencies(function () {
    fetch(base_url + "/currencies").then(function (data) {
        data.json().then(function (e) {
            for (country in e.results) {
                listOfCountries.push(e.results[country]);
            }
            console.log(listOfCountries);
            addToSelects();
        });
    }).catch(function (e) {});
});

addToSelects(function () {
    countries = listOfCountries;
    for (country in listOfCountries) {
        var item = document.createElement('option');
        item.value = listOfCountries[country].id;
        if ('currencySymbol' in listOfCountries[country]) {
            item.text = listOfCountries[country].currencyName + " => " + listOfCountries[country].currencySymbol;
        } else {
            item.text = "" + listOfCountries[country].currencyName;
        }
        firstCurrency_Select.appendChild(item);
    }

    for (country in countries) {
        var _item = document.createElement('option');
        _item.value = countries[country].id;
        if ('currencySymbol' in countries[country]) {
            _item.text = countries[country].currencyName + " => " + countries[country].currencySymbol;
        } else {
            _item.text = "" + countries[country].currencyName;
        }
        secondCurrency_Select.appendChild(_item);
    }
});

getCountriesAndCurrencies();
function convert() {
    var firstCurrency = firstCurrency_Select.options[firstCurrency_Select.selectedIndex].value;
    var secondCurrency = secondCurrency_Select.options[secondCurrency_Select.selectedIndex].value;
    var amount = amonutInput.value;

    var indexInResponse = firstCurrency + "_" + secondCurrency;

    fetch(base_url + "/convert?q=" + firstCurrency + "_" + secondCurrency + "&compact=y").then(function (response) {
        response.json().then(function (data) {
            resultDiv.innerText = data[indexInResponse].val * amount;
        });
    }).catch(function (err) {
        console.log("[Error] Couldn't convert", err);
    });
}

/***/ })
/******/ ]);