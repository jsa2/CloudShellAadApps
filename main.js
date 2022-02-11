const { decode } = require("jsonwebtoken");
const { main } = require("./Client2");
const getToken = require("./src/getToken");
const fs = require('fs');
const { exec } = require("child_process");
const { preCheck } = require("./precheck");
const { admins } = require("./admins");
const wexc = require('util').promisify(exec)

run().catch((error) => {
    console.log(error)
})

async function run () {

await preCheck().catch((error) => {
    return Promise.reject(`Unable to work due prerequisites failing: ${error}` )
})

var token = await getToken()

   var tEnc = decode(token)
   fs.writeFileSync('kql/tid.txt',tEnc.tid)

       await main({
           access_token:token,
           resource:"https://graph.microsoft.com"
       })

      await admins()

       try {
           await wexc('node nodeparse.js').catch((error) => {
               console.log(error)
           })
           await wexc('node nodeparse2.js')
           //await wexc('node dynamicSend.js')
           console.log('creating query')
           await wexc('node schemaForExternalData.js')
           console.log('open kql/runtime.kql')
       } catch (error) {
          console.log('faield', error)
       }


}
