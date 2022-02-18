import { Posts } from './posts/Posts';
import { Header } from './header/Header';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Home } from './Home';
import { DetailedPost } from './posts/DetailedPost';
import Container from './Container';
import { getAllPosts } from './store/slices/post';
//import { set } from './store/slices/post';
import { useAppDispatch } from './hooks';
import { useEffect } from 'react';
import { Register } from './auth/Register';
import { Login } from './auth/Login';

function App() {

  const dispatch = useAppDispatch();

  async function getPosts() {
    dispatch(getAllPosts());
  }

  useEffect(() => {
    getPosts();
  });

  return (
    <div className="App bg-slate-100 h-screen">
      <BrowserRouter>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="posts" element={<Posts />} />
          <Route path="post/:id" element={<DetailedPost />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login/>} />
        </Routes>
      </Container>
      </BrowserRouter>
      <main>
      </main>
    </div>
  );
}

export default App;
