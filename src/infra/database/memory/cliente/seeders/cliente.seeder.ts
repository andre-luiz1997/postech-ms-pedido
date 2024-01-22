import { DataReader } from "@shared/ports/dataReader";
import { Repository } from "@shared/ports/repository";
import { Seeder } from "@shared/ports/seeder";
import { Cliente, ClienteProps } from "@domain/cliente/entities/cliente";

export class ClienteSeeder implements Seeder {
  constructor(
    private readonly repository: Repository<Cliente>,
    private readonly dataReader: DataReader<ClienteProps[]>
  ) {
  }

  async seed(): Promise<number> {
    try {
      const data = await this.dataReader.read({
        path: "src/domain/cliente/data/clientes.json",
      });
      const expectedLength = data.length;
      await Promise.all(
        data.map(async (cliente) => {
          await this.repository.criar({ item: new Cliente(cliente) });
        })
      );

      return expectedLength;
    } catch (error) {
      throw error;
    }
  }
}
