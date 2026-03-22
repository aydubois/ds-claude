describe('Multi-select', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render multi-select with floating label', () => {
    cy.get('ponyo-multi-select').first().within(() => {
      cy.get('.ponyo-multi-select-box').should('be.visible');
      cy.get('.ponyo-multi-select-label').should('be.visible');
      cy.get('.ponyo-multi-select-arrow').should('exist');
    });
  });

  it('should open dropdown with toolbar on click', () => {
    cy.get('ponyo-multi-select').first().within(() => {
      cy.get('.ponyo-multi-select-box').click();
      cy.get('.ponyo-multi-select-dropdown').should('be.visible');
      cy.get('.ponyo-multi-select-toolbar').should('be.visible');
      cy.get('.ponyo-multi-select-toolbar-btn').should('have.length', 2);
      cy.get('.ponyo-multi-select-option').should('have.length.at.least', 1);
    });
  });

  it('should select an option and show chip', () => {
    cy.get('ponyo-multi-select').first().within(() => {
      cy.get('.ponyo-multi-select-box').click();
      cy.get('.ponyo-multi-select-option').first().click();
      cy.get('.ponyo-chip').should('have.length', 1);
    });
  });

  it('should remove chip on click', () => {
    cy.get('ponyo-multi-select').first().within(() => {
      cy.get('.ponyo-multi-select-box').click();
      cy.get('.ponyo-multi-select-option').first().click();
      cy.get('.ponyo-chip').should('have.length', 1);
      cy.get('.ponyo-chip-remove').first().click();
      cy.get('.ponyo-chip').should('have.length', 0);
    });
  });

  it('should select all via toolbar', () => {
    cy.get('ponyo-multi-select').first().within(() => {
      cy.get('.ponyo-multi-select-box').click();
      cy.get('.ponyo-multi-select-toolbar-btn').first().click(); // Tout sélectionner
      cy.get('.ponyo-chip').should('have.length', 5);
    });
  });

  it('should deselect all via toolbar', () => {
    cy.get('ponyo-multi-select').first().within(() => {
      cy.get('.ponyo-multi-select-box').click();
      cy.get('.ponyo-multi-select-toolbar-btn').first().click(); // Tout sélectionner
      cy.get('.ponyo-multi-select-toolbar-btn').last().click(); // Tout désélectionner
      cy.get('.ponyo-chip').should('have.length', 0);
    });
  });

  it('should close on Escape', () => {
    cy.get('ponyo-multi-select').first().within(() => {
      cy.get('.ponyo-multi-select-box').click();
      cy.get('.ponyo-multi-select-dropdown').should('be.visible');
      cy.get('.ponyo-multi-select-box').type('{esc}');
      cy.get('.ponyo-multi-select-dropdown').should('not.exist');
    });
  });
});
