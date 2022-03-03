import { Link, Navigate } from "react-router-dom";
import { useAppSelector } from "src/hooks";
import Title from "src/textelements/Title";

export function AccountDashboard() {

    const accesstoken = useAppSelector((state) => state.user.access_token);

    if (accesstoken) {
        return (
            <div className="p-4">
                <Title>Mon espace</Title>
                <div className=' grid grid-cols-2 bg-slate-200 rounded-md px-8 py-4 gap-12 ml-60 mr-60 shadow mt-6'>
                    <div className='bg-blue-300 p-4 rounded-md shadow hover:scale-110 hover:bg-blue-400'>
                        <Link to="/statistics">
                            <button className="w-full">
                                Statistiques
                            </button>
                        </Link>
                    </div>
                    <div className='bg-blue-300 p-4 rounded-md shadow hover:scale-110 hover:bg-blue-400'>
                        <Link to="" state={{ fromDashBoard: true }}>
                            <button className="w-full">
                                A venir...
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <Navigate
                to={`/login/`}
            />
        )
    }

}