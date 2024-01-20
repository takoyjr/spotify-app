import { useState, useEffect } from "react";

export function useAccesToken() {
  const clientId = "c95a79ece37f4de8bee9d8cf014bd6c3";
  const clientSecret = "e47941f9541c43f8bf81a3e8a4e507d4";
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    var authParam = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };
    try {
      fetch("https://accounts.spotify.com/api/token", authParam)
        .then((result) => result.json())
        .then((data) => {
          setAccessToken(data.access_token);
        });
    } catch (error) {
      console.error("Error :", error);
    }
  }, []);
  return accessToken;
}

export function SearchParam() {
  const accessToken = useAccesToken();
  var searchParam = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return searchParam;
}
