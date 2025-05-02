import { Posts } from "./posts/Posts";
import { Header } from "./header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { DetailedPost } from "./posts/DetailedPost";
import Container from "./Container";
import { Register } from "./auth/Register";
import { Login } from "./auth/Login";
import { NotFound } from "./validation/NotFound";
import { AccountDashboard } from "./auth/AccountDashboard";
import { Statistics } from "./metrics/Statistics";

function App() {
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
            <Route path="login" element={<Login />} />
            <Route path="myspace" element={<AccountDashboard />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </BrowserRouter>
      <main></main>
    </div>
  );
}

export default App;
