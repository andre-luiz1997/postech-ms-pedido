import * as express from "express"
import { response } from "@infra/drivers/utils"
import { ApiController } from "@infra/drivers/api/ApiController"
import { ItemDTO } from "../dtos/item/item.dto"
const router = express.Router()

const apiController = ApiController.Instance


router.patch("/:id", ItemDTO.validate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const body = req.body
  return response(
    apiController.itemController.editar(req.params.id, body),
    res,
    next
  )
})

router.delete("/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return response(apiController.itemController.deletar(req.params.id), res, next)
})

export default router
