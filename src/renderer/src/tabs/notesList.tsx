import { NotebookPen } from "lucide-react";

const NoteList = () => {

  return (
    <div className="w-full h-screen bg-[#f1f2f0]">
      <div className="w-full relative flex items-center py-2 justify-center border-b-2 border-white">
        <p>Signals And Systems</p>
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
