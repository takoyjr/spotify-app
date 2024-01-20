import { useEffect, useState } from "react";
import "../css/Main.css";
import { useAccesToken } from "../hooks/useAccessToken";
import { Link } from "react-router-dom";


type releasesArtist = {
  name: string;
  images: { url: string }[];
  id: string;
  artists: { name: string }[];
}[];

export const popularGenres:string[] = ["Pop", "Rock-N-Roll", "Hip-Hop", "Electro", "Alternative"];

type GenresColors = { [key in "Pop" | "Rock-N-Roll" | "Hip-Hop" | "Electro" | "Alternative"]: string };
export const genresColors: GenresColors = {
  "Pop": "from-pink-300 to-pink-700",
  "Rock-N-Roll": "from-yellow-300 to-orange-700",
  "Hip-Hop": "from-green-300 to-green-700",
  "Electro": "from-purple-300 to-purple-700",
  "Alternative": "from-gray-300 to-gray-700",
};

export function Main() {
  const [releasesArtist, setReleasesArtist] = useState<releasesArtist>([]);
  const accessToken = useAccesToken();

  var searchParam = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/browse/new-releases`,
          searchParam
        );

        if (!result.ok) {
          console.error("Failed :", result.status);
          return;
        }

        const data = await result.json();

        if (data.albums && data.albums.items) {
          setReleasesArtist(data.albums.items);
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Error :", error);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div className="p-6">
      <div className="">
        <h1 className="font-bold text-3xl mb-2">Popular genres</h1>
        <ul className="wrapper">
          {popularGenres.map((genre) => {
            return (
              <Link to={`/genres/${genre}`} >
              <li className="hover:cursor-pointer" 
              key={genre}>
                <div className="w-full bg-181818 rounded-lg p-4">
                  <div
                    className={
                    `${genre === "Pop" ? genresColors[genre] : 
                    genre === "Rock-N-Roll" ? genresColors[genre] : 
                    genre === "Hip-Hop" ? genresColors[genre] : 
                    genre === "Electro" ?  genresColors[genre] : 
                    genre === "Alternative" ?  genresColors[genre] : ""}
                    w-full h-52 bg-cover bg-no-repeat rounded-lg flex justify-center items-center bg-gradient-to-br`}
                  >
                    <span className="text-nowrap font-bold text-2xl">
                      {genre}
                    </span>
                  </div>
                </div>
              </li>
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="mt-4">
        <h1 className="font-bold text-3xl my-2">New Releases</h1>
        <ul className="wrapper">
          {releasesArtist.map((release) => {
            return (
              <Link to={`/albums/${release.id}`} >
              <li className="hover:cursor-pointer"
              key={release.name}>
                <div className="w-full bg-181818 rounded-lg flex flex-col justify-end items-center p-4">
                  <div
                    className="w-full h-52 bg-cover bg-no-repeat rounded-lg"
                    style={{ backgroundImage: `url(${release.images[0].url})` }}
                  ></div>
                  <div className="w-full text-ellipsis overflow-hidden pt-2 flex flex-col">
                    <span className="text-nowrap font-bold text-lg text-wrapper-m">
                      {release.name}
                    </span>
                    <span className="text-nowrap text-wrapper-m">{release.artists[0].name}</span>
                  </div>
                </div>
              </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
