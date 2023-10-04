import React, {useContext} from 'react'
import Appcontext from '../AppContext/Appcontext'


export default function Receipentsprofiledrawer() {
    
    const context = useContext(Appcontext)
    
  return (
    <div className={`h-full flex flex-col transition-all ${context.profileVisible?'w-4/5':'w-0'} select-none overflow-y-scroll` }>
        <nav className={` h-20 w-full bg-slate-400 flex items-center transition-all ${context.profileVisible?'visible':'hidden'}`}>
            <span className=' text-lg my-4'>
                <button className=' cursor-pointer bg-transparent outline-none border-none text-white mx-8 text-xl' onClick={()=>context.setProfileVisible(false)}><i className="fa-solid fa-close"></i></button>
                <span className='text-white font-semibold'>My Profile</span>
            </span>
        </nav>
        <section className={` bg-slate-100 w-full flex-grow flex flex-col items-center transition-all ${context.profileVisible?'visible':'hidden'}`}>
            {/* profile picture */}
            <section className=' h-80 w-full bg-white flex justify-evenly items-center flex-col mb-2'>
                <span className=' transition rounded-full overflow-hidden h-48 w-48 flex jusfity-center items-center'>
                    <img className='w-full h-full'src={context.chatSelected.picture || 'https://shorturl.at/cjtyQ'} alt="Image not found." />
                </span>
                <span className=' flex flex-col items-center'>
                <span className='text-xl text-slate-700'>{context.chatSelected.username}</span>
                <span className='text-sm text-slate-400'>{context.chatSelected.email}</span></span>
            </section>
            <section className=' pl-12 h-max w-full bg-white flex justify-evenly flex-col mb-4'>
                <span className=' text-blue-600 text-sm pt-4 pb-3'>Description</span>
                <span className=' text-slate-700 pb-4'>{context.chatSelected.description}</span>
            </section>
        </section>
    </div>
  )
}
