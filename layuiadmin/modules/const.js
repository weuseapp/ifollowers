layui.define(function (e) {
    e('const', {
        // 商品状态，0：待上架，1：已上架，2：已下架
        STATUS_WAITING: 0,
        STATUS_ENABLE: 1,
        STATUS_DISABLE: 2,
        // 支付方式，1：金币，2：金钱
        PAY_TTPE_COINS: 1,
        PAY_TYPE_MONEY: 2,
        // 商品类型，1：金币，2：任务，3：订阅
        PRODUCT_TYPE_COINS: 1,
        PRODUCT_TYPE_TASK: 2,
        PRODUCT_TYPE_SUB: 3,
        // 其他类型，-1：未知，0：点赞，1：加粉，2：观看，3：金币，默认为0
        OTHER_TYPE_UNKNOWN: -1,
        OTHER_TYPE_LIKE: 0,
        OTHER_TYPE_FOLLOWER: 1,
        OTHER_TYPE_VIEW: 2,
        OTHER_TYPE_COINS: 3,
        OTHER_TYPE_GOLD_FOLLOWER: 4,
    });
});