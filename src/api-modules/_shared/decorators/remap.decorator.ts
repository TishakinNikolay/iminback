function remap(target: any, source: any) {
    Object.keys(source).forEach((key) => {
        if (key in target) {
            if (typeof source[key] == 'object') {
                target[key] = remap(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    });
    return target;
}
export function scalable(type: any) {
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