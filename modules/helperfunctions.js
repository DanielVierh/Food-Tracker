/**
 * 
 * @param {number} val - Int 
 * @returns string with 0
 */

export function addZero(val = 0) {
    if (val < 10) {
        val = '0' + val;
    }
    return val;
}