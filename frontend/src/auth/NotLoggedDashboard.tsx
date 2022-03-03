import { Link } from "react-router-dom";

export function NotLoggedDashboard() {
    return (
        <div className=' grid grid-cols-2 bg-slate-200 rounded-md px-8 py-4 gap-12 ml-60 mr-60 shadow mt-6'>
            <div>
                <div className='bg-blue-300 p-4 rounded-md shadow hover:scale-110 hover:bg-blue-400'>
                    <Link to="/login" className="w-full" >
                        <button className="w-full">
                            S'identifier
                        </button>
                    </Link>
                </div>
                <div className="m-2">Pas encore inscrit ? <Link to="/register" className="text-blue-400 hover:text-blue-600">S'inscrire</Link></div>
            </div>
            <div className='bg-blue-300 p-4 rounded-md shadow hover:scale-110 hover:bg-blue-400 h-3/5'>
                <Link to="/posts">
                    <button className="w-full">
                        Consulter les derniers posts
                    </button>
                </Link>
            </div>
        </div>
    )
}