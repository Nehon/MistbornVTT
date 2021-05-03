//import { Traversal } from "./utils/traversal.js";

export const registerHandlebarsHelpers = function () {

    // Handlebars.registerHelper('getEmbeddedItems', function (type, ids) {
    //     if (ids) {
    //         const items = Traversal.getItemsOfType(type);
    //         return ids.map(id => items.find(i => i._id === id));
    //     } else return null;
    // });

    Handlebars.registerHelper('disabled', function (value) {
        return Boolean(value) ? "disabled" : "";
    });

    Handlebars.registerHelper('readonly', function (value) {
        return Boolean(value) ? "readonly" : "";
    });


    Handlebars.registerHelper('or', function (value1, value2) {
        return Boolean(value1) || Boolean(value2);
    });

    Handlebars.registerHelper('and', function (value1, value2) {
        return Boolean(value1) && Boolean(value2);
    });
    Handlebars.registerHelper('safeString', function (string) {
        return new Handlebars.SafeString(string);
    });

    Handlebars.registerHelper('stripStyle', function (string) {
        let s = string.replace(/style="[^"]*"/g,"");
        return new Handlebars.SafeString(s);
    });

    Handlebars.registerHelper('percent', function (value, max) {
        return Math.max(0,Math.min(100, Math.floor(value / max * 100.0)));
    });


    Handlebars.registerHelper('info', function (align, label1, value1, label2, value2, label3, value3) {
        const v2Sign = value2 < 0 ? '' : '+';
        const v3Sign = value3 < 0 ? '' : '+';
        return new Handlebars.SafeString(`<span class="tooltiptext tooltip-${align}">` +
            `<span class="flexrow"><span class="flex1 right">${label1}&nbsp;</span><span class="flex1 left">&nbsp;${value1}</span></span>` +
            `<span class="flexrow"><span class="flex1 right">${label2}&nbsp;</span><span class="flex1 left">&nbsp;${v2Sign}${value2}</span></span>` +
            `<span class="flexrow"><span class="flex1 right">${label3}&nbsp;</span><span class="flex1 left">&nbsp;${v3Sign}${value3}</span></span>` +
            '</span>');
    });

    // Handlebars.registerHelper('buffWidget', function (value, key) {
    //     const changes = Traversal.getChangesFromBuffValue(value);
    //     let html = `<div class="left">`;
    //     for (const change of changes) {    
    //         if(!change.key){
    //             html += `<div class="buff">${change.value}<i data-value="${change.value}," data-key="${key}" class="fas fa-times remove-buff"></i></div>`;
    //             continue;
    //         }
    //         html += `<div class="buff">${game.i18n.localize(change.key)} ${change.value}<i data-value="${change.key}(${change.value})," data-key="${key}" class="fas fa-times remove-buff"></i></div>`;
    //     }
    //     html += `<i class="fas fa-plus add-buff right" data-key="${key}"></i></div>`;
    //     return new Handlebars.SafeString(html);
    // });

    Handlebars.registerHelper('optionEffects', function () {
        let html = "";
        for (const effect of CONFIG.statusEffects) {     
           html += `<option value="${effect.id}">${game.i18n.localize(effect.label)}</option>`;
        }
        return new Handlebars.SafeString(html);
    });     

    Handlebars.registerHelper('forin', function (object, elementName, block) {
        let accum = "";
        let i = 0;
        if (!elementName) elementName = "element";
        for (const key in object) {
            let obj = { key: key, i: i };
            obj[elementName] = object[key];
            accum += block.fn(obj);
            i++;
        }
        return accum;
    });

    Handlebars.registerHelper('getDRKeys', function (object) {
        let keys = [];
        for (const key in object) {
            if(key === "weaknesses" || key === "value" || key === "ignored"){
                continue;
            }
            keys.push(key);
        }
        return keys;
    });
    
    
    Handlebars.registerHelper('getAttribute', function (object, attribute) {
        return object[attribute];
    });

    Handlebars.registerHelper('getClass', function (skillRoll) {
        if (skillRoll.isCritical) {
            return "critical";
        }
        if (skillRoll.isSuccess) {
            return "success";
        }
        if (skillRoll.isFumble) {
            return "fumble";
        }
        if (skillRoll.isSuccess === false) {
            return "failure";
        }
        return "roll";
    });

    Handlebars.registerHelper('info4', function (align, label1, value1, label2, value2, label3, value3, label4, value4) {
        const v2Sign = value2 < 0 ? '' : '+';
        const v3Sign = value3 < 0 ? '' : '+';
        const v4Sign = value4 < 0 ? '' : '+';
        return new Handlebars.SafeString(`<span class="tooltiptext tooltip-${align} tooltip-move-up">` +
            `<span class="flexrow"><span class="flex1 right">${label1}&nbsp;</span><span class="flex1 left">&nbsp;${value1}</span></span>` +
            `<span class="flexrow"><span class="flex1 right">${label2}&nbsp;</span><span class="flex1 left">&nbsp;${v2Sign}${value2}</span></span>` +
            `<span class="flexrow"><span class="flex1 right">${label3}&nbsp;</span><span class="flex1 left">&nbsp;${v3Sign}${value3}</span></span>` +
            `<span class="flexrow"><span class="flex1 right">${label4}&nbsp;</span><span class="flex1 left">&nbsp;${v4Sign}${value4}</span></span>` +
            '</span>');
    });


    Handlebars.registerHelper('getPaths', function (items) {
        return items.filter(item => item.type === "path");
    });

    Handlebars.registerHelper('getSpecies', function (items) {
        return items.find(item => item.type === "species");
    });

    Handlebars.registerHelper('hint', function (item) {
        let content;
        if(item.data.worn){
            content = "E"
        } else if(item.data.properties && item.data.properties.consumable){
            content = item.data.qty;
        }
        if (content) {
            return new Handlebars.SafeString(`<span class="hint">${content}</span>`)
        }       
        return "";
    });


    const equippedFromRange= (items, start, end) =>{
        let inventory = items.filter(item => item.type === "item");
        let array = new Array(end - start + 1);
        for (let i = 0; i < array.length; i++) {
            array[i] = undefined;            
        }
        let unslotted = [];
        for (const item of inventory) {
            if(!item.data.worn){
                continue;
            }
            if(item.flags.equipSlot === undefined || item.flags.equipSlot === null){
                unslotted.push(item);
            }
            if(start > item.flags.equipSlot || item.flags.equipSlot > end){
                continue;
            }
            array[item.flags.equipSlot - start] = item;
        }

        if( unslotted.length ){
            console.warn("Equipment with no slot", unslotted);
        }        
        
        return array;
    }


    Handlebars.registerHelper('getEquippedAccessories', function (items) {
        return equippedFromRange(items, 0, 7);       
    });

    Handlebars.registerHelper('getEquipped', function (items) {
        let array = equippedFromRange(items, 8, 13);
        for (let i = 0; i < array.length; i++) {
            if(!array[i]){
                array[i]={empty:true};
            }            
        }
        array[0].htmlId = "rightHand"
        array[1].htmlId = "leftHand"
        array[2].htmlId = "head"
        array[3].htmlId = "chest"
        array[4].htmlId = "legs"
        array[5].htmlId = "feet"
        return array;
    });

    Handlebars.registerHelper('getInventory', function (items) {        
        let inventory = items.filter(item => item.type === "item");
        let array = new Array(49);
        for (let i = 0; i < array.length; i++) {
            if(inventory.length <= i){
                array[i] = undefined;
                continue;
            }
            array[i] = inventory[i];            
        }
        
        //console.log(array);
        return array;
    });

    Handlebars.registerHelper('getWorn', function (items) {
        let worn = items.filter(item => item.type === "item" && item.data.worn);
        worn.sort(function (a, b) {
            const aKey = a.data.subtype + "-" + a.name.slugify({ strict: true });
            const bKey = b.data.subtype + "-" + b.name.slugify({ strict: true });
            return (aKey > bKey) ? 1 : -1
        });
        return worn;
    });

    Handlebars.registerHelper('getItems', function (items) {
        return items.filter(item => item.type === "item");
    });

    Handlebars.registerHelper('getProfile', function (items) {
        return items.find(item => item.type === "profile");
    });

    Handlebars.registerHelper('countPaths', function (items) {
        return items.filter(item => item.type === "path").length;
    });

    Handlebars.registerHelper('state', function () {        
        console.log(arguments);
    });

    Handlebars.registerHelper('logItem', function (item) {        
        console.log("logitem", item);
    });


    Handlebars.registerHelper('getCapacities', function (items) {
        let caps = items.filter(item => item.type === "capacity");
        caps.sort(function (a, b) {
            const aKey = a.data.path + "-" + a.data.rank;
            const bKey = b.data.path + "-" + b.data.rank;
            return (aKey > bKey) ? 1 : -1
        });
        return caps;
    });
    Handlebars.registerHelper('getExtraCapacities', function (items, start, end) {
        let result = []
        let caps = items.filter(item => item.type === "capacity" && (item.data.rank === undefined || item.data.rank === null));
        for (let i = start; i <= end ; i++) {
            result[i - start] = caps[i];
        }
        return result;
    });

    Handlebars.registerHelper('getActions', function (items, start, end) {
        let result = []        
        for (let i = start; i <= end ; i++) {
            result[i - start] = items[i];
        }
        return result;
    });


    Handlebars.registerHelper('idFromKey', function (items, key) {        
        let item = items.find(item => item.data.key === key);        
        return item._id;
    });


    // Handlebars.registerHelper('getCapacitiesByIds', function (ids) {
    //     if (ids) {
    //         const caps = Traversal.getItemsOfType("capacity").filter(c => ids.includes(c._id));
    //         caps.sort(function (a, b) {
    //             const indexA = ids.indexOf(a._id);
    //             const indexB = ids.indexOf(b._id);
    //             return (indexA > indexB) ? 1 : -1
    //         });
    //         return caps;
    //     } else return null;
    // });

    Handlebars.registerHelper('getPath', function (items, pathKey) {
        return items.filter(item => item.type === "path").find(p => p.data.key === pathKey);
    });

    Handlebars.registerHelper('isNull', function (val) {
        return val == null;
    });

    Handlebars.registerHelper('isEmpty', function (list) {
        if (list) return list.length == 0;
        else return 0;
    });

    Handlebars.registerHelper('notEmpty', function (list) {
        return list.length > 0;
    });

    Handlebars.registerHelper('isZeroOrNull', function (val) {
        return val == null || val == 0;
    });

    Handlebars.registerHelper('isNegative', function (val) {
        return val < 0;
    });

    Handlebars.registerHelper('isNegativeOrNull', function (val) {
        return val <= 0;
    });

    Handlebars.registerHelper('isPositive', function (val) {
        return val > 0;
    });

    Handlebars.registerHelper('isPositiveOrNull', function (val) {
        return val >= 0;
    });

    Handlebars.registerHelper('equals', function (val1, val2) {
        return val1 == val2;
    });

    Handlebars.registerHelper('gt', function (val1, val2) {
        return val1 > val2;
    });

    Handlebars.registerHelper('lt', function (val1, val2) {
        return val1 < val2;
    });

    Handlebars.registerHelper('gte', function (val1, val2) {
        return val1 >= val2;
    });

    Handlebars.registerHelper('lte', function (val1, val2) {
        return val1 <= val2;
    });
    Handlebars.registerHelper('and', function (val1, val2) {
        return val1 && val2;
    });

    Handlebars.registerHelper('or', function (val1, val2) {
        return val1 || val2;
    });

    Handlebars.registerHelper('not', function (cond) {
        return !cond;
    });

    Handlebars.registerHelper('isEnabled', function (configKey) {
        return game.settings.get("cof", configKey);
    });

    Handlebars.registerHelper('split', function (str, separator, keep) {
        return str.split(separator)[keep];
    });


    // If you need to add Handlebars helpers, here are a few useful examples:
    Handlebars.registerHelper('concat', function () {
        var outStr = '';
        for (var arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper('add', function (a, b) {
        return parseInt(a) + parseInt(b);
    });

    Handlebars.registerHelper('sub', function (a, b) {
        return parseInt(a) - parseInt(b);
    });


    Handlebars.registerHelper('mult', function (a, b) {
        return parseInt(a) * parseInt(b);
    });

    Handlebars.registerHelper('valueAtIndex', function (arr, idx) {
        return arr[idx];
    });

    Handlebars.registerHelper('includesKey', function (items, type, key) {
        // console.log(items);
        return items.filter(i => i.type === type).map(i => i.data.key).includes(key);
    });

}