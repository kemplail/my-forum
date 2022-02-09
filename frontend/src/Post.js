import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function Post(props) {

    const [nbComments, setNbComments] = useState();

    useEffect(() => {
        async function getNbComments() {
            const { data } = await axios.get('http://localhost:5000/comments/post/nbComments/'+props.post._id);
            setNbComments(data);
        }
        getNbComments();
    },[])

    return(
       <div id={props.post._id}>
           <h2>{props.post.title}</h2>
            <p>
                {props.post.text} <br/>
                Nombre de commentaires : {nbComments ? nbComments : 0 }
            </p>
       </div>
    )
}