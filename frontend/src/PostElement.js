import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

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
        return `${text.substr(0,100)}...`;
    }

    return(
       <div id={props.post._id}>
           <h2>{props.post.title}</h2>
           <p>
               Auteur : {props.post.author.username} <br />
               Date : {new Date(props.post.date).toDateString()}
           </p>
            <p>
                {viewResumeOfText(props.post.text)} <br/>
                Nombre de commentaires : {nbComments ? nbComments : 0 } <br/>
                <Link to="/">En savoir plus</Link>
            </p>
       </div>
    )
}