describe('Navigation Rail', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render navigation rail with links', () => {
    cy.get('ay-navigation-rail').should('be.visible');
    cy.get('ay-navigation-rail .ay-nav-rail-link')
      .should('have.length', 4);
  });

  it('should have role="navigation"', () => {
    cy.get('ay-navigation-rail')
      .should('have.attr', 'role', 'navigation');
  });

  it('should mark link as active on click (class ay-nav-rail-link--active)', () => {
    cy.get('ay-navigation-rail .ay-nav-rail-link').first().invoke('removeAttr', 'href');
    cy.get('ay-navigation-rail .ay-nav-rail-link').first().click();
    cy.get('ay-navigation-rail .ay-nav-rail-link').first()
      .should('have.class', 'ay-nav-rail-link--active');
  });

  it('should have toggle button', () => {
    cy.get('ay-navigation-rail .ay-nav-rail-toggle')
      .should('be.visible');
  });

  it('should have links as <a> elements with href', () => {
    cy.get('ay-navigation-rail .ay-nav-rail-link').each(($link) => {
      cy.wrap($link)
        .should('match', 'a')
        .and('have.attr', 'href');
    });
  });
});
