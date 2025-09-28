import { WamNode, WebAudioModule } from "@webaudiomodules/api";
import { useCallback, useState } from "react";
import { AsyncResult, asyncResult } from "./AsyncResult";
import { WamEnvironment } from "./WamEnvironment";
import { nullthrows } from "@/lib/nullthrows";

export type ChordPlayer = {
  start: () => Promise<void>;
  play: (notes: MidiNoteDescription[]) => Promise<void>;
  status: AsyncResult<unknown>["status"];
};

const MIDI = {
  NOTE_ON: 0x90,
  NOTE_OFF: 0x80,
};

type MidiNoteDescription = [note: number, velocity: number];

export function useChordPlayer(): ChordPlayer {
  const [wamStatus, setWamStatus] = useState(
    asyncResult.pending<WebAudioModule<WamNode>>()
  );

  const start = useCallback(async () => {
    console.log("starting...");
    if (wamStatus.status === "ready") {
      console.log("already started");
      return;
    }

    try {
      const audioContext = new AudioContext();
      const wamEnv = await WamEnvironment.initialize(audioContext);
      const playerWam = await wamEnv.loadWAM(
        "https://www.webaudiomodules.com/community/plugins/burns-audio/soundfont/index.js"
      );
      playerWam.audioNode.connect(audioContext.destination);
      await playerWam.audioNode.setState({ instrument: "vibraphone" });

      // create the UI and add it to the container
      const ui = await playerWam.createGui();
      const container = nullthrows(
        document.getElementById("test-wam-container")
      );
      container.appendChild(ui);

      setWamStatus(asyncResult.ready(playerWam));
    } catch (error) {
      setWamStatus(asyncResult.error(error));
    }
  }, [wamStatus.status]);

  const play = useCallback(
    async (notes: MidiNoteDescription[]) => {
      console.log("playing...");
      if (wamStatus.status !== "ready") {
        console.log("not started, starting...");
        await start();
      }

      // if still not started, there was an error
      if (wamStatus.status !== "ready") {
        console.log("error starting chord player");
        return;
      }

      const wam = wamStatus.value;

      for (const [note, velocity] of notes) {
        wam.audioNode.scheduleEvents({
          type: "wam-midi",
          time: wam.audioNode.context.currentTime,
          // data: { bytes: new Uint8Array([0x90, 74, 100]) },
          data: { bytes: [MIDI.NOTE_ON, note, velocity] },
        });

        wam.audioNode.scheduleEvents({
          type: "wam-midi",
          time: wam.audioNode.context.currentTime + 0.25,
          // data: { bytes: new Uint8Array([0x80, 74, 100]) },
          data: { bytes: [MIDI.NOTE_OFF, note, velocity] },
        });
      }

      // wam.audioNode.scheduleEvents({
      //   type: "wam-midi",
      //   time: wam.audioNode.context.currentTime,
      //   // data: { bytes: new Uint8Array([0x90, 74, 100]) },
      //   data: { bytes: [MIDI.NOTE_ON, 74, 100] },
      // });

      // wam.audioNode.scheduleEvents({
      //   type: "wam-midi",
      //   time: wam.audioNode.context.currentTime + 0.25,
      //   // data: { bytes: new Uint8Array([0x80, 74, 100]) },
      //   data: { bytes: [MIDI.NOTE_OFF, 74, 100] },
      // });
    },
    [wamStatus, start]
  );

  return {
    start,
    play,
    status: wamStatus.status,
  };
}

// async function run(wamUrl) {
//   await initHost(audioContext);

//   let wam = await loadWAM(wamUrl);

//   // create the UI and add it to the container
//   const ui = await wam.createGui();
//   const container = document.getElementById("wam-container");
//   container.appendChild(ui);

//   wam.audioNode.connect(audioContext.destination);
// }
