import {Link} from 'react-router-dom'
import { useEffect, useState } from "react";
import "../css/Main.css";
import { useAccesToken } from "../hooks/useAccessToken";


type Album = {
  name: string;
  id: string;
  images: { url: string }[];
}[];

type releasesArtist = {
  name: string;
  images: {url:string}[];
  id: string;
  href: string;
  artists: {name:string}[];
}[];

export function Search() {
  const [artist, setArtist] = useState("");
  const [albums, setAlbums] = useState<Album>([]);

  const [releasesArtist, setReleasesArtist] = useState<releasesArtist>([]);
  const [itemQuery, setItemQuery] = useState(Boolean);

  const accessToken = useAccesToken();



  var searchParam = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  async function GetAlbums() {
    if (!artist.trim()) {
      setItemQuery(true);
      console.error("Artist name is empty");
      return;
    }
    var artistId = await fetch(
      `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
      searchParam
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });
    var albumsList = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`,
      searchParam
    )
      .then((result) => result.json())
      .then((data) => {
        console.log(data.items);
        return data.items;
      });
    setAlbums(albumsList);
    setItemQuery(false);
  }

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
          console.log(data.albums.items);
          setReleasesArtist(data.albums.items);
          setItemQuery(true);
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
    <div  className="p-6">
      <div className="flex mb-4">
        <input
          className="bg-181818 text-white ml-6 p-2 rounded-lg outline-none"
          placeholder="Artist name"
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
        ></input>
        <button className="p-2 font-semibold text-xl hover:underline" onClick={GetAlbums}>
          Search artist
        </button>
      </div>
      { itemQuery 
      ? <ul className="wrapper">
      {releasesArtist.map((release) => {
        return (
          <Link to={`/albums/${release.id}`}>
          <li className="hover:cursor-pointer" 
          key={release.name}>
            <div className="w-full bg-181818 rounded-lg flex flex-col justify-end items-center p-4">
              <div
                className="w-full h-52 bg-cover bg-no-repeat rounded-lg"
                style={{ backgroundImage: `url(${release.images[0].url})` }}
              ></div>
              <div className="w-full text-ellipsis overflow-hidden pt-2 flex flex-col">
                <span className="text-nowrap font-bold text-lg text-wrapper-m">{release.name}</span>
                <span className="text-nowrap text-wrapper-m">{release.artists[0].name}</span>
              </div>
            </div>
          </li>
          </Link>
        );
      })}
      </ul>  
      : <ul className="wrapper">
      {albums.map((album) => {
        return (
          <Link to={`/albums/${album.id}`}>
          <li className="hover:cursor-pointer" 
          key={album.name}>
            <div className="w-full bg-181818 rounded-lg flex flex-col justify-end items-center p-4">
              <div
                className="w-full h-52 bg-cover bg-no-repeat rounded-lg"
                style={{ backgroundImage: `url(${album.images[0].url})` }}
              ></div>
              <div className="w-full text-ellipsis overflow-hidden pt-2">
                <span className="text-nowrap font-bold text-wrapper-m">{album.name}</span>
              </div>
            </div>
          </li>
          </Link>
        );
      })}
      </ul> }
    </div>
  );
}
