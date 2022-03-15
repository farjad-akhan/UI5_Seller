sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/library',
    'sap/m/MessageToast'
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator,coreLibrary,MessageToast) {
    "use strict";

    var ValueState = coreLibrary.ValueState;

    return Controller.extend("UI5_new.controller.Seller", {
        onAdd: function () {
           
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "UI5_new.fragment.addSeller"
                });
            }
            this.pDialog.then(function (oDialog) {
                oDialog.open();
                sap.ui.getCore().getModel("Seller").setProperty("/editable", true);
            });
            
        },
        onPress: function (oEvent) {

            var row_no = oEvent.getSource().getBindingContext("Seller").getPath().split("/")[2]
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Details", {
                detailData: row_no
            }
            );
        },
        onSubmitDialog: function () {
            
            var sellerData = sap.ui.getCore().getModel("Seller").getProperty("/sellerData");
            var sellerList = sap.ui.getCore().getModel("Seller").getProperty("/sellerList");


            var errorMsg = '';
            var eregex = /^([a-zA-Z./#$_]+)@([a-z]+)\.[a-z]{2,7}$/;
            var pregex = /^[9876]+[0-9]{9}$/;
            if (sellerData.name == "" || sellerData.contact_no == "" || sellerData.name == null || sellerData.contact_no == null || sellerData.email == "" || sellerData.email == null || sellerData.responsible_order == "" || sellerData.responsible_order == null || sellerData.outlet_name == "" || sellerData.outlet_name == null || sellerData.city == "" || sellerData.city == null || sellerData.zip == "" || sellerData.zip == null || sellerData.country == "" || sellerData.country == null || sellerData.street == "" || sellerData.street == null || sellerData.service_rating == "" || sellerData.service_rating == null || sellerData.product_rating == "" || sellerData.product_rating == null ||  sellerData.no == "" || sellerData.no == null) {
                MessageBox.error("Please fill required details");
                return;

            }


            
            var i;
            for( i=0;i<sellerList.length;i++){
             
             if(sellerList[i].name==sellerData.name){
                MessageBox.error("Seller Name already exists");
                return;
             }
           }



            if (!eregex.test(sellerData.email) || sellerData.email == "" || sellerData.email == null) {
                errorMsg = errorMsg + "*Please provide a valid email \n"
            }
            if (!pregex.test(sellerData.contact_no) || sellerData.contact_no == "" || sellerData.contact_no == null) {
                errorMsg = errorMsg + "*Please provide a valid contact no. \n"
            }
            if (sellerData.name == "" || sellerData.name == null) {
                errorMsg = errorMsg + "*Please provide Seller Name \n"
            }
            if (sellerData.responsible_order == "" || sellerData.responsible_order == null) {
                errorMsg = errorMsg + "*Please provide number of Responsible Order \n"
            }
            if (sellerData.outlet_name == "" || sellerData.outlet_name == null) {
                errorMsg = errorMsg + "*Please provide Outlet Name \n"
            }
            if (sellerData.city == "" || sellerData.city == null) {
                errorMsg = errorMsg + "*Please provide City \n"
            }
            if (sellerData.zip == "" || sellerData.zip == null) {
                errorMsg = errorMsg + "*Please provide Zip Code \n"
            }
            if (sellerData.no == "" || sellerData.no == null) {
                errorMsg = errorMsg + "*Please provide Door no. \n"
            }
            if (sellerData.country == "" || sellerData.country == null) {
                errorMsg = errorMsg + "*Please provide Country \n"
            }
            if (sellerData.street == "" || sellerData.street == null) {
                errorMsg = errorMsg + "*Please provide Street \n"
            }
            // if (sellerData.dealing_product == "" || sellerData.dealing_product == null) {
            //     errorMsg = errorMsg + "*Please provide Dealing Product \n"
            // }
            if (sellerData.service_rating == "" || sellerData.service_rating == null) {
                errorMsg = errorMsg + "*Please provide Service Rating \n"
            }
            if (sellerData.product_rating == "" || sellerData.product_rating == null) {
                errorMsg = errorMsg + "*Please provide Product Rating \n"
            }

            if (errorMsg == '') {
                var sellerId="MA"+sellerList.length+200;
                var rate = sellerData.seller_rating + sellerData.product_rating + sellerData.service_rating;
                // sap.ui.getCore().getModel("Seller").setProperty("/sellerData/dealing_products", []);
                sap.ui.getCore().getModel("Seller").setProperty("/sellerData/sellerId", sellerId);
                sap.ui.getCore().getModel("Seller").setProperty("/sellerData/overall_rating", rate);
                sellerList.push(sellerData);
                MessageBox.success("Seller : " + sellerData.name + " added successfully");
                sap.ui.getCore().getModel("Seller").setProperty("/sellerData", {})
                sap.ui.getCore().getModel("Seller").refresh()

                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "UI5_new.fragment.addSeller"
                    });
                }
                this.pDialog.then(function (pDialog) {
                    pDialog.close();
                    
                });
            } else {
                MessageBox.error(errorMsg);
            }

        },
        onCloseDialog: function () {
            // if (!this.pDialog) {
            //     this.pDialog = this.loadFragment({
            //         name: "UI5_new.fragment.addSeller"
            //     });
            // }
            // this.pDialog.then(function (pDialog) {
            //     pDialog.close();
                
            // });
    
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData", {})
           
            sap.ui.getCore().getModel("Seller").refresh()
            this.byId("formDialog").close();
        },
        onFilterSellers: function (oEvent) {
            debugger



            var aFilter = [],
                sQuery = oEvent.getSource().getValue();
            var fName = new Filter("name", FilterOperator.Contains, sQuery);
            var fCity = new Filter("city", FilterOperator.Contains, sQuery);
            var fOutlet = new Filter("outlet_name", FilterOperator.Contains, sQuery);
            aFilter = [fName, fCity, fOutlet];
            var fFilter = new Filter({
                filters: aFilter,
                and: false
            });
            this.byId("List").getBinding("items").filter(fFilter);

        },
        rate: function (oEvent) {
            debugger
            if (oEvent > 0 && oEvent <=5) {
                return "Poor";
            }
            else if (oEvent > 5 && oEvent< 10) {
                return "Average";
            }
            else {
                return "Good";
            }
        },
        statusColor: function (oEvent) {
            if (oEvent > 0 && oEvent < 5) {
                return "Error";
            }
            else if (oEvent >= 5 && oEvent < 10) {
                return "Warning";
            }
            else {
                return "Success";
            }
        },
        onCountryChange:function(oEvent){
            debugger
            var oValidatedComboBox = oEvent.getSource(),
				sSelectedKey = oValidatedComboBox.getSelectedKey(),
				sValue = oValidatedComboBox.getValue();

			if (!sSelectedKey && sValue) {
				oValidatedComboBox.setValueState(ValueState.Error);
				oValidatedComboBox.setValueStateText("Please enter a valid country!");
			} else {
				oValidatedComboBox.setValueState(ValueState.None);
			}
        },
        handleSelectionChange: function(oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");

			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}

			MessageToast.show( + state + " '" + changedItem.getText() + "'", {
				width: "auto"
			});
		},

		handleSelectionFinish: function(oEvent) {
            debugger
			var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = " Selected : [";
            var arr=[]
			for (var i = 0; i < selectedItems.length; i++) {
                arr.push(selectedItems[i].mProperties);
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
			}
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData/dealing_products", arr)
			messageText += "]";

			MessageToast.show(messageText, {
				width: "auto"
			});


            var oValidatedComboBox = oEvent.getSource(),
				sSelectedKey = oValidatedComboBox.getSelectedKey(),
				sValue = oValidatedComboBox.getValue();

			if (!sSelectedKey && sValue) {
				oValidatedComboBox.setValueState(ValueState.Error);
				oValidatedComboBox.setValueStateText("Please choose valid dealing products!");
			} else {
				oValidatedComboBox.setValueState(ValueState.None);
			}

		}

    });
});