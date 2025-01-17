import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Project = () => {
    const location = useLocation()

    console.log(location.state)

  return (
    <main
    className='h-screen w-screen flex'>
        <section className="left flex flex-col  h-full min-w-60 bg-red-300">
            <header className="flex justify-end p-2 px-4 w-full bg-slate-200">
                <button className='p-2 '>
            <i className="ri-group-fill"></i>
            </button>

            </header>
            <div className="conversation-area flex-grow flex flex-col">
            <div className="message box flex-grow"></div>
            <div className="inputField w=full flex">
            <input 
            className='p-2 px-4 border-none outline-none' type="text" placeholder='Enter the message'/>
            <button className='flex-grow'><i className="ri-send-plane-fill"></i></button>
    </div>



            </div>

        </section>


    </main>
  )
}

export default Project