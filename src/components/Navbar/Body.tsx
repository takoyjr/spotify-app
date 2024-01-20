import { useState, useEffect } from "react";
import { SearchParam, useAccesToken } from "../../hooks/useAccessToken";
import { Link } from 'react-router-dom'

type playLists = {
  images: { url: string }[];
  name: string;
  owner: { display_name: string };
  id: string;
}[];

export function Body() {
  const searchParam = SearchParam();
  const accessToken = useAccesToken();
  const userId = "31isoxntszv4atuezfy2juqaayle";

  const [playList, getPlayList] = useState<playLists>([]);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists?offset=0&limit=20`,
          searchParam
        );

        if (!result.ok) {
          console.error("Failed :", result.status);
          return;
        }
        const data = await result.json();
        if (Array.isArray(data.items)) {
          console.log(data);
          getPlayList(data.items);
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Error :", error);
      }
    };

    getPlaylists();
  }, [accessToken, userId]);


  return (
    <>
      <div className="w-full h-full bg-212121 rounded-lg p-6 mt-1 mob-round mm">
        <div className="flex justify-between mb-4 font-semibold items-center ">
          <span>My Library</span>
          <span>
            <i className="fa-solid fa-list"></i>
          </span>
        </div>
        <ul>
          {playList.map((items) => (
            <Link to={`/playlists/${items.id}`}>
            <li key={items.id}>
              <div className="flex mb-4 items-center font-semibold">
                <img
                  className="w-12 h-12 rounded"
                  src={items.images[0].url}
                ></img>
                <div className="flex flex-col ml-3">
                  <span>{items.name}</span>
                  <div>
                    playlist
                    <span className="playList-name">
                      {items.owner.display_name}
                    </span>
                  </div>
                </div>
              </div>
            </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}
