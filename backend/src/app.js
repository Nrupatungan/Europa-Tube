import e from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = e()

app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true}))

app.use(e.json({limit: "16kb"}))

app.use(e.urlencoded({extended: true, limit: "16kb"}))

app.use(e.static("public"))

app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"
import commentRouter from "./routes/comment.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"

//routes declaration
app.use('/api/v1/users', userRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/dashboard', dashboardRouter)
app.use('/api/v1/healthcheck', healthCheckRouter)
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/playlist', playlistRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)
app.use('/api/v1/tweets', tweetRouter)
app.use('/api/v1/videos', videoRouter)

// http://localhost:8000/api/v1/users/register for example

export { app }