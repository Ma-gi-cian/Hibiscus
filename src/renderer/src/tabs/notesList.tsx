import { useEffect, useState } from "react";
import { NotebookPen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@renderer/redux/hooks";
import { setNotebookDetails, setNoteOpenDetails } from "@renderer/redux/features/NotesHandler/notes";
import { Note } from "src/utils/types";

const NoteList = () => {

  const {notebookName, notebookId, note_open_id} = useAppSelector((state) => state.notesHandler)
  const dispatch = useAppDispatch();

  const [notes, setNotes] = useState<Note[]>([])
  const getNotes = async(id: string) => {
    const response = await window.api.getNotes(id);
    return response
  }

  useEffect(() => {
    console.log("The current Notebook id is", notebookId);
    const fetchNotes = async () => {
      const response = await getNotes(notebookId);
      if (response && typeof response === "object" && "docs" in response) {
        setNotes((response as { docs: Note[] }).docs);
      } else {
        setNotes([]);
      }
    };
    fetchNotes();
  }, [notebookId]);

  const createNote = async() => {
    if (notebookId != ""){
      const response =  await window.api.createNote(notebookId)
      console.log(response)
    } else {
      console.error("You need to be inside a notebook to do this")
    }
  }

  const selectNote  = (id: string) => {
    dispatch(setNoteOpenDetails({id}))
  }

  return (
    <div className="w-full h-screen bg-[#f1f2f0]">
      <div className="w-full relative flex items-center py-2 justify-center border-b-2 border-white">
        {notebookName != "" ? <label>{notebookName}</label> : <label>Select A Notebook</label>}
        <button
          className="absolute cursor-pointer right-4"
          onClick={createNote}
                  >
          <NotebookPen className="w-4 h-4" />
        </button>
      </div>

      <ul style={{ scrollbarWidth: "none" }} className="p-1 space-y-2 max-h-screen  overflow-y-auto">
        {notes?.map((d, index) => (
          <button onClick = {() => selectNote(d._id)} key = {index} className = "flex flex-col w-full text-left">
            <h1 className = "w-full">{d.title}</h1>
            <p className = "w-full">{d.body}</p>
          </button>
        ))}
     </ul>
    </div>
  )
}

export default NoteList;
