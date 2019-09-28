/*
 * @Author: Mr_Wei
 * @Description: 普通用户状态管理文件
 * @Date: 18:01 2019/07/05
 * @Param: userstore.js
 * @return:
 **/


const types = {
    SET_AUTHORIZATED:"SET_AUTHORIZATED",
    SET_USER:"SET_USER"
};

const state = {
    isAuthorizated:false,
    user:{},
    isSign:false,
    avatar:''
};
const getters = {
    isSign:state => state.isSign,
    isAuthorizated:state => state.isAuthorizated,
    user:state => state.user,
    avatar:state => state.avatar
};
const mutations = {
    isSign(state, isSign){
        state.isSign = isSign;
    },
    isAuthorizated(state, isAuthorizated){
        state.isAuthorizated = isAuthorizated;
    },
    user(state, user){
        state.user = user;
    },
    avatar(state, avatar){
        state.avatar = avatar;
    }
};
const actions = {
    clearCurrentState:({commit}) => {
        commit("isAuthorizated", false);
        commit("user", null);
    },
}

const userStore = {
    state,
    getters,
    mutations,
    actions
}



export default userStore;