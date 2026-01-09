import express from 'express'
import dotenv from 'dotenv'
import route from 'routes/route'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import todoRoute from 'routes/todo.routes'
import verificationRoute from 'routes/verification.route'
import { AppError } from 'errors/error'

dotenv.config()
const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(cookieParser()) // cookie-den meluati oxumaq ucun
app.use(helmet())

const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:3014'
]
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('AUTHENTICATION ROUTES')
})

app.use('/api/auth', route)
app.use('/api/auth', todoRoute)
app.use('/api/auth', verificationRoute)

app.use((err: any, req: any, res: any, next: any) => {
    console.error('ERROR:', err);
    const statusCode = err instanceof AppError ? err.statusCode : 500
    return res.status(statusCode).json({
        type: "application/problem+json",
        status: statusCode,
        title: statusCode === 500 ? "Internal Server Error" : "Error",
        detail: err?.message ?? "Unexpected error"
    })
})

app.listen(PORT, () => {
    console.log(`Server is runnig on http://localhost:${PORT}`)
})


