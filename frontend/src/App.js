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

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="posts" element={<Posts />} />
          <Route path="post/:id" element={<DetailedPost />} />
        </Routes>
      </BrowserRouter>
      <main>
      </main>
    </div>
  );
}

export default App;
