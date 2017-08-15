// ==UserScript==
// @name         1688 Seller Info
// @version      0.1
// @description  Seller Info
// @author       Mikelarg
// @match        http://*.1688.com/*
// @match        https://*.1688.com/*
// @resource sellerInfo_CSS  https://raw.githubusercontent.com/Mikelarg/SellerInfo1688/master/seller_info.css
// @resource sellerInfo_HTML https://raw.githubusercontent.com/Mikelarg/SellerInfo1688/master/seller_info.html
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant    GM_addStyle
// @grant    GM_getResourceText
// @grant    GM_setValue
// @grant    GM_getValue
// ==/UserScript==
(function () {
    'use strict';
    const sellerURL = jQuery('.app-layer').data('view-config').currentDomainUrl;
    
    let data;
    let sellerColorInput;
    let sellerMessageInput;
    let sellerMessageElement;
    
    function saveData(data) {
        GM_setValue("seller_data", JSON.stringify(data));
    }
    function getData() {
        let data = JSON.parse(GM_getValue("seller_data", null));
        if (data === null) data = {};
        return data
    }
    
    function dataToInputs() {
        if (data.hasOwnProperty(sellerURL)) {
            let seller = data[sellerURL];
            let sellerColor = seller['color'];
            let sellerMessage = seller['message'];
            sellerColorInput.val(sellerColor);
            sellerMessageInput.val(sellerMessage);
            sellerMessageElement.css("background", sellerColor);
            sellerMessageElement.find('.message-text').text(sellerMessage);
            sellerMessageElement.fadeIn(500).css("display", "table");
       }   
    }
    
    if (sellerURL) {
        const sellerInfo_CSS = GM_getResourceText("sellerInfo_CSS");
        const sellerInfo_HTML = GM_getResourceText("sellerInfo_HTML");
        GM_addStyle(sellerInfo_CSS);

        data = getData();

        jQuery("body").append(sellerInfo_HTML);
        let sellerInfo = jQuery('#sellerInfo');
        sellerColorInput = sellerInfo.find('.seller-color input');
        sellerMessageInput = sellerInfo.find('.seller-message textarea');
        sellerMessageElement = jQuery('.seller-message-element');
        let hidden = false;
        const sellerInfoHeight = sellerInfo.height();
        const sellerInfoWidth = sellerInfo.width();
        sellerInfo.width(20);
        sellerInfo.height(20);

        dataToInputs();

        sellerInfo.find('.seller-url input').val(sellerURL);

        sellerInfo.find('.seller-save-button').click(function (e) {
            e.preventDefault();
            let sellerColor = sellerColorInput.val();
            let sellerMessage = sellerMessageInput.val();
            let data = getData();
            sellerMessageElement.css("background", sellerColor);
            sellerMessageElement.find('.message-text').text(sellerMessage);
            sellerMessageElement.fadeIn(500).css("display", "table");
            data[sellerURL] = {'color': sellerColor, 'message': sellerMessage};
            saveData(data);
        });

        sellerInfo.find('.seller-hide-button').click(function (e) {
            e.preventDefault();
            if (hidden) {
                sellerInfo.animate({
                    height: sellerInfoHeight,
                    width: sellerInfoWidth
                }, 500, function () {
                    sellerInfo.removeClass('hidden');
                });
            } else {
                sellerInfo.animate({
                    height: 20,
                    width: 20
                }, 500);
                sellerInfo.addClass('hidden');
            }
            hidden = !hidden;
        });

        sellerInfo.find('.seller-delete-button').click(function (e) {
            e.preventDefault();
            let data = getData();
            delete data[sellerURL];
            saveData(data);
            sellerMessageElement.fadeOut(500);
        });

        sellerInfo.find('.seller-export-button').click(function (e) {
            e.preventDefault();
            prompt("Copy Sellers Data", JSON.stringify(getData()));
            return false;
        });

        sellerInfo.find('.seller-import-button').click(function (e) {
            e.preventDefault();
            let import_data = prompt("Paste Here Sellers Data");
            data = JSON.parse(import_data);
            saveData(data);
            dataToInputs();
            return false;
        });

        sellerMessageElement.find(".message-hide-button").click(function (e) {
            e.preventDefault();
            sellerMessageElement.fadeOut(500);
        })
    }
})();
