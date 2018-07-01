let cacheName = "currency-cache-v4";
let cacheFiles = [
    '/',
    '/main',
    '/index.html',
    '/sw',
    '/index.js',
    '/sw/sw.js',
    '/node_modules',
    'webpack.config.js',
    '/build',
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
    e.respondWith(

        caches.match(e.request)
            .then((response)=>{
                if(response){
                    console.log("[ServiceWorker] Found in cache", e.request.url);
                    return response;
                }

                let requestClone = e.request.clone();
                fetch(requestClone)
                    .then((response)=>{
                        if(!response){
                            console.log("[ServiceWorker] No resp for fetch");
                            return response;
                        }

                        let responseClone = response.clone();
                        caches.open(cacheName)
                            .then((cache)=>{
                                console.log("[ServiceWorker] New Data ", e.request.url);
                                cache.put(e.request,responseClone);
                                return response;
                            });
                    }).catch((err)=>{
                        console.log("[ServiceWorker] Error Fetch and Caching new files",err);
                    })
            })
    );
});

