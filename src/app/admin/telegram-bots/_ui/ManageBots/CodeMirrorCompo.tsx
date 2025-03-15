import { useEffect, useMemo, useRef, useState } from 'react'
//@ts-ignore
import CodeMirrorReact from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'

//@ts-ignore
import { procFQL } from './procFQL'
import { create } from 'zustand'

const useMirror = create<{
    cm: any
    api: any
    suggestions: {}
    value: ''
    ctx: {}
    dictionary: {}
    CodeMirror: any
    reload: () => void
}>((): any => {
    return {
        //
        dictionary: {},
        reload: () => {},
        suggestion: {},
        //
    }
})

export function CodeMirrorCompo({ value, onChange }: any) {
    let ref = useRef<null | HTMLTextAreaElement>(null)
    let [ready, setReady] = useState<false | true>(false)

    useEffect(() => {
        import('codemirror')
            .then((r) => r.defineMode)
            .then(async (defineMode) => {
                // @ts-ignore
                await import('codemirror/keymap/sublime.js')
                // @ts-ignore
                await import('codemirror/addon/hint/show-hint.js')
                // await import('codemirror/addon/hint/show-hint.css')

                defineMode('funQueryLanguage', () => {
                    var parserState = {
                        curlyQuoteIsOpen: false,
                        curlyQuoteName: 'Quote',
                    }

                    let self = {
                        // tables: [
                        //     //
                        //     'home_page_bucket',
                        //     'menu_page_bucket',
                        // ],
                    }

                    return {
                        token(stream: any, state: any) {
                            let title = ''
                            let quote = ''
                            let detectedType: any = null

                            let dictionary: any = useMirror.getState().dictionary

                            Object.keys(dictionary || {}).forEach((kn) => {
                                if (detectedType === null) {
                                    if (stream.match(kn)) {
                                        let detected = dictionary[kn][0]
                                        detectedType = detected
                                    } else {
                                        detectedType = null
                                    }
                                }
                            })

                            // self.tables.forEach((et) => {
                            //     if (detectedType === null) {
                            //         if (stream.match(et)) {
                            //             detectedType = 'TableInstance'
                            //         }
                            //     }
                            // })

                            if (stream.match(/### .+/g)) {
                                title += ' ParagraphTitle-3'
                            } else if (stream.match(/## .+/g)) {
                                title += ' ParagraphTitle-2'
                            } else if (stream.match(/# .+/g)) {
                                title += ' ParagraphTitle-1'
                            }

                            let output = (detectedType ? detectedType + ' ' : '') + title + quote
                            if (detectedType === null) {
                                stream.next()
                            }

                            return output
                            // if (stream.match('const')) {
                            //   return 'style-a'
                            // } else if (stream.match('bbb')) {
                            //   return 'style-b'
                            // } else {
                            //   stream.next()
                            //   return null
                            // }
                        },
                    }
                })

                setReady(true)
            })

        return () => {}
    }, [])

    useEffect(() => {
        let ans = procFQL({ query: value })

        let suggestions = [
            //
            ['posts', 'comments', 'settings'],
        ]

        let dictionary = ans.dictionary

        let dictionaryKNs = Object.keys(dictionary)

        let getOther = ({ kn }: any) => {
            return dictionaryKNs
                .filter((ekn) => {
                    return ekn !== kn
                })
                .filter((ekn) => {
                    return dictionary[ekn].includes(dictionary[kn][0])
                })
        }

        // forEach Word
        dictionaryKNs.forEach((kn) => {
            let other = getOther({ kn })
            if (other.length > 0) {
                suggestions.push([kn, ...other])
            }
        })

        useMirror.setState({
            value,
            suggestions,
            ctx: ans.ctx,
            dictionary: ans.dictionary,
        })
    }, [value])

    let options = useMemo(() => {
        let handleSuggestions = (cm: any) => {
            return new Promise(async (resolve, reject) => {
                let Pos = await import('codemirror').then((r) => r.Pos)

                let run = async () => {
                    var suggs = useMirror.getState().suggestions as any[]

                    // console.log(JSON.stringify(suggs, null, '  '))
                    var cursor = cm.getCursor(),
                        line = cm.getLine(cursor.line)

                    var start = cursor.ch,
                        end = cursor.ch
                    while (start && /\w/.test(line.charAt(start - 1))) --start
                    while (end < line.length && /\w/.test(line.charAt(end))) ++end
                    var word = line.slice(start, end).toLowerCase()

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
                let nowCursor = JSON.stringify(cursor)
                if (nowCursor === lastCursor) {
                    return
                } else {
                    lastCursor = nowCursor
                }
                let nullVal: any = null

                self.CodeMirror.commands.autocomplete(self.cm, nullVal, { completeSingle: true })
                // self.CodeMirror.commands.undo(self.cm)
                // self.CodeMirror.commands.redo(self.cm)
                // self.cm.setCursor({ line: cursor.line, ch: cursor.ch })
            }
        }

        let tt = setInterval(() => {
            autoPop()
        }, 1)

        return () => {
            clearInterval(tt)
        }
    }, [])

    //

    return (
        <>
            {ready && (
                <CodeMirrorReact
                    ref={(api: any) => {
                        if (api) {
                            let cm = api.getCodeMirror()

                            cm.on('cursor', () => {
                                console.log(123)
                            })

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
                    value={value}
                    onChange={async (value: any, event: any) => {
                        //
                        let self = useMirror.getState()
                        if (self.cm) {
                            let cursor = self.cm.getCursor()
                            let nullVal: any = null

                            self.CodeMirror.commands.autocomplete(self.cm, nullVal, { completeSingle: true })
                            self.CodeMirror.commands.undo(self.cm)
                            self.CodeMirror.commands.redo(self.cm)
                            self.cm.setCursor({ line: cursor.line, ch: cursor.ch })

                            useMirror.setState({
                                value,
                            })
                        }
                    }}
                    options={options}
                />
            )}
            <style
                dangerouslySetInnerHTML={{
                    __html: /* css */ `

.cm-TableInstance{
  font-weight: bold;
  border-bottom: rgb(31, 202, 173) solid 2px;
}
.cm-HolderInstance{
  font-weight: bold;
  border-bottom: rgb(202, 108, 31) dashed 2px;
}
.cm-ResultInstnace{
  font-weight: bold;
  border-bottom: rgb(202, 31, 165) dashed 2px;
}
.cm-FieldInstance{
  font-weight: bold;
  border-bottom: rgb(202, 122, 31) dashed 2px;
}

.cm-OrderInstance{
  font-weight: bold;
  border-bottom: rgb(31, 191, 202) dashed 2px;
}
.cm-NumberInstance{
  font-weight: bold;
  background-color: rgb(176, 224, 228);
}

.codemirrorbox{
  height: 500px;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: perspective(500px) translateZ(-50px) translateY(50px) rotateX(-30deg);
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
  font-size: 17px;
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
.cm-ParagraphTitle-1{
  font-size: 35px;
  font-weight: bold;
  border-bottom: rgb(31, 182, 202) dashed 2px;
}
.cm-ParagraphTitle-2{
  font-size: 25px;
  font-weight: bold;
  border-bottom: rgb(31, 182, 202) dashed 2px;
}
.cm-ParagraphTitle-3{
  font-weight: bold;
  border-bottom: rgb(31, 182, 202) dashed 2px;
}


.cm-IDInstance{
  font-weight: bold;
  border-bottom: rgb(31, 139, 202) dashed 2px;
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
