import { Link } from "react-router-dom";
import moment from 'moment';

import { ArrowCircleRightIcon, ChatAlt2Icon, HeartIcon } from '@heroicons/react/solid'
import { Post } from '../types/post';
import { useGetCommentsOfAPostQuery } from '../store/rtk/comments';
import { DateElement } from "../textelements/DateElement";

interface PostElementProps {
    post: Post
}

export function PostElement(props: PostElementProps) {

    const { data, isLoading, error } = useGetCommentsOfAPostQuery(props.post._id);

    function viewResumeOfText(text: string) {
        return `${text.substr(0,200)}...`;
    }

    return(
       <div id={props.post._id} className='bg-blue-200 rounded-md hover:bg-blue-300 w-full hover:scale-110 p-3 shadow'>

           <h2 className='font-semibold m-3'>{props.post.title}</h2>

           <p className='m-2'>
                <DateElement>Crée {moment(props.post.date).fromNow()} par {props.post.author.username}</DateElement> <br/>
                { props.post.lastUpdate && <DateElement>Modifié pour la dernière fois {moment(props.post.lastUpdate).fromNow()}</DateElement> }
           </p>

           <hr />

            <p className='bg-blue-100 rounded-md p-4 mt-2'>
                {viewResumeOfText(props.post.text)} <br/>
            </p>

            <p className='flex m-2'>

                <div className="flex space-x-2">
                    <ChatAlt2Icon className="h-8 w-8 text-blue-700" /> {!isLoading ? data && data.length : "Loading..." }
                    <HeartIcon className="h-8 w-8 text-pink-500" /><span>{props.post.likes.length}</span>
                </div>

                <Link to={`/post/${props.post._id}`} className="flex ml-auto">
                    <span className='underline hover:font-bold hover:text-blue-700' >En savoir plus</span>
                    <ArrowCircleRightIcon className="h-5 w-5 text-blue-500 ml-1" />
                </Link>
                
            </p>

       </div>
    )
}