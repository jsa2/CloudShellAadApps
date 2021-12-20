const { decode } = require("jsonwebtoken");
const { main } = require("./Client2");
const getToken = require("./src/getToken");
const { runner } = require("./src/pluginRunner");
const fs = require('fs');
const { exec } = require("child_process");
const wexc = require('util').promisify(exec)

run()

async function run () {

var token = await getToken()

   var tEnc = decode(token)
   fs.writeFileSync('kql/tid.txt',tEnc.tid)

       await main({
           access_token:token,
           resource:"https://graph.microsoft.com"
       })

       try {
           await wexc('node nodeparse.js').catch((error) => {
               console.log(error)
           })
           await wexc('node nodeparse2.js')
           //await wexc('node dynamicSend.js')
           console.log('creating query')
           await wexc('node schemaForExternalDataExtended.js')
           console.log('open kql/runtime.kql')
       } catch (error) {
          console.log('faield', error)
       }


}
