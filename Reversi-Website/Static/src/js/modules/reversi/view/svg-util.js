Reversi.BoardElementFactory.SVGUtil = (() => {
    /**
     *
     * @param {Element} target
     * @param {Array | Object} attributes
     * @private
     */
    let setAttributesNS = (target, attributes) => {
        if (!(target instanceof Element)) throw new Error("target not an HTMLElement");
        if (attributes instanceof Object) attributes = objectToArray(attributes);
        if (!(attributes instanceof Array)) throw new Error("target not an Array");

        for (let key in attributes) {
            target.setAttribute(key, attributes[key]);
        }
    };

    /**
     *
     * @param object
     * @returns {Array}
     * @private
     */
    let objectToArray = (object) => {
        if (!(object instanceof Object)) throw new Error("target not an Object");

        let output_array = [];
        Object.keys(object).map((key) => {
            output_array[key] = object[key];
        });

        return output_array;
    };

    return {
        objectToArray: objectToArray,
        setAttributesNS: setAttributesNS
    }
})();

