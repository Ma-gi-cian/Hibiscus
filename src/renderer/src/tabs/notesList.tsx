import { useEffect } from "react";
import { NotebookPen } from "lucide-react";
import { useAppSelector } from "@renderer/redux/hooks";

const NoteList = () => {

  const {notebookName, notebookId, note_open_id} = useAppSelector((state) => state.notesHandler)

  useEffect(() => {
    console.log("The current Notebook id is",notebookId)
  }, [notebookId])

  const createNote = () => {
    
  }

  return (
    <div className="w-full h-screen bg-[#f1f2f0]">
      <div className="w-full relative flex items-center py-2 justify-center border-b-2 border-white">
        {notebookName != "" ? <label>{notebookName}</label> : <label>Select A Notebook</label>}
        <button
          className="absolute right-4"
                  >
          <NotebookPen className="w-4 h-4" />
        </button>
      </div>

      <ul style={{ scrollbarWidth: "none" }} className="p-1 space-y-2 max-h-screen  overflow-y-auto">
     </ul>
    </div>
  )
}

export default NoteList;
