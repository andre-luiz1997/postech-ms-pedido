import { Pedido, PedidoItemProps, statusPedidos } from "src/domain/pedido/entities/pedido"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"
import { RegistroExistenteException } from "src/shared/exceptions/registroExistente.exception"
import { PedidoMemoriaRepository } from "./pedidosMemoria.repository"
import { ClienteMemoriaRepository } from "../../cliente/repositories/clientesMemoria.repository"
import { ItemMemoriaRepository } from "../../item/repositories/itemMemoria.repository"
import { Item, ItemProps } from "src/domain/item/entities/item"
import { ClienteProps } from "src/domain/cliente/entities/cliente"
import { JsonDataReader } from "src/shared/adapters/jsonDataReader"
import { ClienteSeeder } from "../../cliente/seeders/cliente.seeder"
import { ItemSeeder } from "../../item/seeders/item.seeder"
import { DtoValidationException } from "src/shared/exceptions"

describe("Deve instanciar um repository de memória", () => {
  const pedidosRepository = PedidoMemoriaRepository.Instance
  const clientesRepository = ClienteMemoriaRepository.Instance
  const itensRepository = ItemMemoriaRepository.Instance
  const statuses = [...statusPedidos].reverse()
  const clientesDataReader = new JsonDataReader<Array<ClienteProps>>()
  const itensDataReader = new JsonDataReader<Array<ItemProps>>()
  const clientesSeeder = new ClienteSeeder(clientesRepository, clientesDataReader)
  const itensSeeder = new ItemSeeder(itensRepository, itensDataReader)

  test("Deve listar os pedidos", async () => {
    const pedidos = await pedidosRepository.listar()
    expect(pedidos).toHaveLength(0)
  })

  test("Deve cadastrar um cliente", async function () {
    const expectedLength = await clientesSeeder.seed()
    const output = await clientesRepository.listar()
    expect(output).toHaveLength(expectedLength)
  })

  test("O repository de clientes possui clientes", async () => {
    let clientes = await clientesRepository.listar()
    if (!clientes.length) await clientesSeeder.seed()
    clientes = await clientesRepository.listar()
    expect(clientes.length).toBeGreaterThan(0)
  })

  test("O repository de itens possui itens", async () => {
    let itens = await itensRepository.listar()
    if (!itens.length) await itensSeeder.seed()
    itens = await itensRepository.listar()
    expect(itens.length).toBeGreaterThan(0)
  })

  test("Instance deve ser uma instância de PedidoMemoriaRepository", async () => {
    expect(pedidosRepository).toBeInstanceOf(PedidoMemoriaRepository)
  })

  test("Deve criar um pedido", async () => {
    const cliente = await clientesRepository.listar()
    let item = await itensRepository.listar()
    const pedido = new Pedido({
      cliente: cliente[0],
      itens: [
        {
          item: item[0],
          qtd: 1,
        },
      ],
      status: "aberto",
    })
    const pedidoCriado = await pedidosRepository.criar({ item: pedido })
    expect(pedidoCriado).toBeInstanceOf(Pedido)
    expect(pedidoCriado._id).toBeDefined()
    expect(pedidoCriado.valor).toBe(item[0].preco)
  })

  test("Deve verificar ordenacao dos pedidos", async () => {
    const pedidos = await pedidosRepository.listar()
    const statuses = [...statusPedidos].reverse()
    const pedidosOrdenados = pedidos.sort((pedidoA, pedidoB) => {
      const indiceA = statuses.indexOf(pedidoA.status)
      const indiceB = statuses.indexOf(pedidoB.status)
      return indiceA - indiceB
    })
    expect(pedidosOrdenados).toBeDefined()
    expect(pedidosOrdenados[0].status).toBe("aberto");
  });

  test("Deve editar um pedido", async () => {
    const pedido = await pedidosRepository.listar({ status: "aberto" })
    pedido[0].status = "fechado"
    const pedidoEditado = await pedidosRepository.editar({ _id: pedido[0]._id, item: pedido[0] })
    expect(pedidoEditado).toBeInstanceOf(Pedido)
    expect(pedidoEditado.status).toBe("fechado")
  });

  test("Deve dar erro ao tentar criar um pedido com cliente inexistente", async () => {
    const cliente = await clientesRepository.listar()
    let item = await itensRepository.listar()
    const pedido = new Pedido({
      cliente: cliente[0],
      itens: [
        {
          item: item[0],
          qtd: 1,
        },
      ],
      status: "aberto",
    })
    delete pedido.cliente
    try {
      const pedidoCriado = await pedidosRepository.criar({ item: pedido })
      expect(pedidoCriado).toThrow(DtoValidationException)
    } catch (error) {}
  })

  test("Deve listar pedidos com status 'aberto'", async () => {
    const pedidos = await pedidosRepository.listar({ status: "aberto" })
    expect(pedidos).toBeDefined()
  })

  test("Deve deletar um pedido", async () => {
    const pedido = await pedidosRepository.listar();
    const deleted = await pedidosRepository.deletar({ _id: pedido[0]._id })
    expect(deleted).toBeTruthy()
  })

 

  test("Deve dar erro ao tentar deletar um pedido inexistente", async () => {
    try {
      const output = await pedidosRepository.deletar({ _id: "-1" })
      expect(output).toThrow(RegistroInexistenteException)
    } catch (error) {}
  })
})
