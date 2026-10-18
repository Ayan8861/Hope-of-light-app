# Hope of Light — NGO website (Express + MySQL)

Plain HTML/CSS/JS frontend (`public/`) served by a Node.js + Express API (`server/`) with a MySQL database.

## Run it locally

1. Install **Node.js 18+** and **MySQL 8+** (or MariaDB 10.5+).
2. Set up the server:
   ```bash
   cd server
   npm install
   cp .env.example .env        # then edit .env: DB_PASSWORD and JWT_SECRET
   npm run db:init             # creates the database, tables and the 4 programs
   npm run create-admin -- you@example.com "YourStrongPassword" "Your Name"
   npm start
   ```
3. Open http://localhost:3000

Generate a JWT secret with:
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## What works

| Feature | How |
|---|---|
| Register / login / logout | bcrypt-hashed passwords, JWT in an httpOnly cookie |
| Donations (UPI) | Form → saved as *pending* → UPI app opens (or QR/UPI ID) → donor enters the 12-digit UTR → *submitted* → admin checks it against the UPI app and clicks **Verify** |
| Live totals | Homepage numbers and program progress bars count **verified** donations only |
| Volunteers | Logged-in users apply to a program; admin approves/rejects |
| Contact form | Saved to the database; admin reads them in the panel |
| Member dashboard | `/account.html` — own donations and volunteer applications |
| Admin panel | `/admin.html` — overview chart, donation verification + CSV export, volunteers, messages, program goals |

## Database tables
`users`, `projects`, `donations`, `volunteer_applications`, `messages` — see `server/schema.sql`.

## Things to edit
- `public/js/app.js` → `SITE` block at the top: address, email, hours, phone, social links.
- `server/.env` → `UPI_ID`.
- Program goals: Admin panel → Projects tab.
- Replace `public/images/upi-qr.png` if your UPI ID changes.

## Deploying
See **DEPLOY.md** for the step-by-step guide (GitHub → Aiven free MySQL → Render free hosting).
