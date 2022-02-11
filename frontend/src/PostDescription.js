import { useParams } from "react-router-dom";
import axios from 'axios';

export default function PostDescription(props) {
    return (
        <div className="post-description">
            <h1>{props.post.title}</h1>
            <p>
                Auteur : {props.post.author.username} <br />
                Date : {new Date(props.post.date).toDateString()}
                {props.post.lastupdate ? `Dernière mise à jour : ${props.post.lastupdate}` : ''}
            </p>
            <p>
                <button>Modifier</button>
                <button>Supprimer</button>
            </p>
            <p>
                {props.post.text}
            </p>
        </div>
    );
}