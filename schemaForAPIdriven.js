var pathLoc = 'material'
var fs = require('fs')
var path = require('path')
var {createStorage} = require('./SchemaStorage')
//var chalk = require('chalk')

main()

async function main ( ) {

var files = fs.readdirSync(path.resolve(pathLoc))
var tid = fs.readFileSync('kql/tid.txt').toString()
var fullSchema = `let home="${tid}"; \n //`
for await (file of files) {
    
    var content = require(`./${pathLoc}/${file}`)
    //console.log( chalk.yellow('\nschema for', file, '\n' ))
    var schema = `\nlet ${file.split('.json')[0]} = (externaldata (`
    
    try {delete content[0]['@odata.id']} catch (error) {
      console.log('different schema')
    }

    var k =  Object.keys(content[0])
    k.forEach((key, index) => {
    
       var type = typeof(content[0][key])
       if (type == "object") {
        schema += `${key}: dynamic` 
       } else {
        schema += `${key}: string` 
       }
      
       if (index !== (k.length - 1)) {
           schema += ", "
       }
    })
    var url = await createStorage(pathLoc,file,`./${pathLoc}/${file}`)
schema += `)[@"${url}"] with (format="multijson"));`
schema +=  '\n //'
fullSchema+=schema

  }
 
  var baseq = fs.readFileSync('kql/apiSort.kql').toString()
  fs.writeFileSync('kql/runtime.kql',fullSchema+baseq)
 
}



