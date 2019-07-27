/*
 * createTime：2019/6/21
 * author：fujie.wen
 * description: 会员整合
 */

const userMember = require('../../model/user-member');

class userMemberController {

    // 获取会员整合用户列表
    static async memberMergeList(ctx) {
        let res = await userMember.memberMergeListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
    static async memberMergeOperator(ctx) {
        let res = await userMember.memberMergeOperatorValue(ctx, ctx.params);
        ctx.body = res.data
    }
}

module.exports = userMemberController;
