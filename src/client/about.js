import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import MyContactList from 'my/contactList';

const app = createElement('my-contact-list', { is: MyContactList });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#contact').appendChild(app);
