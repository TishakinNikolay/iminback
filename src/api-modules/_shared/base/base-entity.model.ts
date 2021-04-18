import {validate} from 'class-validator';
import {FindManyOptions, In, SelectQueryBuilder} from 'typeorm';
import {IFilter} from '../interfaces/IFilter';

export class BaseEntity {
    public async validate() {
        const errors = await validate(this);
        if (errors.length > 0) {
            throw new Error(`Validation failed!\n${errors}`);
        }
    }

    public static async findAndTotal<T>(this, options?: FindManyOptions<BaseEntity> | undefined): Promise<{ items: T[], count: number }> {
        const result = await this.findAndCount(options);

        return {
            items: result[0],
            count: result[1]
        };
    }

    public static createFindManyOptions(filter: IFilter): FindManyOptions {
        const {
            page = 1,
            perPage = 10
        } = filter;
        return {
            skip: page > 0 ? (page - 1) * perPage : 0,
            take: perPage,
            where: BaseEntity.createWhere(filter.options)
        };
    }

    public static createWhere(options) {
        if (!options) {
            return;
        }
        const result: object = {};
        for (const key of Object.keys(options)) {
            const value = options[key];
            result[key] = Array.isArray(value) ? In(value) : In([value]);
        }
        return result;
    }

    public static createWhereString(options): string {
        const whereProperties: string[] = [];
        for (const key of Object.keys(options)) {
            const value = options[key];
            if (value === undefined) {
                continue;
            } else if (Array.isArray(value)) {
                whereProperties.push(`"${key}" IN (:...${key})`);
            } else if (typeof value === 'object' && value !== null) {
                whereProperties.push(`"${key}" @> :${key}`);
            } else {
                whereProperties.push(`"${key}" = :${key}`);
            }
        }
        return whereProperties.join(' AND ');
    }

    public static createRelations<T>(relations: string[], query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        relations.forEach((i) => {
            query.relation(i);
        });

        return query;
    }

    public static createSearchByPropertyString(searchProperty, logicalOperator: string = ' OR '): string {
        return `(${BaseEntity.createSearchByPropertyArray(searchProperty).join(logicalOperator)})`;
    }

    private static createSearchByPropertyArray(searchProperty, parentPropertyName?): string[] {
        let whereProperties: string[] = [];
        for (const key of Object.keys(searchProperty)) {
            const value = searchProperty[key];
            if (typeof value === 'object') {
                whereProperties = [...whereProperties, ...BaseEntity.createSearchByPropertyArray(value, parentPropertyName ? `${parentPropertyName}.${key}` : key)];
            } else {
                whereProperties.push(`"property" ->> '${parentPropertyName && parentPropertyName !== 'property' ? `${parentPropertyName}.${key}` : key}' ILIKE '%${value}%'`);
            }
        }
        return whereProperties;
    }

    public static createSortOrderObject(orderObject, parentPropertyName?) {
        let order = {};
        for (const key of Object.keys(orderObject)) {
            const value = orderObject[key];
            if (typeof value === 'object') {
                order = {...order, ...BaseEntity.createSortOrderObject(value, parentPropertyName ? `${parentPropertyName}.${key}` : key)};
            } else if (parentPropertyName) {
                order[`"property" ->> '${parentPropertyName ? `${parentPropertyName}.${key}` : key}'`] = value;
            } else {
                order[key] = value;
            }
        }
        return order;
    }
}