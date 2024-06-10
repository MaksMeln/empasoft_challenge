# Cypress Automation Project - Sheira

Welcome to the Cypress Automation Project for the Shady Meadows Bed & Breakfast website. This project contains automated tests to ensure the quality and reliability of the Shady Meadows Bed & Breakfast website using Cypress.

## Prerequisites

Before getting started, make sure you have the following software and tools installed on your local machine:

- **Node.js and npm:** If you don't have them already, you can download and install Node.js and npm from [nodejs.org](https://nodejs.org).

- **Cypress:** Install Cypress by following the instructions on the official website [cypress.io](https://www.cypress.io). Cypress is our primary testing tool for this project.

## Setup

Follow these steps to set up the project on your local machine:

1. **Clone the Repository:** Begin by cloning this repository to your local machine.

2. **Navigate to the Project Directory:** Using your terminal, navigate to the project directory that you just cloned.

3. **Install Project Dependencies:** Run the following command to install the required project dependencies using Yarn:

   ```shell
   yarn install
   ```

## Running the Tests

You can run Cypress tests with different configurations. Here are the steps:

- To open the Cypress Test Runner, run the following commands, use the following command (replace `{{device}}` with the device name (allowed values: `desktop`, `iphonese`, `surface`)):

  ```shell
  yarn cypress:open:{{device}} # Opens the Cypress Test Runner in the browser
  ```

- To run the tests with different viewports, use the following command (replace `{{device}}` with the device name (allowed values: `desktop`, `iphonese`, `surface`)):

  ```shell
  yarn cypress:run:{{device}} # Runs the tests with viewports
  ```

## Test Structure

Our tests are organized within the `cypress/e2e` directory

## Customization and Configuration

The `cypress/config` directory stores important configuration files for your Cypress tests:

- `cypress.js`: Contains configuration.

You can further customize the test behavior by modifying the `cypress.config.js` file.

If you need to create or modify custom commands, check the `support/commands.js` file.

The `cypress/fixtures` directory within this project contains mock data files used for simulating various scenarios in Cypress tests.

For more advanced customization options, explore the [Cypress documentation](https://docs.cypress.io).
