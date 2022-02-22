import NavbarElement from './NavbarElement';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { clearState } from 'src/store/slices/user';
import { DeconnexionButton } from './DeconnexionButton';

export function Navbar() {
    
    const acessToken = useAppSelector((state) => state.user.access_token);

    const dispatch = useAppDispatch();

    return (
        <div className="navbar flex bg-slate-200 border-solid border-2 border-gray-400">
            <Link to="/">
                <img 
                    className="h-16 w-40 mt-2 ml-2"
                    src="http://static1.squarespace.com/static/58ffa7cae4fcb5b3f1e21577/t/58ffaa9f20099e9f05827f23/1493150371764/myforumwords.png" 
                />
            </Link>
            <ul className='flex'>
                <NavbarElement name="Fil des posts" link="/posts" />
            </ul>

            { !acessToken ?
                <ul className='flex ml-auto'>
                    <NavbarElement name="S'inscrire" link="/register" />
                    <NavbarElement name="Se connecter" link="/login" />
                </ul>
                :
                <ul className='flex ml-auto'>
                    <NavbarElement name="Mon espace" link="/" />
                    <DeconnexionButton onClick={() => dispatch(clearState())} />
                </ul>
            }

        </div>
    )

}