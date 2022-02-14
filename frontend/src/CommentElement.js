import moment from "moment";

import { PencilIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/solid";

export default function CommentElement(props) {

    return(
    <div className="comment-element bg-slate-100 mt-2 p-2 rounded-md shadow">
        <span className="italic">
           Ecrit par { props.comment.author.username } le { moment(props.comment.date).format("DD/MM/YYYY") } à { moment(props.comment.date).format("h:mm") }
        </span>
        <div className="grid grid-cols-6 mt-2 gap-2">
            <div className="break-words col-span-4">
                { props.comment.text }
            </div>
            <div className="ml-auto flex space-x-2 col-span-2">
                <button className='ml-auto flex bg-green-500 hover:bg-green-700 text-white font-bold rounded h-10 p-2'><PencilIcon className="h-5 w-5" /><span>Modifier</span></button>
                <button className='ml-auto flex bg-red-500 hover:bg-red-700 text-white font-bold rounded h-10 p-2'><TrashIcon className="h-5 w-5" /><span>Supprimer</span></button>
            </div>
        </div>
    </div>
    );

}