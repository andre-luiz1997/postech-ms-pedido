import * as express from "express"
import * as bodyParser from "body-parser"
import config from "@shared/config"
import routes from "./routes"
import { MongoConnection } from "../database/mongodb/adapters/MongoConnection"
import { response, sendError } from "./utils"

const isMongoDatabase = config.NODE_ENV == "production" || config.NODE_ENV == "debug"
const PORT = config.PORT || 3000
const cors = require("cors")
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
  console.log(`${req.method}: ${req.originalUrl}`)
  next()
})

function configureRoutes() {
  app.use(routes)

  app.listen(PORT, () => {
    console.log(`Server escutando na porta ${PORT}`)
  })

  //ERROR HANDLER
  app.use((err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
    return sendError(err, res)
  })
}

function configureMongo() {
  const client = new MongoConnection({
    database: config.mongo.MONGO_DATABASE,
    user: config.mongo.MONGO_USER,
    password: config.mongo.MONGO_PW,
    port: +config.mongo.MONGO_PORT,
    host: config.mongo.MONGO_HOST,
  })
  return client.connect().then(() => configureRoutes())
}

async function bootstrap() {
  if (isMongoDatabase) return configureMongo()
  return configureRoutes()
}

bootstrap()
