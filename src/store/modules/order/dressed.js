export default {
    namespaced: true,
    state: {
        activeStatus: '',
        currentPage: '',
        idArr: [],
    },
    getters: {
        orderItem: state => state.orderItem,
        idArr: state => state.idArr
    },
    mutations: {
        SET_STATUS: (state, activeStatus) => {

            state.activeStatus = activeStatus;
        },
        SET_PAGE: (state, currentPage) => {

            state.currentPage = currentPage;
        },
        SET_INDEX: (state, idArr) => {
            state.idArr = idArr;
        },
    },
    actions: {
        SET_PAGE({
            commit
        }, currentPage) {
            commit('SET_PAGE', currentPage);
        },
        SetStatus({
            commit
        }, activeStatus) {
            commit('SET_STATUS', activeStatus);
        },
        SetPage({
            commit
        }, currentPage) {
            commit('SET_PAGE', currentPage);
        },
        SetIndex({
            commit
        }, idArr) {

            commit('SET_INDEX', idArr);
        },
    }

};
