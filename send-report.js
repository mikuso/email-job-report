const Promise = require('bluebird');
const nodemailer = require('nodemailer');

module.exports = async function(options, report) {
    const mailTransport = Promise.promisifyAll(nodemailer.createTransport(options.transport));

    let totals = [
        [report.totals.success, 'successful', 'successful'],
        [report.totals.warning, 'warnings', 'warning'],
        [report.totals.error, 'errors', 'error'],
        [report.totals.info, 'infos', 'info'],
    ].filter(t => t[0] > 0).map(t => `${t[0]} ${t[(t[0]===1)?2:1]}`);

    await mailTransport.sendMailAsync({
        from: options.from || 'noreply@email-job-report',
        to: options.to,
        subject: `${options.name || 'Report'} - ${totals.join(', ')}`,
        html: report.html,
        attachments: report.attachments
    });
};
