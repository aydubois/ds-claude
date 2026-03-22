describe('Select', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render select with floating label', () => {
    cy.get('ponyo-select').first().within(() => {
      cy.get('.ponyo-select-box').should('be.visible')
        .and('have.css', 'height', '40px')
        .and('have.css', 'cursor', 'pointer');
      cy.get('.ponyo-select-label').should('be.visible');
      cy.get('.ponyo-select-arrow').should('exist');
    });
  });

  it('should open dropdown on click', () => {
    cy.get('ponyo-select').first().within(() => {
      cy.get('.ponyo-select-box').click();
      cy.get('.ponyo-select-dropdown').should('be.visible');
      cy.get('.ponyo-select-option').should('have.length.at.least', 1);
    });
  });

  it('should select an option and close dropdown', () => {
    cy.get('ponyo-select').first().within(() => {
      cy.get('.ponyo-select-box').click();
      cy.get('.ponyo-select-option').first().click();
      cy.get('.ponyo-select-dropdown').should('not.exist');
      cy.get('.ponyo-select-box').should('contain.text', 'Administrateur');
    });
  });

  it('should show error state', () => {
    cy.get('ponyo-select.ponyo-select--error').first().within(() => {
      cy.get('.ponyo-select-box')
        .should('have.css', 'border-color', 'rgb(194, 65, 43)');
      cy.get('.ponyo-select-error').should('be.visible');
    });
  });

  it('should show disabled state', () => {
    cy.get('ponyo-select.ponyo-select--disabled').first().within(() => {
      cy.get('.ponyo-select-box')
        .should('have.css', 'cursor', 'not-allowed');
    });
  });

  it('should navigate with keyboard', () => {
    cy.get('ponyo-select').first().within(() => {
      cy.get('.ponyo-select-box').focus().type('{enter}');
      cy.get('.ponyo-select-dropdown').should('be.visible');
      cy.get('.ponyo-select-box').type('{downarrow}{enter}');
      cy.get('.ponyo-select-dropdown').should('not.exist');
    });
  });

  it('should close on Escape', () => {
    cy.get('ponyo-select').first().within(() => {
      cy.get('.ponyo-select-box').click();
      cy.get('.ponyo-select-dropdown').should('be.visible');
      cy.get('.ponyo-select-box').type('{esc}');
      cy.get('.ponyo-select-dropdown').should('not.exist');
    });
  });
});
