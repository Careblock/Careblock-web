# CareBlock Web Application

## Introduction

Careblock is an innovative healthcare application leveraging the security and transparency of the Cardano blockchain. Built with ASP.NET 6.0, Careblock aims to enhance healthcare data management by providing a decentralized, secure, and efficient platform for healthcare providers and patients.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Contributing](#contributing)
5. [License](#license)

## Installation

### Prerequisites

- React 18.2.0
- Redux 5.0.1
- Vite 5.2.0

## Features

- **Decentralized Data Management**: Store healthcare data (EHR) securely on the Cardano blockchain.
- **Patient and Provider Portals**: Separate interfaces for patients and healthcare providers with custome and management features for each healthcare provider.
- **Secure Access**: Ensure data privacy and integrity using blockchain technology.
- **Scalability**: Built with ASP.NET 6.0 for high performance and scalability.

## Project Structure

The project is structured into several key directories:

- **src/**: The source directory contains all the application code, including components, pages, and utilities.
  
  - **components/**: This directory houses reusable UI components, such as buttons, input fields, and modals, that can be used throughout the application to maintain consistency and reduce code duplication.

  - **pages/**: Contains the application's pages, organized by their functional areas. Each page directory may include its specific components, styles, and tests.

    - **authentication/**: Focuses on user authentication, including login, registration, and password recovery.
      
      - **login/**: Implements the login functionality, allowing existing users to access their accounts.
      - **register/**: Contains the registration logic and UI for new users, supporting different roles with role-specific fields.
      - **recover/**: Provides users with the ability to recover their accounts, typically through password reset mechanisms.
    
    - **patient/**: Dedicated to patient-specific functionalities.
      
      - **patient-info/**: Allows patients to view and edit their personal and medical information, ensuring their profiles are up-to-date.

  - **services/**: Includes the application's service layer, where the business logic resides. This might involve communication with backend APIs, handling authentication, and managing state.

  - **utils/**: Utility functions and helpers that provide common functionality across the application, such as date formatting, validation functions, and more.

- **public/**: Contains static assets like images, fonts, and the `index.html` file. These assets are publicly accessible and not processed by Webpack.

- **config/**: Configuration files for various environments (development, production, etc.).

## Getting Started

To get started with the CareBlock Web Application, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone [https://github.com/Careblock/careblock.git](https://github.com/Careblock/Careblock-service.git)
    cd careblock-web
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

    or if you use yarn:
    ```bash
    yarn install
    ```

3. **Start the development server**:
    ```bash
    npm run dev
    ```

    or if you use yarn:
    ```bash
    yarn dev
    ```

4. **Open the application**:
    - Open your browser and navigate to `http://localhost:3000`.

## Contributing

We welcome contributions to Careblock. To contribute:

1. **Fork the repository**:
    - Click the "Fork" button on the top right corner of the repository page on GitHub.

2. **Create a feature branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```

3. **Commit your changes**:
    - Make your changes and commit them with a descriptive message.
    ```bash
    git add .
    git commit -m "Add a detailed description of your changes"
    ```

4. **Push the branch**:
    ```bash
    git push origin feature/your-feature-name
    ```

5. **Open a pull request**:
    - Go to your forked repository on GitHub.
    - Click on the "Compare & pull request" button.
    - Provide a detailed description of your changes and submit the pull request.

## License

This project is licensed under the MIT License.

---

For any questions or support, please contact [careblock.io@gmail.com](mailto:careblock.io@gmail.com).
