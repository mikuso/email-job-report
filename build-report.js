const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const juice = require('juice');
const uuid = require('uuid');
const humanizeDuration = require('humanize-duration');

const templatePath = path.resolve(__dirname, './template/email.html');
const EmailReportTemplate = Handlebars.compile(fs.readFileSync(templatePath, 'utf8'));

const countableElements = ['error','success','warning', 'info'];

module.exports = function(jobs) {
    if (!Array.isArray(jobs)) {
        jobs = [jobs];
    }

    jobs = jobs.map(job => {
        let j = {
            group           : job.group ? String(job.group) : '',
            name            : String(job.name),
            description     : job.description && String(job.description),
            info            : job.info,
            success         : job.success,
            warning         : job.warning,
            error           : job.error,
            icon            : 'success',
            duration        : job.duration
        };

        // ensure some elements are arrays or null, and count them
        for (let k of countableElements) {
            if (j[k] !== undefined && j[k] !== null) {
                if (!Array.isArray(j[k])) {
                    j[k] = [j[k]];
                }
            } else {
                j[k] = null;
            }
            let counter = k+'s';
            j[counter] = j[k] ? j[k].length : 0;
        }

        if (j.errors > 0) {
            j.icon = 'error';
        } else if (j.warnings > 0) {
            j.icon = 'warning';
        } else if (j.successs > 0) {
            j.icon = 'success';
        } else if (j.infos > 0) {
            j.icon = 'info';
        }

        if (j.duration !== null && j.duration !== undefined) {
            j.durationHuman = humanizeDuration(j.duration, {largest: 2, round: true});
        }

        return j;
    });

    let groupedJobs = jobs.reduce((groups, job) => {
        let exists = groups.find(g => g.group === job.group);
        if (!exists) {
            exists = {group: job.group, jobs: []};
            groups.push(exists);
        }
        exists.jobs.push(job);
        return groups;
    }, []);

    let totals = countableElements.map(el => {
        return {
            el: el,
            total: jobs.reduce((total, j) => total + ((j.icon===el)?1:0), 0)
        };
    }).reduce((totals, v) => {
        totals[v.el] = v.total;
        return totals;
    }, {});

    let images = {
        'success': {id: `${uuid.v4()}@email-job-report`, path: './template/success.png'},
        'warning': {id: `${uuid.v4()}@email-job-report`, path: './template/warning.png'},
        'error': {id: `${uuid.v4()}@email-job-report`, path: './template/error.png'},
        'info': {id: `${uuid.v4()}@email-job-report`, path: './template/info.png'},
        'clock': {id: `${uuid.v4()}@email-job-report`, path: './template/clock.png'}
    };

    jobs.forEach(j => j.iconcid = images[j.icon].id);

    let html = EmailReportTemplate({jobs, totals, images, groupedJobs});

    return {
        html: juice(html),
        attachments: Object.values(images).map(i => ({
            filename: path.basename(i.path),
            path: path.resolve(__dirname, i.path),
            cid: i.id,
            contentDisposition: 'inline'
        })),
        totals: totals,
        jobs: jobs,
        groupedJobs: groupedJobs
    };
};
