import { EditorFromTextArea } from 'codemirror'
import { useEffect, useRef, useState } from 'react'

export function CodeMirrorCompo({ value, onChange }: any) {
    let ref = useRef<null | HTMLTextAreaElement>(null)
    let [cm, setCM] = useState<false | EditorFromTextArea>(false)

    useEffect(() => {
        if (typeof value === 'string') {
            if (cm) {
                cm.setValue(value)
            }
        }
    }, [cm, value])

    useEffect(() => {
        let task = []
        if (ref.current) {
            import('codemirror').then(async (CodeMirror) => {
                await import('codemirror')

                await import('codemirror/addon/hint/show-hint.js')
                await import('codemirror/addon/fold/foldcode.js')
                await import('codemirror/addon/fold/foldgutter.js')
                await import('codemirror/addon/fold/brace-fold.js')

                if (ref.current) {
                    let res = CodeMirror.fromTextArea(ref.current)

                    res.on('change', () => {
                        onChange(res.getValue())
                    })

                    setCM(res)
                }
            })
        }
        return () => {}
    }, [])

    return (
        <>
            <div className='w-full h-full bg-red-500  codemirrorbox'>
                <textarea className=' w-full h-full CodeMirror' ref={ref}></textarea>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                
.rhymes-suggestions li{
  cursor: pointer;
  margin-bottom: 0px;
}
.rhymes-suggestions li:hover{
  text-decoration: underline;
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

.cm-IDInstance{
  font-weight: bold;
  border-bottom: rgb(31, 139, 202) dashed 2px;
}

.cm-Table{
  border-bottom: rgba(52, 209, 20, 0.55) solid 2px;
}

.cm-Rhyme{
  border-bottom: rgba(52, 209, 20, 0.55) solid 2px;
}

.cm-Quote{
  background: rgb(253, 255, 134, 0.55);
}

.cm-StarQuote{
  background: rgba(255, 227, 134, 0.8);
}

.cm-DoubleStarQuote{
  background: rgb(255, 203, 134);
}

.cm-HiddenQuote{
  background: rgba(255, 134, 255, 0.8);
}

.cm-DoubleHiddenQuote{
  background: rgb(212, 0, 255, 0.8);
}

.cm-ControversialQuote{
  color: white;
  background: rgb(4, 0, 255);
}

.cm-Existence{
  padding-bottom: 1px;
  border-bottom: hotpink solid 2px;
}
.cm-Being{
  padding-bottom: 1px;
  border-bottom: rgb(31, 182, 202) solid 2px;
}
.cm-Quote.cm-Existence{
  padding-bottom: 1px;
  border-bottom: hotpink solid 2px;
}
.cm-Quote.cm-Being{
  padding-bottom: 1px;
  border-bottom: rgb(31, 182, 202) solid 2px;
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
  content: "<";
}
.CodeMirror-foldgutter-folded:after {
  content: ">";
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

                `,
                }}
            ></style>
        </>
    )
}
