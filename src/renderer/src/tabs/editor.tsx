import { useRef, useEffect, useState } from 'react';
import { Note } from 'src/utils/types';
import { basicExtensions } from '../components/EditorExtensions';
import { EditorView } from "@codemirror/view";
import { ChevronsLeftRightIcon} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@renderer/redux/hooks';

const Editor = () => {
  const {notebookName, notebookId, note_open_id, currentNote} = useAppSelector((state) => state.notesHandler)
  const dispatch = useAppDispatch()
  const editorRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    const noteData = async(id: string) => {
      const response = await window.api.getNoteData(id);
      console.log(response);
    }

    if (note_open_id != null) {
      noteData(note_open_id);
    }

    if(editorRef.current && !viewRef.current) {
      viewRef.current = new EditorView({
        doc: currentNote.body,
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
  },[note_open_id, currentNote])


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

          {note_open_id ? <input
            style={{WebkitAppRegion: 'no-drag'}}
            className="flex bg-transparent text-gray-900 text-2xl w-1/2 font-semibold border-none outline-none placeholder-gray-400 focus:placeholder-gray-300 transition-colors duration-200"
            value={currentNote.title}
            onKeyDown={handleKeyDown}
          /> : <p></p>}

        </div>
      </div>

      {note_open_id ? <div
        className="w-full h-screen overflow-y-auto text-black bg-blue-300"
        style={containerStyle}
        ref={editorRef}
      >
      </div> : <div className = "w-full, h-screen flex items-center justify-center text-xl font-serif overflow-y-auto text-black bg-blue-300" style={containerStyle}>Please Select a note from a Notebook</div>}
    </div>
  )
}

export default Editor;
