describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Email ou senha inválidos').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[type="email"]').type('demo@example.com');
    cy.get('input[type="password"]').type('demo123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/apps');
  });

  it('should redirect to login when accessing protected route', () => {
    cy.visit('/quality/rnc');
    cy.url().should('include', '/login');
  });
});