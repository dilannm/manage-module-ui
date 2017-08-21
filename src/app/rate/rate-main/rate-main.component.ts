import {Component, OnInit} from '@angular/core';
import {RateService} from '../../commons/services/rate.service';
import {
    Category, Currency, Mapping, Rate, RateCategory, RateDefinition, RateTax, RateType,
    Tariff, Tax
} from '../../commons/models/common-data-models';
import {AuthenticationService} from '../../commons/services/authentication.service';
import {MessageService} from "../../commons/services/message.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-rate-main',
    templateUrl: './rate-main.component.html',
    styleUrls: ['./rate-main.component.scss']
})
export class RateMainComponent implements OnInit {

    private isDescriptionEmpty: boolean;
    private isNameError: boolean;
    private isDateEmpty: boolean;
    private isCurrencyError: boolean;
    private isRateTypeError: boolean;
    private isTariffError: boolean;

    private currencyError: string;
    private rateTypeError: string;
    private tariffError: string;

    private nameError: string;

    private rateDefName: string;
    private rateDefDescription: string;
    private currency: string;
    private rateType: string;
    private tariff: string;
    private rateTax: string;
    private taxId: number;

    private showSubcategory: boolean;
    private showAddCurrency: boolean;
    private showAddTariff: boolean;

    private dialogactionTitile: string;

    private tariffList: Tariff[];
    public currencyList: Currency[];
    private rateTypeList: RateType[];
    private categoryList: Category[];
    private rateCategories: RateCategory[];
    private rateTaxList: RateTax[];
    private mappingList: Mapping[];

    private categoryNameList: string[];
    private currencyCodeList: string[];
    private rateTypeCodeList: string[];
    private tariffNameList: string[];
    private rateDefNameList: string[];
    private taxidlist: string;

    private showChildNewCategory: boolean;
    private showChildNewSubCategory: boolean;
    private showChildNewTariff: boolean;


    private categoryId: number;
    private tariffId: number;

    constructor(private rateService: RateService, private _router: Router, private authService: AuthenticationService, private message: MessageService) {
    }

    ngOnInit() {
        this.showSubcategory = false;
        this.showAddCurrency = false;
        this.showAddTariff = false;
        this.showChildNewTariff = false;
        this.showChildNewSubCategory = false;
        this.showChildNewCategory = false;
        this.clearErrors();

        this.rateDefName = '';
        this.rateDefDescription = '';
        this.currency = '';
        this.rateType = '';
        this.tariff = '';
        this.rateTax = '';
        this.taxId = 0;

        this.tariffList = [];
        this.currencyList = [];
        this.rateTypeList = [];
        this.categoryList = [];
        this.mappingList = [];

        this.categoryNameList = [];
        this.currencyCodeList = [];
        this.rateTypeCodeList = [];
        this.tariffNameList = [];
        this.rateDefNameList = [];
        this.rateTaxList = [];
        this.taxidlist = '';
        this.rateCategories = [];

        this.getTariffList();
        this.getCurrencyList();
        this.getRateTypeList();
        this.getCategoryList();
        this.getRateDefinitionList();
        this.getRateTaxList();
    }

    /**
     * this function will load the existing tariff list
     */
    getTariffList() {
        this.rateService.getTariffList((response, status) => {
            if (status) {
                let count = 0;
                for (const entry of response) {
                    this.tariffList[count] = new Tariff();
                    this.tariffList[count].tariffId = response[count].tariffId;
                    this.tariffList[count].tariffName = response[count].tariffName;
                    this.tariffNameList[count] = response[count].tariffName;
                    count++;
                }

            } else {
                this.message.error(response);
            }
        });

    }

    /**
     * this function will load the existing currency list
     */
    getCurrencyList() {
        this.rateService.getCurrencyList((response, status) => {
            if (status) {
                let count = 0;
                for (const entry of response) {
                    this.currencyList[count] = new Currency();
                    this.currencyList[count].currencyId = response[count].currencyId;
                    this.currencyList[count].currencyCode = response[count].currencyCode;
                    this.currencyCodeList[count] = response[count].currencyCode;
                    count++;
                }

            } else {
                this.message.error(response);
            }
        });

    }

    /**
     * this function will load the existing rate types
     */
    getRateTypeList() {
        this.rateService.getRateTypeList((response, status) => {
            if (status) {
                let count = 0;
                for (const entry of response) {
                    this.rateTypeList[count] = new RateType();
                    this.rateTypeList[count].rateTypeId = response[count].rateTypeId;
                    this.rateTypeList[count].rateTypeCode = response[count].rateTypeCode;
                    this.rateTypeCodeList[count] = response[count].rateTypeCode;
                    count++;
                }

            } else {
                this.message.error(response);
            }
        });

    }


    /**
     * this function will load the existing rate taxes list
     */
    getRateTaxList() {
        this.rateService.getRateTaxList((response, status) => {
            if (status) {
                let count = 0;
                for (const entry of response) {
                    this.rateTaxList[count] = new RateTax();
                    this.rateTaxList[count].taxId = response[count].taxId;
                    this.rateTaxList[count].taxName = response[count].taxName;
                    count++;
                }
            } else {
                this.message.error(response);
            }
        });
    }


    /**
     * this function will load the available categories
     */
    getCategoryList() {
        this.rateService.getCategoryList((response, status) => {
            if (status) {
                let count = 0;
                for (const entry of response) {
                    this.categoryList[count] = new Category();
                    this.categoryList[count].categoryId = response[count].categoryId;
                    this.categoryList[count].categoryName = response[count].categoryName;
                    this.categoryList[count].categoryCode = response[count].categoryCode;
                    this.categoryNameList[count] = response[count].categoryName;
                    count++;
                }

            } else {
                this.message.error(response);
            }
        });

    }

    /**
     * load available rate definitions
     */
    getRateDefinitionList() {
        this.rateService.getRateDefinitionList((response, status) => {
            if (status) {
                let count = 0;
                for (const entry of response) {
                    this.rateDefNameList[count] = response[count].rateDefName;
                    count++;
                }

            } else {
                this.message.error(response);
            }
        });

    }


    /**
     * when rate card is submitted
     * @param ratecardForm
     */
    onRateCardSubmition(ratecardForm) {

        this.clearErrors();

        const loginInfo = this.authService.loginUserInfo.getValue();

        let currency: Currency;
        let tariff: Tariff;
        let rateType: RateType;
        let rateTaxes: RateTax[] = [];
        let rateCard: Rate;
        let rateDefCategoryBase: number;
        let ratedefinition: RateDefinition;

        let validCurrency = false;
        let validTariff = false;
        let validRateType = false;


        /** for loop to assign currency id */
        for (const entry of this.currencyList) {
            if (entry.currencyCode == this.currency) {
                currency = new Currency();
                currency.currencyId = entry.currencyId;
                validCurrency = true;
            }
        }

        /** for loop to assign rateType id */
        for (const entry of this.rateTypeList) {
            if (entry.rateTypeCode == this.rateType) {
                rateType = new RateType();
                rateType.rateTypeId = entry.rateTypeId;
                validRateType = true;
            }
        }

        /** for loop to assign tariff id */
        for (const entry of this.tariffList) {
            if (entry.tariffName == this.tariff) {
                tariff = new Tariff();
                tariff.tariffId = entry.tariffId;
                validTariff = true;
            }
        }

        let count2 = 0;
        /** for loop to assign rate tax values*/
        for (const item of this.rateTax) {
            let temp = new RateTax();
            let temTax = new Tax();

            temTax.taxId = Number(item);
            temp.tax = temTax;
            rateTaxes[count2] = temp;
            count2++;
        }

        /** assign value to rateDefCategoryBase */
        rateDefCategoryBase = (this.showSubcategory) ? 1 : 0;

        if (!this.isEmpty() && tariff != null && currency != null && rateType != null && validTariff && validCurrency && validRateType) {
            console.log('submitted rate card form ');
            rateCard = new Rate();

            ratedefinition = new RateDefinition();
            /** assign values for the rate definition */
            ratedefinition.rateDefName = this.rateDefName;
            ratedefinition.rateDefDescription = this.rateDefDescription;
            ratedefinition.rateDefDefault = 0;
            ratedefinition.currency = currency;
            ratedefinition.rateType = rateType;
            ratedefinition.rateDefCategoryBase = rateDefCategoryBase;
            ratedefinition.tariff = tariff;

            rateCard.rateDefinition = ratedefinition;

            if (rateDefCategoryBase == 0) {
                rateCard.rateCategories = [];
            } else {
                rateCard.rateCategories = this.rateCategories;
            }

            rateCard.rateTaxes = rateTaxes;
            rateCard.createdBy = loginInfo.userName;

            console.log('#######  ' + JSON.stringify(rateCard));

            this.rateService.addNewRateCard(rateCard, (response, status) => {

                if (status) {
                    this.message.success(response.message);
                    this.reloadPage();
                } else {
                    this.message.error(response);
                }
            });


        } else {
            console.log('invalid fields');
            if (this.rateDefName.length == 0) {
                this.isNameError = true;
                this.nameError = 'Name Cannot be Empty'
            }
            if (this.rateDefDescription.length == 0) {
                this.isDescriptionEmpty = true;
            }
            if (!validRateType) {
                this.isRateTypeError = true;
                this.rateTypeError = 'Invalid Rate Type';
            }
            if (!validTariff) {
                this.isTariffError = true;
                this.tariffError = 'Invalid Tariff';
            }
            if (!validCurrency) {
                this.isCurrencyError = true;
                this.currencyError = 'Invalid Currency';
            }
            if (this.currency.length == 0) {
                this.isCurrencyError = true;
                this.currencyError = 'Currency can not be empty';
            }
            if (this.rateType.length == 0) {
                this.isRateTypeError = true;
                this.rateTypeError = 'Rate Type can not be empty';
            }
            if (this.tariff.length == 0) {
                this.isTariffError = true;
                this.tariffError = 'Tariff can not be empty';
            }

        }


    }

    /**
     * check for empty fields
     * @returns {boolean}
     */
    isEmpty(): boolean {
        if (this.rateDefName.length != 0 && this.rateDefDescription.length != 0) {
            return false;
        } else {
            return true;
        }

    }

    /**
     * clear error labels
     */
    clearErrors() {
        this.isDateEmpty = false;
        this.isDescriptionEmpty = false;
        this.isNameError = false;
        this.isCurrencyError = false;
        this.isRateTypeError = false;
        this.isTariffError = false;

        this.currencyError = '';
        this.rateTypeError = '';
        this.tariffError = '';
    }

    changeDialogTitle() {
        if (this.showAddCurrency)
            return this.dialogactionTitile = 'Add new Currency code';
        else if (this.showAddTariff || this.showChildNewTariff)
            return this.dialogactionTitile = 'Add new Tariff code';
        else if (this.showChildNewCategory || this.showChildNewSubCategory)
            return this.dialogactionTitile = 'Add new Category';
    }

    /**
     * event trigger to handle modal fire
     * @param event
     */
    onmodalfireHandler(event: string) {
        if (event === 'addNewCategory') {
            this.showChildNewCategory = true;
        } else if (event === 'addNewSubCategory') {
            this.showChildNewSubCategory = true;
        } else {
            this.showChildNewTariff = true;
        }

    }

    clearModalContent() {
        this.showAddCurrency = false;
        this.showAddTariff = false;
        this.showChildNewTariff = false;
        this.showChildNewSubCategory = false;
        this.showChildNewCategory = false;
    }

    /**
     * event handler method which is triggered when a new currency is added
     * @param event
     */
    onAddCurrencyHandler(event: boolean) {
        console.log('add currency event called');
        if (event) {
            this.getCurrencyList();
        }
    }

    /**
     * event handler method which is triggered when a new category added, to refresh list
     * @param event
     */
    onAddCategoryHandler(event: boolean) {
        console.log('add category event called');
        if (event) {
            this.getCategoryList();
        }
    }

    /**
     * event handler mehod which assign category, sub category and tariff values.
     * @param event
     */
    onRateCategorySubmitionHandler(event: Mapping[]) {

        let count = 0;

        for (const maping of event) {

            let rateCategory = new RateCategory();

            /** for loop to assign category id */
            for (const entry of this.categoryList) {
                if (entry.categoryName == maping.category) {
                    const category = new Category();
                    category.categoryId = entry.categoryId;
                    rateCategory.category = category
                }
            }


            /** for loop to assign sub category id */
            for (const entry of this.categoryList) {
                if (maping.subcategory) {
                    if (entry.categoryName == maping.subcategory) {
                        const subcategory = new Category();
                        subcategory.categoryId = entry.categoryId;
                        rateCategory.subCategory = subcategory;
                    }
                } else {
                    const subcategory = new Category();
                    subcategory.categoryId = null;
                    rateCategory.subCategory = subcategory;

                }

            }


            /** for loop to assign tariff id */
            for (const entry of this.tariffList) {
                if (entry.tariffName == maping.tariff) {
                    const tariff = new Tariff();
                    tariff.tariffId = entry.tariffId;
                    rateCategory.tariff = tariff;
                }
            }

            this.rateCategories[count] = rateCategory;

            count++;
        }

        //  console.log("%%%%%%%%%%%%%%" + JSON.stringify(this.rateCategories));
    }

    /**
     * event handler method which is triggered when a new tariff added, to refresh list
     * @param event
     */
    onAddTariffHandler(event: boolean) {
        console.log('add tariff event called');
        if (event) {
            this.getTariffList();
        }
    }

    /**
     * to check real time the name is not duplicated
     * @param name
     */
    isNameUnique(name) {
        let state = false;
        for (const entry of this.rateDefNameList) {
            if (name == entry) {
                state = true;
            }
        }
        if (state) {
            this.isNameError = true;
            this.nameError = 'Name Already Existing';
        } else {
            this.isNameError = false;
            this.nameError = '';
        }
    }

    showit() {
        this.reloadPage();
    }

    reloadPage() {

        /** reinitialize all the variables */

        this.rateDefName = '';
        this.rateDefDescription = '';
        this.currency = '';
        this.rateType = '';
        this.tariff = '';
        this.rateTax = '';
        this.taxId = 0;
        this.rateCategories = [];
        this.mappingList = [];


        /** reload all the service values */
        this.getTariffList();
        this.getCurrencyList();
        this.getRateTypeList();
        this.getCategoryList();
        this.getRateDefinitionList();
        this.getRateTaxList();

        this.clearErrors();

    }

}
