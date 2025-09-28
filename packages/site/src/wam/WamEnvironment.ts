import {
  WamNode as IWamNode,
  WebAudioModule as IWebAudioModule,
} from "@webaudiomodules/api";
import { useEffect, useState } from "react";
import { asyncResult } from "./AsyncResult";

const WAM_SDK =
  "https://www.webaudiomodules.com/sdk/2.0.0-alpha.6/src/initializeWamHost.js";

export type WAMImport = {
  prototype: IWebAudioModule;
  createInstance<Node extends IWamNode = IWamNode>(
    groupId: string,
    audioContext: BaseAudioContext,
    initialState?: unknown
  ): Promise<IWebAudioModule<Node>>;
  new <Node extends IWamNode = IWamNode>(
    groupId: string,
    audioContext: BaseAudioContext
  ): IWebAudioModule<Node>;
} & Pick<typeof IWebAudioModule, "isWebAudioModuleConstructor">;

export class WamEnvironment {
  private wamInstances = new Set<IWebAudioModule<IWamNode>>();

  constructor(
    public audioContext: AudioContext,
    private hostGroupId: string,
    private hostGroupKey: string
  ) {}

  static async initialize(audioContext: AudioContext = new AudioContext()) {
    const { default: initializeWamHost } = await import(WAM_SDK);
    const [hostGroupId, hostGroupKey] = await initializeWamHost(
      audioContext,
      "example"
    );
    return new WamEnvironment(audioContext, hostGroupId, hostGroupKey);
  }

  // Load a WebAudioModule, and return an instance.
  async loadWAM(path: string) {
    const initialState = {};
    const rawModule = await import(/* @vite-ignore */ path);
    if (rawModule == null) {
      throw new Error("could not import " + path);
    }
    const WAM: WAMImport = rawModule.default;

    if (typeof WAM !== "function" || !WAM.isWebAudioModuleConstructor) {
      throw new Error(`Path ${path} is not a WebAudioModule.`);
    }

    const instance = new WAM("example", this.audioContext);
    await instance.initialize(initialState);

    this.wamInstances.add(instance);
    return instance;
  }
}

export function useWamEnvironment() {
  const [wamEnv, setWamEnv] = useState(asyncResult.pending<WamEnvironment>());
  useEffect(() => {
    WamEnvironment.initialize()
      .then((wamEnv) => setWamEnv(asyncResult.ready(wamEnv)))
      .catch((error) => setWamEnv(asyncResult.error(error)));
  }, []);
  return wamEnv;
}

// document.getElementById("start").addEventListener("click", () => {
//   audioContext.resume();
//   // Je n'arrive pas à faire jouer une note MIDI avec ce WAM
//   run(
//     "https://mainline.i3s.unice.fr/PedalEditor/Back-End/functional-pedals/published/fluteMIDI2/indexGUIStandard.js"
//   );
//   // Mais j'y arrive avec celui-là.
//   //run("https://mainline.i3s.unice.fr/PedalEditor/Back-End/functional-pedals/published/fluteMIDI/index.js");
// });

// document.getElementById("startCustom").addEventListener("click", () => {
//   audioContext.resume();
//   run(
//     "https://mainline.i3s.unice.fr/PedalEditor/Back-End/functional-pedals/published/fluteMIDI2/index.js"
//   );
// });

// document.getElementById("note").addEventListener("click", () => {
//   wam.audioNode.scheduleEvents({
//     type: "wam-midi",
//     time: wam.audioNode.context.currentTime,
//     data: { bytes: new Uint8Array([0x90, 74, 100]) },
//   });
//   wam.audioNode.scheduleEvents({
//     type: "wam-midi",
//     time: wam.audioNode.context.currentTime + 0.25,
//     data: { bytes: new Uint8Array([0x80, 74, 100]) },
//   });
// });
