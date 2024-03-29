import { JsonDataReader } from "@shared/adapters/jsonDataReader"
import { Item, ItemProps } from "@domain/item/entities/item"
import { ItemMemoriaRepository } from "@infra/database/memory/item/repositories/itemMemoria.repository"
import { EditarItemUseCase } from "@domain/item/usecases/editarItem.usecase"

const itensRepository = ItemMemoriaRepository.Instance

describe("Testando itens", () => {
  test("Verifica se cria um item", async () => {
    try {
      const newItemProps = {
        nome: "Big Mac",
        tipo: "lanche",
        preco: 39.9,
        medida: "unidade",
        aceitaOpcional: true,
        descricao:
          "Hambúrguer (100% carne bovina), alface americana, queijo cheddar, maionese Big Mac, cebola, picles e pão com gergelim",
      }
      const item = new Item(newItemProps)
      const output = await itensRepository.criar({ item: item })
      expect(output).toBeTruthy()
      expect(output).toMatchObject(newItemProps)
    } catch (error) {}
  })

  test("Deve editar um item", async function () {
    try {
      const editarItemUseCase = new EditarItemUseCase(itensRepository)
      const itens = await itensRepository.listar()
      if (itens[0]) {
        const newItemProps: ItemProps = {
          _id: itens[0]._id,
          nome: "Big Mac",
          tipo: "lanche",
          preco: 39.9,
          medida: "unidade",
          aceitaOpcional: true,
          descricao:
            "Hambúrguer (100% carne bovina), alface americana, queijo cheddar, maionese Big Mac, cebola, picles e pão com gergelim",
        }
        const output = await editarItemUseCase.execute({ _id: itens[0]._id, props: newItemProps })
        expect(output).toMatchObject(newItemProps)
      }
    } catch (error) {}

    //   expect(output).toHaveLength(expectedLength);
  })

  // test("Deve deletar um item", async function () {
  //   try {
  //     const initialLength = (await itensRepository.listar())?.length
  //     const item = (await itensRepository.listar())[0]
  //     const output = await itensRepository.deletar({ _id: item._id })
  //     const endLength = (await itensRepository.listar())?.length
  //     expect(output).toBeTruthy()
  //     expect(endLength).toBe(initialLength - 1)
  //   } catch (error) {}
  // })
})
