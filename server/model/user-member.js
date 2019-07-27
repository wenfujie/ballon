/*
 * createTime：2019/6/21
 * author：fujie.wen
 * description: 会员整合
 */
class userMember {
    //  获取会员整合用户列表
    static async memberMergeListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-rel-trgs/vip-relation', params).then((res) => {
            return res
        });
    }

    //  会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
    static async memberMergeOperatorValue(ctx, params) {
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-rel-hds/relation-confirm', params).then((res) => {
            return res
        });
    }

}

module.exports = userMember
