export class MistRoll{
    constructor(formula){
        let rollRegExp = /^(.+?(?=\.|$))(?:\.(.*))?/g;
    
        let m;

        while ((m = rollRegExp.exec(formula)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === rollRegExp.lastIndex) {
                rollRegExp.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if(groupIndex == 1 && match){
                   this._rollFormula = match;
                }
                if(groupIndex==2 && match){
                    this._nudgesFormula = match
                }            
            });
        }
     
    }

    roll(actor){
        if(!actor){
            actor ={
                data:{}
            };
        }
        let roll = new Roll(`(${this._rollFormula})d6`, actor.data);
        roll.roll();
        
        this._results = [...roll.terms[0].results];
        this._results.sort((r1,r2) => r2.result - r1.result);

        this._nudges = 0

        if(this._nudgesFormula){
            let nRoll = new Roll(this._nudgesFormula, actor.data);
            nRoll.roll();
            this._nudges = nRoll.result;
        }
        this._nbDices = this._results.length - 1;

        let prevResult = 0;
        this._result = 0;
        for (let i = 0; i < this._results.length; i++) {
            const element = this._results[i];
            if(element.result == 6){
                this._nudges++;
            } else if(prevResult === element.result){
                this._result = prevResult;
                break;
            } else {
                prevResult = element.result;
            }
        }

        
        console.log(`${this._result}.${this._nudges}`);
        console.log(this._results);

        this.toMessage(actor);

    }

    log(){
        console.log(this._rollFormula,'d6', this._nudgesFormula ? this._nudgesFormula : 0, 'nudges');
    }

    async toMessage(actor) {
        const rollOptionTpl = 'systems/mistborn/templates/chat/roll-card.hbs';
        const rollOptionContent = await renderTemplate(rollOptionTpl, this);

        // Prepare chat data
        let messageData = {
            user: game.user._id,
            content: rollOptionContent,
            sound: CONFIG.sounds.dice,            
        };
        if(actor){
            messageData.speaker= ChatMessage.getSpeaker({ actor: actor });
        }
        
        return CONFIG.ChatMessage.entityClass.create(messageData);
    }
}