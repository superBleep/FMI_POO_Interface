# Installation guide
## Software requirements
- Node.js (+ npm)
- A relational database management system (DBMS)
- Redis

## Startup
- Run `npm i` server-side/client-side to download and install the required packages
- Enable the Redis service (temporarily): `sudo service redis-server start`
- Start Redis: `redis-cli`
- Start the service of your DBMS
- Populate the database with the `fmi_app_db.sql` script
- Change the `.env` sample according to your configuration
	- Default backend port: `5000`
	- Default frontend port: `5173`
    - Default Redis port: `6379`
- Start the backend server: `nodemon`
  - Alternate mock server can be found in `src/json-server`
- Start the frontend server: `npm run dev`

## Database schema
![Database schema](https://github.com/Nubaz/FMI_POO_Interface/blob/StudentIndexFixes/DB_Diagram.png?raw=true)