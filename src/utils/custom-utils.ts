export class CustomUtils{
    public static getUniqueMapBy(arr: any, key: any) {
        return new Map(arr.filter(it => it).map((item) => [item[key], item]));
    }
}