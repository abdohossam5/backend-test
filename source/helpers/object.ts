const ObjectHelpers = {
  isObject: (obj: { [key: string]: any }) => {
    return !(Object.prototype.toString.call(obj) !== '[object Object]' || Object.getOwnPropertyNames(obj).indexOf('_bsontype') >= 0);
  },
  convertObjectToQueryString: (obj: { [key: string]: any }) => {
    let result = '';

    if (ObjectHelpers.isObject(obj)) {
      Object.keys(obj).forEach((key: string) => {
        const value = obj[key];
        if (Array.isArray(value)) {
          value.forEach((itm) => {
            result += `&${key}=${encodeURIComponent(itm)}`;
          });
        } else {
          result += `&${key}=${encodeURIComponent(value)}`;
        }
      });
    }

    return (result ? result.substr(1) : result);
  }
};

export default ObjectHelpers;
