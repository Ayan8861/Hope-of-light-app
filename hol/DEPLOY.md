# Putting Hope of Light online (free)

You need three free accounts: **GitHub** (code), **Aiven** (MySQL database) and **Render** (runs the Node server).
Do the parts in this order.

---

## Part 1 — Free MySQL on Aiven

1. Go to **aiven.io**, sign up (no card needed) and create a **free MySQL** service. Wait until it shows **Running**.
2. On the service page, copy these into a notepad: **Host, Port, User, Password, Database name** (usually `avnadmin` and `defaultdb`).
3. On the same page, click **Download CA certificate** (a file called `ca.pem`).
4. Put that file at **`server/certs/ca.pem`** in your project. (It is a public certificate, so it is safe to upload to GitHub.)

## Part 2 — Create the tables in the cloud database (from your PC)

1. In VS Code's terminal, go to the server folder: `cd server`
2. Copy the template: `copy .env.cloud.example .env.cloud`
3. Open `.env.cloud` and fill in the Aiven values (host, port, user, password, database name).
4. Create the tables:  
   `npm run db:init:cloud`  → should print **Database "defaultdb" is ready.**
5. Create your admin login on the cloud database:  
   `npm run create-admin:cloud -- you@example.com "StrongPass123" "Your Name"`

(`.env.cloud` is ignored by git, so your password is not uploaded.)

## Part 3 — Upload the project to GitHub

1. On github.com click **New repository**, name it `hope-of-light-app`, keep it **Public** (or Private), and do **not** add a README.
2. In the VS Code terminal, go to the project root and push:
   ```
   cd ..
   git init
   git add .
   git status
   ```
   Check the list: **`.env` and `.env.cloud` must NOT appear.** Then:
   ```
   git commit -m "Hope of Light upgraded"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/hope-of-light-app.git
   git push -u origin main
   ```

## Part 4 — Run it on Render

1. Go to **render.com**, sign up with GitHub, click **New → Web Service**, and pick your `hope-of-light-app` repo.
2. Fill in:
   - **Region:** Singapore (closest to India)
   - **Root Directory:** leave empty
   - **Runtime:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Instance Type:** Free
3. Under **Environment Variables** add:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `NODE_VERSION` | `22` |
   | `JWT_SECRET` | a new long random string (generate it with the same command as before) |
   | `UPI_ID` | your UPI ID |
   | `DB_HOST` | from Aiven |
   | `DB_PORT` | from Aiven |
   | `DB_USER` | from Aiven |
   | `DB_PASSWORD` | from Aiven |
   | `DB_NAME` | from Aiven |
   | `DB_SSL` | `true` |
   | `DB_SSL_CA_FILE` | `certs/ca.pem` |

4. Click **Create Web Service**. After a few minutes the log says the service is live, and Render shows your link, like `https://hope-of-light-app.onrender.com`.

## Part 5 — Test

Open the link on your phone and PC. Log in with your admin account, make a test donation and verify it.

## Things to know

- **Free Render sleeps after 15 minutes without visitors.** The first visit afterwards can take 30–60 seconds. Open the site a minute before a demo. Optional: a free pinger such as cron-job.org can call `https://YOUR-LINK/healthz` every 10 minutes to keep it awake.
- **Updating the site later:** change files, then `git add .`, `git commit -m "update"`, `git push`. Render redeploys automatically.
- **Aiven free tier** is a small database (1 GB) and may be powered off if it is unused for a long time; you can switch it back on from the Aiven console.
- Never put your passwords in files that go to GitHub. Passwords belong only in `.env`, `.env.cloud` and Render's environment settings.
