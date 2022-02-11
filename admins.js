const { axiosClient } = require("./src/axioshelpers")
const { batchThrottledSimple } = require("./src/batcher2")
const getToken = require("./src/getToken")

module.exports={admins}
//admins()
async function admins () {

    var graphToken = await getToken()
    
    var {value:roles} = await genericGraph({
       responseType: 'json',
       "method": "get",
       url: `https://graph.microsoft.com/beta/directoryRoles/`,
       headers: {
         'content-type': "application/json",
         authorization: "Bearer " + graphToken
       }
     }).catch((error) => {
       console.log(error)
     })
    
     roles.map((item) => {
    
      item.runContext= {
         fn: genericGraph,
         opts:{
          refInfo:item?.displayName,
          responseType: 'json',
          "method": "get",
          url:`https://graph.microsoft.com/beta/directoryRoles/${item.id}/members`,
          headers:{
              'content-type':"application/json",
              authorization:"Bearer " + graphToken
          },
        /*   timeout:2000 */
      }
      }
    })
    
    
    let admins = await batchThrottledSimple(7,roles)

    var list =[]
    admins.map(it => {
        it.value.filter(ob => ob['@odata.type'] !== '#microsoft.graph.user' ).forEach(spn => {
            let {appId, id, displayName} = spn
            list.push({id, displayName, appId, role:it.refInfo })
        })
    })

    if (list.length > 0) {
        require('fs').writeFileSync('./material/admins.json',JSON.stringify(list))
        return "admin completed"
    }
   
   
    require('fs').writeFileSync('./material/admins.json',`[{"role":"","displayName":""}]`)

}



async function genericGraph (options) {
    console.log(options.url)
 if (options?.refInfo) {
     var {refInfo} = options
     delete options.refInfo
 }
    var data = await axiosClient(options).catch((error) => {
        return Promise.reject(error)
    })

    if (refInfo) {
        data.refInfo=refInfo
        return data
    } else {
        return data
    }
    }