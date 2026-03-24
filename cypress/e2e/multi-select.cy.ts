describe('Multi-select', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render multi-select with floating label', () => {
    cy.get('ay-multi-select').first().within(() => {
      cy.get('.ay-multi-select-box').should('be.visible');
      cy.get('.ay-multi-select-label').should('be.visible');
      cy.get('.ay-multi-select-arrow').should('exist');
    });
  });

  it('should open dropdown with toolbar on click', () => {
    cy.get('ay-multi-select').first().within(() => {
      cy.get('.ay-multi-select-box').click();
      cy.get('.ay-multi-select-dropdown').should('be.visible');
      cy.get('.ay-multi-select-toolbar').should('be.visible');
      cy.get('.ay-multi-select-toolbar-btn').should('have.length', 2);
      cy.get('.ay-multi-select-option').should('have.length.at.least', 1);
    });
  });

  it('should select an option and show chip', () => {
    cy.get('ay-multi-select').first().within(() => {
      cy.get('.ay-multi-select-box').click();
      cy.get('.ay-multi-select-option').first().click();
      cy.get('.ay-chip').should('have.length', 1);
    });
  });

  it('should remove chip on click', () => {
    cy.get('ay-multi-select').first().within(() => {
      cy.get('.ay-multi-select-box').click();
      cy.get('.ay-multi-select-option').first().click();
      cy.get('.ay-chip').should('have.length', 1);
      cy.get('.ay-chip-remove').first().click();
      cy.get('.ay-chip').should('have.length', 0);
    });
  });

  it('should select all via toolbar', () => {
    cy.get('ay-multi-select').first().within(() => {
      cy.get('.ay-multi-select-box').click();
      cy.get('.ay-multi-select-toolbar-btn').first().click(); // Tout sélectionner
      cy.get('.ay-chip').should('have.length', 5);
    });
  });

  it('should deselect all via toolbar', () => {
    cy.get('ay-multi-select').first().within(() => {
      cy.get('.ay-multi-select-box').click();
      cy.get('.ay-multi-select-toolbar-btn').first().click(); // Tout sélectionner
      cy.get('.ay-multi-select-toolbar-btn').last().click(); // Tout désélectionner
      cy.get('.ay-chip').should('have.length', 0);
    });
  });

  it('should close on Escape', () => {
    cy.get('ay-multi-select').first().within(() => {
      cy.get('.ay-multi-select-box').click();
      cy.get('.ay-multi-select-dropdown').should('be.visible');
      cy.get('.ay-multi-select-box').type('{esc}');
      cy.get('.ay-multi-select-dropdown').should('not.exist');
    });
  });
});
