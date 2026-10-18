# Hope of Light as a phone app

The site is now an installable web app (PWA): home-screen icon, full-screen window, offline fallback page.

## 1. Publish the update
In the VS Code terminal, in the folder that contains `hol`:
```
git add .
git commit -m "Add installable app"
git push
```
Wait until Render shows the deploy as **Live**.

## 2. Install it from the browser (no APK needed)
- **Android (Chrome):** open your site → menu (⋮) → **Install app** (or **Add to Home screen**). The site's footer also shows an **Install the app** link.
- **iPhone (Safari):** Share button → **Add to Home Screen**.

## 3. Make a real APK (Android)
1. Go to **pwabuilder.com**, paste your Render link, click **Start**. Manifest, service worker and icons should pass.
2. Click **Package for stores → Android**.
3. Set a **Package ID** (lowercase, e.g. `com.hopeoflight.app`) and an app name. For **Signing key** choose **New** and fill the form. Keep the key file and its password safe.
4. Click **Download**. The zip contains the `.apk`, a `signing-key-info.txt` with the SHA-256 fingerprint, and an `assetlinks.json`.
5. Copy `assetlinks.json` into `public/.well-known/assetlinks.json` in this project, push to GitHub, and check that
   `https://YOUR-LINK/.well-known/assetlinks.json` opens in a browser. Without this step the app works but shows a browser address bar at the top.
6. Send the `.apk` to your phone (WhatsApp, Drive, USB), tap it, and allow **Install unknown apps** when Android asks.

The APK only wraps your live site, so the site must stay online. Publishing on Google Play is optional and needs a one-time developer fee.
