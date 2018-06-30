import idb from 'idb';

const base_url = "https://free.currencyconverterapi.com/api/v5";

const storeName = "currencies_country_list";

const firstCurrency_Select = document.getElementById("firstCurrency_Select");
const secondCurrency_Select = document.getElementById("secondCurrency_Select");
const amonutInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const button = document.getElementById('convert');


let listOfCountries = [];
let countries = [];

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
        console.log("[IDB] ",val);
        if(val.length < 1) getCountriesAndCurrencies();
        else{ 
            listOfCountries = val;
            addToSelects();
        }
    });


let getCountriesAndCurrencies = ()=>{
    fetch(`${base_url}/currencies`).then((data)=>{
        data.json().then(function(e){
            for(let country in e.results){
                listOfCountries.push(e.results[country]);
            }
            dbPromise
                .then((db)=>{
                    let transaction = db.transaction(storeName,'readwrite');
                    let store = transaction.objectStore(storeName);
                    store.delete('first');
                    return ransaction.complete;
                });
                dbPromise
                .then((db)=>{
                    let transaction = db.transaction(storeName,'readwrite');
                    let store = transaction.objectStore(storeName);
                    store.put(listOfCountries,'first');
                    return transaction.complete;
                });
            console.log(listOfCountries);
            addToSelects();
        });
        
    }).catch((e)=>{
    
    });
};

let addToSelects  = ()=>{
    countries = listOfCountries;
    for(let country in listOfCountries){
        let item  = document.createElement('option');
        item.value = listOfCountries[country].id;
        if('currencySymbol' in listOfCountries[country]){
            item.text = `${listOfCountries[country].currencyName} => ${listOfCountries[country].currencySymbol}`;
        }else{
            item.text = `${listOfCountries[country].currencyName}`;
        }
        firstCurrency_Select.appendChild(item);
    }

    for(let country in countries){
        let item  = document.createElement('option');
        item.value = countries[country].id;
        if('currencySymbol' in countries[country]){
            item.text = `${countries[country].currencyName} => ${countries[country].currencySymbol}`;
        }else{
            item.text = `${countries[country].currencyName}`;
        }
        secondCurrency_Select.appendChild(item);
    }
 }

let  convertCurrency = ()=> {
    
    let firstCurrency = firstCurrency_Select.value;
    let secondCurrency = secondCurrency_Select.value;
    let amount = amonutInput.value;

    let indexInResponse = `${firstCurrency}_${secondCurrency}`;
    
    fetch(`${base_url}/convert?q=${firstCurrency}_${secondCurrency}&compact=y`)
        .then((response)=>{
            response.json().then(function(data){
                console.log(data);
                resultDiv.innerText = data[indexInResponse].val * amount;
            })
            
        })
        .catch((err)=>{
            console.log("[Error] Couldn't convert", err);
        })

};

$('#convert').click(() => {
    convertCurrency();
});



