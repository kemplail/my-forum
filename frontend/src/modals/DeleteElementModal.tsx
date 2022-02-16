import { CancelButton } from '../formelements/CancelButton';
import { DeleteButton } from '../formelements/DeleteButton';
import { Modal } from './Modal';

interface DeleteElementModalProps {
    open: boolean,
    close: VoidFunction,
    name: string,
    deleteFunc: VoidFunction
}

export default function DeleteElementModal(props : DeleteElementModalProps) {

    return (

        <Modal open={props.open} close={props.close} title={props.name} description={`Etes-vous sûr de vouloir supprimer l'élément ?`} >

            <div className='flex space-x-2'>
                    <DeleteButton onClick={props.deleteFunc} />
                    <CancelButton onClick={props.close} />
            </div>

        </Modal>

    );
}