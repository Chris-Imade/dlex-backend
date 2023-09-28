# Dlex-backend

![Dlex Insight](./assets/images/dlex.png)

## Introduction

Welcome to the Dlex project, an open-source initiative aimed at creating a versatile application for managing the affairs of small to medium-sized organizations. Dlex is designed to reduce fraud within an organization and create a secure and efficient system for managing various aspects, from products to transactions and more.

## Technologies Used

Dlex is built using a stack of modern technologies:

- **Electron:** For the multi-platform desktop application frontend.
- **Node.js:** For the backend server.
- **Express:** As the web application framework.
- **MongoDB:** As the database system.

## Key Features

### Offline and Auto-Syncing

One of Dlex's standout features is its ability to work seamlessly both online and offline. When connected to the internet, data is automatically synchronized with the central server. Users can continue working even when offline, and once they're back online, Dlex automatically syncs their changes, ensuring data integrity and accessibility at all times.

### Automated Reports in Excel Format

Dlex simplifies reporting by generating automated reports in Excel (.xls) format. These reports are sent directly to the user's email, making it easy to access and share critical information. Whether it's transaction summaries, product catalogs, or financial statements, Dlex streamlines the reporting process, saving time and effort for users.

## How to Contribute

Dlex is an open-source project, and we welcome contributions from developers with JavaScript skills. If you're interested in getting involved, here's how you can contribute:

1. **Fork the Repository:** Start by forking the Dlex repository on GitHub [here](https://github.com/Chris-Imade/dlex-backend).

2. **Clone the Repository:** Clone your forked repository to your local development environment using the following command:

*git clone https://github.com/Chris-Imade/dlex-backend.git*


3. **Set Up the Development Environment:** Follow the project's documentation to set up your development environment. Ensure you have all the required dependencies installed.

4. **Pick an Issue:** Visit the project's [issue tracker](https://github.com/Chris-Imade/dlex-backend/issues) to find tasks and issues you'd like to work on. You can filter by difficulty or type to find tasks that match your skills and interests.

5. **Create a Branch:** Create a new branch for your work based on the latest `main` branch. Use a descriptive name that relates to the issue you're addressing.

*git checkout -b feature/your-feature-name*

6. **Code and Test:** Write your code following the project's coding standards and guidelines. Ensure your changes are well-tested.

7. **Submit a Pull Request (PR):** Once you're satisfied with your changes, submit a pull request to the Dlex repository. Be sure to include a clear and concise description of your changes and reference the issue you're addressing.

8. **Code Review:** Your PR will undergo code review by project maintainers. Be prepared to make necessary changes based on feedback.

9. **Merge and Celebrate:** After your PR is approved, it will be merged into the main project. Congratulations, you've contributed to Dlex!

## Get Started

Ready to get started? Check out the Dlex repository [here](https://github.com/Chris-Imade/dlex-backend) and join us in building a safer and more efficient way for organizations to manage their affairs.

## Testing and Feedback

We encourage testers to try out the Dlex software and provide valuable feedback. If you encounter any issues, have suggestions for improvements, or want to share your experience, please:

- **Create an Issue:** Visit the project's [issue tracker](https://github.com/Chris-Imade/dlex-backend/issues) and create an issue describing the problem or suggestion you have. Your feedback is invaluable in making Dlex even better!

We appreciate your support in making Dlex a reliable and user-friendly solution.

--- **Routes**

--- **Products Routes**

- It is worth noting that most endpoints requires the userId to be passed on as a query to the path, it's also worth noting that each request except the authentication requests are to have an Authoriazation header with the value of type {{Token actual_token}}

- **Post: `{{ _.baseURL }}/api/v1/reports/sendTransaction?userId={{userId}}`**
**This endpoint would fetch all the transactions belonging to the current user and convert the data to a CSV file after which the file is sent the the user's registered mail.**

- **Post: `{{ _.baseURL }}/api/v1/products?userId={{userId}}`**
**This endpoint creates a new product from the JSON body passed on to the req object. It also returns the new product created.**

- **Get: `{{ _.baseURL }}/api/v1/products?userId={{userId}}`**
- **This endpoint returns all the products the user has created it take's no parameter or parses no body.**

- **Get: `{{ _.baseURL }}/api/v1/products/{{productId}}?userId={{userId}}` This endpoint returns the single product of which its id is being passed on as a parameter in the path.**

- **Put: `{{ _.baseURL }}/api/v1/products/{{productId}}?userId={{userId}}` This endpoint updates the product of which it's id is passed as a parameter, it takes in the update as a json object and returns the updated product.**

- **Delete: `{{ _.baseURL }}/api/v1/products/{{productId}}?userId={{userId}}` This endpoints does a series of things. When a product is deleted, the email of the user extracted from the user's token in the Authorization and then used alongside nodemailer and some other transparent factors to update the user/admin/owner the certain products have been deleted.**

- **It is also worth noting that images used for the products are stored as base64 strings and when the user makes a delete requests, the images are uploaded to cloudinary from where the preview images are used as thumbnails for the mail.**

--- **Transaction Routes**


- **Post: `{{ _.baseURL }}/api/v1/transaction?userId={{userId}}`**
**This endpoint creates a new transaction from the JSON body passed on to the req object. It also returns the new transaction created.**

- **Get: `{{ _.baseURL }}/api/v1/transaction?userId={{userId}}`**
- **This endpoint returns all the transaction the user has created it take's no parameter or parses no body.**

- **Get: `{{ _.baseURL }}/api/v1/transaction/{{transactionId}}?userId={{userId}}` This endpoint returns the single transaction of which its id is being passed on as a parameter in the path.**

- **Put: `{{ _.baseURL }}/api/v1/transaction/{{transactionId}}?userId={{userId}}` This endpoint updates the transaction of which it's id is passed as a parameter, it takes in the update as a json object and returns the updated transaction.**

- **Delete: `{{ _.baseURL }}/api/v1/transaction/{{transactionId}}?userId={{userId}}` This simply filters out the transaction based on the id passed and then deletes it.**


- **For the users route:**
- **Get: `{{ _.baseURL }}/api/v1/users/user-id:`**
**This route uses the Authorization header to get the user's id and send back as a response, can come in handy when you need to know the user's id in other to make other requests.**

- **Put: `{{ _.baseURL }}/api/v1/users/user/{{userId}}` **chatgpt - only - you should know how to describe this by now save me the time**

- **Get: `{{ _.baseURL }}/api/v1/users/user/{{userId}}`:**
**Gets a single user by user ID.**

**For Authentication:**
**Post: `{{ _.baseURL }}/api/v1/auth/register`**
--- **This route takes some basic information about the user in this format:**
```javascript
{
	"email": string,
	"username": string,
	"password": string,
	"isAdmin": boolean
}
```

**it returns:**
```javascript
{
	"message": "Success",
	"status": 201,
	"detail": "User successfully created"
} 
```
--- **when successful and an error when not. Errors may vary depending on the kind of issues to be addressed.**

- **Post: {{ _.baseURL }}/api/v1/auth/login**
--- **This endpoint expects as minimal as:**
```javascript
{
	"username": string,
	"password": string
}
```

--- **and returns and example response:**
```javascript
{
	"message": "Success",
	"status": 200,
	"details": "User successfully logged in 😇",
	"token": "**chatgpt - only - jwt token sample here**"
}
```

--- **when everything works fine. And a corresponding error when things goes sideways.**