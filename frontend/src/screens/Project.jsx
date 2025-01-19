import React, { useEffect, useState ,useContext} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket,receiveMessage,sendMessage } from '../config/socket'
import { UserContext } from '../context/user.context'


const Project = () => {
    const location = useLocation()

    const [isSidePanalOpen, setisSidePanalOpen] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [ users, setUsers ] = useState([])
    const [ project, setProject ] = useState(location.state.project)
    const [message, setmessage] = useState('')
    const { user } = useContext(UserContext)
    // const messageBox = React.createRef(null)
    const messageBoxRef = React.useRef(null);





    
    const handleUserClick = (id) => {
        setSelectedUserId(
          prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });
    }

    function addCollaborators() {

      axios.put("/projects/add-user", {
          projectId: location.state.project._id,
          users: Array.from(selectedUserId)
      }).then(res => {
          // console.log(res.data)
          setIsModalOpen(false)

      }).catch(err => {
          console.log(err)
      })

  }

  const send=()=>{
    // console.log(user)
    sendMessage('project-message', {
      message,
      sender: user
    })
    appendOutgoingMessage(message)
    setmessage('')

  }


    useEffect(() => {

      initializeSocket(project._id)

      receiveMessage('project-message', (data) => {
        console.log(data)
        appendIncomingMessage(data)
      })

      axios.get(`/projects/get-project/${location.state.project._id}`).then((res) => {
        console.log(res.data.project);
        
        setProject(res.data.project)
        })
        axios.get('/users/all').then((res) => {
          setUsers(res.data.users)
          }).catch(err => {
            console.log(err)
          })

    }, [])

    // function appendIncomingMessage(messageObject){
    //   const messageBox = document.querySelector('.message-box')
    //   const message = document.createElement('div')
    //   message.classList.add('message' , 'max-w-56' , 'flex' , 'flex-col' , 'p-2' , )
    //   message.innerHTML = `
    //   <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
    //   <p class='text-sm'>${messageObject.message}</p>
    //   `
    //   messageBox.appendChild(message)
    // }

    function appendIncomingMessage(messageObject) {
      const messageBox = messageBoxRef.current;
      if (messageBox) {
        const message = document.createElement('div');
        message.classList.add('message', 'max-w-56', 'flex', 'flex-col', 'p-2','bg-slate-50', 'rounded-md');
        message.innerHTML = `
          <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
          <p class='text-sm'>${messageObject.message}</p>
        `;
        messageBox.appendChild(message);
        scrollToBottom();
        // messageBox.scrollTop = messageBox.scrollHeight; // Auto-scroll to the bottom
      }
    }

    // function appendOutgoingMessage(message) {
    //   const messageBox = messageBoxRef.current;
    //   if (messageBox) {
    //     const message = document.createElement('div');
    //     message.classList.add('ml-auto', 'max-w-56', 'flex', 'flex-col', 'p-2', 'bg-slate-50', 'rounded-md');
    //     message.innerHTML = `
    //       <small class='opacity-65 text-xs'>${user.email}</small>
    //       <p class='text-sm'>${message}</p>
    //     `;
    //     messageBox.appendChild(message);

    //     messageBox.scrollTop = messageBox.scrollHeight; 
    //   }
    // }

    function appendOutgoingMessage(messageContent) {
      const messageBox = messageBoxRef.current;
      if (messageBox) {
        const messageElement = document.createElement('div'); // Rename to avoid shadowing
        messageElement.classList.add('ml-auto', 'max-w-56', 'flex', 'flex-col', 'p-2','bg-slate-50', 'rounded-md');
        messageElement.innerHTML = `
          <small class='opacity-65 text-xs'>${user.email}</small>
          <p class='text-sm'>${messageContent}</p>
        `;
        messageBox.appendChild(messageElement);
        scrollToBottom();
    
        // Scroll to the bottom to display the latest message
        // messageBox.scrollTop = messageBox.scrollHeight;
      }
    }

    function scrollToBottom() {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight
  }
    
    



    // console.log(location.state)

  return (
    <main
    className='h-screen w-screen flex'>
        <section className="left relative flex flex-col  h-screen min-w-96 bg-slate-300">
            <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute top-0">
                
            <button className='flex gap-2' 
            onClick={() => setIsModalOpen(true)}
            >
                        <i className="ri-add-fill mr-1"></i>
                        <p>Add collaborator</p>
                    </button>


                <button
                onClick={
                  () => setisSidePanalOpen(!isSidePanalOpen)
                } className='p-2 '>
            <i className="ri-group-fill"></i>
            </button>

            </header>
            <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full">
              
            <div
            ref={messageBoxRef}
             className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
              

            </div>
            <div className="inputField w-full flex absolute bottom-0">
            <input 
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            className='p-2 px-4 border-none outline-none flex-grow' type="text" placeholder='Enter the message'/>
            <button
            onClick={send} className=' px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
    </div>



            </div>



            <div className={`sidePanal w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all  ${isSidePanalOpen? 'translate-x-0':'-translate-x-full'} top-0`}>
              <header className='flex justify-between items-center   px-4 p-2 bg-slate-200'>
                <h1 className='font-semibold'>Collaborators</h1>
                <button onClick={() => setisSidePanalOpen(!isSidePanalOpen)}
                  className='p-2'> 
                  <i className="ri-close-fill"></i>
                </button>
              </header>

              <div className="users flex flex-col gap-2">
                {project.users && project.users.map(user => {
                  return (
                      <div className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center ">
                  <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                  <i className="ri-user-fill absolute"></i>


                  </div>
                  <h1 className='font-semibold text-lg'>{user.email}</h1>
                </div> 
                  )
                    
                })}

             
              </div>

            </div>

        </section>
        {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user.id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}


    </main>
  )
}

export default Project