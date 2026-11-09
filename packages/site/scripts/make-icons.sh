#!/bin/sh
# Renders the site's icons into public/ with ImageMagick:
#   scripts/icon.svg       the icon, for the larger sizes
#   scripts/favicon-32.svg  redrawn on the pixel grid for favicon-32x32.png
#   scripts/favicon-16.svg  redrawn on the pixel grid for favicon-16x16.png
#
# Each SVG is drawn large and box-filtered down, so pixel-aligned shapes stay
# sharp. Run from packages/site: sh scripts/make-icons.sh
set -eu

ORANGE="#f97316"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# render SVG SIZE OUT: draws SVG at 512px, then scales it to SIZE.
render() {
  sed -E 's/<svg ([^>]*)width="[0-9]+" height="[0-9]+"/<svg \1width="512" height="512"/' "$1" > "$tmp/big.svg"
  magick -background none "MSVG:$tmp/big.svg" -filter box -resize "$2x$2" \
    -depth 8 -strip "$3"
}

render scripts/favicon-16.svg 16 public/favicon-16x16.png
render scripts/favicon-32.svg 32 public/favicon-32x32.png
render scripts/icon.svg 48 "$tmp/48.png"
render scripts/icon.svg 192 public/android-chrome-192x192.png
render scripts/icon.svg 512 public/android-chrome-512x512.png
magick public/favicon-16x16.png public/favicon-32x32.png "$tmp/48.png" \
  public/favicon.ico

# iOS rounds the corners itself and wants no transparency: fill them in.
render scripts/icon.svg 180 "$tmp/180.png"
magick "$tmp/180.png" -background "$ORANGE" -flatten -depth 8 -strip \
  public/apple-touch-icon.png
