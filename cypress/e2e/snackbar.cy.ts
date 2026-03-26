describe('Snackbar', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should not show snackbar initially', () => {
    cy.get('.ay-snackbar').should('not.exist');
  });

  it('should show snackbar on "Simple" button click', () => {
    cy.contains('button', 'Simple').click();
    cy.get('.ay-snackbar').should('be.visible');
    cy.get('.ay-snackbar-message')
      .should('contain.text', 'copié');
  });

  it('should auto-dismiss after timeout', () => {
    cy.contains('button', 'Simple').click();
    cy.get('.ay-snackbar').should('be.visible');
    cy.get('.ay-snackbar', { timeout: 6000 }).should('not.exist');
  });

  it('should show snackbar with action button on "Avec action" click', () => {
    cy.contains('button', 'Avec action').click();
    cy.get('.ay-snackbar').should('be.visible');
    cy.get('.ay-snackbar-message')
      .should('contain.text', 'supprimé');
    cy.get('.ay-snackbar-action')
      .should('be.visible')
      .and('contain.text', 'Annuler');
  });
});
