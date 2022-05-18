var {graph, graphList, graphOwner, graphExtended} = require('./src/graphf')
const fs = require('fs')

module.exports={main}

async function main (token) {

  

    var gRsponse2=[]
    var firstop = 'oauth2PermissionGrants'
    await graphList(token,firstop, undefined, gRsponse2).catch((error) => {
        console.log(error)
    })
    fs.writeFileSync(`${firstop}.json`,JSON.stringify(gRsponse2))
    
    var users = new Set(gRsponse2.map(user => user.principalId))
    //console.log(users)

    var usersProm = []
    var usersList = []
    users.forEach((user) => {
        if(user !== null) {

            usersProm.push(
                graph(token,`users/${user}`).catch((error) => {
                    console.log(error)
                }).then((user) => {
                   usersList.push(user)
                })
            )

        }
        
    })

    await Promise.all(usersProm)
    fs.writeFileSync('users.json',JSON.stringify(usersList))

 
    
    //Apps begin here
    var gRsponse1=[]
    var firstop = 'applications'
    await graphList(token,firstop, undefined, gRsponse1).catch((error) => {
        console.log(error)
    })

    fs.writeFileSync(`${firstop}-save.json`,JSON.stringify(gRsponse1))
   

    let proxArra = []

    gRsponse1.filter( proxyApp => proxyApp?.web?.logoutUrl !== null).filter(s => s.web?.logoutUrl.toLowerCase().match('appproxy=logout')  )
    .forEach(prx => {
     
        
        
        proxArra.push( graphExtended(token,`applications/${prx.id}?$select=onPremisesPublishing,appId`) )


    })

    let AppProxyApps = await Promise.all(proxArra)

    


    var appArra =[]
    var appList = []
    
 
    var burstCount = 40
    var i = 0
    for await (app of gRsponse1) {
        i++
        console.log(i)
        if (i % burstCount == 0) {
            await waitT(1000)
        }
        console.log('checking', app.appId)
        appArra.push(
            graphOwner(token, `applications/${app.id}/owners`, app.appId).catch((error) => {
                console.log('error', error)
            }).then((data) => {
                if (data?.userPrincipalName?.length > 0) { 

                    if(data.appId == "dca4e297-f238-4e84-93f1-f443ace5adc9") {
                        console.log('mat')  
                    }

                    console.log('pushing to', data.appId)
                    appList.push({
                        appId: data.appId,
                        userPrincipalName: data.userPrincipalName.map((item) => {
                            return item.userPrincipalName
                        })
                    })
                }
                
            })
        )

    }

    await Promise.all(appArra)
    //Apps end here

    fs.writeFileSync(`${firstop}.json`,JSON.stringify(appList))



    var gRsponse=[]
    var firstop = 'servicePrincipals'
    await graphList(token,firstop, undefined, gRsponse).catch((error) => {
        console.log(error)
    })

    // Map owners to SPN here

    gRsponse.map((item) => {
        item.owners = appList.find((app) => {
            item.owners = []
            if (app.appId == item.appId) {
                return item.owners = app.userPrincipalName
            }
        })

        if (item.owners?.appId) {
            delete item.owners.appId
        }
        //console.log(item.owners)
       
    })

    gRsponse.map((item) => {
        if (!item.owners) {
            item.owners=[]
        }
    })

    gRsponse.map(app => {
        app.onPremisesPublishing = AppProxyApps.find( s => s.appId == app.appId)?.onPremisesPublishing || null

        if (app.onPremisesPublishing) {
            console.log('sd')
        }
        
    })

    
    fs.writeFileSync(`${firstop}.json`,JSON.stringify(gRsponse))

  var promArra =    []
  var spnList = []

  function waitT (ms) {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve('waited')
          }, ms);
      }
      
      )
      
  }

  var burstCount = 50
 var i = 0
  for await (spn of gRsponse) {
    i ++
    console.log(i)
    if (i % burstCount == 0) {
        await waitT(1000)
    }
    promArra.push(
        graph(token,`servicePrincipals/${spn.id}/appRoleAssignedTo`).catch((error) => {
            console.log('error',error)
        }).then((data) => {
            
            if (data?.length > 0) {
                console.log(data)
                data.forEach((item) => spnList.push(item))
            }
        })
    )

  }

  /*   gRsponse.forEach((spn) => {

        promArra.push(
            graph(token,`servicePrincipals/${spn.id}/appRoleAssignedTo`).catch((error) => {
                console.log('error',error)
            }).then((data) => {
                
                if (data?.length > 0) {
                    data.forEach((item) => spnList.push(item))
                }
            })
        )
    }) */

    await Promise.all(promArra)
    fs.writeFileSync(`roles.json`,JSON.stringify(spnList))


}
