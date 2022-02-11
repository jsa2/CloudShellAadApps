const getToken = require("./src/getToken");
const { graphList,graphListS } = require("./src/graphf");
const fs = require('fs')






//https://docs.microsoft.com/en-us/graph/query-parameters

module.exports={getSignIns}

//getSignIns(24)
async function getSignIns (hours) {

var d1 = new Date (),
d2 = new Date ( d1 );
//d2.setHours ( d1.getHours() + 24 );
d2.setHours ( d1.getHours() - hours );
var date = d2.toISOString()
//var d1 = new Date ().toISOString(),


    var token = await getToken()

    var s = `auditLogs/signIns?&$filter=signInEventTypes/any(t: t eq 'interactiveUser' or t eq 'nonInteractiveUser' or t eq 'servicePrincipal' or t eq 'managedIdentity') and (createdDateTime ge ${date})`

    token.resource = "https://graph.microsoft.com"
    var signins= []
    await graphListS({
        access_token:token,
        resource:"https://graph.microsoft.com"
    }, s,undefined,signins)

   // console.log(signins)
    fs.writeFileSync('./material/signins.json',JSON.stringify(signins))
    

}