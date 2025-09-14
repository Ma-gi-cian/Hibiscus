import {  useEffect, useRef, useState } from "react";
import {USER, Notebook} from "../../../utils/types"
import {
  NotebookText,
  NotepadText,
  PlusCircle,
  Pin,
} from "lucide-react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@renderer/redux/hooks";
import {setNotebookDetails} from "@renderer/redux/features/NotesHandler/notes"
/**
 * First query the notebooks with parent notebook equal to null
 * when we click any notebook that it will select it as the parent notebook
 *     - query the notes and notebooks inside of it. The notebooks should be displayed in the notebook panel and
 *     - the notes in the notes section.
 *
 * We will also be able to get back meaning render the parent notebook using a back button in the notebooks panel
 *
 */

const NotebookList = () => {

  const dispatch = useAppDispatch();

  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedNotebook, setSelectedNotebook] = useState<string>("")
  const [isFormOpen, setFormOpen] = useState(false)
  const [userData, setUserData] = useState<USER>()
  const [rootNotebooks, setRootNotebooks] = useState<Notebook[]>([]);

  useEffect(() => {
    const fetch = async() => {
      const userDataResponse= await window.api.sync();
      const rootNotebooks = await window.api.getRootNotebooks();
      setUserData(userDataResponse)
      setRootNotebooks(rootNotebooks.docs)
    }
    fetch()

  }, [])

  useEffect(() => {
    if(isFormOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFormOpen])

  const chooseNotebook = (name: string, id: string) => {
    dispatch(setNotebookDetails({name, id}))
  }

  const addNotebook = async (name: string, parentNotebook: string | null) => {
    const response = await window.api.addNotebook(name, parentNotebook);
    if ( response ) {
      console.log("Created")
      const rootNotebooks = await window.api.getRootNotebooks();
      setRootNotebooks(rootNotebooks.docs);
      setFormOpen(false);
    } else {
      console.error("Failed to create it ")
    }
  }


  const handleNotebookFormSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    const notebookName = e.target[0].value;
    if(notebookName != "") {
      addNotebook(notebookName, null)
    } else {
      console.error("Failed to create the notebook")
    }
  }

  return (
    <div className="w-full  border-r-[0.4px] flex items-center justify-center flex-col border-gray-300 h-screen tracking-wider text-slate-800">

      <div className="w-full  h-screen p-8 tracking-wider space-y-3 ">
        <button onClick = {() => setSelectedNotebook('all-notes') } className={ selectedNotebook == "all-notes" ? ` bg-pink-100 w-full py-1 px-2 font-serif text-lg flex items-center justify-left gap-4` : `font-serif py-1 px-2 w-full text-lg flex items-center justify-left gap-4`}>
          <NotepadText className="w-5 h-5" />
          <span>All Notes</span>
        </button>

        <button onClick = {() => setSelectedNotebook("pinned")} className= { selectedNotebook == "pinned" ? ` bg-pink-100 py-1 px-2 justify-left w-full font-serif text-lg flex items-center justify-left gap-4` : `font-serif w-full py-1 px-2 text-lg flex items-center justify-left gap-4`}>
          <Pin className="w-5 h-5" />
          <span>Pinned</span>
        </button>

        <span className="font-serif text-lg flex items-center justify-between w-full gap-4">
          <span className="flex items-center justify-center gap-4">
            <NotebookText className="w-5 h-5" />
            <p>Notebooks</p>
          </span>
          <button onClick = {() => setFormOpen(!isFormOpen)}>
            <PlusCircle className = "w-4 h-4"/>
          </button>
        </span>
        <ul className = "font-serif space-y-1  flex flex-col">
          <form   className = { isFormOpen ? `w-full border-[0.3px] border-black ` : `hidden`} onSubmit={handleNotebookFormSubmit}>
            <input ref={inputRef}  placeholder="Notebook Name..." className = { `px-2 py-1 w-full`} />
            <button className = "hidden" type="submit">Submit</button>
          </form>
          {/** when the button is clicked then we select this notebook and then get the data  */}
          {rootNotebooks.length == 0 ? <p></p> :  rootNotebooks.map((d, index) => (<button key = {index} onClick = {() => {chooseNotebook(d.name, d._id)}} className="pl-8 text-left cursor-pointer">{d.name}</button>))}
        </ul>
      </div>

      <div className="flex items-left font-mono p-4 w-full border-t-[3.2px] justify-between flex-col">
        <p>{userData?.name}</p>
        <p className="text-xs tracking-widest text-zinc-600">
          {" "}
          Synced At: {new Date(String(userData?.syncedOn)).toTimeString().split(" ")[0]}
        </p>
      </div>
    </div>
  );
};

export default NotebookList;
