import { LightningElement } from 'lwc';
import { getAccounts } from 'data/sessionService';
import { createAccount } from 'data/sessionService';
export default class AccountList extends LightningElement {
    sessions = [];
    name = '';
    connectedCallback() {
        this.getAllAccount();
    }

    getAllAccount() {
        getAccounts().then((result) => {
            this.sessions = this.allSessions = result;
        });
    }

    handleSearchKeyInput(event) {
        const searchKey = event.target.value.toLowerCase();
        this.sessions = this.allSessions.filter((session) =>
            session.name.toLowerCase().includes(searchKey)
        );
    }

    handleName(event) {
        this.name = event.target.value;
    }

    handleCreateAccount() {
        createAccount(this.name).then((res) => {});
        this.name = '';
        this.getAllAccount();
    }
}
