import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Main } from "./components/Main";
import { Search } from "./components/Search";
import { GenrePage } from "./components/GenrePage";
import { Wrong } from "./components/Wrong";
import { AlbumPage } from "./components/AlbumPage"
import { ListPage } from "./components/ListPage"

function App() {
  return (
    <>
      <div className="h-screen w-full p-2 mob">
        <div className="h-full flex overflow-hidden mob mob-flex">
          <Navbar />
          <div className="main w-full text-white h-full ml-1 rounded-lg overflow-auto mob mob-round">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/search" element={<Search />} />
              <Route path="/genres/:popularGenres" element={<GenrePage />} />
              <Route path="/albums/:newReleases" element={<AlbumPage />} />
              <Route path="/playlists/:userPlaylists" element={<ListPage />} />
              <Route path="*" element={<Wrong />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
