import { Injectable } from "@nestjs/common";

@Injectable()
export class ObjectRemapperService {

    public static _remap(target: any, source: any) {
        Object.keys(source).forEach((key) => {
            if (key in target) {
                if (typeof source[key] == 'object') {
                    target[key] = ObjectRemapperService._remap(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        });
        return target;
    }
    public remap(target: any, source: any) {
        return ObjectRemapperService._remap(target, source);
    }

}