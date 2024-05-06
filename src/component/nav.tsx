import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-500 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center gap-7">
          <Link to="/home" className="text-white text-lg font-semibold">
            Home
          </Link>
          <div>
            <Link to="/cart" className="text-white mr-4">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
