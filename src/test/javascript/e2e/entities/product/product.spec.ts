/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProductComponentsPage, ProductDeleteDialog, ProductUpdatePage } from './product.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Product e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let productUpdatePage: ProductUpdatePage;
    let productComponentsPage: ProductComponentsPage;
    let productDeleteDialog: ProductDeleteDialog;
    const fileToUpload = '../../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Products', async () => {
        await navBarPage.goToEntity('product');
        productComponentsPage = new ProductComponentsPage();
        expect(await productComponentsPage.getTitle()).to.eq('storeApp.product.home.title');
    });

    it('should load create Product page', async () => {
        await productComponentsPage.clickOnCreateButton();
        productUpdatePage = new ProductUpdatePage();
        expect(await productUpdatePage.getPageTitle()).to.eq('storeApp.product.home.createOrEditLabel');
        await productUpdatePage.cancel();
    });

    it('should create and save Products', async () => {
        const nbButtonsBeforeCreate = await productComponentsPage.countDeleteButtons();

        await productComponentsPage.clickOnCreateButton();
        await productUpdatePage.setNameInput('name');
        expect(await productUpdatePage.getNameInput()).to.eq('name');
        await productUpdatePage.setDescriptionInput('description');
        expect(await productUpdatePage.getDescriptionInput()).to.eq('description');
        await productUpdatePage.setPriceInput('5');
        expect(await productUpdatePage.getPriceInput()).to.eq('5');
        await productUpdatePage.sizeSelectLastOption();
        await productUpdatePage.setImageInput(absolutePath);
        await productUpdatePage.productCategorySelectLastOption();
        await productUpdatePage.save();
        expect(await productUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Product', async () => {
        const nbButtonsBeforeDelete = await productComponentsPage.countDeleteButtons();
        await productComponentsPage.clickOnLastDeleteButton();

        productDeleteDialog = new ProductDeleteDialog();
        expect(await productDeleteDialog.getDialogTitle()).to.eq('storeApp.product.delete.question');
        await productDeleteDialog.clickOnConfirmButton();

        expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
