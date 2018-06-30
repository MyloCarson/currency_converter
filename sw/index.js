import idb from 'idb';

if(navigator.serviceWorker){

    navigator.serviceWorker
        .register('/sw/sw.js')
        .then((registration)=>{
            console.log("Registration Successful");
        })
        .catch((err)=>{
            console.log("Registration failed",err);
        });
}

const base_url = "https://free.currencyconverterapi.com/api/v5";

let listOfCountries = [];
let countries = [];
const firstCurrency_Select = document.getElementById("firstCurrency_Select");
const secondCurrency_Select = document.getElementById("secondCurrency_Select");
const amonutInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");

const storeName = "currencies_country_list";

let dbPromise = idb.open('currency_converterDB',1,(upgradeDB)=>{
    let store = upgradeDB.createObjectStore(storeName);
    store.put(listOfCountries, "first");
  });

dbPromise
    .then((db)=>{
    let transaction = db.transaction(storeName);
    let store = transaction.objectStore(storeName);
    return store.get('first');
    })
    .then((val)=>{
        console.log("[IDB] ",val)
    });


getCountriesAndCurrencies(()=>{
    fetch(`${base_url}/currencies`).then((data)=>{
        data.json().then(function(e){
            for(country in e.results){
                listOfCountries.push(e.results[country]);
            }
            console.log(listOfCountries);
            addToSelects();
        });
        
    }).catch((e)=>{
    
    });
});

addToSelects (()=>{
    countries = listOfCountries;
    for(country in listOfCountries){
        let item  = document.createElement('option');
        item.value = listOfCountries[country].id;
        if('currencySymbol' in listOfCountries[country]){
            item.text = `${listOfCountries[country].currencyName} => ${listOfCountries[country].currencySymbol}`;
        }else{
            item.text = `${listOfCountries[country].currencyName}`;
        }
        firstCurrency_Select.appendChild(item);
    }

    for(country in countries){
        let item  = document.createElement('option');
        item.value = countries[country].id;
        if('currencySymbol' in countries[country]){
            item.text = `${countries[country].currencyName} => ${countries[country].currencySymbol}`;
        }else{
            item.text = `${countries[country].currencyName}`;
        }
        secondCurrency_Select.appendChild(item);
    }
 });

getCountriesAndCurrencies();
function convert(){
    let firstCurrency = firstCurrency_Select.options[firstCurrency_Select.selectedIndex].value;
    let secondCurrency = secondCurrency_Select.options[secondCurrency_Select.selectedIndex].value;
    let amount = amonutInput.value;

    let indexInResponse = `${firstCurrency}_${secondCurrency}`;
    
    fetch(`${base_url}/convert?q=${firstCurrency}_${secondCurrency}&compact=y`)
        .then((response)=>{
            response.json().then(function(data){
                resultDiv.innerText = data[indexInResponse].val * amount;
            })
            
        })
        .catch((err)=>{
            console.log("[Error] Couldn't convert", err);
        })

}


