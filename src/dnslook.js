
const { resolveAny } = require('dns').promises;

/* main()
async function main () {
var r = await getWebSitesName('a2z.dewi.red')
console.log(r)
}
 */

async function getWebSitesName (object) {
var {fqdn,id} = object
var address = fqdn.split('//')[1].split('/')[0]
    try { 
        await resolveAny(address)
        return {fqdn,id,failed:false}
} catch (error) {
    return {fqdn,id, failed:true}
}
   

}

module.exports={getWebSitesName}