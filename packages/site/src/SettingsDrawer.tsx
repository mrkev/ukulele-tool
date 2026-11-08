import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Monitor, Moon, Settings, Sun } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { ThemeSetting } from "@/lib/theme";

const THEMES: { value: ThemeSetting; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const REPO = "https://github.com/mrkev/ukulele-tool";

export function SettingsDrawer({
  theme,
  setTheme,
}: {
  theme: ThemeSetting;
  setTheme: (theme: ThemeSetting) => void;
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

          <BuildInfo />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/** Which build is running: the commit it was made from, and when. */
function BuildInfo() {
  const commit: string = import.meta.env.VITE_BUILD_COMMIT;
  const dirty: boolean = import.meta.env.VITE_BUILD_DIRTY;
  const time = new Date(import.meta.env.VITE_BUILD_TIME);
  if (!commit) return null;

  const date = time.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <p className="mt-8 text-center text-xs text-muted-foreground">
      Build{" "}
      {dirty ? (
        // Built with uncommitted changes, so the commit alone isn't the source.
        <span className="font-mono">{commit}+</span>
      ) : (
        <a
          className="font-mono underline hover:text-foreground"
          href={`${REPO}/commit/${commit}`}
        >
          {commit}
        </a>
      )}{" "}
      · {date}
    </p>
  );
}
