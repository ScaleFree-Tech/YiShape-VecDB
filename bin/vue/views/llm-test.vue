<template id="llm-test">

    <app-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large"> 测试大模型问答 </el-text>
                </template>
            </el-page-header>
            <hr />

            <el-tabs id="query3Div" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="大模型测试" name="query1">
                    <div style="border:0px solid red;">
                        <el-input v-model="query" style="width: 600px;height: 80px;" :rows="3" type="textarea"
                            placeholder="请输入要咨询的问题"></el-input>
                        <el-button type="primary" @click="doStreamLLM" class="searchButton"
                            :disabled="loading">提问</el-button>
                        <div style="font-size: 10pt;text-align: left;">
                            <el-text>大模型挂载：</el-text>
                            <el-select v-model="this.llmType" placeholder="选择挂载的大模型" style="width:200px;">
                                <el-option v-for="item in llms" :key="item.modelExpr" :label="item.modelExpr"
                                    :value="item.modelExpr" />
                            </el-select>&nbsp;&nbsp;&nbsp;
                            <el-link type="primary" :href="'/user/user_llm_session/'+this.llmType" target="_blank">打开会话窗口</el-link>
                            <hr/>
                        </div>

                        <div v-loading="loading" class="searchResult">
                            <div id="queryResult" v-if="!this.isEmpty(this.result)">
                                <el-divider content-position="left">
                                    <el-text class="mx-1" type="primary">大模型回答</el-text>
                                </el-divider>
                                <el-text class="mx-1" v-html="replaceLnWithBr(result.llmAns)"></el-text>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(this.result)" description="暂无大模型回答" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

    </app-frame>


</template>


<script>
const LLMTest = {
    mounted() {
        this.loadLLMModels();
    },
    data() {
        return {
            activeName: 'query1',
            query: '',
            result: {},
            loading: false,
            currentQuery: '',
            llms: [],
            llmType: 'DeepSeek',
        }
    },
    methods: {
        isEmpty(value) {
            return JSON.stringify(value) === '{}';
        },
        handleClick(tab, event) {
            this.currentQuery = tab.props['name'];
            this.loading = false;
            // console.log(this.currentQuery)
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/")
        },
        loadLLMModels() {
                    let url = "/llm/get_all/text";
                    axios.get(url).then((response) => {
                        this.llms = response.data;
                        if (this.llms.length > 0) {
                            this.llmType = this.llms[0].modelExpr;
                        }
                        console.log(this.llms);
                    });
        },
        checkQuery(query) {
            // console.log(_MessageBox);
            this.$msgbox(
                {
                    message: '提问的内容不能为空！',
                    title: '警告',
                    confirmButtonText: '确认',
                    type: 'warning',
                }
            );
            // alert('检索的内容不能为空！');
        },

        replaceLnWithBr(text) {
            tt = text.replace('\<think\>', '\<div class="quoteThink"\>')
            tt = tt.replace('\</think\>', '\</div\>')
            tt = marked.parse(tt);
            return tt;
        },

        scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动
            }
        },

        doLLM() {
            if (this.query.trim() == '') {
                this.checkQuery(this.query);
                return;
            }
            // this.currentQuery = 'query2';
            this.loading = true;
            let params = {
                "model": 'Ollama',
                "query": this.query,
            }
            let url = "/llm";
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 600000,
            }).then((response) => {
                this.result = response.data;
                console.log(this.result)
                this.loading = false;
            });
        },

        doStreamLLM() {
            if (this.query.trim() == '') {
                this.checkQuery(this.query);
                return;
            }
            // this.currentQuery = 'query2';
            this.loading = true;
            this.result = {};
            let params = {
                "session_id": "000",
                "model": this.llmType,
                "query": this.query,
                "history":"[]"
            }
            let url = "/websocket/llm";
            let socket = new WebSocket("ws://" + location.hostname + ":" + location.port + url);
            socket.onopen = function (e) {
                console.log("[open] Connection established");
                console.log("Sending to server");
                let strr = JSON.stringify(params);
                console.log(strr);
                socket.send(strr);
            };
            socket.onmessage = this.wsllmmessage;
            socket.onclose = this.wsllmclose;
            socket.onerror = this.wserror;
        },
        wsllmmessage: function (event) {
            this.loading = false;
            let obj = JSON.parse(event.data)
            // console.log(`[message] Data received from server: ${event.data}`);
            let msgType = obj.type;
            let done = obj.ifDone;
            let msg = obj.msg;
            // console.log(obj)
            let ifMultiStep = obj.ifMultiStep;
            if (msgType = 'Word') {
                if (typeof (this.result.llmAns) == 'undefined' || this.result.llmAns == null) {
                    this.result.llmAns = "";
                }
                this.result.llmAns += msg;
                // console.log(msg);
                window.scrollTo(0, document.body.scrollHeight);
            }

        },
        wsllmclose: function (event) {
            if (event.wasClean) {
            } else {
                // 例如服务器进程被杀死或网络中断
                // 在这种情况下，event.code 通常为 1006
                console.log('[close] Connection died');
            }
            this.scrollToSection('query3Div');
            this.loading = false;
        },
        wserror: function (error) {
            this.scrollToSection('query3Div');
            this.loading = false;
            console.log(`[error] ${error.message}`);
        }



    },
    template: "#llm-test"
};

app.component("llm-test", LLMTest);
</script>
<style>
.clearfloat {

    clear: both;

}

.searchButton {
    height: 80px;
    width: 80px;
    margin-left: 5px;
}
</style>
