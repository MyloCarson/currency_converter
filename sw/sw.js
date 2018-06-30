let cacheName = "currency-cache-v2";
let cacheFiles = [
    '/',
    '/main',
    '/main/index.html',
    '/sw',
    '/sw/index.js',
    '/sw/sw.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
    ];

self.addEventListener('install', (e)=>{
    console.log("[ServiceWorker] Installed");

    e.waitUntil(
        caches.open(cacheName)
            .then(function(cache){
                console.log('[ServiceWorker] Caching cachefiles');
                cache.addAll(cacheFiles);
            })
    );
});

self.addEventListener('activate', (e)=>{
    console.log("[ServiceWorker] Activated");

    e.waitUntil(
        caches.keys()
            .then((cacheNames)=>{
                return Promise.all(cacheNames.map((thisCacheName)=>{

                    if(thisCacheName !== cacheName){
                        console.log('[ServiceWorker] Removing cached files from ', thisCacheName);
                        return caches.delete(thisCacheName);
                    }
                }))
            })
    );
});

self.addEventListener('fetch',(e)=>{
    console.log("[ServiceWorker] Fetching ", e.request.url);
})

