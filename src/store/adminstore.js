/*
 * @Author: Mr_Wei
 * @Description: 管理员store
 * @Date: 21:08 2019/07/20
 * @Param: adminstore.js
 * @return:
 **/


const state = {
    isAdminAuthorization:false,
    allusers:[]
};
const getters = {
    isAdminAuthorization:state => state.isAdminAuthorization,
    allusers:state => state.allusers
};
const mutations = {
    isAdminAuthorization:(state, authorization) => {
        state.isAdminAuthorization = authorization;
    },
    getAllusers:(state, users) => {
        state.allusers = users;
    }
};
const actions = {
    isAdminAuthorization:({commit}, authorization) => {
        commit("isAdminAuthorization", authorization);
    },
    getAllusers:({commit}, users) => {
        commit("getAllusers", users);
    },
    clearAdminState:({commit}) => {
        commit("getAllusers", null);
        commit("isAdminAuthorization", false);
        localStorage.removeItem("users");
        localStorage.removeItem("adminToken");
    }
}

const adminStore = {
    state,
    getters,
    mutations,
    actions
}

export default adminStore;