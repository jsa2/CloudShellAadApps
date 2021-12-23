//const { createStorage } = require("./SchemaStorage");
const getToken = require('./src/getToken')
const {createContainer} = require('./src/src')
async function main () {

    console.log('testing access tokens')

    var t = await getToken().catch((error) => {
        throw new Error('Unable to work with Access Tokens',error)
    })

 
    console.log('Az access ok',t.substring(0,15))

    console.log('testing storage')
   var s =await createContainer('sdasdasdsarewrewrewre').catch(error => {
        console.log( error )
        return Promise.reject(`Unable to work with storage ${error}` )
    })

    console.log('storage access ok',s)

}


main().catch((error) => {
    console.log(error)
})