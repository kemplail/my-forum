import CommentElement from "./CommentElement";

export default function CommentsList(props) {

  function showComments() {
    if(props.comments.length > 0) {
      return props.comments.map((element) => {
        return <CommentElement key={element._id} comment={element} />
      })
    } else {
      return <p>Aucun commentaire trouvé</p>;
    }
  }

  return (
    <div className="comments-list">
        <h2>Liste des commentaires ({props.comments.length })</h2>
        {showComments()}
    </div>
  );

}