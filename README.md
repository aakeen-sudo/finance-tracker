# Student Finance Tracker

A simple app for students to track spending, set a budget cap, and search their records with regex. Built with plain HTML, CSS and JavaScript, with no frameworks.

Live site: https://aakeen-sudo.github.io/finance-tracker/
Repo: https://github.com/aakeen-sudo/finance-tracker
Demo video: ADD YOUR UNLISTED VIDEO LINK HERE

## Theme
Student Finance Tracker

## How to run
1. Clone the repo.
2. Open the folder in VS Code.
3. Right click index.html and choose Open with Live Server.
The app uses JavaScript modules, so it needs a server. Double clicking the file will not work.

## Features
Dashboard with total records, total spent, top category, a 7 day chart and a spending cap message.
Records table with live regex search, case toggle, highlighted matches and sorting by date, description and amount.
Add and edit form with regex validation and error messages while you type.
Delete with a confirm step.
Settings for a base currency, 2 other currencies with manual rates, and a spending cap.
JSON import with validation, JSON export, and sample data from seed.json.
All data saved in localStorage.

## Regex catalog
Description, no spaces at the start or end: `^\S(?:.*\S)?$`
Description, no double spaces: `/ {2,}/`
Amount: `^(0|[1-9]\d*)(\.\d{1,2})?$` (12.50 passes, 012 and 12.555 fail)
Date: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$` (2026-10-18 passes, 2026-13-01 fails)
Category: `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` (Fast-food passes, Food! fails)
Currency code: `^[A-Z]{3}$` (USD passes)
Advanced, back-reference: `\b(\w+)\s+\1\b` catches repeated words like "the the"
Advanced, negative lookahead: `^(?!0+(\.0+)?$)\d+(\.\d{1,6})?$` refuses an exchange rate of 0

Search examples: `coffee|tea` finds drinks, `^2026-10` finds October 2026 dates.

## Keyboard map
Tab and Shift Tab move between links, fields and buttons.
The first Tab shows a Skip to content link. Press Enter to jump to the main content.
Enter in a form saves it.
Enter or Space on a button presses it.

## Accessibility notes
Landmarks: header, nav, main, section and footer, with one h1 and an h2 for each section.
Every input has a label.
Visible focus outline on everything you can tab to.
Errors and status messages use role status, so screen readers read them.
The cap message is polite when under the cap and assertive when over.
The chart has a text description for screen readers.
Strong colour contrast, and animations turn off for people who prefer reduced motion.

## Tests
Open tests.html with Live Server, or at https://aakeen-sudo.github.io/finance-tracker/tests.html
It runs 15 checks on the validators and the safe regex compiler, and shows how many passed.

## AI use
I built this project with help from Claude, it gave me some of the codes and i typed everything.