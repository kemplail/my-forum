import { Dialog } from '@headlessui/react'
import Title from 'src/textelements/Title'

interface ModalProps {
    open: boolean,
    close: VoidFunction,
    title: string,
    description: string,
    children: React.ReactNode
}


export function Modal(props: ModalProps) {
    
    return (

        <Dialog open={props.open} onClose={props.close} className="fixed z-10 inset-0 overflow-y-auto">
            
            <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>

                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />

                <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6'>
                    
                    <Dialog.Title>
                        <Title as="span">{ props.title }</Title>
                    </Dialog.Title>
                    <Dialog.Description className='mb-4'>
                        { props.description }
                    </Dialog.Description>

                    {
                        props.children
                    }
                   
                </div>
            </div>

        </Dialog>

    )

}