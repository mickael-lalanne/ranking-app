import { BrowserClerk } from '@clerk/clerk-react';
import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin';

// Add Cypress and app to global window for testing
declare global {
    interface Window {
        Clerk: BrowserClerk;
    }
}

export default defineConfig({
    e2e: {
        baseUrl: 'https://localhost:44412',
        setupNodeEvents(on, config) {
            getCompareSnapshotsPlugin(on, config);
        },
    },
    env: {
        user_email: 'mickael.lalanne03+clerk_test@gmail.com',
        user_password: 'clerk_e2e_password',
        clerk_origin: 'https://renewed-bobcat-2.accounts.dev',
        failSilently: false,
        ALWAYS_GENERATE_DIFF: false,
        ALLOW_VISUAL_REGRESSION_TO_FAIL: true,
        SNAPSHOT_BASE_DIRECTORY: 'cypress/screenshots/base',
        SNAPSHOT_DIFF_DIRECTORY: 'cypress/screenshots/diff',
        INTEGRATION_FOLDER: 'cypress\\e2e\\',
        type: 'actual',
    },
    chromeWebSecurity: true,
    screenshotsFolder: 'cypress/screenshots/actual',
    trashAssetsBeforeRuns: true,
});
