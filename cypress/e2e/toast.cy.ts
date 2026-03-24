describe('Toast', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show success toast on click', () => {
    cy.contains('button', 'Success').click();
    cy.get('.ay-toast--success')
      .should('be.visible')
      .and('contain.text', 'Sauvegardé');
  });

  it('should show info toast on click', () => {
    cy.contains('button', 'Info').click();
    cy.get('.ay-toast--info')
      .should('be.visible')
      .and('contain.text', 'mis à jour');
  });

  it('should show warning toast on click', () => {
    cy.contains('button', 'Warning').click();
    cy.get('.ay-toast--warning')
      .should('be.visible')
      .and('contain.text', 'instable');
  });

  it('should show error toast on click', () => {
    cy.contains('button', 'Error').click();
    cy.get('.ay-toast--error')
      .should('be.visible')
      .and('contain.text', 'Erreur');
  });

  it('should have correct toast styling', () => {
    cy.contains('button', 'Success').click();
    cy.get('.ay-toast--success')
      .should('have.css', 'border-radius', '4px')
      .and('have.css', 'background-color', 'rgb(255, 255, 255)');
  });

  it('should have close button', () => {
    cy.contains('button', 'Error').click();
    cy.get('.ay-toast-close').first().should('be.visible');
  });

  it('should dismiss toast on close click', () => {
    cy.contains('button', 'Error').click();
    cy.get('.ay-toast--error').should('be.visible');
    cy.get('.ay-toast-close').first().click();
    cy.get('.ay-toast--error').should('not.exist');
  });

  it('should auto-dismiss success toast', () => {
    cy.contains('button', 'Success').click();
    cy.get('.ay-toast--success').should('be.visible');
    cy.wait(5500);
    cy.get('.ay-toast--success').should('not.exist');
  });

  it('should NOT auto-dismiss error toast', () => {
    cy.contains('button', 'Error').click();
    cy.get('.ay-toast--error').should('be.visible');
    cy.wait(5500);
    cy.get('.ay-toast--error').should('be.visible');
  });

  it('should have correct ARIA attributes for success', () => {
    cy.contains('button', 'Success').click();
    cy.get('.ay-toast--success')
      .should('have.attr', 'role', 'status')
      .and('have.attr', 'aria-live', 'polite');
  });

  it('should have correct ARIA attributes for error', () => {
    cy.contains('button', 'Error').click();
    cy.get('.ay-toast--error')
      .should('have.attr', 'role', 'alert')
      .and('have.attr', 'aria-live', 'assertive');
  });

  it('should stack multiple toasts', () => {
    cy.contains('button', 'Success').click();
    cy.contains('button', 'Error').click();
    cy.get('.ay-toast').should('have.length', 2);
  });

  it('should be fixed positioned bottom-right', () => {
    cy.contains('button', 'Success').click();
    cy.get('ay-toast-container')
      .should('have.css', 'position', 'fixed')
      .and('have.css', 'bottom', '16px')
      .and('have.css', 'right', '16px');
  });
});
