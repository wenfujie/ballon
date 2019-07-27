import ysf from "./ysf-sdk"
export function ysfService(uid, name, email, mobile) {
    console.log("qiyu", ysf)
    ysf.on({
        'onload': function () {
            ysf.config({
                uid: uid,
                name: name,
                email: email,
                mobile: mobile,
                success: function () {
                    location.href = ysf.url();
                },
                error: function () {

                }
            });

        }
    });
}