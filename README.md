# MHS Grade

MHS Grade is a chrome extension that allows students to track their performance in a more organized and visually appealing way, predict future trends of a student's grades, and provides goal-setting features.

## Features

- **Performance Tracking & Visualization:** Simple and interactive interface to track a student's grades.
- **GPA Calculation** Calculates weighted and unweighted GPA automatically.
- **Grade Prediction** Predicts grades using linear regression, a simple predictive algorithm based on past entries.
- **Automatic Grade Input** Crawls the progress page in myMHS for automatic grade input.
- **Goal Setting** Set and track academic goals such as GPA targets and subject-specific goals.

## Setting Up

1. Clone the repository

   ```bash
   git clone https://github.com/Alwaysprogram/MHS-Grade.git
   ```

2. Install the dependencies

   ```bash
    npm install
    ```

3. Build the project or run dev

   ```bash
   npm run build
   ```

   or

   ```bash
   npm run dev
   ```

  > Note: `npm run dev` will not minify the code

4. Load the extension

- Open Chrome
- Go to `chrome://extensions/`
- Enable Developer Mode
- Click on `Load unpacked`
- Select the `dist` folder
- The extension should now be loaded

## Development

This project uses ES-Lint and Prettier for code formatting. Make sure to run `npm run lint` before pushing any changes.

> Note: You can also use the ESLint and Prettier extensions in your editor to automatically format the code.

## Technologies

- HTML/CSS/JS
- TailwindCSS

## To-do

- [ ] store the data to chrome.storage.local
  - [ ] store subject colors

- [ ] popout button: pop out into another page
  - [ ] make another html(similar to popup.html)
  - [ ] change opennewtab to just open html file
- [ ] filter out repeated data
- [ ] button to refetch data (refresh button)
- [ ] add a loading screen while fetching data from API
- [ ] config button(settings/preferences)
  - [ ] subject colors
    - [ ] color selector
  - [ ] chart type
- [ ] report problem button
  - [ ] google form
- [ ] add data analysis (analytical computing)
- [ ] talk to Mr. Almena for advertising

- [ ] change to tsc maybe
