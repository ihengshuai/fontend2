/*
 * @Author: Mr_Wei
 * @Description: 存放音乐信息store
 * @Date: 10:24 2019/09/17
 * @Param: musicstore.js
 * @return:
 **/


const state = {
    currentMusic:{
        title:"Welcome to my website",
        artist:"everyone",
        src:"xxxx.mp3",
        pic:"bg.jpg",
        lrc:""
    },
    judgePath:false
};

const getters = {
    getCurrentMusic:state => state.currentMusic,
    getJudgePath:state => state.judgePath,
};

const mutations = {
    setCurrentMusic:(state, music) => {
        state.currentMusic.title = music.title;
        state.currentMusic.artist = music.artist;
        state.currentMusic.src = music.src;
        state.currentMusic.pic = music.pic;
        state.currentMusic.lrc = music.lrc;
    },
    setJudgePath:(state, judge) => {
        state.judgePath = judge;
    }
};

const actions = {
    setCurrentMusic:({commit}, music) => {
        commit("setCurrentMusic", music);
    }
};


const musicStore = {
    state,
    getters,
    mutations,
    actions
}

export default musicStore;