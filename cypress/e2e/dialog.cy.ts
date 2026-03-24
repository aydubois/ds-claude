describe('Dialog', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should not show dialog initially', () => {
    cy.get('.ay-dialog-backdrop').should('not.exist');
  });

  it('should open dialog on button click', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ay-dialog-backdrop').should('be.visible');
    cy.get('.ay-dialog').should('be.visible');
  });

  it('should show header, body and footer', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ay-dialog-header').should('contain.text', 'Supprimer');
    cy.get('.ay-dialog-body').should('contain.text', 'irréversible');
    cy.get('.ay-dialog-footer button').should('have.length', 2);
  });

  it('should have correct dialog dimensions', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ay-dialog')
      .should('have.css', 'border-radius', '8px')
      .and('have.css', 'background-color', 'rgb(255, 255, 255)');
  });

  it('should close on backdrop click', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ay-dialog-backdrop').click('topLeft');
    cy.get('.ay-dialog-backdrop').should('not.exist');
  });

  it('should close on close button click', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ay-dialog-close').click();
    cy.get('.ay-dialog-backdrop').should('not.exist');
  });

  it('should close on Escape key', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ay-dialog').should('be.visible');
    cy.get('.ay-dialog-close').focus().type('{esc}');
    cy.get('.ay-dialog-backdrop').should('not.exist');
  });

  it('should have modal aria attributes', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ay-dialog')
      .should('have.attr', 'role', 'dialog')
      .and('have.attr', 'aria-modal', 'true');
  });

  it('should have semi-transparent backdrop', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ay-dialog-backdrop')
      .should('have.css', 'background-color', 'rgba(0, 0, 0, 0.35)');
  });
});
