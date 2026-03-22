describe('Accordion', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render accordion panels', () => {
    cy.get('ponyo-accordion').first().within(() => {
      cy.get('ponyo-accordion-panel').should('have.length', 3);
    });
  });

  it('should show expanded panels with body content', () => {
    cy.get('ponyo-accordion-panel').first().within(() => {
      cy.get('.ponyo-accordion-body').should('be.visible');
      cy.get('.ponyo-accordion-chevron').invoke('text').should('match', /▾|▼/);
    });
  });

  it('should show collapsed panels without body', () => {
    cy.get('ponyo-accordion-panel.ponyo-accordion-panel--collapsed').first().within(() => {
      cy.get('.ponyo-accordion-content').should('not.be.visible');
    });
  });

  it('should collapse panel on toggle click', () => {
    cy.get('ponyo-accordion-panel').first().within(() => {
      cy.get('.ponyo-accordion-toggle').click();
      cy.get('.ponyo-accordion-content').should('not.be.visible');
    });
  });

  it('should expand collapsed panel on toggle click', () => {
    cy.get('ponyo-accordion-panel.ponyo-accordion-panel--collapsed').first()
      .find('.ponyo-accordion-toggle').click();
    cy.get('ponyo-accordion-panel').eq(1).within(() => {
      cy.get('.ponyo-accordion-content').should('be.visible');
    });
  });

  it('should have drag handle with grab cursor', () => {
    cy.get('ponyo-accordion-panel .ponyo-accordion-drag-handle').first()
      .should('be.visible')
      .and('have.css', 'cursor', 'grab');
  });

  it('should have panel border and background', () => {
    cy.get('ponyo-accordion-panel').first()
      .should('have.css', 'border-radius', '4px')
      .and('have.css', 'background-color', 'rgb(255, 255, 255)');
  });

  it('should have correct ARIA attributes on toggle', () => {
    cy.get('ponyo-accordion-panel').first().within(() => {
      cy.get('.ponyo-accordion-toggle')
        .should('have.attr', 'aria-expanded', 'true')
        .and('have.attr', 'aria-controls');
    });
  });

  it('should have region role on content', () => {
    cy.get('ponyo-accordion-panel').first().within(() => {
      cy.get('.ponyo-accordion-content')
        .should('have.attr', 'role', 'region');
    });
  });
});
