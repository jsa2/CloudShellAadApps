const {createContainer, upload, getSasUrl } = require('./src/src')


async function createStorage (container,file, filePath) {

    await createContainer(container).catch(error => {
        console.log( error )
        throw new Error('Unable to work with storage',error)
    })
    await upload(container, file, filePath)
    //120 is 120 hours, change the value to desired amount
    var url = getSasUrl(container, file, 10)
    
    return url

}


module.exports={createStorage}
