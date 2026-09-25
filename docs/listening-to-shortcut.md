# Listening to: iOS Shortcut setup

The portfolio reads a five-song JSON file in Vercel Blob. A song stays visible for exactly 14 days after it is shared. Sharing a sixth active song removes the oldest. Sharing the same song again moves it to the top and resets its 14-day timer.

## One-time Vercel setup

1. In the Vercel project, create a **private Vercel Blob** store and connect it to the portfolio project. New connections use Vercel's short-lived OIDC credentials and add `BLOB_STORE_ID` to the project environment. Older connections can use `BLOB_READ_WRITE_TOKEN` instead.
2. Generate a random secret, for example `openssl rand -hex 32`, and add it in Vercel as `LISTENING_SHORTCUT_TOKEN` for Production. Keep it out of the repository.
3. Deploy the portfolio through its existing Git deployment pipeline. The two initial songs appear from `src/data/listening-to.json` until the first Shortcut submission creates the Blob file.

For this portfolio, the Blob store and production secret are already configured. The secret is also saved locally in `.env.local` as `LISTENING_SHORTCUT_TOKEN`; keep that file private.

## Shortcut on iPhone

1. Create a new shortcut named **Listening to**.
2. In the shortcut details, enable **Show in Share Sheet** and accept **URLs** as input.
3. Add a **URL** action with `https://hiteshrohira.vercel.app/api/listening`.
4. Add **Get Contents of URL**. Set Method to **POST**. Add a header named `Authorization` with value `Bearer ` followed by the `LISTENING_SHORTCUT_TOKEN` value from your local `.env.local`.
5. Set Request Body to **JSON**, add a text field named `url`, and set its value to **Shortcut Input**.
6. Optionally add **Show Notification** with a success message after the request.

In YouTube Music, open a song, tap **Share**, and choose **Listening to**. The Shortcut sends only the song link. The portfolio fetches the title, artist, album art, and album name from YouTube Music and saves the five-song list. Song submissions update Blob without triggering a new deployment.

The endpoint only accepts `https://music.youtube.com/watch?v=...` song links. If a share-sheet item arrives as text instead of a URL on your iOS version, set the shortcut input types to **URLs and Text**, then use **Get URLs from Input** before the request.
