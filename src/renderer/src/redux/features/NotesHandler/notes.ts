import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Note } from "src/utils/types";

export interface NoteState  {
  notebookName : string;
  notebookId : string;
  note_open_id: string | null;
  currentNote : Note
}

const initialData : NoteState = {
  notebookName: "",
  notebookId : "",
  note_open_id: null,
  currentNote: {
    _id: "",
    title: "",
    body: "",
    bookId: "",
    createdAt: new Date(Date.now()),
    modifiedAt: new Date(Date.now()),
    numOfTasks: 0,
    numOfCheckedTasks: 0,
    pinned: false,
    status: "done",
    tags: [],
    type: "note"
  }
}

const notesHandler  = createSlice({
  initialState: initialData,
  name: 'notelist',
  reducers: {
    setNotebookDetails : (state, action : PayloadAction<{name: string, id: string}>) => {
      const {name, id} = action.payload;
      state.notebookId = id;
      state.notebookName = name;
      state.note_open_id = null; // maybe we can like remember in the future what was open and make it open ( store what was open using the config or something, or even modify the notes structure )
    },

    setNoteOpenDetails: (state, action: PayloadAction<{id : string }>) => {
      const { id } = action.payload;
      state.note_open_id = id;
    },

    setCurrentNote : (state, action: PayloadAction<Note>) => {
      state.currentNote = action.payload;
    }
  }
})

export const { setNotebookDetails, setNoteOpenDetails } = notesHandler.actions;
export default notesHandler;
