const URL = '/api/accounts/';
const URLContact = '/api/contacts/';
const URLCreateAccount = '/api/createAccount';
const URLCreateContact = '/api/createContact';
let sessions = [];

export const getAccounts = () =>
    fetch(URL)
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            sessions = result.data;
            return sessions;
        })
        .catch((error) => {
            alert('Error in saving contact ' + error);
        });

export const getSession = (sessionId) => {
    return sessions.find((session) => {
        return session.id === sessionId;
    });
};

export const getContacts = () =>
    fetch(URLContact)
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            sessions = result.data;
            return sessions;
        })
        .catch((error) => {
            alert('Error in saving contact ' + error);
        });

export const createAccount = async (name) => {
    console.log('name is ' + name);
    fetch(URLCreateAccount, {
        method: 'POST',
        headers: { 'account-name': name }
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            // eslint-disable-line no-alert
            alert('Message is : ' + result.body.toString());
            return sessions;
        })
        .catch((error) => {
            alert('Error in saving contact ' + error);
        });
};

export const createContact = async (firstName, lastName, email, phone) => {
    console.log('name is ' + name);
    fetch(URLCreateContact, {
        method: 'POST',
        headers: {
            'contact-first': firstName,
            'contact-last': lastName,
            'contact-email': email,
            'contact-phone': phone
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            // eslint-disable-line no-alert
            //console.log(result.body.toString().split('"')[1]);

            alert('Message is ' + result.body.toString());

            console.log(result.body);
            return sessions;
        })
        .catch((error) => {
            alert('Error in saving contact ' + JSON.stringify(error));
        });
};

export const createBankAccount = async (
    holderName,
    openDate,
    closeDate,
    branch
) => {
    console.log('name is ' + holderName + openDate + closeDate + branch);
    // fetch(URLCreateAccount, {
    //     method: 'POST',
    //     headers: { 'account-name': name }
    // })
    //     .then((response) => {
    //         return response.json();
    //     })
    // .then((result) => {
    //     // eslint-disable-line no-alert
    //     alert(
    //         'Account Created Successfully!!! ' +
    //             result.body.toString().split('"')[1]
    //     );
    //     return sessions;
    // });
};
