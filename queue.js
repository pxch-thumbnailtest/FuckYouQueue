import express from 'express';
import axios from 'axios';
const app = express();
const webhook = process.env.WEBHOOK_URL;
const jobs = [];

app.get('/', (req, res) => {
        res.send('FuckYouQueue is running!');
    }
);

app.post('/scheduleJobs', (req, res) => {
    let newJobs = req.body.jobs;
    if (newJobs) {
        jobs.push(newJobs);
        doJobs();
    }
    res.status(200).send('Jobs scheduled');
});

const doJobs = async () => {
    let successfulJobs = [];
    let failedJobs = [];
    for(let job of jobs) {
        try {
            await axios.post(webhook, job);
            successfulJobs.push(job);
        }
        catch(e) {
            console.log('Failed to schedule job: ', job);
            console.log(e);
            failedJobs.push(job);
        }
    }
    console.log('Successful jobs: ', successfulJobs);
    console.log('Failed jobs: ', failedJobs);
}