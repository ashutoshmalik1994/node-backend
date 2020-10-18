'use strict';
module.exports = function(res) {
    return {
        success: function(message, code) {
            res.status(code).send({
                is_success: true,
                responseCode: code,
                message: message || error,
                data: {}
            });
        },
        failure: function(error, code) {
            res.status(code).send({
                is_success: false,
                responseCode: code,
                message: error,
                data: {}
            });
        },
        data: function(item, code) {
            res.status(code).send({
                is_success: true,
                responseCode: code,
                data: item.data
            });
        },
        page: function(items, code, total, skiped) {
            res.status(code).send({
                is_success: true,
                responseCode: code,
                data: {
                    items: items,
                    skiped: skiped || 0,
                    total: total || items.length
                }
            });
        },
        productData: function(item, code, count, sideBarCount) {
            res.status(code).send({
                is_success: true,
                responseCode: code,
                data: item,
                count: count,
                sideBarCount: sideBarCount
            });
        }
    };
};