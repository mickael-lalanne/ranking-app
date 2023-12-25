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
                                identifier: Cypress.env('user_email'),
                                password: Cypress.env('user_password'),
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

compareSnapshotCommand();
