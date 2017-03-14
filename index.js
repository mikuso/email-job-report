/**

    // Call with an array of job results as follows:

    emailJobReport({
        transport: {host: 'localhost'},
        from: 'Alerts <alerts@example.org>',
        to: ['panic@example.com'],
        name: 'Test Report',
        jobs: [
            {
                group       : 'General',
                name        : 'Do a thing with a thing',
                description : 'Involves doing things',
                success     : true,
                error       : null,
                result      : 'Thing done',
            },
            {
                group       : null,
                name        : 'Do another thing',
                description : 'Involves doing different things',
                success     : false,
                error       : Error("Failure"),
                result      : null,
            }
        ]
    });

    // Arguments:

    {
        transport   : Object                       // nodemailer transport options
        jobs        : Array                        // array of Jobs, defined below
        to          : Array|String                 // recipient email address(es)
        from        : String                       // sender email address
        name        : String       [optional]      // report name, appears in the subject line
    }

    // Job structure

    {
        group       : String       [optional]      // table group header name (to group job results)
        name        : String                       // name of the job
        description : String       [optional]      // a description of the job
        duration    : Number       [optional]      // job duration in milliseconds

        info        : Array|String [conditional]   // a string or array of strings with information
        success     : Array|String [conditional]   // a string or array of strings with success message(s)
        warning     : Array|String [conditional]   // a string or array of strings with warning(s)
        error       : Array|Error  [conditional]   // an unexpected error or array of errors
    }

*/

const send = require('./send-report');
const build = require('./build-report');

async function emailJobReport(options){
    return send(options, await build(options.jobs));
}
emailJobReport.JobEntry = require('./job-entry')

module.exports = emailJobReport;
