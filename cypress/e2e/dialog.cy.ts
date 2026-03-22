describe('Dialog', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should not show dialog initially', () => {
    cy.get('.ponyo-dialog-backdrop').should('not.exist');
  });

  it('should open dialog on button click', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ponyo-dialog-backdrop').should('be.visible');
    cy.get('.ponyo-dialog').should('be.visible');
  });

  it('should show header, body and footer', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ponyo-dialog-header').should('contain.text', 'Supprimer');
    cy.get('.ponyo-dialog-body').should('contain.text', 'irréversible');
    cy.get('.ponyo-dialog-footer button').should('have.length', 2);
  });

  it('should have correct dialog dimensions', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ponyo-dialog')
      .should('have.css', 'border-radius', '8px')
      .and('have.css', 'background-color', 'rgb(255, 255, 255)');
  });

  it('should close on backdrop click', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ponyo-dialog-backdrop').click('topLeft');
    cy.get('.ponyo-dialog-backdrop').should('not.exist');
  });

  it('should close on close button click', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ponyo-dialog-close').click();
    cy.get('.ponyo-dialog-backdrop').should('not.exist');
  });

  it('should close on Escape key', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ponyo-dialog').should('be.visible');
    cy.get('.ponyo-dialog-close').focus().type('{esc}');
    cy.get('.ponyo-dialog-backdrop').should('not.exist');
  });

  it('should have modal aria attributes', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ponyo-dialog')
      .should('have.attr', 'role', 'dialog')
      .and('have.attr', 'aria-modal', 'true');
  });

  it('should have semi-transparent backdrop', () => {
    cy.contains('button', 'Ouvrir la modale').click();
    cy.get('.ponyo-dialog-backdrop')
      .should('have.css', 'background-color', 'rgba(0, 0, 0, 0.35)');
  });
});
