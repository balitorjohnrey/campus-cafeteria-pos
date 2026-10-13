# AI-Assisted Development Documentation

This document records the AI assistance used while creating the Campus Cafeteria POS System. Student evaluation fields are intentionally left for the student to complete after reviewing and testing the final application.

## AI Interaction 1 — Initial Development

### Exact Prompt Used

```text
Act as a professional full-stack developer and software engineer. Help me develop a complete, functional, modern, and beginner-friendly Campus Cafeteria Point-of-Sale (POS) System based on Scenario 1 of my IT 415 Midterm Practical Examination at Davao del Norte State College.

I want you to create the actual working application, not just a development plan or pseudocode.

Use plain HTML, CSS, and JavaScript without complicated frameworks. Do not require a database, backend server, authentication, or payment gateway.

The application should run locally by opening index.html in a browser.

Start building the project immediately.
```

### Purpose of the Prompt

To generate the initial project structure, user interface, product data, and core POS behavior using beginner-friendly plain HTML, CSS, and JavaScript.

### Summary of AI Response

Codex created the local project folder, initialized the HTML/CSS/JavaScript files, designed a desktop-friendly POS dashboard, added the required product array, rendered all menu products, and implemented the cart, payment, receipt, and reset workflows.

### Student Evaluation

To be completed by the student after reviewing the code and running the application.

### Modifications Made

Codex continued development in stages after the initial interface, adding cart behavior, payment calculation, validation, receipt generation, screenshots, and documentation. Student modifications, if any, should be added here after review.

## AI Interaction 2 — Debugging or Improvements

### Exact Prompt Used

```text
Test this specific transaction from the examination instructions:

Fried Chicken (1 pc) x 2 = ₱130.00
Rice (Plain) x 1 = ₱15.00
Iced Tea (cup) x 1 = ₱20.00

Expected results:
- Total Amount: ₱165.00
- Cash Received: ₱200.00
- Change: ₱35.00

Also test exact payment, insufficient payment, blank payment, negative payment, quantity changes, product removal, and resetting for another transaction.

Fix problems you discover before finalizing the project.
```

### Purpose of the Prompt

To verify the required transaction flow, confirm calculation accuracy, check validation cases, and improve any UI or behavior issues discovered during testing.

### Summary of AI Response

Codex ran an automated headless Chrome test against the actual `index.html` file. The test verified product display, cart totals, the sample transaction, receipt values, exact payment, insufficient payment, blank payment, negative payment, invalid decimal validation, product removal, transaction locking, and reset behavior. Codex also captured real screenshots in the `screenshots/` folder.

### Student Evaluation

To be completed by the student after independently testing the application and reviewing the generated screenshots.

### Modifications Made

During visual screenshot review, Codex found that the cart remove buttons were clipped in the right panel. Codex adjusted the cart grid column widths and reran the automated browser test successfully.
