# optget

JavaScript component to compute the SHA256 of strings or bytes.

## Install

### Node.js

    npm install --save optget

## Usage

### Exemple 1

```js
optgetParams = [
    {
        name : 'value',
        type : "String",
        min_aliases : ['v']
    }
]
optget(optgetParams, (options) => {
    console.log(options.value)
})
```

Valid Command

```
node test --value=yolo,
node test --value yolo,
node test -v=yolo,
node test -v yolo
```

Invalid Command

```
node test --value=yolo yolo,
node test --value= yolo,
node test --value=,
node test --other=yolo,
node test yolo,
```

## Bug

## Test

# Credits

# License

(ISC License)

Copyright 2019, <brindibou.pkmn@gmail.com>