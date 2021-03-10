import { Injectable } from "@nestjs/common";

@Injectable()
export class ObjectRemapperService {
    public remap(targetType: any, source: any, target: any = {}): any {
        return ObjectRemapperService._remap(targetType, source);
    }
    public static _remap(targetType: any, source: any, target: any = {}): any {
        console.log('in remap');
        Object.keys(source).forEach(function (key) {
            const targetKeys: string[] = ObjectRemapperService.getParamNames(targetType);
            if (targetKeys.includes(key)) {
                if (source[key] instanceof Object) {
                    target[key] = ObjectRemapperService._remap(targetType, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        });
        return target;
    }

    static STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    static ARGUMENT_NAMES = /([^\s,]+)/g;
    static getParamNames(func) {
        console.log(func.toString());
        var fnStr = func.toString().replace(ObjectRemapperService.STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ObjectRemapperService.ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    }
}