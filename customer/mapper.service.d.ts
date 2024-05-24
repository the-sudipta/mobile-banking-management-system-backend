export declare class MapperService {
    dtoToEntity<T, U>(dto: T, entityClass: new () => U): U;
    entityToDto<T, U>(entity: T, dtoClass: new () => U): U;
    listEntitiesToListDtos<T, U>(entities: T[], dtoClass: new () => U): U[];
}
