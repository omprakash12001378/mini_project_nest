# MySQL Setup Guide

This guide provides multiple options for setting up MySQL for the Pets Management API.

## Option 1: Docker (Recommended)

If you have Docker installed, this is the easiest method:

```bash
docker compose up -d
```

This will start MySQL 8.0 with:
- **Host**: localhost
- **Port**: 3306
- **Database**: pets_shelter
- **Username**: pets_user
- **Password**: password123
- **Root Password**: root123

To stop MySQL:
```bash
docker compose down
```

To stop and remove all data:
```bash
docker compose down -v
```

## Option 2: Local MySQL Installation

### Windows

1. Download MySQL Community Server from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
2. Run the installer
3. Choose "Developer Default" or "Server only"
4. Set root password during installation
5. Complete the installation

**Create Database and User:**

Open MySQL Command Line Client or MySQL Workbench and run:

```sql
CREATE DATABASE pets_shelter;
CREATE USER 'pets_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON pets_shelter.* TO 'pets_user'@'localhost';
FLUSH PRIVILEGES;
```

### macOS

Using Homebrew:

```bash
brew install mysql
brew services start mysql
```

**Secure Installation:**
```bash
mysql_secure_installation
```

**Create Database and User:**
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE pets_shelter;
CREATE USER 'pets_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON pets_shelter.* TO 'pets_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

**Create Database and User:**
```bash
sudo mysql
```

Then run:
```sql
CREATE DATABASE pets_shelter;
CREATE USER 'pets_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON pets_shelter.* TO 'pets_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Option 3: Cloud MySQL (PlanetScale, AWS RDS, etc.)

### PlanetScale (Free Tier)

1. Go to [PlanetScale](https://planetscale.com/)
2. Create a free account
3. Create a new database
4. Get connection string
5. Update `src/app.module.ts` with your connection details

### AWS RDS

1. Go to AWS RDS Console
2. Create a MySQL database instance
3. Configure security groups to allow your IP
4. Get endpoint and credentials
5. Update `src/app.module.ts`

## Verifying MySQL Connection

### For Docker:
```bash
docker ps
```

You should see a container named `pets-mysql` running.

### For Local Installation:

**Windows (PowerShell):**
```powershell
Get-Service MySQL*
```

**macOS:**
```bash
brew services list | grep mysql
```

**Linux:**
```bash
sudo systemctl status mysql
```

## Testing the Connection

You can test the MySQL connection using the MySQL client:

### Docker:
```bash
docker exec -it pets-mysql mysql -u pets_user -ppassword123 pets_shelter
```

### Local Installation:
```bash
mysql -u pets_user -ppassword123 pets_shelter
```

Once connected, you can run:
```sql
SHOW TABLES;
```

After starting your NestJS app, you should see a `pets` table created automatically (thanks to TypeORM's `synchronize: true`).

## Using MySQL Workbench (GUI)

MySQL Workbench is a great GUI tool for managing MySQL:

1. Download [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
2. Create a new connection:
   - **Connection Name**: Pets Shelter
   - **Hostname**: localhost
   - **Port**: 3306
   - **Username**: pets_user
   - **Password**: password123
   - **Default Schema**: pets_shelter

## Database Schema

TypeORM will automatically create this table structure:

```sql
CREATE TABLE `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `species` enum('dog','cat','bird') NOT NULL,
  `age` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Troubleshooting

### "Access denied for user" error
- Verify username and password are correct
- Make sure the user has been granted privileges
- Try connecting with root user first

### "Can't connect to MySQL server" error
- Make sure MySQL is running
- Check if port 3306 is available
- Verify firewall settings

### "Unknown database" error
- Make sure you created the `pets_shelter` database
- Check database name spelling

### "Client does not support authentication protocol" error
This happens with older MySQL clients. Run:
```sql
ALTER USER 'pets_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password123';
FLUSH PRIVILEGES;
```

### TypeORM Connection Error
If you see connection errors in your NestJS app:
1. Verify MySQL is running
2. Check credentials in `src/app.module.ts`
3. Ensure database exists
4. Check network connectivity

## Environment Variables (Optional)

For better security, you can use environment variables. Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=pets_user
DB_PASSWORD=password123
DB_DATABASE=pets_shelter
```

Then install:
```bash
npm install @nestjs/config
```

And update `app.module.ts` to use ConfigModule.

## Next Steps

After setting up MySQL, start the application:

```bash
npm run start:dev
```

You should see in the console:
```
[Nest] INFO [TypeOrmModule] TypeOrmModule dependencies initialized
```

The `pets` table will be created automatically. Then test the API using the examples in TESTING_GUIDE.md.

## Useful MySQL Commands

```sql
-- View all pets
SELECT * FROM pets;

-- Count pets by species
SELECT species, COUNT(*) as count FROM pets GROUP BY species;

-- Find oldest pets
SELECT * FROM pets ORDER BY age DESC LIMIT 5;

-- Delete all pets (careful!)
DELETE FROM pets;

-- Reset auto-increment
ALTER TABLE pets AUTO_INCREMENT = 1;
```
