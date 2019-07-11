/*
 * @Author: Mr_Wei
 * @Description: 搜索内容
 * @Date: 21:08 2019/07/09
 * @Param: searchstore.js
 * @return:
 **/


const state = {
    search:""
};

const getters = {
    search:state => state.search
}
const mutations = {
    search(state, search){
        state.search = search;
    }
};
const actions = {
    search:({commit}, search) => {
        commit("search", search);
    }
}

const SearchStore = {
    state,
    getters,
    mutations,
    actions
};

export default SearchStore;