describe('Button', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render filled primary buttons with correct styles', () => {
    cy.get('button[ay-button][variant="filled"][color="primary"][size="md"]')
      .first()
      .should('be.visible')
      .and('have.class', 'ay-button--filled')
      .and('have.class', 'ay-button--primary')
      .and('have.class', 'ay-button--md')
      .and('have.css', 'background-color', 'rgb(20, 122, 121)')
      .and('have.css', 'color', 'rgb(255, 255, 255)')
      .and('have.css', 'cursor', 'pointer')
      .and('have.css', 'border-radius', '4px');
  });

  it('should render filled sm buttons with smaller height', () => {
    cy.get('button[ay-button][size="sm"]')
      .first()
      .should('have.class', 'ay-button--sm')
      .and('have.css', 'height', '28px');
  });

  it('should render filled md buttons with correct height', () => {
    cy.get('button[ay-button][variant="filled"][size="md"]')
      .first()
      .should('have.css', 'height', '32px');
  });

  it('should render filled danger buttons with danger color', () => {
    cy.get('button[ay-button][variant="filled"][color="danger"]')
      .first()
      .should('have.class', 'ay-button--danger')
      .and('have.css', 'background-color', 'rgb(194, 65, 43)');
  });

  it('should render outlined primary buttons', () => {
    cy.get('button[ay-button][variant="outlined"][color="primary"]')
      .first()
      .should('have.class', 'ay-button--outlined')
      .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
      .and('have.css', 'color', 'rgb(20, 122, 121)');
  });

  it('should render outlined danger buttons', () => {
    cy.get('button[ay-button][variant="outlined"][color="danger"]')
      .first()
      .should('have.class', 'ay-button--danger')
      .and('have.css', 'color', 'rgb(194, 65, 43)');
  });

  it('should render text buttons with transparent background', () => {
    cy.get('button[ay-button][variant="text"]')
      .first()
      .should('have.class', 'ay-button--text')
      .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
      .and('have.css', 'border-style', 'none');
  });

  it('should render disabled buttons with disabled styles', () => {
    cy.get('button[ay-button].ay-button--disabled')
      .first()
      .should('have.css', 'cursor', 'not-allowed')
      .and('have.css', 'pointer-events', 'none');
  });

  it('should have flex display and aligned items', () => {
    cy.get('button[ay-button]')
      .first()
      .should('have.css', 'align-items', 'center')
      .and('have.css', 'justify-content', 'center');
  });
});
