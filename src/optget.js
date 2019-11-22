
const mapCheckValue = {
    "String" : (v) => true,
    "Integer" : (v) => v == parseInt(v),
    "Url" : (v) => validerUrl(v),
    "Boolean" : (v) => v === 'true' || v === 'false',
}

const mapGetValue = {
    "String" : (v) => v,
    "Integer" : (v) => parseInt(v),
    "Url" : (v) => v,
    "Boolean" : (v) => v === 'true'
}

const validerUrl = (str) => {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
        return false;
    } else {
        return true;
    }
}

const getExecName = () => {
    const argv1Arr = process.argv[1].split('\\').join('/').split('/')
    const execName = argv1Arr[argv1Arr.length - 1]
    return execName
}

const validateName = (name) => {
    let numok = false
    for (let i = 0; i < name.length; i++) {
        if ((name[i] >= 'a' && name[i] <= 'z') || (name[i] >= 'A' && name[i] <= 'Z') || (name[i] === '_')) {
            numok = true
            continue
        }
        if (numok && (name[i] >= '0' && name[i] <= '9'))
            continue
        if (numok && name[i] === '-')
            continue
        return false
    }
    return true
}

const validateParams = (options, params) => {
    for (let i = 0; i < params.length; i++) {
        const param = params[i]
        if (param.name === "help" || param.name === "err") {
            options.err = 'Optget bad config: "err" and "help" is an option name forbidden'
            return
        }
        if (param.name === "..." && i !== params.length - 1) {
            options.err = 'Optget bad config: "..." must be in last position'
            return
        }
        if (param.name === "..." && (param.aliases !== undefined || param.min_aliases !== undefined || param.type !== undefined || param.isMultiple !== undefined || param.isOptional !== undefined || param.default !== undefined)) {
            options.err = 'Optget bad config: "..." must be nothing'
            return
        }
        if (param.name === "...")
            continue
        if (!validateName(param.name)) {
            options.err = 'Optget bad config: ' + param.name + ' is an invalidate name'
            return
        }
        if (param.aliases) {
            for (let k in param.aliases) {
                if (!validateName(param.aliases[k])) {
                    options.err = 'Optget bad config: ' + param.aliases[k] + ' is an invalidate alias'
                    return
                }
            }
        }
        if (param.min_aliases) {
            for (let k in param.min_aliases) {
                if (!validateName(param.min_aliases[k])) {
                    options.err = 'Optget bad config: ' + param.min_aliases[k] + ' is an invalidate minified alias'
                    return
                }
            }
        }
        if (param.type && param.values) {
            options.err = 'Optget bad config at ' + param.name + ': option can\'t have a type and an array of values'
            return
        }
        if (!param.isOptional && param.default) {
            options.err = 'Optget bad config at ' + param.name + ': option can\'t be not optional and have a default value'
            return
        }
        if (param.type) {
            if (!mapCheckValue[param.type]) {
                options.err = 'Optget bad config at ' + param.name + ': unknown type option'
                return
            }
        }
    }
}

const genHelp = (options, params, execName) => {
    let help = 'Usage : ' + execName
    for (let i in params) {
        const param = params[i]
        help += '\n\n'
        help += '\t' + params[i].name + '='
        if (param.type) {
            help += param.type
        }
        if (param.values) {
            help += '['
            for (let j = 0; j < param.values.length; j++) {
                help += param.values[j] + (j === param.values.length - 1 ? '' : ',')
            }
            help += ']'
        }
        if (param.isOptional) {
            help += ' (Optional'
            if (param.default !== undefined) {
                help += ' [Default value : ' + param.default + ']'
            }
            help += ')'
        }
        if (param.isMultiple) {
            help += ' (Multiple values possible)'
        }
        if (param.aliases && param.aliases.length > 0) {
            help += ' (Aliases: '
            for (let j = 0; j < param.aliases.length; j++) {
                help += param.aliases[j] + (j === param.aliases.length - 1 ? '' : ', ')
            }
            help += ')'
        }
        if (param.min_aliases && param.min_aliases.length > 0) {
            help += ' (Minified Aliases: '
            for (let j = 0; j < param.min_aliases.length; j++) {
                help += param.min_aliases[j] + (j === param.min_aliases.length - 1 ? '' : ', ')
            }
            help += ')'
        }
    }
    options.help = help
}

const useAliases = (options, params, argv) => {
    for (let i = 0; i < argv.length && !options.err; i++) {
        let arg = argv[i]
        for (let j in params) {
            const param = params[j]
            if (param.aliases) {
                for (let k in param.aliases) {
                    if (arg.indexOf('--' + param.aliases[k]) === 0)
                        arg = arg.replace('--' + param.aliases[k], '--' + param.name)
                }
            }
            if (param.min_aliases) {
                for (let k in param.min_aliases) {
                    if (arg.indexOf('-' + param.min_aliases[k]) === 0)
                        arg = arg.replace('-' + param.min_aliases[k], '--' + param.name)
                }
            }
        }
        argv[i] = arg
    }
    return argv
}

const validateValue = (options, param, value) => {
    if (param.values) {
        if (param.values.map(elem => "" + elem).indexOf(value) === -1) {
            options.err = 'Wrong value at option: ' + param.name + ', value must be in (' + JSON.stringify(param.values) + ')'
            return
        }
    }
    if (param.type) {
        if (!mapCheckValue[param.type](value)) {
            options.err = 'Wrong value at option: ' + param.name + ', value must be ' + param.type
            return
        }
    }
    value = param.type ? mapGetValue[param.type](value) : param.values[param.values.map(elem => "" + elem).indexOf(value)]
    if (param.isMultiple) {
        if (options[param.name])
            options[param.name].push(value)
        else
            options[param.name] = [value]
    } else {
        options[param.name] = value
    }
}

const extractValueFromArg = (options, param, arg) => {
    validateValue(options, param, arg.substring(param.name.length + 3))
}

const findValueInArgs = (options, param, args, index) => {
    if (param.type === 'Boolean') {
        options[param.name] = true
        return index
    } else {
        let i = 1
        while (i + index < args.length) {
            const argNext = args[index + i]
            if (argNext.indexOf('--') === 0 || (argNext.indexOf('-') === 0 && !(argNext[1] >= '0' && argNext[1] <= '9')))
                break
            validateValue(options, param, argNext)
            args[index + i] = "~~~" + args[index + i] + "~~~"
            i++
            if (!param.isMultiple)
                break
        }
        if (i === 1)
            options.err = 'No value at option: ' + param.name
        return index + i - 1
    }
}

const extractValuesFromArgv = (options, params, argv) => {
    for (let i = 0; i < argv.length && !options.err; i++) {
        const arg = argv[i]
        for (let j in params) {
            const param = params[j]
            if (arg === '--' + param.name) {
                i = findValueInArgs(options, param, argv, i)
                if (options.err)
                    break
            }
            else if (arg.indexOf('--' + param.name + '=') === 0) {
                extractValueFromArg(options, param, arg)
                if (options.err)
                    break
            }
        }
    }
    if (params.length > 1 && params[params.length - 1].name === "...") {
        options['...'] = []
        for (let i = 0; i < argv.length && !options.err; i++) {
            const arg = argv[argv.length - 1 - i]
            if (arg.indexOf('~~~') === 0 && arg.lastIndexOf('~~~') === arg.length - 3)
                continue
            if (arg.indexOf('--') === 0 || (arg.indexOf('-') === 0 && !(arg[1] >= '0' && arg[1] <= '9')))
                break
            options['...'].push(arg)
            argv[argv.length - 1 - i] = "~~~" + arg + "~~~"
        }
        options['...'] = options['...'].reverse()
    }
}

const finalize = (options, params, argv) => {
    if (options.err)
        return
    const availableOptionsName = []
    for (let j in params) {
        const param = params[j]
        availableOptionsName.push(param.name)
        if (param.aliases)
            for (let k in param.aliases)
                availableOptionsName.push(param.aliases[k])
        if (param.min_aliases)
            for (let k in param.min_aliases)
                availableOptionsName.push(param.min_aliases[k])
        if (param.name !== '...' && !param.isOptional && options[param.name] === undefined) {
            options.err = 'Missing option : ' + param.name
            break
        }
        if (param.isOptional && !options[param.name]) {
            if (param.type)
                options[param.name] = param.isMultiple ? (param.default === undefined ? [] : [param.default]) : param.default
            if (param.values)
                options[param.name] = param.isMultiple ? (param.default === undefined ? [] : [param.values[param.default]]) : param.values[param.default]
        }
    }
    for (let i = 0; i < argv.length && !options.err; i++) {
        const arg = argv[i]
        if (arg.indexOf('~~~') === 0 && arg.lastIndexOf('~~~') === arg.length - 3)
            continue
        let name = arg.split('=')[0]
        if (name.indexOf('--') !== 0 && name.indexOf('-') !== 0) {
            options.err = 'Missing identifier option : ' + name
            break
        }
        if (name.indexOf('--') === 0)
            name = name.substring(2)
        else if (name.indexOf('-') === 0)
            name = name.substring(1)
        if (availableOptionsName.indexOf(name) === -1) {
            options.err = 'Option not valid: ' + name
            break
        }
    }   
}

const optget = (params, callback) => {

    const options = {}
    const execName = getExecName()
    validateParams(options, params)
    if (options.err) {
        console.error(options.err)
        return
    }
    genHelp(options, params, execName)
    if (process.argv[2] === '--help' && process.argv.length === 3) {
        if (options.help)
            console.log(options.help)
        return
    }
    let argv = useAliases(options, params, process.argv.map(elem => elem).filter((_, index) => index >= 2))
    extractValuesFromArgv(options, params, argv)
    finalize(options, params, argv)
    if (options.err) {
        console.error(options.err + '\n')
        if (options.help)
            console.error(options.help)
    }
    if (!options.err)
        callback(options)
}

module.exports = optget
