import { useRef, useEffect } from 'react';
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


    // editorRef.current?.focus()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ( event.code == "Enter" && viewRef.current) {
      event.preventDefault();
      viewRef.current.focus()
    }
  }

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
    <div className="px-2 relative gap-4" style={{WebkitAppRegion: "drag"}}>

      <div style={{WebkitAppRegion: 'no-drag'}} className="w-full rounded-t-xl bg-white p-3 border-b border-gray-200">
        <div id="title" className="flex items-center gap-3" style={{WebkitAppRegion : 'drag'}}>
          <button
            style={{WebkitAppRegion: 'no-drag'}}
            onClick={() => console.log("clicked")}
            className="flex-shrink-0 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-md px-1.5 py-1.5 transition-colors duration-200"
          >
            <ChevronsLeftRightIcon className="w-4 h-4 text-gray-600"/>
          </button>

          <input
            style={{WebkitAppRegion: 'no-drag'}}
            className="flex bg-transparent text-gray-900 text-2xl w-1/2 font-semibold border-none outline-none placeholder-gray-400 focus:placeholder-gray-300 transition-colors duration-200"
            placeholder="Untitled"
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div
        className="w-full h-screen overflow-y-auto text-black bg-blue-300"
        style={containerStyle}
        ref={editorRef}
      >
      </div>
    </div>
  )
}

export default Editor;
