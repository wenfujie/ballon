/*
* createTime：2019/7/27
* author：fujie.wen
* description: 会员整合模块多处调用方法mixins）
*/

<script>
    import { UserService } from '@/api/service';

    export default {
        components:{},
        data() {
            return {

            }
        },
        methods: {
            // 获取会员列表1
            m_getMemberList(windowFlag) {
                let data = {
                    vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
                    windowFlag: windowFlag, // 1弹窗 0非弹窗
                };
                return UserService.memberMergeList(data).then(res => {
                    return res
                });
            },
        },
        created() {
        }
    }
</script>
