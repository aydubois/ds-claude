describe('Input', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render input with floating label', () => {
    cy.get('ponyo-input').first().within(() => {
      cy.get('.ponyo-input').should('be.visible')
        .and('have.css', 'height', '40px')
        .and('have.css', 'border-radius', '4px');
      cy.get('.ponyo-input-label').should('be.visible');
    });
  });

  it('should float label up when input is focused', () => {
    cy.get('ponyo-input').first().within(() => {
      cy.get('.ponyo-input').focus();
      cy.get('.ponyo-input-label')
        .should('have.css', 'font-size', '11.2px'); // 0.7rem
    });
  });

  it('should show error state with danger border', () => {
    cy.get('ponyo-input.ponyo-input-field--error').first().within(() => {
      cy.get('.ponyo-input')
        .should('have.css', 'border-color', 'rgb(194, 65, 43)');
      cy.get('.ponyo-input-error')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(194, 65, 43)');
    });
  });

  it('should show helper text', () => {
    cy.get('ponyo-input').first().within(() => {
      cy.get('.ponyo-input-helper').should('be.visible');
    });
  });

  it('should show disabled state', () => {
    cy.get('ponyo-input.ponyo-input-field--disabled').first().within(() => {
      cy.get('.ponyo-input')
        .should('be.disabled')
        .and('have.css', 'cursor', 'not-allowed');
    });
  });
});
