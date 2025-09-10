import Editor from './tabs/editor'
import NotebookList from './tabs/notebookList'
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  type ImperativePanelHandle
} from 'react-resizable-panels'

import { useRef,  useState } from 'react'
import NoteList from './tabs/notesList'

function App(){

  const sidebar = useRef<ImperativePanelHandle>(null)
  const noteside = useRef<ImperativePanelHandle>(null)

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSidebarResize = (size: number | undefined) => {
    if (size && size > 3) {
      setSidebarCollapsed(false)
    }
  }

  return (
    <main className="w-[100%] h-screen bg-[#f8f5f9] flex items-center justify-center flex-col overflow-hidden">
      <PanelGroup className="border-t-2 border-black" direction="horizontal">
        <Panel
          ref={sidebar}
          onResize={() => handleSidebarResize(sidebar.current?.getSize())}
          maxSize={25}
          minSize={0}
          defaultSize={20}
          className={true ? `min-w-[200px]` : ''}
        >
          <NotebookList/>
        </Panel>

        <PanelResizeHandle/>

        <Panel
        minSize={0}
        maxSize={30}
        defaultSize={24}
        className = {true ? `min-w-[200px]` : ''}
        >
          <NoteList/>
        </Panel>

        <PanelResizeHandle/>
        
        <Panel minSize={30} defaultSize={63}>
          <Editor/>
        </Panel>
      </PanelGroup>
    </main>
  )
}


export default App;
