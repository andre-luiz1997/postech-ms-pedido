export interface FindUniqueProps {
    prop: string;
    value: string;
    transaction?: any;
}

export interface IsUniqueProps extends FindUniqueProps {
    ignoreId?: string;
}

export interface IsUniqueManyProps {
    props: FindUniqueProps[];
    ignoreId?: string;
    transaction?: any;
}

export interface BuscarUmProps {
    query: any;
    transaction?: any;
}
export interface DeletarProps {
    _id: string;
    transaction?: any;
}

export interface EditarProps<T> {
    _id: string;
    item: T
    transaction?: any;
}

export interface CriarProps<T> {
    item: T
    transaction?: any;
}

export interface BaseRepository<T> {
    criar(props: CriarProps<T>): Promise<T>;
    listar(queryProps?: Object): Promise<T[]>;
    buscarUm(props: BuscarUmProps): Promise<T | null>;
}

export interface Repository<T> extends BaseRepository<T> {
    editar(props: EditarProps<T>): Promise<T>;
    isUnique?(props: IsUniqueProps | IsUniqueManyProps): Promise<boolean>;
    deletar(props: DeletarProps): Promise<boolean>;

    startTransaction?(): Promise<any>;
    inTransaction?(transaction: any, callback: () => Promise<any>): Promise<any>;
    commitTransaction?(transaction: any): Promise<any>;
    rollbackTransaction?(transaction: any): Promise<any>;
}