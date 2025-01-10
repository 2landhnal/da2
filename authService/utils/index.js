import _ from 'lodash';
export const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds);
};
export const removeNullField = (object) => {
    const cleanedObject = {};

    for (const key in object) {
        if (object[key] !== null && object[key] !== undefined) {
            cleanedObject[key] = object[key];
        }
    }

    return cleanedObject;
};
