const fs = require('fs')
//const chalk = require('chalk')

var sta = require('./config.json').connectionString
//console.log(sta)
process.env['AZURE_STORAGE_CONNECTION_STRING']=sta
const {createBlobService,BlobUtilities} = require('azure-storage')

const blobsvc = createBlobService()

//console.log('init')

function getSasUrl (container,name,duration,IPAddressOrRange) {

var d1 = new Date (),
d2 = new Date ( d1 );
d2.setMinutes ( d1.getMinutes() + duration );
   
    var sharedAccessPolicy = {
        AccessPolicy: {
          Permissions: BlobUtilities.SharedAccessPermissions.READ,
          Start: d1,
          Expiry: d2,
          Protocols:"https",
        }
      };

      console.log(sharedAccessPolicy)

      if (IPAddressOrRange )  {
          sharedAccessPolicy.AccessPolicy.IPAddressOrRange = IPAddressOrRange
      }
    
      var sas = blobsvc.generateSharedAccessSignature(container,name,sharedAccessPolicy)
     
      var url = blobsvc.getUrl(container,name,sas)
    
    
       return (url)
    /* 
        var sas = BlobClientWithToken.generateSharedAccessSignature(container,,sharedAccessPolicy)
        var url = blobsvc.getUrl(container, upload, cred); */
    
    }


function createContainer (container) {

    return new Promise ((resolve,reject) => {

        blobsvc.createContainerIfNotExists(container, (err,result) => {
           // console.log(result)
            
            if (err) {
                return reject(err)
            }

            return resolve(result)
        })

    })

    

}

 async function upload (container,file,filepath) {

    return new Promise ((resolve,reject )=> {
      
     blobsvc.createBlockBlobFromLocalFile(container,file,filepath,(err,result,response) => {
        //console.log(result)
            
        if (err) {return reject(err)}

        return resolve(result)
     })

    })

   
   
}

//reads()
module.exports={createContainer,upload,getSasUrl,createContainer}