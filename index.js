import express from 'express'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import postRouter from './routes/posts.js'
import cookieParser from 'cookie-parser'
import multer from 'multer';

const app = express() 

//para subir archivos al servidor
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, Date.now()+file.originalname)
    }
  })
const upload = multer({ storage })
//const upload = multer({ dest: './uploads/' })

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename)

  })

app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/posts", postRouter)

app.listen(4000,()=>[
    console.log('Conected!')
])