import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccesToken } from "../hooks/useAccessToken";
import "../css/albumPage.css";
import { FastAverageColor } from "fast-average-color";

type trackInfo = {
  name: string;
  id: string;
  artist: string;
  duration_ms: string;
}[];

type artistsInfo = {
  name: string;
}[];

export function AlbumPage() {
  const { newReleases } = useParams();
  const accessToken = useAccesToken();
  const [albumTracks, setAlbumTracks] = useState<trackInfo>([]);
  const [artists, setArtists] = useState<artistsInfo>([]);
  const [albumName, setAlbumName] = useState("");
  const [albumImg, setAlbumImg] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const fac = new FastAverageColor();
  const [albumBgColor, setAlbumBgColor] = useState("");

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
          `https://api.spotify.com/v1/albums/${newReleases}`,
          searchParam
        );

        if (!result.ok) {
          console.error("Failed :", result.status);
          return;
        }

        const data = await result.json();
        if (Array.isArray(data.tracks?.items)) {
          setAlbumTracks(data.tracks.items);
          setArtists(data.artists);
          setAlbumName(data.name);
          setReleaseDate(data.release_date);
          setAlbumImg(data.images[0].url);

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
  }, [accessToken, newReleases]);

  return (
    <>
      <div
        className="flex flex-row items-stretch p-6 mob-flex"
        style={{ background: `linear-gradient(${albumBgColor}, #121212)` }}
      >
        <img className="h-52 rounded" src={albumImg} alt=""></img>
        <div className="flex flex-col items-stretch ml-4">
          <div className="h-1/2 flex items-end">
            <h1 className="text-white font-bold text-2xl">{albumName}</h1>
          </div>
          <div className="h-1/2 flex items-end">
            <h1 className="text-white">
              {artists.map((art, index) => (
                <span className="font-bold text-xl" key={index}>
                  {art.name}
                  {index < artists.length - 1 && ", "}
                </span>
              ))}
              <span id="releaseDate" className="font-medium">
                {releaseDate}
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="albumWrapper wrapperHeader pb-2">
          <div>
            <span>#</span>
          </div>
          <div className="text-left">
            <span>Name</span>
          </div>
          <div>
            <span>
              <i className="fa-regular fa-clock"></i>
            </span>
          </div>
        </div>
      </div>
      <ul className="">
        {albumTracks.map((track, index) => (
          <li className="hover:cursor-pointer bg-hover" key={track.id}>
            <div className="w-full rounded-lg p-4">
              <div className="w-full rounded-lg flex items-center albumWrapper">
                <div>
                  <span className="font-medium text-gray-400">{index + 1}</span>
                </div>
                <div className="text-left">
                  <span className="font-semibold">{track.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">
                    {`${Math.floor(
                      parseFloat(track.duration_ms) / 1000 / 60
                    )}:${(Math.floor(parseFloat(track.duration_ms) / 1000) % 60)
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
