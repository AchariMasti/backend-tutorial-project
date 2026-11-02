# Backend Tutorial Project — Node.js, Express & MongoDB

A beginner-friendly backend API using the model–route–controller pattern. It includes:

- MongoDB Atlas connection with Mongoose
- User registration, login, logout and current-user endpoint
- Password hashing with bcryptjs
- JWT authentication stored in an HTTP-only cookie
- Protected Posts CRUD endpoints (create, read, update and delete)
- JSON error responses and basic request hardening with Helmet
- A Postman collection for testing

## 1. Requirements

Install these on your laptop:

- Node.js (use an active LTS release) and npm
- Visual Studio Code (or another code editor)
- Git
- Postman Desktop
- A free MongoDB Atlas account

Check Node and npm from a terminal:

```bash
node -v
npm -v
```

## 2. Run the project locally

1. Download or clone this repository and open its folder in VS Code.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Make your own environment file by copying `.env.example` to `.env`.

   macOS/Linux:

   ```bash
   cp .env.example .env
   ```

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Fill in `MONGODB_URI` and `JWT_SECRET` in `.env`. Do not put quotation marks around the values and do not commit `.env` to GitHub.
5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:5000/` in a browser. You should receive a JSON message saying the API is running. `http://localhost:5000/api/health` is the health check.

For a normal start (without automatic restart), use `npm start`.

## 3. Create a MongoDB Atlas database

1. Go to <https://www.mongodb.com/atlas/database> and create a free account / free cluster.
2. In Atlas, create a **database user**. This username and password are for your application; they are not necessarily your Atlas website login.
3. Under **Network Access**, add your current IP address. For a temporary classroom test only, Atlas also allows `0.0.0.0/0` (access from anywhere); that is less secure, so remove it after testing.
4. Open your cluster and choose **Connect → Drivers**. Select Node.js and copy the connection string.
5. Replace the username and password placeholders with the database user's credentials. URL-encode special characters in the password. Add a database name such as `backend_tutorial` before the query string.
6. Paste the complete URI into `MONGODB_URI` in your local `.env` file.

Example shape (not a real credential):

```text
mongodb+srv://DB_USERNAME:DB_PASSWORD@cluster-name.xxxxx.mongodb.net/backend_tutorial?retryWrites=true&w=majority
```

## 4. Project structure

```text
backend-tutorial-project/
├── postman/
│   └── Backend-Tutorial.postman_collection.json
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── asyncHandler.js
│   ├── app.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### What each part does

- **Models** describe how User and Post documents are stored in MongoDB.
- **Routes** map an HTTP method and URL to a controller.
- **Controllers** contain the actual register/login and CRUD logic.
- **Middleware** checks the login cookie before protected endpoints run.
- **config/db.js** connects the app to MongoDB Atlas.
- **app.js** configures Express and mounts routes.
- **index.js** loads environment variables, connects to the database and starts the server.

## 5. API endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Purpose | Login required? |
|---|---|---|---|
| GET | `/api/health` | Check API status | No |
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Log in | No |
| POST | `/api/auth/logout` | Clear login cookie | No |
| GET | `/api/auth/me` | Get the current user | Yes |
| POST | `/api/posts` | Create a post | Yes |
| GET | `/api/posts` | Get your posts | Yes |
| GET | `/api/posts/:id` | Get one of your posts | Yes |
| PATCH | `/api/posts/:id` | Update one of your posts | Yes |
| DELETE | `/api/posts/:id` | Delete one of your posts | Yes |

### Example request bodies

Register (`POST /api/auth/register`):

```json
{
  "name": "Student One",
  "email": "student@example.com",
  "password": "student123"
}
```

Login (`POST /api/auth/login`):

```json
{
  "email": "student@example.com",
  "password": "student123"
}
```

Create post (`POST /api/posts`):

```json
{
  "title": "My first backend post",
  "content": "I built my first Express and MongoDB API."
}
```

Update post (`PATCH /api/posts/{{postId}}`):

```json
{
  "title": "Updated post title",
  "content": "This content has been updated."
}
```

## 6. Test with Postman

1. Start the Node server and leave its terminal window running.
2. In Postman, select **Import → Files** and import `postman/Backend-Tutorial.postman_collection.json`.
3. Run **Health Check** first. It should return HTTP `200`.
4. Run **Register** once with an email address you have not used before. It should return HTTP `201` and Postman should retain the `token` cookie for `localhost`.
5. Run **Current User**. It should return the account you just created.
6. Run **Create Post**. A successful response returns the new post ID; the collection saves it as `postId`.
7. Run **Get All Posts**, **Get One Post**, **Update Post**, and **Delete Post** in that order.
8. Run **Logout**. Then try **Current User** again; it should return HTTP `401` because the cookie has been cleared.

If you already registered the test email, skip Register and run Login. If Postman does not send the cookie, open Postman's cookie manager for `localhost` and confirm the `token` cookie exists. You can also log in again.

## 7. Understand the request flow

For example, when Postman sends `POST /api/posts`:

1. Express receives the request in `app.js`.
2. `postRoutes.js` matches `POST /` under `/api/posts`.
3. `protect` middleware checks the JWT cookie and loads the logged-in user.
4. `createPost` in `postController.js` validates the body and creates a MongoDB document.
5. Mongoose uses the schema in `Post.js` to validate and store the document.
6. Express sends a JSON response to Postman.

## 8. Push the project to a public GitHub repository

Run these commands in the project folder. First create an **empty public repository** on <https://github.com/new> named `backend-tutorial-project`. Do not add a README there because this folder already contains one.

```bash
git init
git add .
git status
git commit -m "Build Node Express MongoDB backend tutorial project"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/backend-tutorial-project.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username. Then open the repository page and copy its public URL for your assignment submission.

**Before pushing:** check that `.env` is not listed by `git status`. The `.gitignore` excludes it, but always verify. Never publish database passwords, JWT secrets, or other credentials. If a secret is accidentally pushed, rotate it in Atlas / your secret provider; deleting the file in a later commit does not make the exposed secret safe again.

## 9. Prepare for your evaluation

Be ready to demonstrate these points on your laptop:

1. Explain the difference between a model, route, controller and middleware.
2. Show the MongoDB Atlas connection in `src/config/db.js` (do not reveal your password on screen).
3. Register and log in using Postman; explain that bcrypt hashes passwords and JWT verifies the login session.
4. Create, read, update and delete a post in Postman.
5. Show the documents in the `users` and `posts` collections in MongoDB Atlas.
6. Explain why `.env` is excluded from GitHub.

## Notes

This is an API backend, not a frontend website. Its visible interface is the JSON response in Postman or a browser. All post endpoints require a logged-in user, and each user can only read or modify their own posts. Logout clears the browser/Postman cookie; for this tutorial, authentication uses an HTTP-only cookie rather than sending a token in the URL or request body.
