import * as express from "express"
import { response } from "../utils"
import { ApiController } from "../api/ApiController"
import { ClienteDTO } from "../dtos/cliente/cliente.dto"
const router = express.Router()

const apiController = ApiController.Instance

router.patch("/:id", ClienteDTO.validate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const body = req.body
  return response(
    apiController.clienteController.editar({_id: req.params.id, props: body}),
    res,
    next
  )
})

router.delete("/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return response(apiController.clienteController.deletar(req.params.id), res, next)
  })

export default router
