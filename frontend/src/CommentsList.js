import CommentElement from "./CommentElement";
import { ChatAlt2Icon } from "@heroicons/react/solid";

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
      <div className="flex space-x-2">
        <ChatAlt2Icon className="h-5 w-5" />
        <h2 className="text-1xl font-medium mb-4">Liste des commentaires ({props.comments.length })</h2>
      </div>
        {showComments()}
    </div>
  );

}