/// <reference types="cypress" />

import { SignInResource } from '@clerk/types';
import compareSnapshotCommand from 'cypress-visual-regression/dist/command';

declare global {
    namespace Cypress {
        interface Chainable<Subject = any> {
            /**
             * Custom command to sign in with Clerk
             * @example cy.signIn()
             */
            signIn(): Chainable<null>;
            /**
             * Custom command to sign out
             * @example cy.signOut()
             */
            signOut(): Chainable<null>;
            /**
             * Custom command to clear all tierlists and templates of the e2e test user
             * @example cy.resetDB()
             */
            resetDB(): Chainable<null>;
            /**
             * Custom command to add an element in the Template Editor
             * @example cy.addElement()
             */
            addElement(): Chainable<null>;
            /**
             * Custom command to drag and drop
             * @example cy.dragAndDrop()
             */
            dragAndDrop(
                target: Cypress.Chainable<JQuery<HTMLElement>>,
                subject: Cypress.Chainable<JQuery<HTMLElement>>
            ): Chainable<null>;
        }
    }
}

// Cf https://clerk.com/docs/testing/cypress#sign-in-helper
Cypress.Commands.add('signIn', () => {
    cy.visit('/');

    cy.origin(Cypress.env('clerk_origin'), () => {
        cy.window()
            .should((window) => {
                expect(window).to.not.have.property(`Clerk`, undefined);
                expect(window.Clerk.isReady()).to.eq(true);
            })
            .then((window) => {
                if (window.Clerk && window.Clerk.client) {
                    cy.clearCookies();

                    const sinInWithClerk = new Promise<SignInResource>(
                        (resolve, reject) => {
                            window.Clerk.client!.signIn.create({
                                identifier: Cypress.env('clerk_user_email'),
                                password: Cypress.env('clerk_user_password'),
                            })
                                .then((res: SignInResource) => {
                                    resolve(res);
                                })
                                .catch((err) => reject(err));
                        }
                    );

                    const setSessionActive = (
                        res: SignInResource
                    ): Promise<void> => {
                        return new Promise((resolve, reject) => {
                            window.Clerk.setActive({
                                session: res.createdSessionId,
                            })
                                .then(() => resolve())
                                .catch((err) => reject(err));
                        });
                    };

                    cy.wrap(sinInWithClerk).then((res) => {
                        cy.wrap(setSessionActive(res as SignInResource));
                        cy.log('Finished Signing in.');
                    });
                }
            });
    });
});

Cypress.Commands.add('signOut', () => {
    cy.log(`sign out by clearing all cookies.`);
    cy.clearCookies({ domain: undefined });
});

Cypress.Commands.add('resetDB', () => {
    cy.log(`Reset the database...`);
    cy.request('DELETE', '/template/deleteE2E');
});

Cypress.Commands.add('addElement', () => {
    // Add an element
    cy.get('[data-cy="add-element-input"]').selectFile(
        'cypress/assets/element_sample.jpg',
        { force: true }
    );
    // Check the image has been resized
    cy.get('[data-cy="element-preview-img"]').should(($img) => {
        expect(($img[0] as HTMLImageElement).naturalHeight).to.be.lessThan(151);
        expect(($img[0] as HTMLImageElement).naturalWidth).to.be.lessThan(151);
    });
    // Click on create element button
    cy.get('[data-cy="create-element-button"]').click();
});

compareSnapshotCommand();

// Based on https://stackoverflow.com/a/71350094/22930358
Cypress.Commands.add(
    'dragAndDrop',
    (
        target: Cypress.Chainable<JQuery<HTMLElement>>,
        subject: Cypress.Chainable<JQuery<HTMLElement>>
    ) => {
        const BUTTON_INDEX = 0;
        const SLOPPY_CLICK_THRESHOLD = 10;
        target.then(($target) => {
            let coordsDrop = $target[0].getBoundingClientRect();
            subject.then((subject) => {
                const coordsDrag = subject[0].getBoundingClientRect();
                cy.wrap(subject)
                    .trigger('mousedown', {
                        button: BUTTON_INDEX,
                        clientX: coordsDrag.x,
                        clientY: coordsDrag.y,
                        force: true,
                    })
                    .trigger('mousemove', {
                        button: BUTTON_INDEX,
                        clientX: coordsDrag.x + SLOPPY_CLICK_THRESHOLD,
                        clientY: coordsDrag.y,
                        force: true,
                    });
                cy.get('body')
                    .trigger('mousemove', {
                        button: BUTTON_INDEX,
                        clientX: coordsDrop.x,
                        clientY: coordsDrop.y,
                        force: true,
                    })
                    .trigger('mouseup');
            });
        });
    }
);
