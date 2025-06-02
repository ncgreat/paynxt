import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import { DealContext } from '../../DealContext';

const Subheader = (title) => {
  const history = useHistory();
  const {setViewMore} = useContext(DealContext);
//  console.log(title.title);
  return (
    <div className="p-4 bg-[#f4eff6] border border-gray-200 shadow-sm 
    sticky top-0 z-50">
        <div className='flex pl-2'>
        <button 
            onClick={() => {history.goBack(); setViewMore(false)}} 
            className='border border-gray-400 rounded-md shadow-md p-2'>
            <MdArrowBack />
        </button>
        <h3 className="font-semibold pl-3 mt-1 text-[#868686]">{title?.title }</h3>
        </div>
       
    </div>
    
  )
}

export default Subheader