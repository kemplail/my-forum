export default function CommentElement(props) {

    return(
    <div className="comment-element">
        <div>
            <button>Modifier</button>
            <button>Supprimer</button>
        </div>
        <p>
           Ecrit par { props.comment.author.username } le { new Date(props.comment.date).toDateString() }
        </p>
        <p>
            { props.comment.text }
        </p>
    </div>
    );

}