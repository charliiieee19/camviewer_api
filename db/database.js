const sql = require('mssql');

const sqlConfig = {
    user: 'sa',
    password: 'IpKh5u6LIwUVng5vzXI/Ew==',
    database: 'CampusSolution',
    server: '52.76.113.60',
    pool: {
        max: 100,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
}

const ExecuteQuery = async (query) => {
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query(query);
        return result.recordset;
    } catch (err) {
        return err;
    }
}

module.exports = { ExecuteQuery }