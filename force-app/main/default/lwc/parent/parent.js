import { LightningElement, track, api, wire } from 'lwc';

import getUserData from '@salesforce/apex/JestData.getUserData';

export default class Parent extends LightningElement {
    @api userId;
    @track message = '';
    @track inputValue = '';
    @track currentWordId = 0;
    @track rows = [];
    @track isError = false;

    @api getInput() { return this.inputValue; }

    @wire(getUserData, {})
    getUserData({data, error}){
        if(data !== undefined){
            this.userId = data.userId;
            this.message = data.message;
        }
    }

    handleAddWord(event){
        if(this.inputValue == ''){
            this.isError = true;
            console.log('AddWord:');
            return;
        }

        this.rows.push({value : this.inputValue, id : this.currentWordId});
        this.currentWordId++;
        this.inputValue = '';
        this.isError = false;
    }

    handleClearList(){
        this.rows = [];
        this.currentWordId = 0;
        this.isError = false;
        this.inputValue = '';
    }

    handleFillInput(event){
        this.inputValue = event.detail;
    }

    handleChangeInput(event){
        this.inputValue = event.target.value;
    }
}