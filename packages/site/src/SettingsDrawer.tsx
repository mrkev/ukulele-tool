import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Switch } from "@base-ui/react/switch";
import { Monitor, Moon, Settings, Sun } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { ThemeSetting } from "@/lib/theme";
import { canPlayInSilentMode } from "@/lib/silentModePlayback";

const THEMES: { value: ThemeSetting; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function SettingsDrawer({
  theme,
  setTheme,
  silentModePlayback,
  setSilentModePlayback,
}: {
  theme: ThemeSetting;
  setTheme: (theme: ThemeSetting) => void;
  silentModePlayback: boolean;
  setSilentModePlayback: (enabled: boolean) => void;
}) {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        aria-label="Settings"
        className="flex size-10 pointer-coarse:size-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent dark:ring-1 dark:ring-border"
      >
        <Settings className="size-4" />
      </DrawerTrigger>
      <DrawerContent
        swipeFromContent
        className="bg-card text-card-foreground [--drawer-bleed-background:var(--card)]"
      >
        <div className="mx-auto w-full max-w-md overflow-y-auto p-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          <DrawerTitle className="mb-4">Settings</DrawerTitle>

          <div id="appearance-label" className="mb-2 text-sm font-medium">
            Appearance
          </div>
          <RadioGroup
            aria-labelledby="appearance-label"
            value={theme}
            onValueChange={(value) => setTheme(value as ThemeSetting)}
            className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
          >
            {THEMES.map(({ value, label, Icon }) => (
              <Radio.Root
                key={value}
                value={value}
                // A real <button>: the drawer's swipe-to-dismiss leaves buttons
                // alone, but would swallow clicks on the default <span>.
                nativeButton
                render={<button type="button" />}
                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-checked:bg-card data-checked:text-foreground data-checked:shadow-sm"
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Radio.Root>
            ))}
          </RadioGroup>

          {/* Only browsers with the Audio Session API (Safari) can do this. */}
          {canPlayInSilentMode() && (
            <div className="mt-6">
              {/* A <label>, not just a click on the switch's <span>: the
                  drawer's swipe-to-dismiss leaves labels alone. */}
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-sm font-medium">Play in silent mode</span>
                <Switch.Root
                  checked={silentModePlayback}
                  onCheckedChange={setSilentModePlayback}
                  className="relative flex h-7 w-12 shrink-0 rounded-full bg-input p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-checked:bg-star"
                >
                  <Switch.Thumb className="size-6 rounded-full bg-white shadow-sm transition-transform data-checked:translate-x-5" />
                </Switch.Root>
              </label>
              <p className="mt-2 text-sm text-muted-foreground">
                If you can't hear chords, your phone may be on silent: turn
                this on, or turn silent mode off. While it's on, playing a
                chord pauses any other audio, like music you're playing along
                to.
              </p>
            </div>
          )}

          <BuildInfo />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/** Which build is running: the commit it was made from. */
function BuildInfo() {
  const commit: string = import.meta.env.VITE_BUILD_COMMIT;
  const dirty: boolean = import.meta.env.VITE_BUILD_DIRTY;
  if (!commit) return null;

  return (
    <p className="mt-8 text-center text-xs text-muted-foreground">
      Build{" "}
      <span className="font-mono">
        {commit}
        {/* Built with uncommitted changes, so the commit alone isn't the source. */}
        {dirty && "+"}
      </span>
    </p>
  );
}
