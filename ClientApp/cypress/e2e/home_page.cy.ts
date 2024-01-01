describe('Page', () => {
    beforeEach(() => {
        cy.session('signed-in', () => {
            cy.signIn();
        });
    });

    it('sucessfully loads', () => {
        cy.visit('/');

        // Bruce Wayne is the first and last name of the e2e user
        cy.contains('Welcome, Bruce Wayne');

        cy.wait(1000).then(() => {
            cy.compareSnapshot('home-page');
        });
    });

    it('logs out', () => {
        cy.visit('/');

        // Click on the logout button
        cy.get('[data-cy="logout-button"]').click();

        // User should be on the Clerk authentification page
        cy.origin(Cypress.env('clerk_origin'), () => {
            cy.window().should((window) =>
                expect(window.location.origin).to.eq(
                    Cypress.env('clerk_origin')
                )
            );
        });
    });
});
