describe('Tierlists with no templates', () => {
    before(() => {
        cy.resetDB();
    });

    beforeEach(() => {
        cy.session('signed-in', () => {
            cy.signIn();
        });

        cy.visit('/');

        // From the home page, click on the tierlists button
        cy.get('[data-cy="tierlist-button"]').click();
    });

    it('checks empty view', () => {
        // As there is no template created, the add tierlist button should be disable
        cy.get('[data-cy="header-buttons"]')
            .find('[data-cy="app-button"]')
            .should('be.disabled');
        // And an info message should be displayed
        cy.get('[data-cy="info-box"]').should('be.visible');

        cy.compareSnapshot('tierlists-empty-message');
    });
});

describe('Tierlists with mocked templates', () => {
    before(() => {
        cy.resetDB();
    });

    beforeEach(() => {
        cy.session('signed-in', () => {
            cy.signIn();
        });

        // // Fake the server response to have a sample template
        cy.intercept('GET', '/template*', { fixture: 'template_sample.json' });

        cy.visit('/');

        // From the home page, click on the tierlists button
        cy.get('[data-cy="tierlist-button"]').click();
    });

    const SAMPLE_TIERLIST_NAME = 'My tierlist';
    const SAMPLE_TIERLIST_NAME_EDITED: string = 'My tierlist edited';

    it('creates a tierlist', () => {
        // As the server now returns a template, the add tierlist button should be enable
        cy.get('[data-cy="header-buttons"]')
            .find('[data-cy="app-button"]')
            .should('be.enabled')
            // Go to the tierlist builder
            .click();

        // An info box should be displayed that says a template need to be selected
        cy.get('[data-cy="info-box"]').should('be.visible');

        cy.compareSnapshot('tierlists-creation-without-template');

        // Select a template
        cy.get('[data-cy="template-selector"]')
            .click()
            .get('[data-cy="template-selector-item"]')
            .click();

        // The ranking grid should now be displayed
        cy.get('[data-cy="ranking-grid"]').should('be.visible');
        cy.compareSnapshot('tierlists-creation-with-template', {
            capture: 'viewport',
        });

        // The create button should be disable because no name is setted
        cy.get('[data-cy="create-tierlist"]')
            .get('[data-cy="app-button"]')
            .should('be.disabled');

        // Move all elements to the left of the grid
        _dragElementToCell(0, 0, 0);
        _dragElementToCell(0, 1, 0);
        _dragElementToCell(0, 2, 0);
        cy.scrollTo('bottom');
        _dragElementToCell(0, 3, 0);
        cy.scrollTo('bottom');
        _dragElementToCell(0, 4, 0);

        // Set the tier name
        cy.get('[data-cy="tierlist-name-field"]').type(SAMPLE_TIERLIST_NAME);

        cy.compareSnapshot('tierlists-ranked-elements', {
            capture: 'viewport',
        });

        // Click on the save button
        cy.get('[data-cy="create-tierlist"]').click();

        // The created tierlist should now be displayed in the viewer
        cy.get('[data-cy="tierlist-preview"]').contains(SAMPLE_TIERLIST_NAME);
    });

    it('updates a tierlist', () => {
        // Check the tierlist previously created exists
        cy.contains(SAMPLE_TIERLIST_NAME);

        cy.compareSnapshot('tierlists-viewer');

        // Edit it
        cy.get('[data-cy="tierlist-preview"]').click();

        // Change its name
        cy.get('[data-cy="tierlist-name-field"]')
            .find('input')
            .clear()
            .type(SAMPLE_TIERLIST_NAME_EDITED);

        // Move the first element to the right of the grid
        _changeElementRank(0, 0, 0, 4);
        // Unrank all other elements
        _unrankElement(1, 0);
        _unrankElement(2, 0);
        _unrankElement(3, 0);
        _unrankElement(4, 0);
        // Verify elements have been correctly unrank
        cy.get('[data-cy="to-rank-section"]')
            .find('[data-cy="element-preview"]')
            .should('have.length', 4);

        // Click on the save button
        cy.get('[data-cy="create-tierlist"]').click();

        // The tierlist should have been edited in the viewer
        cy.get('[data-cy="tierlist-preview"]').contains(
            SAMPLE_TIERLIST_NAME_EDITED
        );
    });

    it('deletes a tierlist', () => {
        // Check the tierlist previously created exists
        cy.contains(SAMPLE_TIERLIST_NAME_EDITED);

        cy.compareSnapshot('tierlists-viewer-edited');

        // Go to edit view
        cy.get('[data-cy="tierlist-preview"]').click();

        // Click on the delete button
        cy.get('[data-cy="header-buttons"]')
            .find('[data-cy="delete-item-button"]')
            .click();

        // A confirmation dialog should be displayed
        cy.get('[data-cy="confirm-dialog"]').should('be.visible');

        // Click on the confirm button
        cy.get('[data-cy="confirm-dialog-button"]')
            .should('be.enabled')
            .click();

        // As there is no more tierlist now, the info message should be displayed again
        cy.get('[data-cy="info-box"]').should('be.visible');
    });
});

/**
 * Drag an element from the rank section to the ranking grid
 * @param {number} elementToRankIndex to know which element to drag
 * @param {number} tierLine to know in which tier we have to drop the element
 * @param {number} tierCol to know in which position we have to drop the element
 */
const _dragElementToCell = (
    elementToRankIndex: number,
    tierLine: number,
    tierCol: number
) => {
    const target: Cypress.Chainable<JQuery<HTMLElement>> = cy
        .get('[data-cy="ranking-grid-tier-line"]')
        .eq(tierLine)
        .find('[data-cy="element-in-cell"]')
        .eq(tierCol);

    const subject: Cypress.Chainable<JQuery<HTMLElement>> = cy
        .get('[data-cy="to-rank-section"]')
        .find('[data-cy="element-preview"]')
        .eq(elementToRankIndex);

    cy.dragAndDrop(target, subject);
    cy.wait(500);
};

/**
 * Drag an element in the grid from a position to an other
 * @param {number} currentTierLine to know which element to drag
 * @param {number} currentTierCol to know which element to drag
 * @param {number} targetTierLine to know where to drop the element
 * @param {number} targetTierCol to know where to drop the element
 */
const _changeElementRank = (
    currentTierLine: number,
    currentTierCol: number,
    targetTierLine: number,
    targetTierCol: number
) => {
    const target: Cypress.Chainable<JQuery<HTMLElement>> = cy
        .get('[data-cy="ranking-grid-tier-line"]')
        .eq(targetTierLine)
        .find('[data-cy="element-in-cell"]')
        .eq(targetTierCol);

    const subject: Cypress.Chainable<JQuery<HTMLElement>> = cy
        .get('[data-cy="ranking-grid-tier-line"]')
        .eq(currentTierLine)
        .find('[data-cy="element-in-cell"]')
        .eq(currentTierCol)
        .find('[data-cy="element-preview"]');

    cy.dragAndDrop(target, subject);
    cy.wait(500);
};

/**
 * Drag an element to unrank it
 * @param {number} tierLine to know in which tier we have to drop the element
 * @param {number} tierCol to know in which position we have to drop the element
 */
const _unrankElement = (tierLine: number, tierCol: number) => {
    cy.scrollTo('bottom');

    const target: Cypress.Chainable<JQuery<HTMLElement>> = cy.get(
        '[data-cy="to-rank-section"]'
    );

    const subject: Cypress.Chainable<JQuery<HTMLElement>> = cy
        .get('[data-cy="ranking-grid-tier-line"]')
        .eq(tierLine)
        .find('[data-cy="element-in-cell"]')
        .eq(tierCol)
        .find('[data-cy="element-preview"]');

    cy.dragAndDrop(target, subject);
    cy.wait(500);
};
