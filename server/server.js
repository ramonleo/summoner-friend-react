import appModulePath from 'app-module-path';
import http from 'http';
import express from 'express';
import cors from 'cors';

appModulePath.addPath(`${__dirname}`);

const Api = express();
const HTTP = http.Server(Api);

Api.use(cors());

Api.get('/test', (req, res) => res.status(200).send('aeeee porraa!'));
Api.get('/friends/get', (req, res) => res.status(200).send(friendsCache));
Api.get('/hextech/inventory', (req, res) => getInventory().then(inventory => res.status(200).send(inventory)));

HTTP.listen(9001, () => {
    console.log('listening on *:9001');
});




//const LocalStorage = require("./helpers/local-storage-helper.js")

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
var {
    get,
    post,
    put,
    del,
    setAuth
} = require("./utils/methods.js")

const LCUConnector = require('lcu-connector')
const connector = new LCUConnector()
const fs = require("fs")
const JSONStream = require( "JSONStream" );
const json = require("big-json")
//const FriendsElements = require("./components/friends-elements.js")
//global cache
let friendsCache = {};
let matchesCache = {};
let inventoryCache = {}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const getInventory = async () => {
    let inventory = undefined;
    if ("inventory" in inventoryCache) {
        inventory = inventoryCache.inventory;
        if (new Date() - inventoryCache["lastUpdate"] < 60000) {
            return inventory;
        }
    }
    await get("/lol-loot/v1/player-loot-map/").then(function(res) {
        inventory = res;
        inventoryCache["inventory"] = inventory;
        inventoryCache["lastUpdate"] = new Date();
    });
    return inventory
}

// Refresh Friend History
function refreshMatchHistory() {    
    setTimeout(async () => {  
        console.log("Started Match History Refresh");      
        for (const [puuid, summoner] of Object.entries(friendsCache)) {
            let requestCount = 0;
            if (!(puuid in matchesCache)) {
                let matchHistory = {}
                matchHistory["puuid"] = puuid
                matchHistory["matches"] = []
                matchesCache[puuid] = matchHistory
            }

            //Checks if matches has been updated in the last 20 minutes
            console.log("Diferenca de " + (new Date() - summoner["matchesLastUpdate"]) + " milisegundos")
            console.log(new Date().getTime())
            console.log(summoner["matchesLastUpdate"])
            
            if(Date.now() - summoner["matchesLastUpdate"] < 1200000) { //1200000
                console.log("Match history for " + summoner["friendData"]["gameName"] + " is already up to date");
                continue;
            } else {
                if(!("gameName" in summoner["friendData"])) {
                    console.error("No gamename for " + puuid);
                    console.log(summoner);
                }
                console.log("Updating Matches For: " + summoner["friendData"]["gameName"])
                let doneUpdating = false
                let begIndex = 0
                let endIndex = 200 
                
                do {
                    //waits 2  second between requests
                    await sleep(2000);
                    console.log("BegIndex: " + begIndex + " EndIndex: " + endIndex)                    
                    await get("/lol-match-history/v1/products/lol/"+ puuid + "/matches?begIndex=" + begIndex + "&endIndex=" + endIndex).then(function(res) {
                        console.log(requestCount);
                        requestCount++;
                        let games;
                        if("games" in res) {
                            games = res["games"]["games"]
                        } else {
                            games = []
                            console.error("No Game Data Found for " + summoner["friendData"]["gameName"])
                            doneUpdating = true;
                            return;
                        }
                        if (games.length == 0) {
                            console.log("No More Games For " + summoner["friendData"]["gameName"] + "! " + requestCount + " Requests")
                            doneUpdating = true;
                            summoner["matchesLastUpdate"] = Date.now()
                            summoner["matchesHistory"] = true
                            saveCache();
                            return;
                        }
                        games.forEach(game => {
                            game["puuid"] = puuid //Adding identifier to match

                            if(!(game["gameId"] in matchesCache[puuid]["matches"])) {
                                matchesCache[puuid]["matches"][game["gameId"]] = game
                            } else {
                                if (summoner["matchesHistory"]) {
                                    doneUpdating = true;
                                    console.log("Nothing new for " + summoner["friendData"]["gameName"] + "!")
                                    return;
                                } 
                            }                            
			
                            let matchSummonerName = game["participantIdentities"][0]["player"]["summonerName"]
                            if(!(matchSummonerName in summoner["previousNames"])) {
                			    summoner["previousNames"][matchSummonerName] = {
                                    firstSeen: game["gameCreationDate"],
                                    lastSeen: game["gameCreationDate"]
                                }
                            } else {
                                if (game["gameCreationDate"] > summoner["previousNames"][matchSummonerName]["lastSeen"]) {
                                    summoner["previousNames"][matchSummonerName]["lastSeen"] = game["gameCreationDate"]
                                }
                                if (game["gameCreationDate"] < summoner["previousNames"][matchSummonerName]["firstSeen"]) {
                                    summoner["previousNames"][matchSummonerName]["firstSeen"] = game["gameCreationDate"]
                                }
                            }
                        })
                        begIndex += 200
                        endIndex += 200
                    }).catch(err => {
                        console.log(err)
                    });
                    
                } while (!doneUpdating);
            }            
            
        };
        setTimeout(() => {
            refreshMatchHistory();            
        }, 5000);
    }, 1000);
        
	return null
}
function refreshFriend(friend) {
    let sid = friend['id']
    let puuid = friend['puuid']
    let summonerId = friend['summonerId']
 
    let summoner = {
        friendData: friend,
        previousNames: {},
        createDate: new Date(),
        lastUpdate: new Date(),
        matchesLastUpdate: 0,
        matchesHistory: false

    }
    if (!(friendsCache.constructor === Object)) {
        friendsCache = {}
    }
    if (!(puuid in friendsCache)) {
        friendsCache[puuid] = summoner
    } else {
        friendsCache[puuid]["friendData"] = summoner["friendData"];
        friendsCache[puuid]["lastUpdate"] = new Date();
    }
}

const keepFriendsUpdated = async () => {
    //Keep refreshing friends
    setInterval(() => {
        console.log("Getting friends")
        
        get("/lol-chat/v1/friends").then(res => {
            if (res.code == "ECONNREFUSED") {

            }
            if (res.httpStatus == 404) {

            }
            res.forEach(friend => {
                let refreshed = refreshFriend(friend)
            });
            //let friendListElement = document.getElementById("friend-list")
            //friendListElement.innerHTML = ""
            /*FriendsElements.FriendListHtmlElements(Object.values(friendsCache)).forEach(element => {
                friendListElement.appendChild(element)
            });*/
        });
    }, 5000)
}

// Connect to LCU event
connector.on('connect', (data) => {
    console.log("Connected to LCU")
    console.log(data)    
    //window.auth = data    
    setAuth(data);
/*
    get("/swagger/v2/").then(res => {
        if (res.code == "ECONNREFUSED") {

        }
        if (res.httpStatus == 404) {

        }
        console.log(res)
    });
    return;*/
    loadCache(); //Loads the cache from local storage and refreshes the friends
    setInterval(() => {
        saveCache();
    }, 60000); //Saves the cache every minute



    /*document.getElementById("container").style.display = "flex"
    document.getElementById("waiting").style.display = "none"
    const node = document.getElementById("window")
    node.replaceWith(...node.childNodes);
    document.getElementById("waiting").remove()
*/
})

// Check if request status is ok
const stat = (res) => {
    console.log(res.status)
    return ((res.status == 204 || res.status == 201 || res.status == 200) ? true : false);
}

const saveCache = () => {
    console.log("Going to save cache")
    //console.log(friendsCache)

    var transformStream_friends = JSONStream.stringify();
    var outputStream_friends = fs.createWriteStream("./storage/friendsCache.json" );

    var transformStream_matches = JSONStream.stringify();
    var outputStream_matches = fs.createWriteStream("./storage/matchesCache.json" );

    // In this case, we're going to pipe the serialized objects to a data file.
    transformStream_friends.pipe( outputStream_friends );
    transformStream_matches.pipe( outputStream_matches );
    
    // Iterate over the records and write EACH ONE to the TRANSFORM stream individually.
    // --
    // NOTE: If we had tried to write the entire record-set in one operation, the output
    // would be malformed - it expects to be given items, not collections.
    //console.log("Saving:")
    //console.log(friendsCache)

    Object.values(matchesCache).forEach( (matchCache) => {
        Object.values(matchCache["matches"]).forEach( transformStream_matches.write );
    });
    Object.values(friendsCache).forEach( transformStream_friends.write );
    
    // Once we've written each record in the record-set, we have to end the stream so that
    // the TRANSFORM stream knows to output the end of the array it is generating.
    transformStream_matches.end();
    transformStream_friends.end();
    
    // Once the JSONStream has flushed all data to the output stream, let's indicate done.
    outputStream_matches.on(
        "finish",
        function handleFinish() {
            console.log("Matches Cache saved")    
        }
    );
    outputStream_friends.on(
        "finish",
        function handleFinish() {
            console.log("Friends Cache Saved")    
        }
    );      
    
}

const loadCache = () => {
    if (!fs.existsSync("./storage/friendsCache.json")) fs.writeFileSync("./storage/friendsCache.json", "");
    const readStream_friends = fs.createReadStream('./storage/friendsCache.json');
    const parseStream_friends = json.createParseStream();

    if (!fs.existsSync("./storage/matchesCache.json")) fs.writeFileSync("./storage/matchesCache.json", "");
    const readStream_matches = fs.createReadStream('./storage/matchesCache.json');
    const parseStream_matches = json.createParseStream();

    
    parseStream_friends.on('data', function(pojo) {
        // => receive reconstructed POJO
        console.log("Friends Cache loaded")
        //console.log(pojo);
        for (let key in pojo) {
            friendsCache[pojo[key]["friendData"]["puuid"]] = pojo[key]
        }
        //friendsCache = pojo[0]
        //Tests if friendsCache is undefined
        if (friendsCache == undefined) {
            friendsCache = {}
        }
        

        //console.log("Friends Cache")
        //console.log(friendsCache)
    
        keepFriendsUpdated()    
    });
    
    readStream_friends.pipe(parseStream_friends);

    parseStream_matches.on('data', function(pojo) {
        // => receive reconstructed POJO
        console.log("Matches Cache loaded")
        for (let key in pojo) {
            let puuid = pojo[key]["puuid"]
            let gameId = pojo[key]["gameId"]
            if (!(puuid in matchesCache)) {
                matchesCache[puuid] = {
                    "puuid": puuid,
                    "matches": []
                }
            }
            matchesCache[puuid]["matches"][gameId] = pojo[key]
        }
        //friendsCache = pojo[0]
        //Tests if friendsCache is undefined
        if (matchesCache == undefined) {
            matchesCache = {}
        }

        //console.log("Friends Cache")
    
        
        refreshMatchHistory()
    
    });
    
    readStream_matches.pipe(parseStream_matches);    

}

// Start listening for the LCU client
connector.start();