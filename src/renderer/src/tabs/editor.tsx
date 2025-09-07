import {  useRef, useEffect } from 'react';
import { basicExtensions } from '../components/EditorExtensions';
import { EditorView } from "@codemirror/view";
import { ChevronsLeftRightIcon} from 'lucide-react'


const Editor = () => {

  const editorRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if(editorRef.current && !viewRef.current) {
      viewRef.current = new EditorView({
        doc: "# Signals and Systems \n There are two kinds of signals **continuous** and **discrete**",
        parent: editorRef.current,
        extensions: [
          basicExtensions
        ]
      })
    }

    return () => {
      if(viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    }
  },[])


  const containerStyle : React.CSSProperties = {
    width: '100%',
    height: '100vh',
    border: 'none',
    outline: 'none',
    overflow: 'hidden',
    backgroundColor: '#fefefe',
    WebkitAppRegion: 'no-drag'
  };

  return (

    <div className = "py-12 px-8 relative gap-4" style={{WebkitAppRegion: "drag"}}>

      <div style={{WebkitAppRegion: 'no-drag'}} className = "w-full rounded-t-xl bg-white p-2 ">
        <button onClick = { () => console.log("clicked") } className = "border-[0.4px] hover:cursor-pointer border-gray-400 rounded-md px-1 py-1"><ChevronsLeftRightIcon className = "w-4 h-4"/></button>
        <p></p>
      </div>
      <div  className = "w-full h-screen overflow-y-auto text-black bg-blue-300" style={containerStyle} ref = {editorRef}></div>
    </div>
  )
}
export default Editor;
