import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// create login screen just skeleton
// create screen that has cart where they can pay with mybalance
// create screen to connect to mybalance
