sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("UI5_new.Component", {
        metadata: {
            interfaces: ["sap.ui.core.IAsyncContentCreation"],
            manifest: "json"
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
           
            var oData = {
                sellerData: {
                    dealing_products:[]
                },
                sellerList: [{dealing_products:[],sellerId:"MA199", name: "Farjad", outlet_name: "Oak Tree", city: "Bangalore",street:"Avenue road",zip:"560023",country:"India", seller_rating: "5", product_rating: "4", service_rating: "3",email:"farjad@gmail.com", contact_no: "7896541234", dealing_product: "Furniture", responsible_order: "19",overall_rating:"7",no:"25" }],
                countries:[{id:"India", name:"India"},
            {id:"America", name:"America"},
            {id:"UK", name:"United Kingdom"},
            {id:"UAE", name:"United Arab Emirates"},
            {id:"Turkey", name:"Turkey"},
            {id:"Qatar", name:"Qatar"},
            {id:"Australia", name:"Australia"},
            {id:"Saudi Arabia", name:"Saudi Arabia"},
            {id:"China", name:"China"},
            {id:"Malaysia", name:"Malaysia"}],
            products:[{id:"furniture",text:"furniture"},{id:"Dairy products",text:"Dairy products"},
            {id:"grocery",text:"grocery"},{id:"accessories",text:"accessories"},{id:"clothing",text:"clothing"}]
            
               
            }

            var oModel = new JSONModel(oData);
            this.setModel(oModel, "Seller");
            sap.ui.getCore().setModel(oModel, "Seller");
            sap.ui.getCore().getModel("Seller").setProperty("/sellerData", oData);

            

            this.getRouter().initialize();
        }
    })
});