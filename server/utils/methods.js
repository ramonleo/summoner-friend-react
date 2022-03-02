const fetch = require("node-fetch")
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

let _auth = {}
const setAuth = (auth) => {
    _auth = auth
};
const get = (endpoint) => {
    return new Promise(function(resolve, reject) {
        console.log("get - " + endpoint) 
        resolve(fetch(`${_auth.protocol}://${_auth.address}:${_auth.port}${endpoint}`, {
                headers: {
                    'Accept': "application/json",
                    'Authorization': `Basic ${Buffer.from(`${_auth.username}:${_auth.password}`).toString("base64")}`
                },
            })
            .then(res => res.text())
            .then(res => {
                return res === "" ? {} : JSON.parse(res);
            })
        )
    })
}

const post = (endpoint, body) => {
    return new Promise(function(resolve, reject) {
        resolve(fetch(`${_auth.protocol}://${_auth.address}:${_auth.port}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${_auth.username}:${_auth.password}`).toString("base64")}`
                }
            })
            // .then(res => res.text())
            // .then(res => {
            //     return res === "" ? {} : JSON.parse(res);
            // })
        )
    })
}

const del = (endpoint) => {
    return new Promise(function(resolve, reject) {
        resolve(fetch(`${_auth.protocol}://${_auth.address}:${_auth.port}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${_auth.username}:${_auth.password}`).toString("base64")}`
                }
            })
            // .then(res => res.text())
            // .then(res => {
            //     return res === "" ? {} : JSON.parse(res);
            // })
        )
    })
}

const put = (endpoint, body) => {
    return new Promise(function(resolve, reject) {
        resolve(fetch(`${_auth.protocol}://${_auth.address}:${_auth.port}${endpoint}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${_auth.username}:${_auth.password}`).toString("base64")}`
                }
            })
            .then(res => res.text())
            .then(res => {
                return res === "" ? {} : JSON.parse(res);
            }))
    })
}

module.exports = {
    get,
    post,
    put,
    del,
    setAuth
}