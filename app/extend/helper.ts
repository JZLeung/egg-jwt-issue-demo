import {URLSearchParams} from 'url';

export const formatSearchParams = (params: object): string => {
    const newSearchParams = new URLSearchParams();
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const value = params[key];
            newSearchParams.append(key, value);
        }
    }
    return newSearchParams.toString();
};

export const randomStr = (length = 10, ignoreStr = 'oiOL10'): string => {
    const randomString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLength = randomString.length;
    const ignores = ignoreStr.split('');
    let string = '';
    for (let index = 0; index < length; ) {
        const _index = Math.floor(Math.random() * randomLength);
        const letter = randomString[_index];
        if (!ignores.includes(letter)) {
            string += letter;
            index++;
        }
    }
    return string;
};
