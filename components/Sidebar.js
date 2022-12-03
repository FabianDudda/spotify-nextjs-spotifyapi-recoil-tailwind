import {
  HomeIcon,
  MagnifyingGlassIcon as SearchIcon,
  BuildingLibraryIcon as LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  console.log(session.user.accessToken);
  const [playlists, setPlaylists] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  // console.log(playlists);
  // console.log(playlistId);

  useEffect(() => {
    // =======================================================================================
    // ============================= SpotifyAPI über libary aufrufen =========================
    // =======================================================================================
    if (spotifyApi.getAccessToken()) {
      // Playlists
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
        console.log("playlists: ", data.body.items);
      });

      // Save user's spotifyId in RecoilState
      spotifyApi.getMe().then((data) => {
        console.log("user spotifyId: ", data.body.id);
      });

      // Saved podcasts
      spotifyApi.getMySavedShows().then((data) => {
        console.log("shows: ", data.body.items);
      });

      // Episodes of a podcast by ID
      spotifyApi.getShowEpisodes("4rOoJ6Egrf8K2IrywzwOMk").then((data) => {
        console.log("episodes of a show by id: ", data.body.items);
      });

      // Podcast episodes by ID
      spotifyApi.getEpisode("6l4EfnPEH3vIg6PpxMYeAU").then((data) => {
        console.log("episodes by id: ", data);
      });
    }
    // =======================================================================================
    // =======================================================================================
    // =======================================================================================

    // =======================================================================================
    // ============================= SpotifyAPI manuell aufrufen =============================
    // =======================================================================================
    const getUserEpisodes = () => {
      const access_token = session.user.accessToken;
      console.log(access_token);
      return fetch("https://api.spotify.com/v1/me/episodes", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    };

    const handler = async () => {
      const access_token = session.user.accessToken;
      const response = await getUserEpisodes(access_token);
      const { items } = await response.json();

      console.log("episodes: ", items);
      setEpisodes(items);
    };
    handler();
    // =======================================================================================
    // =======================================================================================
    // =======================================================================================
  }, [session, spotifyApi]);

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists... */}
        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}

        {/* Podcasts... */}
        {/* {episodes.map((episode) => (
          <p
            key={episode.id}
            // onClick={() => setEpisodeId(episode.id)}
            className="cursor-pointer hover:text-white"
          >
            {episode.episode.name}
          </p>
        ))} */}
      </div>
    </div>
  );
}

export default Sidebar;
