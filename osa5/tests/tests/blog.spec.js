const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('/')
      await page.getByTestId('username').waitFor()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { id: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('/')
      await page.getByTestId('username').waitFor()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('vilunki')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
      await expect(page.getByTestId('username')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('/')
      await page.getByTestId('username').waitFor()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Varpusten katselun vaikutus koodauskokemukseen')
      await page.getByTestId('author').fill('Lauri Lintuniemi')
      await page.getByTestId('url').fill('http://example.com/pikkuvarpunen')
      await page.getByRole('button', { name: 'create' }).click()

      const uiMessage = await page.locator('.uiMessage')
      await expect(uiMessage).toHaveCSS('color', 'rgb(0, 128, 0)')
      await expect(uiMessage).toContainText('Varpusten katselun vaikutus koodauskokemukseen')
      await expect(page.getByText('Varpusten katselun vaikutus koodauskokemukseen Lauri Lintuniemi')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Varpusten katselun vaikutus koodauskokemukseen')
      await page.getByTestId('author').fill('Lauri Lintuniemi')
      await page.getByTestId('url').fill('http://example.com/pikkuvarpunen')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 2')).toBeVisible()
    })

    test('a blog can be removed by the user who created it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).waitFor()
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Varpusten katselun vaikutus koodauskokemukseen')
      await page.getByTestId('author').fill('Lauri Lintuniemi')
      await page.getByTestId('url').fill('http://example.com/pikkuvarpunen')
      await page.getByRole('button', { name: 'create' }).click()

      page.on('dialog', dialog => dialog.accept());

      await expect(page.getByText('Varpusten katselun vaikutus koodauskokemukseen Lauri Lintuniemi')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()
      await page.getByRole('button', { name: 'Remove' }).click()
      await expect(page.getByText('Varpusten katselun vaikutus koodauskokemukseen Lauri Lintuniemi')).not.toBeVisible()

    })

    test('blogs are sorted by likes', async ({ page }) => {
      async function clickALikeButtonAndWait(locatorText) {
        await page.getByText(locatorText)
          .getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(1000)
      }
      async function createNewBlog(title, author, url) {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill(title)
        await page.getByTestId('author').fill(author)
        await page.getByTestId('url').fill(url)
        await page.getByRole('button', { name: 'create' }).click()
      }

      createNewBlog('Varpusten katselun vaikutus koodauskokemukseen', 'Lauri Lintuniemi', 'http://example.com/pikkuvarpunen')

      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('Nurmikon kasvattamisen syvin olemus')
      await page.getByTestId('author').fill('Niko Nurmimies')
      await page.getByTestId('url').fill('http://example.com/nurmikko')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText('Nurmikon kasvattamisen syvin olemus Niko Nurmimies')
        .getByRole('button', { name: 'view' }).click()
      await page.waitForTimeout(1000);
      await clickALikeButtonAndWait('Nurmikon kasvattamisen syvin olemus Niko Nurmimies')
      await clickALikeButtonAndWait('Nurmikon kasvattamisen syvin olemus Niko Nurmimies')
      await clickALikeButtonAndWait('Nurmikon kasvattamisen syvin olemus Niko Nurmimies')
      await clickALikeButtonAndWait('Nurmikon kasvattamisen syvin olemus Niko Nurmimies')

      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Vaahteran vilvoittava kosketus')
      await page.getByTestId('author').fill('Veikko Vaahtoihminen')
      await page.getByTestId('url').fill('http://example.com/vaahtera')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByText('Vaahteran vilvoittava kosketus Veikko Vaahtoihminen').waitFor()

      await page.getByText('Vaahteran vilvoittava kosketus Veikko Vaahtoihminen')
        .getByRole('button', { name: 'view' }).click()
      await clickALikeButtonAndWait('Vaahteran vilvoittava kosketus Veikko Vaahtoihminen')
      await clickALikeButtonAndWait('Vaahteran vilvoittava kosketus Veikko Vaahtoihminen')

      // The clicking of like button will trigger sorting, so we wait for things to calm down
      await page.getByText('Vaahteran vilvoittava kosketus Veikko Vaahtoihminen').waitFor()

      const blogs = await page.locator('.blog').all()

      await expect(blogs[0]).toContainText('Nurmikon kasvattamisen syvin olemus')
      await expect(blogs[0].locator('.likes')).toHaveText('4')
      await expect(blogs[1]).toContainText('Varpusten katselun vaikutus koodauskokemukseen')
      await expect(blogs[1].locator('.likes')).toHaveText('3')
      await expect(blogs[2]).toContainText('Vaahteran vilvoittava kosketus')
      await expect(blogs[2].locator('.likes')).toHaveText('2')

      await clickALikeButtonAndWait('Vaahteran vilvoittava kosketus')
      await clickALikeButtonAndWait('Vaahteran vilvoittava kosketus')
      await clickALikeButtonAndWait('Vaahteran vilvoittava kosketus')

      const blogsSortedAgain = await page.locator('.blog').all()

      await expect(blogsSortedAgain[0]).toContainText('Vaahteran vilvoittava kosketus')
      await expect(blogsSortedAgain[0].locator('.likes')).toHaveText('5')
    })

  })
  describe('When logged in as another user', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Esko Morko',
          username: 'esko',
          password: 'sekretos'
        }
      })

      await page.goto('/')
      await page.getByTestId('username').waitFor()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })
    test('a blog can be removed by the user who created it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).waitFor()
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Varpusten katselun vaikutus koodauskokemukseen')
      await page.getByTestId('author').fill('Lauri Lintuniemi')
      await page.getByTestId('url').fill('http://example.com/pikkuvarpunen')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Varpusten katselun vaikutus koodauskokemukseen Lauri Lintuniemi')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByTestId('username').waitFor()
      await page.getByTestId('username').fill('esko')
      await page.getByTestId('password').fill('sekretos')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
    })
  })
})