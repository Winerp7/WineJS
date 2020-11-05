"use strict";
/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.dump = void 0;
// Dump is a debugging function we can use to sort of "console.log" our data
// Write: 
// pre= helper.dump(locals)
// in a template and it will show all locals available on that page
function dump(obj) {
    JSON.stringify(obj, null, 2);
}
exports.dump = dump;
