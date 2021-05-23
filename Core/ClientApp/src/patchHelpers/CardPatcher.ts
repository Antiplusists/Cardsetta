import {CardType} from "../entities/Card";

export default class CardPatcher {
    private _type: CardType | null;
    private _question: string | null;
    private _answer: string | null;

    constructor() {
        this._type = null;
        this._question = null;
        this._answer = null;
    }

    public patchType(newType: CardType): CardPatcher {
        this._type = newType;
        return this;
    }

    public patchQuestion(newQuestion: string): CardPatcher {
        this._question = newQuestion;
        return this;
    }

    public patchAnswer(newAnswer: string): CardPatcher {
        this._answer = newAnswer;
        return this;
    }

    public build(): object[] {
        let result = new Array<object>();
        
        if (this._type) {
            result.push({
                op: "replace",
                path: "/type",
                value: CardType[this._type]
            });
        }
        
        if (this._question) {
            result.push({
                op: "replace",
                path: "/question",
                value: this._question
            });
        }
        
        if (this._answer) {
            result.push({
                op: "replace",
                path: "/answer",
                value: this._answer
            });
        }
        return result;
    }
}