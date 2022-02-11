var users = require('./users.json')
var oauth2Grants = require('./oauth2PermissionGrants.json')
var spns = require('./servicePrincipals.json')
var applications = require('./applications-save.json')
const { getWebSitesName } = require('./src/dnslook')

main()

async function main () {

    
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
    
    item.ApplicationHasPassword = pw?.passwordCredentials || item.passwordCredentials
    item.ApplicationHasPublicClient = pw?.isFallbackPublicClient || ""
    
    item.ApplicationHasRequiredAccess = pw?.requiredResourceAccess.map((res) => {

        var spm =spns.find((spn) => spn.appId == res.resourceAppId)
       
        res.resourceAccess = res?.resourceAccess || []
        if (spm) {
            return res?.resourceAccess.map(({id}) => {
                    spm.appRoles = spm?.appRoles || []
                    //console.log(spm.appRoles.length)
                    spm.oauth2PermissionScopes = spm?.oauth2PermissionScopes || []
                    var oauth2R = spm?.oauth2PermissionScopes.find((role) => role.id == id)
                   if (oauth2R) {
                       oauth2R.resource = spm?.appDisplayName || []
                       return oauth2R
                   }
                }) || []
        }
        
        
    }) 

    

    delete item.appRoles; delete item.oauth2PermissionScopes

})


var rs = []

spns.map( spn => {
    spn.replyUrls.filter(item => item.match('azurewebsites.net')).forEach(item => {
        rs.push(getWebSitesName({fqdn:item,id:spn.id}))
    })
})
       
var s= await Promise.all(rs)
var dangl = s.filter(item => item.failed == true)
spns.map(item => {
    
   item.danglingRedirect= dangl.filter(spn => spn.id == item.id) || undefined || {}
})


// console.log(oauth2Grants)

require('fs').writeFileSync('./material/servicePrincipalsUP.json',JSON.stringify(spns))

require('fs').writeFileSync('./material/oauth2PermissionGrantsUP.json',JSON.stringify(oauth2Grants))

}
