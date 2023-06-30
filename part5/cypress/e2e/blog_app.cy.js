describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const admin = {
      username: 'admin',
      name: 'John Doe',
      password: 'password'
    }

    const user = {
      username: 'user',
      name: 'Will Bosi',
      password: 'password'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', admin)
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', () => {
    cy.contains('Log-in to the application')

    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })


  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username').type('admin')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('John Doe logged in')
      cy.get('#logout').should('be.visible')
    })

    it('fails with wrong credentials', () => {
      cy.get('#username').type('invalidUser')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Invalid credentials')
      cy.get('#username').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('#login-button').should('be.visible')
    })
  })

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'admin', password: 'password' })
    })

    it('A blog can be created', () => {
      cy.get('#show-btn').click()
      cy.get('#blog-form-title').type('Burden of Dreams')
      cy.get('#blog-form-author').type('Will Bosi')
      cy.get('#blog-form-url').type('google.com')

      cy.get('#blog-form-submit').click()

      cy.contains('Blog \'Burden of Dreams\' by Will Bosi successfully added')
      cy.contains('Burden of Dreams Will Bosi')
      cy.get('#blog-list').children().should('have.length', 1)
    })
  })

  describe('After creating a blog', () => {
    beforeEach(() => {
      cy.login({ username: 'admin', password: 'password' })
      cy.createBlog({
        title: 'Burden of Dreams',
        author: 'Will Bosi',
        url: 'google.com'
      })
    })

    it('A blog can be liked', () => {
      cy.get('#blog-view-btn:first').click()
      cy.contains('likes 0')
      cy.get('#like:first').click()
      cy.contains('likes 1')
    })

    it('A blog can be deleted', () => {
      cy.get('#blog-view-btn:first').click()
      cy.get('#blog-delete-btn:first').click()
      cy.contains('Burden Of Dreams').should('not.exist')
    })
  })

  describe('After logging another user', () => {
    beforeEach(() => {
      cy.login({ username: 'admin', password: 'password' })

      cy.createBlog({
        title: 'Burden of Dreams',
        author: 'Will Bosi',
        url: 'google.com'
      })

      cy.login({ username: 'user', password: 'password' })
      cy.wait(1000)
    })

    it('The blog cannot be deleted', () => {
      cy.contains('Burden of Dreams')
      cy.get('#blog-view-btn').click()
      cy.get('#blog-delete-btn').should('not.exist')
    })

  })

  describe('Blog ordering', () => {
    beforeEach(() => {
      cy.login({ username: 'admin', password: 'password' })

      cy.createBlog({
        title: 'most likes',
        author: 'Will Bosi',
        url: 'google.com'
      })

      cy.createBlog({
        title: 'least likes',
        author: 'Will Bosi',
        url: 'google.com'
      })

      cy.createBlog({
        title: 'second to last',
        author: 'Will Bosi',
        url: 'google.com'
      })

      cy.createBlog({
        title: 'middle',
        author: 'Will Bosi',
        url: 'google.com'
      })

      cy.visit('http://localhost:3000')

      cy.contains('most likes').find('button').contains('view').click()
      cy.get('#like').click().wait(200).click().wait(200).click()
      cy.get('#hide').click()

      cy.contains('middle').find('button').contains('view').click()
      cy.get('#like').click().wait(200).click()
      cy.get('#hide').click()

      cy.contains('second to last').find('button').contains('view').click()
      cy.get('#like').click()
      cy.get('#hide').click()
    })

    it('The blogs are ordered by likes', () => {
      cy.visit('http://localhost:3000')
      cy.get('.blogPreview').eq(0).contains('most likes')
      cy.get('.blogPreview').eq(1).contains('middle')
      cy.get('.blogPreview').eq(2).contains('second to last')
      cy.get('.blogPreview').eq(3).contains('least likes')
    })
  })
})
