sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/odata/ODataModel",
    'sap/m/Token'
], function (BaseController, JSONModel, formatter, Filter, FilterOperator,MessageToast,MessageBox,ODataModel,Token) {
    "use strict";

    return BaseController.extend("com.chappota.wo.wo.controller.Worklist", {
        _smartFilterBar: null,
        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        onInit: function () {
            this._smartFilterBar = this.getView().byId("smartFilterBar");


        },
        // **************************************************** */
        //             VARIENT SECTION: SAVE and RETRIVE       //
        //***************************************************** */
        _onBeforeVariantFetch: function (oEvent) {
            var projmi = this.getView().byId("projmultiInput").getValue();
            var custmi = this.getView().byId("customermultiInput").getValue();
            var stage = this.getView().byId("stagedd").getSelectedKeys();



            oEvent.getSource().setFilterData({
                _CUSTOM: {
                    Projmi: projmi,
                    Custmi: custmi,
                    Stage: stage

                }
            });

        },

        //To apply variant
        _onAfterVariantLoad: function (oEvent) {
            var oData = oEvent.getSource().getFilterData()._CUSTOM;

            if (oData.Projmi !== '') { this.byId("projmultiInput").setValue(oData.Projmi); }
            if (oData.Custmi !== '') { this.byId("customermultiInput").setValue(oData.Custmi); }
            if (oData.Stage !== '') { this.byId("stagedd").setSelectedKeys(oData.Stage); }




        },



        // **************************************************** */
        //              PROJECT DATA                           //
        //***************************************************** */
        _projectdata: function () {

            if (!this.proddata) {
                this.proddata = this.loadFragment({
                    name: "com.chappota.wo.wo.fragments.S1_ProjectData"
                });
            }

            this.proddata.then(function (oDialog) {
                oDialog.open();
                sap.ui.core.BusyIndicator.show(0);
            });


            var prododata = this.getOwnerComponent().getModel("s1");
            prododata.read("/ProjectSet", {
                urlParameters: {
                    $select: 'ProjectID,ProjectName',
                    $orderby: 'ProjectID'
                    // $top : 100
                },
                success: (odata) => {

                    var prodjson = new JSONModel();
                    prodjson.setSizeLimit(odata.results.length);
                    prodjson.setData(odata.results);
                    this.getView().setModel(prodjson, "s2");
                    sap.ui.core.BusyIndicator.hide();
                },
                error: (msg) => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Error");

                }
            });

        },
        _handleValueHelpSearch: function (evt) {
            var sValue = evt.getParameter("value");
            var oFilter = new Filter(
                "ProjectID",
                FilterOperator.Contains,
                sValue
            );
            evt.getSource().getBinding("items").filter([oFilter]);
        },
        _handleValueHelpClose: function (evt) {
            var aSelectedItems = evt.getParameter("selectedItems"),
                oMultiInput = this.byId("projmultiInput");

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        text: oItem.getTitle()
                    }));
                });
            }
        },
        _projsearch : function(oEvent){
            var sValue = oEvent.getParameter("value");
			var oFilter = new Filter(
				"ProjectID",
				FilterOperator.Contains,
				sValue
			);
			this.byId("projecttable").getBinding("items").filter([oFilter]);

        },

        // **************************************************** */
        //              CUSTOMER DATA                           //
        //***************************************************** */
        _customerdata: function () {

            if (!this.custdata) {
                this.custdata = this.loadFragment({
                    name: "com.chappota.wo.wo.fragments.S1_CustomerData"
                });
            }

            this.custdata.then(function (oDialog1) {
                oDialog1.open();
                sap.ui.core.BusyIndicator.show(0);
            });


            var custodata = this.getOwnerComponent().getModel("customerMDL");
            custodata.read("/A_Customer", {
                urlParameters: {
                    $select: 'Customer,CustomerName',
                    $orderby: 'Customer'
                    // $top : 100
                },
                success: (odata) => {

                    var custodatajson = new JSONModel();
                    custodatajson.setSizeLimit(odata.results.length);

                    custodatajson.setData(odata.results);
                    this.getView().setModel(custodatajson, "s3");
                    sap.ui.core.BusyIndicator.hide();
                },
                error: (msg) => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Error");

                }
            });

        },
        _handleValueHelpSearchCustomer: function (evt) {
            var sValue = evt.getParameter("value");
            var oFilter = new Filter(
                "Customer",
                FilterOperator.Contains,
                sValue
            );
            evt.getSource().getBinding("items").filter([oFilter]);
        },
        selectcustomervalue: function (evt) {

            var aSelectedItems = evt.getParameter("selectedItems"),
                oMultiInput = this.byId("customermultiInput");

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    oMultiInput.addToken(new Token({
                        text: oItem.getTitle()
                    }));
                });
            }
        },


        // **************************************************** */
        //              INITIALIZE DATA  OR TRIGGERS GO EVENT   //
        //***************************************************** */
        onBeforeRebindTable: function (oEvent) {

            // PROJECT STAGE DROPDOWN
            var oBindingParams = oEvent.getParameter("bindingParams");



            var stageid = this.getView().byId("stagedd");


            var acountkeys = stageid.getSelectedKeys();
            if (acountkeys != '') {
                for (var i = 0; i < acountkeys.length; i++) {
                    var filter1 = new Filter("ProjectStage", FilterOperator.EQ, acountkeys[i]);
                    if (acountkeys.length > 0) {
                        oBindingParams.filters.push(filter1);
                    }
                }
            }

            // PROJECT MULTI SELECT
            if (this.byId("projmultiInput").mProperties._semanticFormValue) {
                var mvals = this.byId("projmultiInput").mProperties._semanticFormValue;
                var mvalarr = [];
                mvalarr = mvals.split(", ");
                var filter1;

                for (var i = 0; i < mvalarr.length; i++) {
                    filter1 = new Filter("ProjectID", FilterOperator.EQ, mvalarr[i]);
                    if (mvalarr.length > 0) {
                        oBindingParams.filters.push(filter1);
                    }
                }
            }

            // CUSTOMER MULTI SELECT

            if (this.byId("customermultiInput").mProperties._semanticFormValue) {
                var mvals = this.byId("customermultiInput").mProperties._semanticFormValue;
                var mvalarr = [];
                mvalarr = mvals.split(", ");
                var filter1;
                for (var i = 0; i < mvalarr.length; i++) {
                    filter1 = new Filter("Customer", FilterOperator.EQ, mvalarr[i]);
                    if (mvalarr.length > 0) {
                        oBindingParams.filters.push(filter1);
                    }
                }
            }




        },
        onClear: function (oEvent) {

            var oSmtFilter = this.getView().byId("smartFilterBar");

            // CLEAR Project Stage Dropdown
            if (this.byId("stagedd").getSelectedKeys()) {
                this.byId("stagedd").setSelectedKeys('');
            }

            //CLEAR Project Multi Input

            var projid = oSmtFilter.getControlByKey("CustomInputFiled1");

            if (projid.mProperties._semanticFormValue !== '') {
                projid.removeAllTokens();
            }
            //CLEAR Customer Multi Input

            var custid = oSmtFilter.getControlByKey("CustomInputFiled2");

            if (custid.mProperties._semanticFormValue !== '') {
                custid.removeAllTokens();
            }



        },
        onExit: function () {
            if (this._smartFilterBar) {
                this._smartFilterBar.destroy();
                this._smartFilterBar = null;
            }

            if (this._oModel) {
                this._oModel.destroy();
                this._oModel = null;
            }
        },
        
        // **************************************************** */
        //            Navitaion Via Router from WL to Object    //
        //***************************************************** */
        _navcreateform : function (oEvent) {
         
           this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        
           this.oRouter.navTo("object",{
            from : "worklist",
            to : "object",
           
            
           },true);
        },

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        _onInit: function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished: function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        _onPress: function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack: function () {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("CostCenter", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh: function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject: function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/ProjectSet".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function (aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }

    });
});
