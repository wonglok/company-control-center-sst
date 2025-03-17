import { useEffect, useMemo, useRef, useState } from 'react'
//@ts-ignore
import CodeMirrorReact from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'

import { create } from 'zustand'
import { useBot } from '../../schema/[botID]/useBot'
import nlp from 'compromise'
import plg from 'compromise-dates'
nlp.plugin(plg)

// @ts-ignore
import md2json from 'md-2-json'

// @ts-ignore
import extractURLs from 'extract-urls'
import { StringMap } from 'aws-lambda/trigger/cognito-user-pool-trigger/_common'

const useMirror = create<any>(() => {
    return {
        //
        value: '',
        highlight: {},
        reload: () => {},
        suggestion: {},
        //
    }
})

// let getID = () => {
//     return `_` + (Math.random() * 1000000000).toFixed(0)
// }

const css = /* css */ `
.cm-URLToken{
  border-bottom: rgb(31, 202, 173) solid 2px;
}
.cm-TableToken{
  font-weight: bold;
  border-bottom: rgb(31, 202, 173) solid 2px;
}
.cm-HolderToken{
  font-weight: bold;
  border-bottom: rgb(202, 108, 31) dashed 2px;
}
.cm-ResultInstnace{
  font-weight: bold;
  border-bottom: rgb(202, 31, 165) dashed 2px;
}
.cm-FieldToken{
  font-weight: bold;
  border-bottom: rgb(202, 122, 31) dashed 2px;
}
.cm-OrderToken{
  font-weight: bold;
  border-bottom: rgb(31, 191, 202) dashed 2px;
}
.cm-NumberToken{
  font-weight: bold;
  background-color: rgb(176, 224, 228);
}
`

const procFQL = ({ query }: any) => {
    // Context
    let globals: { [key: string]: any } = {}
    let highlight = {}

    nlp.plugin({
        tags: {},
        words: highlight,
        patterns: {},
        regex: {},
        plurals: {},
    })

    let titles = query
        .split('\n')
        .filter((r: string) => {
            return r.startsWith('### ') || r.startsWith('## ') || r.startsWith('# ')
        })
        .filter((r: string) => r)

    let allStr = query
    titles.forEach((title: string) => {
        allStr = allStr.replace(title, '____SPLITTER____' + title + '____IDX____')
    })

    let groups: string[] = allStr
        .split('____SPLITTER____')
        // .filter((r: string) => r)
        .map((r: string) => {
            let arr = r.split('____IDX____')

            if (arr[0] && arr[1]) {
                return {
                    title: arr[0].trim(),
                    text: arr[1].trim(),
                    steps: arr[1]
                        .trim()
                        .split('\n')
                        .filter((r: string) => r)
                        .map((text) => {
                            return {
                                cmd: text,
                            }
                        }),
                }
            } else {
                return false
            }
        })
        .filter((r: any) => r)

    groups.forEach((group: any) => {
        group.steps.map((step: any) => {
            procSentence({ title: group.title, command: step.cmd, highlight, globals, step, group })
            return step
        })
    })

    globals.groups = groups

    return JSON.parse(
        JSON.stringify({
            globals,
            highlight,
        }),
    )
}

const procSentence = ({ command, highlight, globals, group }: { command: string } | any) => {
    let cleanID = (text: string) => {
        const match = `${text || ''}`.match(/\w+/)
        return match ? match[0] : null
    }

    let tagsToLexicon = ({ lexicon, keyname, tagsToAdd }: any) => {
        let lexArr = (lexicon[keyname] = lexicon[keyname] || [])
        tagsToAdd.forEach((tag: any) => {
            if (!lexArr.includes(tag)) {
                lexArr.unshift(tag)
            }
        })
    }

    let holder: any = {
        type: 'database',
        id: '',
    }

    nlp(command)
        .match(`create * user database (called|*) [.]`)
        .not('the')
        .not('and')
        .out('tags')
        .forEach((entry: any, idx: number) => {
            holder.type = 'userDB'
            holder.id = cleanID(entry.text)
            tagsToLexicon({ lexicon: highlight, keyname: cleanID(entry.text), tagsToAdd: ['HolderToken'] })
            group.database = group.database || []
            group.database.push(holder)
        })

    nlp(command)
        .match(`create * system database (called|*) [.]`)
        .not('the')
        .not('and')
        .out('tags')
        .forEach((entry: any) => {
            holder.type = 'systemDB'
            holder.id = cleanID(entry.text)
            tagsToLexicon({ lexicon: highlight, keyname: cleanID(entry.text), tagsToAdd: ['HolderToken'] })
            group.database = group.database || []
            group.database.push(holder)
        })

    nlp(command)
        .match(`fetch data from [.] * save to [.]`)
        .not('the')
        .not('and')
        .out('tags')
        .forEach((entry: any, idx: number) => {
            if (idx === 0) {
                let urls = nlp(command).urls().out('array')

                urls.forEach((url: string) => {
                    console.log(url)
                })
            }

            // holder.type = 'systemDB'
            // holder.id = cleanID(entry.text)
            // tagsToLexicon({ lexicon: highlight, keyname: cleanID(entry.text), tagsToAdd: ['HolderToken'] })
            // section.db = section.db || []
            // section.db.push(holder)
        })

    // command
    //     .split('\n')
    //     .filter((r: string) => r.trim())
    //     .forEach((subCommand: string) => {
    //         if (subCommand) {
    //             let urls = nlp(subCommand).urls().out('array')

    //             let targetDB = nlp(command).match(`add to [.]`).not('the').not('and').out('array')[0]

    //             section.urls = urls
    //             section.target = targetDB

    //             tagsToLexicon({ lexicon: highlight, keyname: targetDB, tagsToAdd: ['HolderToken'] })
    //             tagsToLexicon({ lexicon: highlight, keyname: urls[0], tagsToAdd: ['URLToken'] })
    //         }

    //         //
    //     })

    // nlp(command)
    //     .match(`fetch data from [*]`)
    //     .not('the')
    //     .not('and')
    //     .out('tags')
    //     .forEach((entry: any) => {
    //         query.table = cleanID(entry.text)
    //         addQuery({ query })
    //         tagsToLexicon({ lexicon: highlight, keyname: cleanID(entry.text), tagsToAdd: ['TableToken'] })
    //     })

    // if (command.toLowerCase().indexOf('go get some data') !== -1) {

    //     // , just skip [.] items and get the first [.]
    //     nlp(command)
    //         .match(`store results in [.] and`)
    //         .not('the')
    //         .not('and')
    //         .out('tags')
    //         .forEach((entry) => {
    //             query.bucket = cleanID(entry.text)
    //         })

    //     nlp(command)
    //         .match(`#HolderToken? and name it with [.] label`)
    //         .not('the')
    //         .not('and')
    //         .out('tags')
    //         .forEach((entry, idx) => {
    //             if (idx === 0) {
    //                 query.id = cleanID(entry.text)
    //                 tagsToLexicon({ lexicon: highlight, keyname: cleanID(entry.text), tagsToAdd: ['ResultInstnace'] })
    //             }
    //         })

    //     nlp(command)
    //         .match(`#HolderToken? look for [.] with ID [.] in it?`)
    //         .not('the')
    //         .not('and')
    //         .out('tags')
    //         .forEach((entry, idx) => {
    //             if (idx === 0) {
    //                 query.lookForField = cleanID(entry.text)
    //                 tagsToLexicon({ lexicon: highlight, keyname: cleanID(entry.text), tagsToAdd: ['FieldToken'] })
    //             } else if (idx === 1) {
    //                 query.lookForID = Number(cleanID(entry.text))
    //                 tagsToLexicon({ lexicon: highlight, keyname: 'ID ' + cleanID(entry.text), tagsToAdd: ['IDToken'] })
    //             }
    //         })

    //     // nlp(command)
    //     //   .match(`skip [*] items and get the first [*]`)
    //     //   .not('the')
    //     //   .not('and')
    //     //   .out('tags')
    //     //   .forEach((entry, idx) => {
    //     //     if (idx === 0) {
    //     //       query.skip = cleanID(entry.text)
    //     //     } else if (idx === 1) {
    //     //       query.limit = Number(cleanID(entry.text))
    //     //     }
    //     //   })

    //     nlp(command)
    //         .match(`sort with [.] order`)
    //         .not('the')
    //         .not('and')
    //         .out('tags')
    //         .forEach((entry, idx) => {
    //             if (idx === 0) {
    //                 query.sort = cleanID(entry.text).toUpperCase()
    //                 tagsToLexicon({ lexicon: highlight, keyname: cleanID(entry.text), tagsToAdd: ['OrderToken'] })
    //             }
    //         })

    //     nlp(command)
    //         .match(`skip [.] items and get the first [.] items`)
    //         .not('the')
    //         .not('and')
    //         .out('tags')
    //         .forEach((entry, idx) => {
    //             if (idx === 0) {
    //                 query.skip = cleanID(entry.text).toUpperCase()
    //                 tagsToLexicon({ lexicon: highlight, keyname: 'skip ' + cleanID(entry.text), tagsToAdd: ['NumberToken'] })
    //             } else if (idx === 1) {
    //                 query.limit = cleanID(entry.text).toUpperCase()
    //                 tagsToLexicon({ lexicon: highlight, keyname: 'first ' + cleanID(entry.text), tagsToAdd: ['NumberToken'] })
    //             }
    //         })
    // }
}

export function CodeMirrorCompo({ autoSave }: any) {
    let bot = useBot((r) => r.bot)

    let [ready, setReady] = useState<false | true>(false)

    useEffect(() => {
        import('codemirror')
            .then((r) => r)
            .then(async (CodeMirror) => {
                // @ts-ignore
                await import('codemirror/keymap/sublime.js')
                // @ts-ignore
                await import('codemirror/addon/hint/show-hint.js')

                useMirror.setState({
                    CodeMirror: CodeMirror,
                })

                CodeMirror.defineMode('funQueryLanguage', () => {
                    let parserState = {
                        curlyShortCodeIsOpen: false,
                        curlyShortCodeName: 'ShortCode',
                    }

                    return {
                        token(stream: any, state: any) {
                            let outputStr = ''
                            // let streamText = stream.string

                            let highlight: any = useMirror.getState().highlight || {}
                            let bot: any = useBot.getState().bot

                            let foundHighlight = ''
                            for (let kn in highlight) {
                                if (stream.match(kn)) {
                                    foundHighlight = ` ${highlight[kn][0]}`
                                    outputStr += `${foundHighlight}`
                                }
                            }

                            let title = ''
                            if (stream.match(/### .+/g)) {
                                title = ' ParagraphTitle-3'
                            } else if (stream.match(/## .+/g)) {
                                title = ' ParagraphTitle-2'
                            } else if (stream.match(/# .+/g)) {
                                title = ' ParagraphTitle-1'
                            }

                            if (title !== '') {
                                outputStr += title
                            }

                            if (outputStr !== '') {
                                return outputStr
                            } else {
                                stream.next()
                                return outputStr
                            }
                        },
                    }
                })

                setReady(true)
            })

        return () => {}
    }, [])

    let onChangeBot = ({ value, saveToDB = false }: any) => {
        let result = procFQL({ query: value })

        let suggestions: any = [
            //
            // ['posts', 'comments', 'settings'],
        ]

        let highlight: any = result.highlight

        console.log(highlight)

        let highlightKNs = Object.keys(highlight)

        let getOther = ({ keyname }: any) => {
            return highlightKNs
                .filter((ekn) => {
                    return ekn !== keyname
                })
                .filter((ekn) => {
                    return highlight[ekn].includes(highlight[keyname][0])
                })
        }

        // forEach Word
        highlightKNs.forEach((keyname) => {
            let other = getOther({ keyname: keyname })
            if (other.length > 0) {
                suggestions.push([keyname, ...other])
            }
        })

        useMirror.setState({
            suggestions,
            highlight: result.highlight,
        })

        let newBot = {
            ...bot,
            botSchema: value,
            json: {
                ...result,
            },
        }

        if (saveToDB) {
            autoSave({ bot: newBot })
        }

        useBot.setState({ bot: newBot })
    }

    let value = useMirror((r) => r.value)

    useEffect(() => {
        if (bot) {
            useMirror.setState({
                value: bot?.botSchema,
            })
        }
    }, [])

    useEffect(() => {
        if (value) {
            onChangeBot({ value, saveToDB: true })
        }
    }, [value])

    let options = useMemo(() => {
        let handleSuggestions = (cm: any) => {
            return new Promise(async (resolve, reject) => {
                let Pos = await import('codemirror').then((r) => r.Pos)

                let run = async () => {
                    let suggs = (useMirror.getState().suggestions as any[]) || []

                    // console.log(JSON.stringify(suggs, null, '  '))

                    let cursor = cm.getCursor(),
                        line = cm.getLine(cursor.line)

                    let start = cursor.ch,
                        end = cursor.ch

                    while (start && /\w/.test(line.charAt(start - 1))) --start
                    while (end < line.length && /\w/.test(line.charAt(end))) ++end

                    let word = line.slice(start, end).toLowerCase()

                    for (let sug of suggs) {
                        if (sug.indexOf(word) !== -1) {
                            return resolve({
                                list: sug.filter((e: any) => e),
                                from: Pos(cursor.line, start),
                                to: Pos(cursor.line, end),
                            })
                        }
                    }

                    return resolve(null)
                }

                run()
                // setTimeout(run, 0)
            })
            /* eslint-enable */
        }
        return {
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Cmd-S': () => {
                    //
                },
            },
            // codemirror options
            keyMap: 'sublime',
            tabSize: 2,
            mode: 'funQueryLanguage',
            // theme: 'chrome',
            lineWrapping: true,
            lineNumbers: true,
            line: true,
            hintOptions: {
                customKeys: {
                    'Arrow-Up': '',
                    'Arrow-Down': '',
                },
                alignWithWord: false,
                hint: handleSuggestions,
                closeOnUnfocus: true,
            },
        }
    }, [])

    //options={options}

    useEffect(() => {
        let lastCursor = ''
        let autoPop = () => {
            let self = useMirror.getState()
            if (self.cm) {
                let cursor = self.cm.getCursor()
                let nowCursor = JSON.stringify(cursor) + bot.botSchema
                if (nowCursor === lastCursor) {
                    return
                } else {
                    lastCursor = nowCursor
                }
                let nullVal: any = null

                self.CodeMirror.commands.autocomplete(self.cm, nullVal, { completeSingle: true })
            }
        }

        let tt = setInterval(() => {
            autoPop()
        }, 1)

        return () => {
            clearInterval(tt)
        }
    }, [bot.botSchema])

    //

    return (
        <>
            {ready && (
                <CodeMirrorReact
                    ref={(api: any) => {
                        if (api) {
                            let cm = api.getCodeMirror()

                            import('codemirror').then((CodeMirror) => {
                                useMirror.setState({
                                    CodeMirror,
                                    cm,
                                    api,
                                })
                            })
                        }
                    }}
                    className='h-full codemirrorbox'
                    value={bot.botSchema}
                    onChange={async (value: any, event: any) => {
                        useMirror.setState({
                            value: value,
                        })
                        let self = useMirror.getState()
                        if (self.cm) {
                            // self.CodeMirror.commands.undo(self.cm)
                            // self.CodeMirror.commands.redo(self.cm)

                            let cursor = self.cm.getCursor()
                            self.CodeMirror.commands.autocomplete(self.cm, false, { completeSingle: true })
                            self.cm.setCursor({ line: cursor.line, ch: cursor.ch })
                        }
                    }}
                    options={options}
                />
            )}
            <style
                dangerouslySetInnerHTML={{
                    __html: /* css */ `
${css}

.cm-ShortCode{
  background: rgb(253, 255, 134, 0.55);
}

.cm-IDToken{
  font-weight: bold;
  border-bottom: rgb(31, 139, 202) dashed 2px;
}

.codemirrorbox{
  height: 100%;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(1.0) perspective(500px) translateZ(-150px) translateY(100px) rotateX(-40deg);
  }
  100%{
    opacity: 1;
    transform: perspective(500px) rotateX(0deg);
  }
}

.CodeMirror {
  font-family: 'Inconsolata', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
}
.CodeMirror-gutters{
  background-color: rgb(255,255,255,0.25);
  color: black;
}
.CodeMirror{
  height: 100%;
  width: 100%;
  background-color: rgb(223, 223, 223);
}
.CodeMirror-hints{
  /* z-index: 10000; */
  position: absolute;
  background-color: white;
  margin-bottom: 0px;
  list-style: none;
  padding: 2px 16px;
  z-index: 1000;

  animation: fadeIn 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s 1 normal both;
}

.cm-ParagraphTitle-1{
font-size: 25px;
font-weight: bold;
  border-bottom: rgb(31, 182, 202) dashed 2px;
}
.cm-ParagraphTitle-2{
font-size: 20px;
font-weight: bold;
  border-bottom: rgb(31, 182, 202) dashed 2px;
}
.cm-ParagraphTitle-3{
    font-size: 17px;
    font-weight: bold;
  border-bottom: rgb(31, 182, 202) dashed 2px;
}

////////

.CodeMirror-hint {
  margin-bottom: 5px;
}
.CodeMirror-hint:hover {
  text-decoration: underline;
}
.CodeMirror-hint-active{
  font-weight: bold;
  color: green;
  /* text-decoration: underline; */
}

.cm-Table{
  border-bottom: rgba(52, 209, 20, 0.55) solid 2px;
}

/* folding */

.CodeMirror-foldmarker {
  color: blue;
  text-shadow: #b9f 1px 1px 2px, #b9f -1px -1px 2px, #b9f 1px -1px 2px, #b9f -1px 1px 2px;
  font-family: arial;
  line-height: .3;
  cursor: pointer;
}
.CodeMirror-foldgutter {
  width: .7em;
}
.CodeMirror-foldgutter-open,
.CodeMirror-foldgutter-folded {
  color: #555;
  cursor: pointer;
}
.CodeMirror-foldgutter-open:after {
  content: "\\25BE";
}
.CodeMirror-foldgutter-folded:after {
  content: "\\25B8";
}

.cm-colormark{
  position: relative;
}

.cm-pre{
/*   outline: red solid 1px; */
  font-size: 20px;
  line-height: 26px;
  font-family: 'Inconsolata', monospace;
  margin: 0;
  overflow: initial;
  color: transparent;
  width: 100%;
  height: 100%;
  min-height: 500px;
}
.cm-label{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  cursor: text;
}
.cm-textarea{
  margin: 0;
  padding: 0;
  border: 0;
  background: 0;
  outline: none;
  resize: none;
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
  color: rgba(0,0,0,1.0);
  caret-color: red;
  font-size: 20px;
  line-height: 26px;
  font-family: 'Inconsolata', monospace;
  box-sizing: border-box;
}
.cm-textarea:focus{
  border: none;
}

.cm-pre > span,
.cm-query-line{
  display: block;
}
.cm-hidevisual{
  visibility: hidden;
}

.cm-line{
}

.nl-PlaceHolder{
  border-bottom: green solid 3px;
}

.nl-BeHere{
  border-bottom: hotpink solid 3px;
}

.array-wrapper{
  margin: 0px;
  padding: 5px 10px;
}
.item-wrapper{
  margin: 10px 10px;
  padding: 5px;
  border-left: grey solid 2px;
  border-top: silver dotted 1px;
  border-bottom: silver dotted 1px;
}

.alt-items:hover{
  text-decoration: underline;
}

.alt-items{
  white-space: pre;
}

.listbox {
  padding: 0px;
}

`,
                }}
            ></style>
        </>
    )
}
