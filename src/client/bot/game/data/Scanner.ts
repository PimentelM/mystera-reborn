import {strict} from "assert";
import {type} from "os";

export class Scanner {

    results: { [path: string]: any };

    rootPathTable : { [path: string]: any };

    acceptedTypes: { [type: string]: boolean } = {
        "string": true,
        "number": true,
        "object": true,
        "boolean": true,
    };

    maxDepth: number = 3;

    separator: string = ".";

    pathsToExclude = {
        Player : true,
        GameMap : true,
        Iventory : true,
        Creatures : true,
        Game : true,
        Bot : true,
        Craft : true,
        Equip : true,
        Upgrades : true,
        Scanner : true,
        PathFinder : true,
        StateController : true,
        StateFactory : true,
    };




    public ObjectIntoPaths = (obj, condition: (x) => boolean = (x) => false, root = "root", maxDepth: number = this.maxDepth, depth: number = 1) => {
        let result = {};

        for (let [_,value] of Object.entries(this.rootPathTable)){
            if (value === obj) {
                return {};
            }
        }

        this.rootPathTable[root] = obj;

        if (depth > maxDepth) return result;

        try {

            for (let [fieldName, value] of Object.entries(obj)) {
                if (!this.acceptedTypes[typeof value]) continue;
                if (this.pathsToExclude[fieldName]) continue;
                if (fieldName.indexOf(this.separator) > -1) console.log(`Separator "${this.separator}" found at ${root} in property ${fieldName}`);

                if (typeof value == typeof {}) {
                    Object.assign(result, this.ObjectIntoPaths(value, condition, root + this.separator + fieldName, maxDepth, depth + 1))
                } else {
                    if (condition(value)) {
                        result[root + this.separator + fieldName] = {value, before: undefined};
                    }
                }
            }

        } catch (e) {

        }

        return result
    };


    public rescan(condition: (x) => boolean) {
        for (let [path, value] of Object.entries(this.results)) {
            let newValue = this.getValueAtPath(path);
            if (condition(newValue)) {
                value.before = value.value;
                value.value = newValue;
            } else {
                delete this.results[path];
            }
        }
        return this.results
    }

    private getValueAtPath(path) {
        let splitAt = path.lastIndexOf(this.separator);
        let rootPath = path.substr(0,splitAt);
        let field = path.substr(splitAt + 1);
        let rootObject = this.rootPathTable[rootPath];
        let value = rootObject[field];

        return value;
    };

    public scan(f,object = window, maxDepth = this.maxDepth) {
        let isEqualTo = (a) => (x) => x===a;
        if (this.acceptedTypes[typeof f]) f = isEqualTo(f);
        this.rootPathTable = {};
        this.results = this.ObjectIntoPaths(object, f, "root", maxDepth);
        return this.results;
    }


}
