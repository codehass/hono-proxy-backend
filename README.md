# hono-proxy-backend

## Table of Contents

- [Project Description](#project-description)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Running the Project Locally](#running-the-project-locally)
- [API Endpoints](#api-endpoints)
- [Results](#api-endpoints-results)
- [License](#license)

## Project Description

This repository provides endpoints to interact with an external API for authentication purposes. It includes the following functionalities:

- Login: Authenticates users and retrieves access tokens.
- Logout: Logs users out and invalidates their sessions.
- AutoLogin: Automatically logs users in based on stored credentials.
- Token Info: Retrieves information about a given JWT token.

## Technologies Used

- Hono
- Node.js
- TypeScript
- AWS Lambda

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/codehass/hono-proxy-backend.git
    
    cd hono-proxy-backend.
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Running the Project Locally

1. Start the development server:

    ```bash
    npm run dev
    ```

2. The backend should now be running on `http://localhost:3000` (or the port specified in the console).

## API Endpoints

- **GET /login** - User login
- **POST /autoLogin** - User autoLogin
- **POST /logout** - User logout
- **POST /token_info** - User token info

## Results
 - login
![Screenshot of Backend](/src/imgs/login.png)
 - autoLogin
 ![Screenshot of Backend](/src/imgs/autologin.png)
 - logout
 ![Screenshot of Backend](/src/imgs/logout.png)
 - token_info
 ![Screenshot of Backend](/src/imgs/tokenInfo.png)
 
## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

