describe('Accordion', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render accordion panels', () => {
    cy.get('ay-accordion').first().within(() => {
      cy.get('ay-accordion-panel').should('have.length', 3);
    });
  });

  it('should show expanded panels with body content', () => {
    cy.get('ay-accordion-panel').first().within(() => {
      cy.get('.ay-accordion-body').should('be.visible');
      cy.get('.ay-accordion-chevron').invoke('text').should('match', /▾|▼/);
    });
  });

  it('should show collapsed panels without body', () => {
    cy.get('ay-accordion-panel.ay-accordion-panel--collapsed').first().within(() => {
      cy.get('.ay-accordion-content').should('not.be.visible');
    });
  });

  it('should collapse panel on toggle click', () => {
    cy.get('ay-accordion-panel').first().within(() => {
      cy.get('.ay-accordion-toggle').click();
      cy.get('.ay-accordion-content').should('not.be.visible');
    });
  });

  it('should expand collapsed panel on toggle click', () => {
    cy.get('ay-accordion-panel.ay-accordion-panel--collapsed').first()
      .find('.ay-accordion-toggle').click();
    cy.get('ay-accordion-panel').eq(1).within(() => {
      cy.get('.ay-accordion-content').should('be.visible');
    });
  });

  it('should have drag handle with grab cursor', () => {
    cy.get('ay-accordion-panel .ay-accordion-drag-handle').first()
      .should('be.visible')
      .and('have.css', 'cursor', 'grab');
  });

  it('should have panel border and background', () => {
    cy.get('ay-accordion-panel').first()
      .should('have.css', 'border-radius', '4px')
      .and('have.css', 'background-color', 'rgb(255, 255, 255)');
  });

  it('should have correct ARIA attributes on toggle', () => {
    cy.get('ay-accordion-panel').first().within(() => {
      cy.get('.ay-accordion-toggle')
        .should('have.attr', 'aria-expanded', 'true')
        .and('have.attr', 'aria-controls');
    });
  });

  it('should have region role on content', () => {
    cy.get('ay-accordion-panel').first().within(() => {
      cy.get('.ay-accordion-content')
        .should('have.attr', 'role', 'region');
    });
  });
});
