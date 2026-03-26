describe('Tabs', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render tabs with ay-tabs selector', () => {
    cy.get('ay-tabs').should('be.visible');
  });

  it('should have multiple tab buttons', () => {
    cy.get('ay-tabs .ay-tabs-tab').should('have.length', 4);
  });

  it('should show content for active tab', () => {
    cy.get('ay-tabs .ay-tabs-tab').eq(1).click();
    cy.get('ay-tabs .ay-tab-panel')
      .should('contain.text', 'Sécurité');
  });

  it('should have different styling on active tab', () => {
    cy.get('ay-tabs .ay-tabs-tab--active')
      .should('have.length', 1)
      .and('have.attr', 'aria-selected', 'true');
  });

  it('should not activate disabled tab on click', () => {
    cy.get('ay-tabs .ay-tabs-tab--disabled').click({ force: true });
    cy.get('ay-tabs .ay-tabs-tab--disabled')
      .should('not.have.class', 'ay-tabs-tab--active');
  });

  it('should have role="tablist" on container', () => {
    cy.get('ay-tabs [role="tablist"]').should('exist');
  });
});
