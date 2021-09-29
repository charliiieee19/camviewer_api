const express = require('express');
const cors = require('cors');
const app = express();

var fs = require('fs');
var https = require('https');
const { ExecuteQuery } = require('./db/database');

app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(cors());

app.post('/GetUsers', async (req, res) => {
    const result = await ExecuteQuery(`
        SELECT DISTINCT
            a.UserID,
            CONCAT(b.LastName,', ',b.FirstName,' ',b.MiddleName) AS [Name]
        FROM AWSLINK.Workfromhome.dbo.WorkfromhomeWebcam a
        LEFT JOIN EmpMaster_Copy b
        ON a.UserID = b.UserID;
    `);

    res.send(result);
});

app.post('/GetUserTK', async (req, res) => {
    const result = await ExecuteQuery(`
        SELECT 
            a.DateCreated,
            a.TranID,
            a.UserID,
            a.TrackID
        FROM AWSLINK.Workfromhome.dbo.WorkfromhomeWebcam a
        LEFT JOIN EmpMaster_Copy b
        ON a.UserID = b.UserID
        WHERE b.UserID = '${req.body.UserID}'
        AND CONVERT(varchar,a.DateCreated,23) = '${req.body.Date}'
    `);

    res.send(result);
});

app.post('/GetUserWebCam', async (req, res) => {
    const result = await ExecuteQuery(`
        SELECT a.FileData
        FROM AWSLINK.Workfromhome.dbo.WorkfromhomeWebcam a
        LEFT JOIN EmpMaster_Copy b
        ON a.UserID = b.UserID
        WHERE a.TrackID = '${req.body.TrackID}'
    `);

    res.send(result);
});

app.get('/GetDepartments', async (req, res) => {
    const result = await ExecuteQuery(`
        SELECT DISTINCT DeptCode FROM EmpMaster_Copy ORDER BY DeptCode ASC
    `);

    res.send(result);
});

https.createServer({
    key: fs.readFileSync('cert/server.key'),
    cert: fs.readFileSync('cert/server.cert')
}, app).listen(process.env.PORT || 3000);

//01250145
