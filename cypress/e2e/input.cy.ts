describe('Input', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render input with floating label', () => {
    cy.get('ay-input').first().within(() => {
      cy.get('.ay-input').should('be.visible')
        .and('have.css', 'height', '40px')
        .and('have.css', 'border-radius', '4px');
      cy.get('.ay-input-label').should('be.visible');
    });
  });

  it('should float label up when input is focused', () => {
    cy.get('ay-input').first().within(() => {
      cy.get('.ay-input').focus();
      cy.get('.ay-input-label')
        .should('have.css', 'font-size', '11.2px'); // 0.7rem
    });
  });

  it('should support type email', () => {
    cy.get('ay-input[type="email"]').first().within(() => {
      cy.get('.ay-input').should('have.attr', 'type', 'email');
    });
  });

  it('should support type password', () => {
    cy.get('ay-input[type="password"]').first().within(() => {
      cy.get('.ay-input').should('have.attr', 'type', 'password');
    });
  });

  it('should support type number', () => {
    cy.get('ay-input[type="number"]').first().within(() => {
      cy.get('.ay-input').should('have.attr', 'type', 'number');
    });
  });

  it('should support type text', () => {
    cy.get('ay-input[type="text"]').first().within(() => {
      cy.get('.ay-input').should('have.attr', 'type', 'text');
    });
  });

  // Clear button
  it('should not show clear button when input is empty', () => {
    cy.get('ay-input[type="email"]:not(.ay-input-field--error):not(.ay-input-field--disabled)').first().within(() => {
      cy.get('.ay-input-clear').should('not.exist');
    });
  });

  it('should show clear button when input has value', () => {
    cy.get('ay-input[type="email"]:not(.ay-input-field--error):not(.ay-input-field--disabled)').first().within(() => {
      cy.get('.ay-input').type('hello');
      cy.get('.ay-input-clear').should('be.visible');
    });
  });

  it('should clear value on clear button click', () => {
    cy.get('ay-input[type="email"]:not(.ay-input-field--error):not(.ay-input-field--disabled)').first().within(() => {
      cy.get('.ay-input').type('hello');
      cy.get('.ay-input-clear').click();
      cy.get('.ay-input').should('have.value', '');
      cy.get('.ay-input-clear').should('not.exist');
    });
  });

  it('should keep focus on input after clear', () => {
    cy.get('ay-input[type="email"]:not(.ay-input-field--error):not(.ay-input-field--disabled)').first().within(() => {
      cy.get('.ay-input').type('hello');
      cy.get('.ay-input-clear').click();
      cy.get('.ay-input').should('be.focused');
    });
  });

  it('should have correct clear button styling', () => {
    cy.get('ay-input[type="email"]:not(.ay-input-field--error):not(.ay-input-field--disabled)').first().within(() => {
      cy.get('.ay-input').type('hello');
      cy.get('.ay-input-clear')
        .should('have.css', 'cursor', 'pointer')
        .and('have.css', 'color', 'rgb(20, 122, 121)');
    });
  });

  it('should add right padding when clearable and filled', () => {
    cy.get('ay-input[type="email"]:not(.ay-input-field--error):not(.ay-input-field--disabled)').first().within(() => {
      cy.get('.ay-input').type('hello');
    });
    cy.get('ay-input[type="email"]:not(.ay-input-field--error):not(.ay-input-field--disabled)').first()
      .should('have.class', 'ay-input-field--clearable');
  });

  // Error state
  it('should show error state with danger border', () => {
    cy.get('ay-input.ay-input-field--error').first().within(() => {
      cy.get('.ay-input')
        .should('have.css', 'border-color', 'rgb(194, 65, 43)');
      cy.get('.ay-input-error')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(194, 65, 43)');
    });
  });

  it('should show helper text', () => {
    cy.get('ay-input').first().within(() => {
      cy.get('.ay-input-helper').should('be.visible');
    });
  });

  it('should show disabled state', () => {
    cy.get('ay-input.ay-input-field--disabled').first().within(() => {
      cy.get('.ay-input')
        .should('be.disabled')
        .and('have.css', 'cursor', 'not-allowed');
    });
  });

  it('should not show clear button when disabled', () => {
    cy.get('ay-input.ay-input-field--disabled').first().within(() => {
      cy.get('.ay-input-clear').should('not.exist');
    });
  });

  // Accessibility
  it('should have aria-invalid on error', () => {
    cy.get('ay-input.ay-input-field--error').first().within(() => {
      cy.get('.ay-input').should('have.attr', 'aria-invalid', 'true');
    });
  });

  it('should have aria-describedby linked to error message', () => {
    cy.get('ay-input.ay-input-field--error').first().within(() => {
      cy.get('.ay-input').then($input => {
        const describedBy = $input.attr('aria-describedby');
        cy.get(`#${describedBy}`).should('contain.text', 'invalide');
      });
    });
  });

  it('should have clear button with aria-label', () => {
    cy.get('ay-input[type="email"]:not(.ay-input-field--error):not(.ay-input-field--disabled)').first().within(() => {
      cy.get('.ay-input').type('hello');
      cy.get('.ay-input-clear').should('have.attr', 'aria-label', 'Effacer');
    });
  });
});
