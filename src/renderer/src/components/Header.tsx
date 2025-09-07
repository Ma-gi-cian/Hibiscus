import { useState } from "react";
import {useAppSelector, useAppDispatch} from '../redux/hooks'
import { OpenNotebook } from "../redux/features/app_state";
import { AlignJustify } from 'lucide-react';

const Header = () => { 
    const dispatch = useAppDispatch();
    const note = useAppSelector((state) => state.stateHandler)    
    const handleTab = () => {

        dispatch(OpenNotebook(!note.isNotebooksOpen))
    }

    const [title, setTitle] = useState<string>("Hibiscus")
    /** bg-[#f8f5f9] */
    return(
        <div style={{ WebkitAppRegion: 'drag' }} className = "w-full  flex items-center justify-center  h-fit p-1 ">
        <div className = "w-full flex items-center justify-center px-4 rounded-xl relative">
            <button onClick={handleTab} style={{WebkitAppRegion: 'no-drag'}} className = "absolute left-7"><AlignJustify /> </button>{/** button for opening the notebooks bar */}
                <p className = "font-mono text-[#333333] text-xs border-2 border-gray-700 rounded-md px-16 md:px-16 lg:px-16 md:text-lg lg:text-md my-1 tracking-widest">{title}</p>
            </div>
        </div>
    )
}

export default Header;