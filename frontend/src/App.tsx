import { Posts } from './Posts';
import { Navbar } from './navbar/Navbar';
import { Header } from './header/Header';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Home } from './Home';
import { DetailedPost } from './DetailedPost';
import Container from './Container';
import { getAllPosts } from './store/slices/post';
//import { set } from './store/slices/post';
import { useAppDispatch } from './hooks';
import { useEffect } from 'react';

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
        </Routes>
      </Container>
      </BrowserRouter>
      <main>
      </main>
    </div>
  );
}

export default App;
