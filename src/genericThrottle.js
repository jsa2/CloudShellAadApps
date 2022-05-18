
module.exports = async function Throttld(burstCount, data, invokeFn, wait) {
    var count = 0
    var fullar = []
    var burstArray = []
    var residue = data.length % burstCount

    console.log('residue is', residue)

    for await (item of data) {

        count++

        burstArray.push(item)

        if (count % burstCount == 0) {
            console.log('chunk sent')
           
            fullar.push(burstArray)
            if (invokeFn && wait) {
                await invokeFn()
            }
            if (invokeFn && !wait) {
                 invokeFn()
            }
            var burstArray = []
        }
    }
    var resid = data.splice((data.length - residue), data.length)
    if (resid.length > 0) {
        console.log(resid < 0)
        console.log('residss')
        fullar.push(resid)
        if (invokeFn && wait) {
            await invokeFn()
        }
        if (invokeFn && !wait) {
             invokeFn()
        }
    }
    console.log(fullar)
}

