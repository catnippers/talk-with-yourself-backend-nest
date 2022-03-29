# TALK WITH YOURSELF BACKEND

## REQUIRED ENVIRONMENT VARIABLES: 


## SETUP
1.) Create a .env file with the following environment variables
- DATABASE_URL
- encryptionSecret
- jwtSecret
- refreshTokenSecret
- apiEmail
- apiEmailPassword

2.) Run npm install

3.) Run the command "npx prisma generate" to generate the required prisma models

4.) Run the command "npx prisma migrate dev --name init" to run the db migration script

5.) Start the application