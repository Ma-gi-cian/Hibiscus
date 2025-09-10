import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface NoteState  {
  notebookName : string;
  notebookId : string;
  note_open_id: string | null;
}

const initialData : NoteState = {
  notebookName: "",
  notebookId : "",
  note_open_id: null
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
    }
  }
})

export const { setNotebookDetails, setNoteOpenDetails } = notesHandler.actions;
export default notesHandler;
