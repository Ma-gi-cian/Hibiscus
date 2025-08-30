import {useState} from 'react';

function App(): React.JSX.Element {

  const [reply, getReply] = useState("No reply right now");
  const data = async() => {
    let response = await window.api.talk();
    console.log(response)
    getReply(response)
  }


  return (
    <main className = "w-full h-screen flex items-center justify-center bg-black text-white">
      <article className = "text-purple-600 flex items-center justify-center gap-4 font-semibold">
        <button className = "bg-white px-4 py-2 rounded-lg" onClick = { () => data()}>Check!</button>
        <p>{reply}</p>
      </article>
    </main>
  )
}

export default App
/**
 *<>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
 */
