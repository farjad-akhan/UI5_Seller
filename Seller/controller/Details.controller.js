sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/ui/core/library',
    'sap/m/MessageToast'
], function (Controller, JSONModel, MessageBox,coreLibrary,MessageToast) {
    "use strict";
    var ValueState = coreLibrary.ValueState;

    return Controller.extend("UI5_new.controller.Details", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Details").attachPatternMatched(this.onOMatched, this);
        },
        onOMatched: function (oEvent) {

            this.getView().bindElement({
                path: "/sellerList/" + oEvent.getParameter("arguments").detailData,
                model: "Seller"
            })

        },
        editBtn: function (oEvent) {

            var row = oEvent.getSource().getBindingContext("Seller").getPath();
            sap.ui.getCore().getModel("Seller").setProperty("/editable", false);
            var row_no = oEvent.getSource().getBindingContext("Seller").getPath().split("/")[2];
            sap.ui.getCore().getModel("Seller").setProperty("/row", row_no);
            var rowData = sap.ui.getCore().getModel("Seller").getProperty(row);
            var eData = {};
            Object.keys(rowData).forEach(function (key) {
                eData[key] = rowData[key];
            });
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "UI5_new.fragment.addSeller"
                });
            }
            this.pDialog.then(function (pDialog) {
                pDialog.open();
                pDialog.getModel("Seller").setProperty("/sellerData", eData);
            });

        },
        onSubmitDialog: function () {
            var sellerData = sap.ui.getCore().getModel("Seller").getProperty("/sellerData");
            var sellerList = sap.ui.getCore().getModel("Seller").getProperty("/sellerList");
            var row_no = sap.ui.getCore().getModel("Seller").getProperty("/row");
            var regex = /^([a-zA-Z./#$_]+)@([a-z]+)\.[a-z]{2,7}$/;
            var pregex = /^[9876]+[0-9]{9}$/;
            var errorMsg = '';
            if (sellerData.name == "" || sellerData.contact_no == "" || sellerData.name == null || sellerData.contact_no == null || sellerData.email == "" || sellerData.email == null || sellerData.responsible_order == "" || sellerData.responsible_order == null || sellerData.outlet_name == "" || sellerData.outlet_name == null || sellerData.city == "" || sellerData.city == null || sellerData.zip == "" || sellerData.zip == null || sellerData.country == "" || sellerData.country == null || sellerData.street == "" || sellerData.street == null || sellerData.service_rating == "" || sellerData.service_rating == null || sellerData.product_rating == "" || sellerData.product_rating == null || sellerData.dealing_products.length == 0 ||  sellerData.no == "" || sellerData.no == null) {
                MessageBox.error("Please fill required details");
                return;

            }

          

            if (!regex.test(sellerData.email) || sellerData.email == "" || sellerData.email == null) {
                errorMsg = errorMsg + "*Please provide a valid email \n"
            }
            if (!pregex.test(sellerData.contact_no) || sellerData.contact_no == "" || sellerData.contact_no == null) {
                errorMsg = errorMsg + "*Please provide a valid contact_no \n"
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
                var rate = sellerData.seller_rating + sellerData.product_rating + sellerData.service_rating;
                sap.ui.getCore().getModel("Seller").setProperty("/sellerData/overall_rating", rate);
                sellerList.splice(row_no, 1, sellerData);
                MessageBox.success("Seller : " + sellerData.name + " updated successfully");
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
        goHome: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("seller");
        },
        rate: function (rating) {

            if (rating > 0 && rating < 5) {
                return "Poor";
            }
            else if (rating >= 5 && rating < 10) {
                return "Average";
            }
            else {
                return "Good";
            }
        },
        onCountryChange:function(oEvent){
            debugger
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData/city", )
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData/no", )
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData/street", )
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData/zip", )

            
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

            var row = oEvent.getSource().getBindingContext("Seller").getPath();
            var rowData = sap.ui.getCore().getModel("Seller").getProperty(row);
            var dealing_products=rowData.dealing_products;

			var state = "Selected";
            // if(isSelected){
               
            //     for(var i=0;i<dealing_products.length;i++){
            //         if(dealing_products[i].text==changedItem.getText()){
            //             MessageBox.error(changedItem.getText() +"is already present");
            //             break;
            //         }
            //     }
            // }
			if (!isSelected) {
				state = "Deselected";
			}

			MessageToast.show( state + " '" + changedItem.getText() + "'", {
				width: "auto"
			});
		},

		handleSelectionFinish: function(oEvent) {
            debugger
			var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = " Selected : [";
            var error_msg=''            

            
            var row = oEvent.getSource().getBindingContext("Seller").getPath();
            var rowData = sap.ui.getCore().getModel("Seller").getProperty(row);
            var dealing_products=rowData.dealing_products;
			for (var i = 0; i < selectedItems.length; i++) {
                var j=0;var f=true;
                for( j=0;j<dealing_products.length;j++){
                    if(dealing_products[j].text==selectedItems[i].getText()){
                        error_msg= error_msg + selectedItems[i].getText() +", ";
                        f=false;                        
                    }
                }
                if(f){
                dealing_products.push(selectedItems[i].mProperties);
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
            }
			}
            
			messageText += "]";
            if(error_msg!=''){
                MessageBox.error(error_msg + ": Already added");
            }
			MessageToast.show(messageText, {
				width: "auto"
			});

            removeAllSelectedItems(selectedItems);

            // sap.ui.getCore().getModel("Seller").refresh()

            // var oValidatedComboBox = oEvent.getSource(),
			// 	sSelectedKey = oValidatedComboBox.getSelectedKey(),
			// 	sValue = oValidatedComboBox.getValue();

			// if (!sSelectedKey && sValue) {
			// 	oValidatedComboBox.setValueState(ValueState.Error);
			// 	oValidatedComboBox.setValueStateText("Please choose valid dealing products!");
			// } else {
			// 	oValidatedComboBox.setValueState(ValueState.None);
			// }

		},
        onAddProducts:function(oEvent){
            if (!this.addDialog) {
                this.addDialog = this.loadFragment({
                    name: "UI5_new.fragment.addProduct"
                });
            }
            this.addDialog.then(function (addDialog) {
                addDialog.open();
            });

        

        },
        onClosePfragment:function(oEvent){
            
           
            // if (!this.addDialog) {
            //     this.addDialog = this.loadFragment({
            //         name: "UI5_new.fragment.addProduct"
            //     });
            // }
            // this.addDialog.then(function (addDialog) {
            //     addDialog.close();
                
            // });
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData", {})
            sap.ui.getCore().getModel("Seller").refresh()
            this.byId("PDialog").close();
        },
        onSubmitProdDialog:function(oEvent){
            var row = oEvent.getSource().getBindingContext("Seller").getPath();
            var rowData = sap.ui.getCore().getModel("Seller").getProperty(row);
            var dealing_products=rowData.dealing_products;
            var newProduct = sap.ui.getCore().getModel("Seller").getProperty("/sellerData/add_product");
            if(newProduct==""|| newProduct==undefined){
                MessageBox.error("Please add a product");
                return;
            }
            
            for(var i=0;i<dealing_products.length;i++){
             
                if(dealing_products[i].text==newProduct){
                   MessageBox.error( newProduct +"  is already added");
                   return;
                }
              }

            dealing_products.push({text:newProduct});
            this.byId("PDialog").close();
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData", {})
            sap.ui.getCore().getModel("Seller").refresh()
        }
    });
});