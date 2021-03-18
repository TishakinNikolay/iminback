function remap(target: any, source: any) {
    if (source) {
        Object.keys(source).forEach((key) => {
            if (key in target) {
                if (typeof source[key] == 'object' && source[key] != null && source[key] != undefined) {
                    if (source[key] instanceof Date) {
                        target[key] = source[key];
                    } else {
                        target[key] = remap(target[key], source[key]);
                    }
                } else {
                    target[key] = source[key];
                }
            }
        });
    }
    return target;
}

function scalable(type: any) {
    return function (target, key, descriptor) {
        const originalFunc = descriptor['value'];
        const proxymapper = async function () {
            const result = await originalFunc.call(this, ...arguments);
            return remap(new type(), result);
        };
        descriptor['value'] = proxymapper;
        return descriptor;
    };
}

function scalableBulk(type: any) {
    return function (target, key, descriptor) {
        const originalFunc = descriptor['value'];
        const proxymapper = async function () {
            const result = await originalFunc.call(this, ...arguments);
            return result.map((entity) => {
                return remap(new type(), entity);
            });
        };
        descriptor['value'] = proxymapper;
        return descriptor;
    };
}
export { scalable, scalableBulk }
