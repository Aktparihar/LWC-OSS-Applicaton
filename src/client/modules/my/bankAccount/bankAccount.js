import { LightningElement } from 'lwc';
import { createBankAccount } from 'data/sessionService';
export default class SessionList extends LightningElement {
    accountHolder = '';
    openingDate = '';
    closingDate = '';
    branch = '';

    handleName(event) {
        if (event.target.name == 'accountHolder') {
            this.accountHolder = event.target.value;
        }
        if (event.target.name == 'openingDate') {
            this.openingDate = event.target.value;
        }
        if (event.target.name == 'closingDate') {
            this.closingDate = event.target.value;
        }
        if (event.target.name == 'branch') {
            this.branch = event.target.value;
        }
    }

    handleCreateAccount() {
        createBankAccount(
            this.accountHolder,
            this.openingDate,
            this.closingDate,
            this.branch
        ).then((res) => {});
    }
}
