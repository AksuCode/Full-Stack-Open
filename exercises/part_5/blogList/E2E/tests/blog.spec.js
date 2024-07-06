const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Teemu Teekkari',
        username: 'teemuTTK',
        password: 'salasana'
      }
    })

    await page.goto('http://localhost:5173')

  })

  test('Login form is shown', async ({ page }) => {
    const username = await page.getByText('username')
    const password = await page.getByText('password')
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('teemuTTK')
      await page.getByTestId('password').fill('salasana')
      await page.getByTestId('loginButton').click()
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('teemuTTK')
      await page.getByTestId('password').fill('vääräsalasana')
      await page.getByTestId('loginButton').click()
      await expect(page.getByText('logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('teemuTTK')
      await page.getByTestId('password').fill('salasana')
      await page.getByTestId('loginButton').click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByText('new blog').click()
      await page.getByTestId('title').fill('Test blog')
      await page.getByTestId('author').fill('Tester')
      await page.getByTestId('url').fill('www.test.fi')
      await page.getByTestId('blogCreateButton').click()
      await expect(page.getByText('view')).toBeVisible()
    })

    describe('viewing a list of blogs', () => {
      beforeEach(async ({ page }) => {
        await page.getByText('new blog').click()
        await page.getByTestId('title').fill('Test blog')
        await page.getByTestId('author').fill('Tester')
        await page.getByTestId('url').fill('www.test.fi')
        await page.getByTestId('blogCreateButton').click()
      })
    
      test('blog can be liked', async ({ page }) => {
        await page.getByText('view').click()
        await page.getByText('like').click()
        await expect(page.getByTestId('notification')).toHaveText('Liked blog Test blog')
      })

      test('blog can be deleted', async ({ page }) => {
        await page.getByText('view').click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByText('delete').click()
        await expect(page.getByTestId('notification')).toHaveText('Blog Test blog deleted')
      })

      test('only blog adder sees delete button', async ({ page, request }) => {
        await page.getByText('view').click()
        await expect(page.getByText('delete')).toBeVisible()

        await request.post('http://localhost:3001/api/users', {
          data: {
            name: 'Tiina Teekkari',
            username: 'tiinaTTK',
            password: 'salasana'
          }
        })
        await page.getByText('logout').click()
        await page.getByTestId('username').fill('tiinaTTK')
        await page.getByTestId('password').fill('salasana')
        await page.getByTestId('loginButton').click()

        await page.getByText('view').click()
        await expect(page.getByText('delete')).not.toBeVisible()
      })

      test('blog list arranged in order of likes', async ({ page, request }) => {

        await page.getByTestId('title').fill('Test 2 blog')
        await page.getByTestId('author').fill('Tester')
        await page.getByTestId('url').fill('www.test2.fi')
        await page.getByTestId('blogCreateButton').click()        

        await page.getByTestId('title').fill('Test 3 blog')
        await page.getByTestId('author').fill('Tester')
        await page.getByTestId('url').fill('www.test3.fi')
        await page.getByTestId('blogCreateButton').click()

        await request.put('http://localhost:3001/api/blogs', {
          data: {
            name: 'Teemu Teekkari',
            username: 'teemuTTK',
            password: 'salasana'
          }
        })



        const views = await page.getByRole('button', {name: 'view'}).all()

        for (const view of views) {
          await view.click()
          await view.waitFor()
        }

        const [blog1, blog2, blog3] = await page.getByTestId('blog').all()

        await blog2.getByText('like').click()
        await blog2.getByText('like').click()

        await blog1.getByText('like').click()

        const [new_blog1, new_blog2, new_blog3] = await page.getByTestId('blog').all()

        expect(blog1 === new_blog2).toBeTruthy()
        expect(blog2 === new_blog1).toBeTruthy()
        expect(blog3 === new_blog3).toBeTruthy()

      })

    })

  })

})