# optget

JavaScript component to parse the command-line arguments. 'process.argv' is the argument . An element of argv that starts with '-' (and is not exactly "-" or "--") is an option element.

## Install

### Node.js

    npm install --save optget

## Usage

### Exemple 1

```js

const optgetParams = [ { name: 'value', type: 'String', min_aliases: [ 'v' ] } ]

optget(optgetParams, (options) => {
    console.log(options.value)
})

```

Valid Command

```
node test --value=yolo
node test --value yolo
node test -v=yolo
node test -v yolo
```

Invalid Command

```
node test --value=yolo yolo
node test --value= yolo
node test --value=
node test --other=yolo
node test yolo
```

### Exemple 2

```js

const optgetParams = [ { name: 'value', type: 'Integer', aliases: [ 'other' ] } ]

optget(optgetParams, (options) => {
    console.log(options.value)
})

```

Valid Command

```
node test --value=45
node test --value 45
node test --other=45
node test --other 45
node test --value=45 --value=12
node test --value=45 -v 12
```

Invalid Command

```
node test --value=yolo
node test --value= yolo
node test --value=45 --value2=12
```

### Exemple 3

```js

const optgetParams = [ { name: 'value', type: 'Boolean', min_aliases: [ 'v' ] },
  { name: 'value2', type: 'Url', isOptional: true } ]

optget(optgetParams, (options) => {
    console.log(options.value, options.value2)
})

```

Valid Command

```
node test --value=true
node test --value=false
node test --value
node test -v=true
node test -v=false
node test -v
node test --value --value2=https://www.npmjs.com
node test --value --value2=https://localhost
node test --value --value2=https://localhost:3000
```

Invalid Command

```
node test --value=true2
node test --value=false2
node test --value=
node test -v=
node test --values2=https://www.npmjs.com
node test -v --value2=skqclmkcqs
```

### Exemple 4

```js

const optgetParams = [ { name: 'value', type: 'String', isOptional: true },
  { name: 'value2',
    type: 'Boolean',
    isOptional: true,
    default: true } ]

optget(optgetParams, (options) => {
    console.log(options.value, options.value2)
})

```

Valid Command

```
node test --value=yolo
node test
node test --value2
node test --value2 false
```

Invalid Command

```
```

### Exemple 5

```js

const optgetParams = [ { name: 'value', type: 'String', isOptional: true },
  { name: 'value2',
    type: 'Boolean',
    isOptional: true,
    default: true } ]

optget(optgetParams, (options) => {
    console.log(options.value, options.value2)
})

```

Valid Command

```
node test --value=yolo
node test
node test --value2
node test --value2 false
```

Invalid Command

```
```

### Exemple 6

```js

const optgetParams = [ { name: 'value',
    values: [ 'yolo1', 'yolo2', 'yolo3' ],
    isOptional: true,
    default: 0 },
  { name: 'value2', values: [ 1, 2, 3 ], isOptional: true } ]

optget(optgetParams, (options) => {
    console.log(options.value, options.value2)
})

```

Valid Command

```
node test --value=yolo1
node test --value=yolo2
node test
node test --value2=1
node test --value2=2
```

Invalid Command

```
node test --value=yolo4
```

### Exemple 7

```js

const optgetParams = [ { name: 'value',
    values: [ 'yolo1', 'yolo2', 'yolo3' ],
    isOptional: true,
    isMultiple: true,
    default: 0 },
  { name: 'value2',
    type: 'String',
    isOptional: true,
    isMultiple: true,
    default: 'tyu' },
  { name: 'value3',
    values: [ 'yolo1', 'yolo2', 'yolo3' ],
    isOptional: true,
    isMultiple: true },
  { name: 'value4',
    type: 'String',
    isOptional: true,
    isMultiple: true } ]

optget(optgetParams, (options) => {
    console.log(options.value, options.value2)
})

```

Valid Command

```
node test --value=yolo1
node test --value yolo1 yolo2
node test --value2 coucou les amis
node test
```

Invalid Command

```
node test --value yolo1 yolo4
node test --value2
```

### Exemple 8

```js

const optgetParams = [ { name: 'value', type: 'String' },
  { name: 'value2', type: 'String', isMultiple: true },
  { name: '...' } ]

optget(optgetParams, (options) => {
    console.log(options.value, options.value2, options['...'])
})

```

Valid Command

```
node test --value=yolo1
node test --value yolo1 --value2 coucou les amis
node test --value2 coucou les amis --value yolo1 ceci un test
```

Invalid Command

```
node test --value yolo1 --value2
node test  ceci un test --value2 coucou les amis --value yolo1
```

Use '...' to catch the end arguments

### Exemple 9

```js

const optgetParams = [ { name: '45value', type: 'String' } ]

```

Invalid because name argument start by digit

### Exemple 10

```js

const optgetParams = [ { name: '-value', type: 'String' } ]

```

Invalid because name argument start by -

### Exemple 11

```js

const optgetParams = [ { name: '_ceci$', type: 'String' } ]

```

Invalid because name argument has character no alphabetic no digit and no _

### Exemple 12

```js

const optgetParams = [ { name: 'help', type: 'String' } ]

```

Invalid because name argument is 'help'

### Exemple 13

```js

const optgetParams = [ { name: 'err', type: 'String' } ]

```

Invalid because name argument is 'err'

## Bug

## Note

If you notice a bug, send me an email to brindibou.pkmn@gmail.com, please

# Credits

# License

(ISC License)

Copyright 2019, <brindibou.pkmn@gmail.com>
