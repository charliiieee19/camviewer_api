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
            CONCAT(b.LastName,', ',b.FirstName,' ',b.MiddleName) AS [Name],
            CONVERT(varchar(50),b.BirthDate,23) AS [BirthDate],
            b.Gender
        FROM AWSLINK.Workfromhome.dbo.WorkfromhomeWebcam a
        LEFT JOIN EmpMaster_Copy b
            ON a.UserID = b.UserID
        WHERE (case when '${req.body.DeptCode}' = 'ALL' THEN 'ALL' ELSE b.DeptCode END) = '${req.body.DeptCode}'
        ORDER BY CONCAT(b.LastName,', ',b.FirstName,' ',b.MiddleName) ASC
    `);

    res.send(result);
});

app.post('/GetUserTK', async (req, res) => {
    const result = await ExecuteQuery(`
        SELECT 
            CONVERT(varchar(MAX),a.DateCreated,0) AS [DateCreated],
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
        SELECT DISTINCT 
            a.DeptCode,
            ISNULL(CONCAT(b.DeptDescription,' (',a.DeptCode,')'),CONCAT('(',a.DeptCode,')')) AS [DeptDescription]
        FROM EmpMaster_Copy a
        LEFT JOIN AWSLINK.SysParam.dbo.DeptProfile b
            ON a.DeptCode = b.DeptCode
        ORDER BY a.DeptCode ASC
    `);

    res.send(result);
});


app.listen(process.env.PORT || 3000);

//01250145
