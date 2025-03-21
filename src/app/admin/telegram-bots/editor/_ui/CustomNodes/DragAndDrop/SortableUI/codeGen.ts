'use client'

import md5 from 'md5'
import mustache from 'mustache'

export const codeGen = (listRaw: any[]): string => {
    let list = JSON.parse(JSON.stringify(listRaw))
    let str = ``

    let getID = (orig: any) => {
        return `__${`${md5(JSON.stringify(orig))}`.slice(2, 9)}`
    }

    let genLocalCode = (arr: any[], level = 0) => {
        return arr.map((li: any) => {
            //

            let body = `${genLocalCode(li.children, level + 1)
                .map((r) => {
                    return `\t\t${mustache.render(r.template || '', { ...li, ...r, result: `${r.result || getID(`${r.id}${r.template}`)}` })}`
                })
                .join('\n')}`

            li.body = body

            return li
        })
    }

    genLocalCode(list, 0)

    let genAll = (arr: any[], level = 0) => {
        return arr.map((li: any) => {
            let indent = ``
            for (let i = 0; i < level; i++) {
                indent += '\t\t'
            }

            str += `${indent}${mustache.render(
                li.template || '',
                { ...li, body: `${li.body}` },
                {},
                {
                    escape: (v) => {
                        return v
                    },
                },
            )}\n`

            return li
        })
    }
    genAll(list, 0)

    return `${str}`
}
