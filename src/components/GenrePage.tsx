import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { genresColors } from "./Main";
import { useAccesToken } from "../hooks/useAccessToken";
import {Link} from 'react-router-dom'

type GenreTrack = {
  name: string;
  id: string;
  artists: { name: string }[];
  album: {
    id: string;
    images: { url: string }[];
  };
};

type Artists = {
  name: string;
}[];


export function GenrePage() {
  const { popularGenres } = useParams();
  const [genreTrack, setGenreTrack] = useState<GenreTrack[]>([]);
  const accessToken = useAccesToken();

  var searchParam = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  async function getRecommendations() {
    try {
      const result = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_genres=pop`,
        searchParam
      );

      if (!result.ok) {
        console.error("Failed :", result.status);
        return;
      }

      const data = await result.json();
      setGenreTrack(data.tracks); 
    } catch (error) {
      console.error("Error :", error);
    }
  }

  useEffect(() => {
    getRecommendations();
  }, [accessToken]);

  return (
    <div className="p-6">
      <h1
        className={`${
          popularGenres === "Pop"
            ? genresColors[popularGenres]
            : popularGenres === "Rock-N-Roll"
            ? genresColors[popularGenres]
            : popularGenres === "Hip-Hop"
            ? genresColors[popularGenres]
            : popularGenres === "Electro"
            ? genresColors[popularGenres]
            : popularGenres === "Alternative"
            ? genresColors[popularGenres]
            : ""
        } bg-clip-text text-transparent bg-gradient-to-br font-bold text-3xl mb-2`}
      >
        {popularGenres}
      </h1>
      <ul className="wrapper">
        {genreTrack.map((track, index) => {
          return (
            <Link to={`/albums/${track.album.id}`} >
            <li className="hover:cursor-pointer" key={index}>
              <div className="w-full bg-181818 rounded-lg flex flex-col justify-end items-center p-4">
                <div
                  className="w-full h-52 bg-cover bg-no-repeat rounded-lg"
                  style={{ backgroundImage: `url(${track.album.images[0].url})` }}
                ></div>
                <div className="w-full text-ellipsis overflow-hidden pt-2 flex flex-col">
                  <span className="text-nowrap font-bold text-lg text-wrapper-m">
                    {track.name}
                  </span>
                  <span className="text-nowrap text-wrapper-m">
                    {track.artists.map((artist, artistIndex) => (
                      <React.Fragment key={artistIndex}>
                        {artistIndex > 0 && ", "}
                        {artist.name}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              </div>
            </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
