import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "../components/Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);

  // console.log(playlist);

  return (
    <div className="flex flex-col space-y-1 pb-28 px-8 text-white">
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  );
}

export default Songs;
