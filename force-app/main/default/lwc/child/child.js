import { LightningElement, api } from 'lwc';

export default class Child extends LightningElement {
    @api rows = [];
    @api message;

    handleClick(event){
        let value;

        for(let r of this.rows){
            if(r.id === event.target.value){
                value = r.value;
                break;
            }
        }

        this.dispatchEvent(new CustomEvent('fillinput', {detail : value}));
    }

}