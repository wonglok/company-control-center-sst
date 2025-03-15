import nlp from 'compromise'

export let getID = () => {
    return `_` + (Math.random() * 1000000000).toFixed(0)
}

export const procFQL = ({ query }) => {
    // Context
    let ctx = {
        queries: [],
        buckets: [],
    }
    let dictionary = {
    }

    nlp.plugin({
        tags: {},
        words: dictionary,
        patterns: {},
        regex: {},
        plurals: {}
    })

    query.split('\n').filter(e => e).forEach((sentence, idx) => {
        procSentence({ command: sentence, dictionary, ctx })
    })

    return {
        ctx,
        dictionary
    }
}

export const procSentence = ({ command, dictionary, ctx }) => {
    let cleanID = (text) => {
        text = `${text}`
        return text.match(/\w+/)[0] || ''
    }
    let addBucket = ({ holderObj }) => {
        ctx.buckets.push(holderObj)
    }
    let addQuery = ({ query }) => {
        ctx.queries.push(query)
    }

    let addWordToDictionary = ({ dictionary, keyname, tagsToAdd }) => {
        dictionary[keyname] = dictionary[keyname] || []

        let arrayInstnaces = dictionary[keyname]
        tagsToAdd.forEach((tag) => {
            if (!arrayInstnaces.includes(tag)) {
                arrayInstnaces.unshift(tag)
            }
        })
    }

    let holder = {
        type: 'bucket',
        id: ''
    }

    let query = {
        table: '',
        id: '',
        bucket: ''
    }

    nlp(command)
        .match(`make a bucket and call it [.]`)
        .not('the')
        .not('and')
        .out('tags')
        .forEach((entry) => {
            holder.id = cleanID(entry.text)
            addWordToDictionary({ dictionary: dictionary, keyname: cleanID(entry.text), tagsToAdd: ['HolderInstance'] })
            addBucket({ holderName: cleanID(entry.text), holderObj: holder })
        })

    if (command.toLowerCase().indexOf('go get some data') !== -1) {
        nlp(command)
            .match(`go get some data from [.] table`)
            .not('the')
            .not('and')
            .out('tags')
            .forEach((entry) => {
                query.table = cleanID(entry.text)
                addQuery({ query })
                addWordToDictionary({ dictionary: dictionary, keyname: cleanID(entry.text), tagsToAdd: ['TableInstance'] })
            })
        // , just skip [.] items and get the first [.]
        nlp(command)
            .match(`store results in [.] and`)
            .not('the')
            .not('and')
            .out('tags')
            .forEach((entry) => {
                query.bucket = cleanID(entry.text)
            })

        nlp(command)
            .match(`#HolderInstance? and name it with [.] label`)
            .not('the')
            .not('and')
            .out('tags')
            .forEach((entry, idx) => {
                if (idx === 0) {
                    query.id = cleanID(entry.text)
                    addWordToDictionary({ dictionary: dictionary, keyname: cleanID(entry.text), tagsToAdd: ['ResultInstnace'] })
                }
            })

        nlp(command)
            .match(`#HolderInstance? look for [.] with ID [.] in it?`)
            .not('the')
            .not('and')
            .out('tags')
            .forEach((entry, idx) => {
                if (idx === 0) {
                    query.lookForField = cleanID(entry.text)
                    addWordToDictionary({ dictionary: dictionary, keyname: cleanID(entry.text), tagsToAdd: ['FieldInstance'] })
                } else if (idx === 1) {
                    query.lookForID = Number(cleanID(entry.text))
                    addWordToDictionary({ dictionary: dictionary, keyname: 'ID ' + cleanID(entry.text), tagsToAdd: ['IDInstance'] })
                }
            })

        // nlp(command)
        //   .match(`skip [*] items and get the first [*]`)
        //   .not('the')
        //   .not('and')
        //   .out('tags')
        //   .forEach((entry, idx) => {
        //     if (idx === 0) {
        //       query.skip = cleanID(entry.text)
        //     } else if (idx === 1) {
        //       query.limit = Number(cleanID(entry.text))
        //     }
        //   })

        nlp(command)
            .match(`sort with [.] order`)
            .not('the')
            .not('and')
            .out('tags')
            .forEach((entry, idx) => {
                if (idx === 0) {
                    query.sort = cleanID(entry.text).toUpperCase()
                    addWordToDictionary({ dictionary: dictionary, keyname: cleanID(entry.text), tagsToAdd: ['OrderInstance'] })
                }
            })

        nlp(command)
            .match(`skip [.] items and get the first [.] items`)
            .not('the')
            .not('and')
            .out('tags')
            .forEach((entry, idx) => {
                if (idx === 0) {
                    query.skip = cleanID(entry.text).toUpperCase()
                    addWordToDictionary({ dictionary: dictionary, keyname: 'skip ' + cleanID(entry.text), tagsToAdd: ['NumberInstance'] })
                } else if (idx === 1) {
                    query.limit = cleanID(entry.text).toUpperCase()
                    addWordToDictionary({ dictionary: dictionary, keyname: 'first ' + cleanID(entry.text), tagsToAdd: ['NumberInstance'] })
                }
            })
    }
}