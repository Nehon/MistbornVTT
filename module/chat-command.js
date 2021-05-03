import { MistRoll } from "./mist-roll.js";
import { Utils } from "./utils/utils.js";

Hooks.on("chatMessage", (html, content, msg) => {
    let regExp;
    regExp = /^\/(m\s)?(mist\s)?/g;    
    let command = content.replace(regExp,"");
    if(command === content){
        // no match of command
        return true;
    }
    
    let roll = new MistRoll(command);
    roll.roll(Utils.getSpeakersActor());
    
    return false;
});
