describe('Templates', () => {
    before(() => {
        cy.resetDB();
    });

    beforeEach(() => {
        cy.session('signed-in', () => {
            cy.signIn();
        });

        const CLOUDINARY_BASE_URL: string =
            'https://api.cloudinary.com/v1_1/ranking-app/image';

        // Fake the upload of an image to cloudinary
        cy.intercept(`${CLOUDINARY_BASE_URL}/upload`, (req) => {
            req.reply({
                public_id:
                    'user_2a0OKch2BahyWcB5z8IRDVIg65l/elements/sample-element',
            });
        });
        // Fake the delete of the sample image in cloudinary
        cy.intercept(`${CLOUDINARY_BASE_URL}/destroy`, (req) => {
            req.reply({ result: 'ok' });
        });

        cy.visit('/');

        // From the home page, click on the templates button
        cy.get('[data-cy="template-button"]').click();
    });

    const SAMPLE_TEMPLATE_NAME: string = 'My template';
    const SAMPLE_TEMPLATE_NAME_EDITED: string = 'My template edited';
    const SAMPLE_TIER_NAME_EDITED: string = 'My tier edited';

    it('checks empty view', () => {
        // No template should be created so an info message should be displayed
        cy.get('[data-cy="info-box"]').should('be.visible');

        cy.compareSnapshot('templates-empty-message');
    });

    it('creates a template', () => {
        // Click on the "Add template" button
        cy.get('[data-cy="header-buttons"]')
            .find('[data-cy="app-button"]')
            .click();

        // Use capture option because this bug: https://github.com/cypress-io/cypress/issues/2681
        cy.compareSnapshot('templates-builder-view', { capture: 'viewport' });

        // Save button should be disable because:
        // - template has no name
        // - template has no element
        cy.get('[data-cy="create-template"]')
            .get('[data-cy="app-button"]')
            .should('be.disabled');

        // The add tier button should not be displayed
        // Because we have 5 tiers by default, which is the limit
        cy.get('[data-cy="add-tier-button"]').should('not.exist');

        // Set a name
        cy.get('[data-cy="template-name"]').type(SAMPLE_TEMPLATE_NAME);

        // Add an element
        cy.addElement();

        // Now the save button should be enable
        cy.get('[data-cy="create-template"]')
            .get('[data-cy="app-button"]')
            .should('be.enabled');

        // Click on the save button
        cy.get('[data-cy="create-template"]').click();

        // The created template should now be displayed in the viewer
        cy.get('[data-cy="template-preview"]').contains(SAMPLE_TEMPLATE_NAME);
    });

    it('updates a template', () => {
        // Check the template previously created exists
        cy.contains(SAMPLE_TEMPLATE_NAME);

        cy.compareSnapshot('templates-viewer');

        // Edit it
        cy.get('[data-cy="template-preview"]').click();

        // Change its name
        cy.get('[data-cy="template-name"]')
            .find('input')
            .clear()
            .type(SAMPLE_TEMPLATE_NAME_EDITED);

        // Delete the number 3 tier
        cy.get('[data-cy="template-tier-in-editor"]').should('have.length', 5);
        cy.get('[data-cy="delete-tier-button"]').should('not.exist');
        cy.get('[data-cy="template-tier-in-editor"]')
            .eq(3)
            .trigger('mouseover');
        cy.get('[data-cy="delete-tier-button"]').should('be.visible');
        cy.get('[data-cy="delete-tier-button"]').click();
        cy.get('[data-cy="template-tier-in-editor"]').should('have.length', 4);
        // The add tier button should now be displayed
        cy.get('[data-cy="add-tier-button"]').should('be.visible');

        // Update a tier name
        cy.get('[data-cy="template-tier-in-editor"]')
            .eq(1)
            .find('[data-cy="tier-name-field"]')
            .find('input')
            .clear()
            .type(SAMPLE_TIER_NAME_EDITED);

        // Add a tier
        cy.get('[data-cy="add-tier-button"]').click();
        // Check that we can only set the rank 3 tier
        for (let i = 0; i < 5; i++) {
            cy.get('[data-cy="tier-rank-selector"]')
                .eq(i)
                .should(
                    'have.css',
                    'pointer-events',
                    i === 3 ? 'auto' : 'none'
                );
        }
        // Set its name
        cy.get('[data-cy="tier-edit-view-name-field"]').type(
            'a tmp tier added'
        );
        // Cancel the tier creation
        cy.get('[data-cy="cancel-tier-button"]').click();

        // Add an other element
        cy.addElement();

        // Click on the save button
        cy.get('[data-cy="create-template"]').click();

        // The template should have been edited in the viewer
        cy.get('[data-cy="template-preview"]').contains(
            SAMPLE_TEMPLATE_NAME_EDITED
        );
    });

    it('deletes a template', () => {
        // Check that the changes previously made have been applied on the server side
        cy.contains(SAMPLE_TEMPLATE_NAME_EDITED);
        cy.get('[data-cy="template-tier"]').should('have.length', 4);

        // Go to edit view
        cy.get('[data-cy="template-preview"]').click();

        // Click on the delete button
        cy.get('[data-cy="header-buttons"]')
            .find('[data-cy="delete-item-button"]')
            .click();

        // A confirmation dialog should be displayed
        cy.get('[data-cy="confirm-dialog"]').should('be.visible');

        // The confirm button should be disable
        // Because we have to type the template name
        cy.get('[data-cy="confirm-dialog-button"]').should('be.disabled');

        // Type the template name
        cy.get('[data-cy="confirm-dialog-name-field"]').type(
            SAMPLE_TEMPLATE_NAME_EDITED
        );

        // Now the confirm button should be enable, so click on it
        cy.get('[data-cy="confirm-dialog-button"]')
            .should('be.enabled')
            .click();

        // As there is no more template now, the info message should be displayed again
        cy.get('[data-cy="info-box"]').should('be.visible');
    });
});
