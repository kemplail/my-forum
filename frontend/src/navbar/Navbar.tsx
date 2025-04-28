import NavbarElement from "./NavbarElement";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { clearState } from "src/store/slices/user";
import { DeconnexionButton } from "./DeconnexionButton";

export function Navbar() {
  const acessToken = useAppSelector((state) => state.user.access_token);

  const dispatch = useAppDispatch();

  return (
    <div className="navbar flex bg-slate-200 border-solid border-2 border-gray-400">
      <Link to="/">
        <img
          className="h-16 w-40 mt-2 ml-2"
          src="https://images.squarespace-cdn.com/content/v1/64b95768b466013336da1b00/81b62eb3-987d-4ffc-b7dd-455d5da22a3e/myforumwords.png"
        />
      </Link>
      <ul className="flex">
        <NavbarElement name="Fil des posts" link="/posts" />
      </ul>

      {!acessToken ? (
        <ul className="flex ml-auto">
          <NavbarElement name="S'inscrire" link="/register" />
          <NavbarElement name="Se connecter" link="/login" />
        </ul>
      ) : (
        <ul className="flex ml-auto">
          <NavbarElement name="Mon espace" link="/myspace" />
          <DeconnexionButton onClick={() => dispatch(clearState())} />
        </ul>
      )}
    </div>
  );
}
