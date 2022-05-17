import { LightningElement } from 'lwc';
import { getContacts } from 'data/sessionService';
import { createContact } from 'data/sessionService';
export default class SessionList extends LightningElement {
    sessions = [];
    firstName = '';
    lastName = '';
    email = '';
    phone = '';
    connectedCallback() {
        getContacts().then((result) => {
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
        if (event.target.name == 'firstName') {
            this.firstName = event.target.value;
        }
        if (event.target.name == 'lastName') {
            this.lastName = event.target.value;
        }
        if (event.target.name == 'email') {
            this.email = event.target.value;
        }
        if (event.target.name == 'phone') {
            this.phone = event.target.value;
        }
    }

    handleCreateContact() {
        // alert('this is ' + this.firstName + this.lastName + this.email);
        createContact(
            this.firstName,
            this.lastName,
            this.email,
            this.phone
        ).then((res) => {});
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
    }
}
