import pg from 'pg';
const client = new pg.Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/coopelos?sslmode=disable' });
client.connect().then(() => { console.log('CONNECTED'); client.end(); }).catch(e => console.log('ERR:', e.message));
