import { configureStore } from "@reduxjs/toolkit";
import notesHandler from "./features/NotesHandler/notes";

export const store = configureStore({
  reducer: {
    notesHandler : notesHandler.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
