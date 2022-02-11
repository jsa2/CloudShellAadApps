var users = require('./users.json')
var oauth2Grants = require('./oauth2PermissionGrants.json')
var spns = require('./servicePrincipals.json')
var applications = require('./applications-save.json')


oauth2Grants.map((item) => {
    
    var match = users.find((user) => user.id == item.principalId)
    
    item.userPrincipalName = match?.userPrincipalName || null
    return item
} )

oauth2Grants.map((item) => {

    var match = spns.find((spn) => spn.id == item.resourceId)
   
    item.resourceDisplayName = match.displayName || null

})

spns.map( (item) =>{

    var pw = applications.find((spn) => spn.appId == item.appId )
    
    if (pw?.passwordCredentials.length > 0) {
     item.passwordCredentialsExpiring = pw?.passwordCredentials.map((cred) =>{
        var remainingDays = getNumberOfDays(new Date(), new Date(cred.endDateTime))
        return {
            remainingDays,
            displayName:cred.displayName
        }

     })
    }

    item.passwordCredentialsExpiring =item?.passwordCredentialsExpiring || []

    item.nextExpiration = item.passwordCredentialsExpiring.sort((a,b) =>{
        console.log(a)
    })

    item.ApplicationHasPassword = pw?.passwordCredentials || item.passwordCredentials
    delete item.appRoles; delete item.oauth2PermissionScopes

})

// console.log(oauth2Grants)

require('fs').writeFileSync('./material/servicePrincipalsUP.json',JSON.stringify(spns))

require('fs').writeFileSync('./material/oauth2PermissionGrantsUP.json',JSON.stringify(oauth2Grants))