import { WorkletSynthesizer } from "spessasynth_lib";
// The synth's DSP runs in an AudioWorklet, which has to be served as its own
// file. Importing it with `?url` makes Vite emit it as an asset and rewrite the
// path for the configured `base`, which `public/` would not do on its own.
import workletUrl from "spessasynth_lib/dist/spessasynth_processor.min.js?url";

// The soundfont lives in `public/`, so it's copied verbatim into the build.
// Keep the filename free of spaces and commas: vite's dev server doesn't decode
// a percent-encoded comma, and quietly serves index.html instead.
// Attribution and licensing for the samples is in LICENSES.txt next to it.
const SOUND_FONT_URL = `${import.meta.env.BASE_URL}ukulele_heiskr_hedsound/ukulele.sf2`;

// Everything plays on one channel; we only ever have the one instrument.
const CHANNEL = 0;

// MIDI CC numbers for selecting a bank. The ukulele presets in this soundfont
// sit at bank 8-11 / program 24 rather than bank 0, so a bare program change
// isn't enough to select one by name.
const CC_BANK_SELECT_MSB = 0;
const CC_BANK_SELECT_LSB = 32;

// spessasynth renders conservatively — a four note chord peaks around -23dBFS
// on this soundfont — so lift it to something audible while keeping headroom.
const OUTPUT_GAIN = 6;

export type UkuleleSynth = {
  context: AudioContext;
  synth: WorkletSynthesizer;
  presetName: string;
};

/**
 * Picks which preset of the soundfont to play. This one ships four variants of
 * the same instrument (stereo/mono, from two different sample packs); we prefer
 * a stereo one, and otherwise take whatever the soundfont offers first.
 */
function pickPreset(synth: WorkletSynthesizer) {
  const presets = synth.presetList.filter((preset) => !preset.isDrum);
  if (presets.length === 0) {
    throw new Error(`No presets found in ${SOUND_FONT_URL}`);
  }
  return presets.find((preset) => /stereo/i.test(preset.name)) ?? presets[0];
}

export async function createUkuleleSynth(): Promise<UkuleleSynth> {
  const [soundFont, context] = await Promise.all([
    fetch(SOUND_FONT_URL).then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Could not load soundfont: ${response.status} ${response.statusText}`
        );
      }
      return response.arrayBuffer();
    }),
    (async () => {
      const context = new AudioContext();
      await context.audioWorklet.addModule(workletUrl);
      return context;
    })(),
  ]);

  const synth = new WorkletSynthesizer(context);
  await synth.soundBankManager.addSoundBank(soundFont, "ukulele");
  await synth.isReady;

  const output = new GainNode(context, { gain: OUTPUT_GAIN });
  synth.connect(output);
  output.connect(context.destination);

  const preset = pickPreset(synth);
  synth.controllerChange(CHANNEL, CC_BANK_SELECT_MSB, preset.bankMSB);
  synth.controllerChange(CHANNEL, CC_BANK_SELECT_LSB, preset.bankLSB);
  synth.programChange(CHANNEL, preset.program);
  // Nothing else should ever change the instrument out from under us.
  synth.midiChannels[CHANNEL].setSystemParameter("presetLock", true);

  return { context, synth, presetName: preset.name };
}
