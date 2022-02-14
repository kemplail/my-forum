import { Dialog } from '@headlessui/react'
import Title from './Title';

export default function DeleteElementModal(props) {

    return (
          <Dialog open={props.open} onClose={props.close} className="fixed z-10 inset-0 overflow-y-auto">
            
            <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>

                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />

                <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6'>
                    <Dialog.Title><Title as="span" name={`Supprimer "${props.name}"`} /></Dialog.Title>
                    <Dialog.Description className='mb-4'>
                        Etes-vous sûr de vouloir supprimer l'élément "{props.name}" ?
                    </Dialog.Description>

                    <div className='flex space-x-2'>
                        <button onClick={props.deleteFunc} className='bg-red-500 hover:bg-red-700 text-white font-bold rounded h-10 p-2'>Supprimer</button>
                        <button onClick={props.close} className='bg-gray-500 hover:bg-gray-700 text-white font-bold rounded h-10 p-2'>Annuler</button>
                    </div>
                </div>
            </div>

          </Dialog>
    );
}