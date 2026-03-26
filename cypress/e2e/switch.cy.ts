describe('Switch', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render switch with label', () => {
    cy.get('ay-switch').first().should('be.visible');
    cy.get('ay-switch').first().find('.ay-switch-label')
      .should('be.visible')
      .and('contain.text', 'Notifications par email');
  });

  it('should toggle on click (class ay-switch--checked)', () => {
    cy.get('ay-switch').first()
      .should('not.have.class', 'ay-switch--checked');
    cy.get('ay-switch').first().click();
    cy.get('ay-switch').first()
      .should('have.class', 'ay-switch--checked');
    cy.get('ay-switch').first().click();
    cy.get('ay-switch').first()
      .should('not.have.class', 'ay-switch--checked');
  });

  it('should show disabled state', () => {
    cy.get('ay-switch.ay-switch--disabled')
      .should('exist')
      .and('have.class', 'ay-switch--disabled');
  });

  it('should have role="switch" attribute on track element', () => {
    cy.get('ay-switch').first().find('.ay-switch-track')
      .should('have.attr', 'role', 'switch');
  });
});
