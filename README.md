# Campus Cafeteria POS System

A desktop-friendly cafeteria point-of-sale web application for Scenario 1 of the IT 415 Midterm Practical Examination at Davao del Norte State College.

The system lets student assistants browse cafeteria products, add items to an order, adjust quantities, validate cash payment, calculate change, generate a digital receipt, and start a new transaction. It uses plain HTML5, CSS3, and JavaScript only.

## Scenario 1 Background

The campus cafeteria needs a simple computer-based POS system for everyday food and drink transactions. The cashier should be able to select menu items, review the order, accept cash payment, and issue a clear digital receipt without a database, login system, backend server, or payment gateway.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Git
- Browser-local execution by opening `index.html`

## Main Features

- Product display for all six required cafeteria items
- Add to Cart buttons for each product
- Cart rows combine duplicate products by increasing quantity
- Quantity increase and decrease controls
- Product removal from the cart
- Automatic subtotal, total, and change calculations
- Integer centavo calculations to avoid floating-point money errors
- Friendly empty-cart message
- Cash received input and validation
- Validation for blank, non-numeric, negative, insufficient, empty-cart, and invalid decimal payments
- Payment confirmation with transaction locking
- Digital receipt with reference number, date/time, item details, totals, cash, change, and thank-you message
- Print Receipt button
- New Transaction button that resets the system
- Keyboard support through normal button focus and Enter-to-confirm payment

## Product Price List

| Product | Price |
|---|---:|
| Rice (Plain) | ₱15.00 |
| Fried Chicken (1 pc) | ₱65.00 |
| Pork Adobo | ₱60.00 |
| Vegetable Side Dish | ₱35.00 |
| Iced Tea (cup) | ₱20.00 |
| Bottled Water | ₱20.00 |

## How to Run the Application

1. Open the `campus-cafeteria-pos` folder.
2. Double-click `index.html`, or open it from a browser using File > Open.
3. Use the product buttons to build an order.
4. Enter the customer's cash payment.
5. Click Confirm Payment to generate the receipt.
6. Click New Transaction for the next customer.

No installation, server, database, or internet connection is required to run the app locally.

## Transaction Flow

1. Browse Products
2. Add to Cart
3. Review Order
4. Enter Payment
5. Validate and Compute
6. Confirm Payment
7. Receipt / New Transaction

## Sample Transaction

| Product | Quantity | Subtotal |
|---|---:|---:|
| Fried Chicken (1 pc) | 2 | ₱130.00 |
| Rice (Plain) | 1 | ₱15.00 |
| Iced Tea (cup) | 1 | ₱20.00 |

Expected result:

- Total Amount: ₱165.00
- Cash Received: ₱200.00
- Change: ₱35.00

This sample transaction was verified with a headless Chrome browser test on October 13, 2026.

## Screenshots

Actual browser screenshots captured during testing are saved in `screenshots/`:

- `01-product-list.png`
- `02-cart-payment.png`
- `03-payment-receipt.png`

After pushing to GitHub, capture one additional screenshot of the public repository commit history for submission evidence.

## GitHub Repository Details

Repository name required by the examination:

```text
campus-cafeteria-pos
```

Current status:

- A local Git repository has been initialized.
- Three staged development commits are prepared locally.
- GitHub CLI (`gh`) is not installed in this environment, so the public GitHub repository could not be created or pushed from here.

To publish manually:

1. Create a new public GitHub repository named `campus-cafeteria-pos`.
2. In a terminal opened inside this project folder, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/campus-cafeteria-pos.git
git push -u origin main
```

After pushing, replace `YOUR_USERNAME` with the actual account name and record the public repository URL here:

```text
GitHub URL: To be added after publishing.
```

## Local File Structure

```text
campus-cafeteria-pos/
├── index.html
├── style.css
├── script.js
├── README.md
├── AI_USAGE.md
└── screenshots/
    ├── 01-product-list.png
    ├── 02-cart-payment.png
    └── 03-payment-receipt.png
```
