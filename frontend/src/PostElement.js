import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import moment from 'moment';

import { ArrowCircleRightIcon } from '@heroicons/react/solid'

export function PostElement(props) {

    const [nbComments, setNbComments] = useState();

    useEffect(() => {
        async function getNbComments() {
            const { data } = await axios.get(`http://localhost:5000/comments/post/nbComments/${props.post._id}`);
            setNbComments(data);
        }
        getNbComments();
    },[])

    function viewResumeOfText(text) {
        return `${text.substr(0,200)}...`;
    }

    return(
       <div id={props.post._id} className='bg-blue-200 rounded-md hover:bg-blue-300 w-full hover:scale-110 p-3'>
           <h2 className='font-semibold m-3'>{props.post.title}</h2>
           <p className='m-2'>
               <span className='italic'>Crée il y a {moment(props.post.date).fromNow()} par {props.post.author.username}</span>
               { props.post.lastUpdate && <span>Modifié pour la dernière fois {moment(props.post.lastUpdate).fromNow()}</span> }
           </p>
            <p className='bg-blue-100 rounded-md p-4'>
                {viewResumeOfText(props.post.text)} <br/>
            </p>
            <p className='flex m-2'>
                Nombre de commentaires : {nbComments ? nbComments : 0 } <br/>
                <div className='flex ml-auto'><Link to={`/post/${props.post._id}`}><span className='underline hover:font-bold hover:text-blue-700' >En savoir plus</span><ArrowCircleRightIcon className="h-5 w-5 text-blue-500" /></Link></div>
            </p>
       </div>
    )
}