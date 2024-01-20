import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SearchParam, useAccesToken } from "../hooks/useAccessToken";
import { FastAverageColor } from "fast-average-color";
import {Link} from 'react-router-dom'
import "../css/listPage.css"

type playlistInfo = {
  name: string;
  owner: { display_name: string };
  images: { url: string }[];
};

type tracksInfo = {
  track: {
    name: string;
    duration_ms: string;
    id: string;

    album: {
      name: string;
      id: string;
      images: { url: string }[];
      artists: { name: string }[];
    };
  };
}[];

export function ListPage() {
  const { userPlaylists } = useParams();
  const accessToken = useAccesToken();
  const searchParam = SearchParam();
  const [playListTracks, setPlayListTracks] = useState<playlistInfo | null>(
    null
  );
  const [tracksInfo, setTracksInfo] = useState<tracksInfo>([]);
  const [tracksCounter, setTracksCounter] = useState(0);
  const [artists, setArtists] = useState<tracksInfo>([]);
  const [albumName, setAlbumName] = useState("");
  const [albumImg, setAlbumImg] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const fac = new FastAverageColor();
  const [albumBgColor, setAlbumBgColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/playlists/${userPlaylists}`,
          searchParam
        );

        if (!result.ok) {
          console.error("Failed :", result.status);
          return;
        }

        const data = await result.json();
        if (Array.isArray(data.tracks?.items)) {
          setPlayListTracks(data);
          setTracksCounter(data.tracks.items.length);
          console.log(data.tracks.items);
          setTracksInfo(data.tracks.items);

          if (data.images[0].url) {
            fac
              .getColorAsync(data.images[0].url)
              .then((color) => {
                setAlbumBgColor(color.hex);
              })
              .catch((e) => {
                console.log(e);
              });
          }
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Error :", error);
      }
    };

    fetchData();
  }, [accessToken, userPlaylists]);

  return (
    <>
      <div
        className="flex flex-row items-stretch p-6 mob-flex"
        style={{ background: `linear-gradient(${albumBgColor}, #121212)` }}
      >
        <img
          className="h-52 rounded"
          src={playListTracks?.images[0]?.url}
          alt=""
        ></img>
        <div className="flex flex-col items-stretch ml-4">
          <div className="h-1/2 flex items-end">
            <h1 className="text-white font-bold text-2xl">
              {playListTracks?.name}
            </h1>
          </div>
          <div className="h-1/2 flex items-end">
            <h1 className="text-white">
              <span className="font-bold text-xl">
                {playListTracks?.owner?.display_name}
              </span>
              <span id="releaseDate" className="font-medium">
                {tracksCounter <= 1 ? `${tracksCounter} track` : `${tracksCounter} tracks`}
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="playlistWrapper wrapperHeader pb-2">
          <div>
            <span>#</span>
          </div>
          <div className="text-left">
            <span>Name</span>
          </div>
          <div>
            <span>Album</span>
          </div>
          <div>
            <span>
              <i className="fa-regular fa-clock"></i>
            </span>
          </div>
        </div>
      </div>
      <ul className="">
        {tracksInfo.map((track, index) => (
          <li className="hover:cursor-pointer bg-hover" key={track.track.id}>
            <div className="w-full rounded-lg p-4">
              <div className="w-full rounded-lg flex items-center playlistWrapper">
                <div>
                  <span className="font-medium text-gray-400">{index + 1}</span>
                </div>
                <div className="text-left flex flex-col">
                  <span className="font-semibold">{track.track.name}</span>
                  {/* <span>{track.track.album.name}</span> */}
                  <div className="flex flex-row">
                    {track.track.album.artists.map((art, index) => (
                      <span className="text-gray-400" key={index}>
                        {art.name}
                        {index < track.track.album.artists.length -1 && ", "}
                      </span>
                    ))}
                  </div>
                  {/* ВЫВЕСТИ ALBUM NAME
                  <span className="text-gray-400">{track.track.album.id}</span> */}
                </div>
                <div>
                  <Link to={`/albums/${track.track.album.id}`}>
                  <span className="text-gray-400 hover:underline">{track.track.album.name}</span>
                  </Link>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">
                    {`${Math.floor(
                      parseFloat(track.track.duration_ms) / 1000 / 60
                    )}:${(
                      Math.floor(parseFloat(track.track.duration_ms) / 1000) %
                      60
                    )
                      .toString()
                      .padStart(2, "0")}`}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
