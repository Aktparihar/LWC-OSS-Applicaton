const jsforce = require('jsforce');

module.exports = class IntegrationService {
    constructor(logger, authService) {
        this.logger = logger;
        this.authService = authService;
    }

    _runSoql(conn, soqlQuery) {
        return new Promise((resolve, reject) => {
            conn.query(soqlQuery, (error, result) => {
                if (error) {
                    this.logger.error(
                        `Failed to run SOQL query: ${soqlQuery}`,
                        error
                    );
                    reject(error);
                }
                resolve(result.records);
            });
        });
    }

    createAccount(req, res, namePost) {
        const session = this.authService.getSession(req, res);
        if (session === null) {
            return;
        }
        console.log(namePost);
        const conn = new jsforce.Connection({
            accessToken: session.sfdcAccessToken,
            instanceUrl: session.sfdcInstanceUrl
        });
        if (namePost !== undefined) {
            conn.sobject('Account').create(
                {
                    Name: namePost
                },
                function (err, rest) {
                    if (err || !rest.success) {
                        return res
                            .status(500)
                            .send({ body: JSON.stringify(err) });
                    }
                    res.set('Content-Type', 'text/html');
                    return res.status(200).send({ body: JSON.stringify(rest) });
                }
            );
        } else {
            res.send({ status: 500 });
        }
    }

    createContact(req, res, firstName, lastName, email, phone) {
        const session = this.authService.getSession(req, res);
        if (session === null) {
            return;
        }
        //console.log(firstName);
        const conn = new jsforce.Connection({
            accessToken: session.sfdcAccessToken,
            instanceUrl: session.sfdcInstanceUrl
        });
        if (lastName !== undefined) {
            conn.sobject('Contact').create(
                {
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    Phone: phone
                },
                function (err, rest) {
                    if (err || !rest.success) {
                        return res
                            .status(500)
                            .send({ body: JSON.stringify(err) });
                    }
                    res.set('Content-Type', 'text/html');
                    return res.status(200).send({ body: JSON.stringify(rest) });
                }
            );
        } else {
            res.send({ status: 500 });
        }
    }

    getAllAccount(req, res) {
        const session = this.authService.getSession(req, res);
        if (session === null) {
            return;
        }
        const conn = new jsforce.Connection({
            accessToken: session.sfdcAccessToken,
            instanceUrl: session.sfdcInstanceUrl
        });

        let soqlQuery = 'SELECT Id, Name, Industry, Phone FROM Account';

        this._runSoql(conn, soqlQuery)
            .then((records) => {
                // Format data
                const formattedData = records.map((sessionRecord) => {
                    let speakers = [];
                    return {
                        id: sessionRecord.Id,
                        name: sessionRecord.Name,
                        industry: sessionRecord.Industry,
                        phone: sessionRecord.Phone,
                        speakers
                    };
                });

                res.json({ data: formattedData });
            })
            .catch((error) => {
                this.logger.error(
                    'Failed to retrieve conference session(s)',
                    error
                );
                res.status(500).send(error);
            });
    }

    getAllContact(req, res) {
        const session = this.authService.getSession(req, res);
        if (session === null) {
            return;
        }
        const conn = new jsforce.Connection({
            accessToken: session.sfdcAccessToken,
            instanceUrl: session.sfdcInstanceUrl
        });

        let soqlQuery = 'SELECT Id, Name,Phone,Email FROM Contact';
        this._runSoql(conn, soqlQuery)
            .then((records) => {
                const formattedData = records.map((sessionRecord) => {
                    let speakers = [];
                    return {
                        id: sessionRecord.Id,
                        name: sessionRecord.Name,
                        speakers
                    };
                });

                res.json({ data: formattedData });
            })
            .catch((error) => {
                this.logger.error(
                    'Failed to retrieve conference session(s)',
                    error
                );
                res.status(500).send(error);
            });
    }
};
