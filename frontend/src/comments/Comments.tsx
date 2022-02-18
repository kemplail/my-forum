import AddComment from "./AddComment";
import CommentsList from "./CommentsList";
import { useGetCommentsOfAPostQuery } from "../store/rtk/comments";
import { useAppSelector } from "src/hooks";

interface CommentProps {
    postid: string
}

export default function Comments(props : CommentProps) {

    const { data, isLoading, error } = useGetCommentsOfAPostQuery(props.postid);
    const accesstoken = useAppSelector((state) => state.user.access_token);

    function showComments() {
        return(
            <div className='comments-childlist bg-blue-100 p-4 shadow'>
                { accesstoken && 
                    <AddComment postid={props.postid} />
                }

                {!isLoading && data && <CommentsList comments={data} />}
            </div>
        );
    }

    return(<div className="comments-parentlist">{ !isLoading ? showComments() : "Loading..."}</div>);

}