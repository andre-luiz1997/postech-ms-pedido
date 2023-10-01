import { DataReader } from "@shared/ports/dataReader";
import { Repository } from "@shared/ports/repository";
import { Seeder } from "@shared/ports/seeder";
import { Cliente, ClienteProps } from "@domain/cliente/entities/cliente";
import { CadastrarClienteUseCase } from "@domain/cliente/usecases/cadastrarCliente.usecase";

export class ClienteSeeder implements Seeder {
  private cadastrarClienteUseCase: CadastrarClienteUseCase;
  constructor(
    private readonly repository: Repository<Cliente>,
    private readonly dataReader: DataReader<ClienteProps[]>
  ) {
    this.cadastrarClienteUseCase = new CadastrarClienteUseCase(repository);
  }

  async seed(): Promise<number> {
    try {
      const data = await this.dataReader.read({
        path: "src/domain/cliente/data/clientes.json",
      });
      const expectedLength = data.length;
      await Promise.all(
        data.map(async (cliente) => {
          return this.cadastrarClienteUseCase.execute(cliente);
        })
      );

      return expectedLength;
    } catch (error) {
      throw error;
    }
  }
}
