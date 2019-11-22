
const optget = require('../optget')

const exemple1 = {
   
    optgetParams : [
        {
            name : 'value',
            type : "String",
            min_aliases : ['v']
        }
    ],

    validCommands : [
        'node test --value=yolo',
        'node test --value yolo',
        'node test -v=yolo',
        'node test -v yolo'
    ],

    failCommands : [
        'node test --value=yolo yolo',
        'node test --value= yolo',
        'node test --value=',
        'node test --other=yolo',
        'node test yolo',
    ]
}

const exemple2 = {
   
    optgetParams : [
        {
            name : 'value',
            type : "Integer",
            aliases : ['other']
        }
    ],

    validCommands : [
        'node test --value=45',
        'node test --value 45',
        'node test --other=45',
        'node test --other 45',
        'node test --value=45 --value=12',
        'node test --value=45 -v 12',
    ],

    failCommands : [
        'node test --value=yolo',
        'node test --value= yolo',
        'node test --value=45 --value2=12',
    ]
}

const exemple3 = {
   
    optgetParams : [
        {
            name : 'value',
            type : "Boolean",
            min_aliases : ['v']
        },
        {
            name : 'value2',
            type : "Url",
            isOptional : true
        }
    ],

    validCommands : [
        'node test --value=true',
        'node test --value=false',
        'node test --value',
        'node test -v=true',
        'node test -v=false',
        'node test -v',
        'node test --value --value2=https://www.npmjs.com',
        'node test --value --value2=https://localhost',
        'node test --value --value2=https://localhost:3000',
    ],

    failCommands : [
        'node test --value=true2',
        'node test --value=false2',
        'node test --value=',
        'node test -v=',
        'node test --values2=https://www.npmjs.com',
        'node test -v --value2=skqclmkcqs',
    ]
}

const exemple4 = {
   
    optgetParams : [
        {
            name : 'value',
            type : "String",
            isOptional : true
        },
        {
            name : 'value2',
            type : "Boolean",
            isOptional : true,
            default : true
        }
    ],

    validCommands : [
        'node test --value=yolo',
        'node test',
        'node test --value2',
        'node test --value2 false',
    ],

    failCommands : [
    ]
}

const exemple5 = {
   
    optgetParams : [
        {
            name : 'value',
            type : "String",
            isOptional : true
        },
        {
            name : 'value2',
            type : "Boolean",
            isOptional : true,
            default : true
        }
    ],

    validCommands : [
        'node test --value=yolo',
        'node test',
        'node test --value2',
        'node test --value2 false',
    ],

    failCommands : [
    ]
}

const exemple6 = {
   
    optgetParams : [
        {
            name : 'value',
            values : ["yolo1", "yolo2", "yolo3"],
            isOptional : true,
            default : 0
        },
        {
            name : 'value2',
            values : [1, 2, 3],
            isOptional : true,
        }
    ],

    validCommands : [
        'node test --value=yolo1',
        'node test --value=yolo2',
        'node test',
        'node test --value2=1',
        'node test --value2=2',
    ],

    failCommands : [
        'node test --value=yolo4',
    ]
}

const exemple7 = {
   
    optgetParams : [
        {
            name : 'value',
            values : ["yolo1", "yolo2", "yolo3"],
            isOptional : true,
            isMultiple : true,
            default : 0
        },
        {
            name : 'value2',
            type : "String",
            isOptional : true,
            isMultiple : true,
            default : "tyu"
        },
        {
            name : 'value3',
            values : ["yolo1", "yolo2", "yolo3"],
            isOptional : true,
            isMultiple : true
        },
        {
            name : 'value4',
            type : "String",
            isOptional : true,
            isMultiple : true,
        },
    ],

    validCommands : [
        'node test --value=yolo1',
        'node test --value yolo1 yolo2',
        'node test --value2 coucou les amis',
        'node test',
    ],

    failCommands : [
        'node test --value yolo1 yolo4',
        'node test --value2',
    ]
}

const exemple8 = {
   
    optgetParams : [
        {
            name : 'value',
            type : "String",
        },
        {
            name : 'value2',
            type : "String",
            isMultiple : true,
        },
        {
            name : '...'
        }
    ],

    validCommands : [
        'node test --value=yolo1',
        'node test --value yolo1 --value2 coucou les amis',
        'node test --value2 coucou les amis --value yolo1 ceci un test',
    ],

    failCommands : [
        'node test --value yolo1 --value2',
        'node test  ceci un test --value2 coucou les amis --value yolo1',
    ]
}

const exemple9 = {
   
    optgetParams : [
        {
            name : '45value',
            type : "String",
        }
    ],

    validCommands : [
        'node test',
    ],

    failCommands : [
    ]
}

const exemple10 = {
   
    optgetParams : [
        {
            name : '-value',
            type : "String",
        }
    ],

    validCommands : [
        'node test',
    ],

    failCommands : [
    ]
}

const exemple11 = {
   
    optgetParams : [
        {
            name : '_ceci$',
            type : "String",
        }
    ],

    validCommands : [
        'node test',
    ],

    failCommands : [
    ]
}

const exemple12 = {
   
    optgetParams : [
        {
            name : 'help',
            type : "String",
        }
    ],

    validCommands : [
        'node test',
    ],

    failCommands : [
    ]
}

const exemple13 = {
   
    optgetParams : [
        {
            name : 'err',
            type : "String",
        }
    ],

    validCommands : [
        'node test',
    ],

    failCommands : [
    ]
}


const runExemple = (exemple) => {
    console.log('************************************************************************')
    console.log("Test :", exemple.optgetParams)
    for (let i = 0; i < exemple.validCommands.length; i++) {
        console.log('------------------------------------------------------------------------')
        console.log('test with valid command ' + i + ' :', exemple.validCommands[i])
        process.argv = exemple.validCommands[i].split(' ')
        optget(exemple.optgetParams, (options) => {
            console.log({options})
        })
    }
    for (let i = 0; i < exemple.failCommands.length; i++) {
        console.log('------------------------------------------------------------------------')
        console.log('test with failure command ' + i + ' :', exemple.failCommands[i])
        process.argv = exemple.failCommands[i].split(' ')
        optget(exemple.optgetParams, (options) => {
            console.log({options})
        })
    }
    console.log('************************************************************************')
}

runExemple(exemple1)
runExemple(exemple2)
runExemple(exemple3)
runExemple(exemple4)
runExemple(exemple5)
runExemple(exemple6)
runExemple(exemple7)
runExemple(exemple8)
runExemple(exemple9)
runExemple(exemple10)
runExemple(exemple11)
runExemple(exemple12)
runExemple(exemple13)

// const display = (exemple, index) => {
//     console.log('### Exemple ' + index)
//     console.log('')
//     console.log('```js')
//     console.log('')
//     console.log('const optgetParams =', exemple.optgetParams)
//     console.log('')
//     console.log('```')
//     console.log('')
//     console.log('Valid Command')
//     console.log('')
//     console.log('```')
//     for (let i = 0; i < exemple.validCommands.length; i++) {
//         console.log(exemple.validCommands[i])
//     }
//     console.log('```')
//     console.log('')
//     console.log('Invalid Command')
//     console.log('')
//     console.log('```')
//     for (let i = 0; i < exemple.failCommands.length; i++) {
//         console.log(exemple.failCommands[i])
//     }
//     console.log('```')
//     console.log('')
// }


// display(exemple1, 1)
// display(exemple2, 2)
// display(exemple3, 3)
// display(exemple4, 4)
// display(exemple5, 5)
// display(exemple6, 6)
// display(exemple7, 7)
// display(exemple8, 8)
// display(exemple9, 9)
// display(exemple10, 10)
// display(exemple11, 11)
// display(exemple12, 12)
// display(exemple13, 13)

