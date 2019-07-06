// Load external modules
let path = require('path');


// Hard-coded path to project root (relative to this file)
let projectRoot = path.resolve(__dirname, './');



// Export as module
module.exports = {
    /**
     * root(relpath)
     *  Creates an absolute path from a path relative to the project root.
     */
    root: function(relpath) {
        if (relpath)
            return path.resolve(projectRoot, relpath);
        else
            return projectRoot;
    },

    /**
     * hasFlag(flag)
     *  Checks for 'flag' inside argument-list.
     */
    hasFlag(flag) {
        return process.argv.join('').indexOf(flag) > -1;
    }
}