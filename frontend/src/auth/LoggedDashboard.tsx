import { Link, useNavigate } from "react-router-dom";

export function LoggedDashboard() {

    const navigate = useNavigate();

    return (
        <div className=' grid grid-cols-2 bg-slate-200 rounded-md px-8 py-4 gap-12 ml-60 mr-60 shadow mt-6'>
            <div className='bg-blue-300 p-4 rounded-md shadow hover:scale-110 hover:bg-blue-400'>
                <Link to="/posts">
                    <button className="w-full">
                        Consulter les derniers posts
                    </button>
                </Link>
            </div>
            <div className='bg-blue-300 p-4 rounded-md shadow hover:scale-110 hover:bg-blue-400'>
                <button className="w-full">
                    <Link to="/posts" state={{ fromDashBoard: true }}>
                        <button className="w-full">
                            Ajouter un nouveau post
                        </button>
                    </Link>
                </button>
            </div>
        </div>
    )
}