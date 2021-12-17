var appr = require('./roles.json')
var spns = require('./servicePrincipals.json')


appr.map((item) =>{

    var spn = spns.find((spn) => spn.id == item.resourceId )
    var role= spn?.appRoles.find((role) => role.id == item.appRoleId)

       spn
       role

        item.appOwnerOrganizationId = spn.appOwnerOrganizationId
        item.assignedRole = role || 'no roles'

})


console.log(appr)

require('fs').writeFileSync('./material/rolesUP.json',JSON.stringify(appr))