import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/index";
import Listings from "./pages/Listings/index";
import Property from "./pages/Property/index";
import Favourites from "./pages/Favourites/index";
import Contact from "./pages/Contact/index";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F5F0E8" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<Property />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}