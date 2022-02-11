const getToken = require("./src/getToken");

getToken().then((data) => {
    console.log(data)
}).catch((error) => {
    console.log(error)
})