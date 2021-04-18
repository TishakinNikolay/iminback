import {FieldEnum} from '../enums/field.enum';
import {FilterComparisonOperatorEnum} from '../enums/filter-comparison-operator.enum';
import {FilterLogicalOperatorEnum} from '../enums/filter-logical-operator.enum';

export interface IFilterInit {
    initFilter?: () => Promise<IFilter>;
}

/**
 * IComplexFilterItem interface
 */
export interface IComplexFilterItem {
    fieldName: string;
    fieldValue: string;
    fieldType: FieldEnum;
    isBaseField: boolean;
    comparisonOperator: FilterComparisonOperatorEnum;
    logicalOperator: FilterLogicalOperatorEnum;
}

/**
 * IComplexFilter interface
 */

export interface IComplexFilter {
    filterItems: IComplexFilterItem[];
}

/**
 * IFilter interface
 */
export interface IFilter {
    page?: number;
    perPage?: number;
    options?: any;
    searchProperty?: any;
    sortOrderOptions?: any;
    complexFilter?: IComplexFilter;
}
