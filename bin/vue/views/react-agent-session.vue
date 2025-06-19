<template id="react-agent-session">

    <app-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ agent_id == null ? '' : 'ReAct Agent会话' }} </el-text>
                </template>
            </el-page-header>
            <hr />


            <el-descriptions class="margin-top" :title="agent.name" :column="2" border>
                <el-descriptions-item width="170px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            最大迭代次数
                        </div>
                    </template>
                    <el-text type="info" size="small">
                        {{ agent.maxRound }}
                    </el-text>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Timer />
                            </el-icon>
                            创建时间
                        </div>
                    </template>
                    {{ this.formatTime(agent.genTime) }}
                </el-descriptions-item>


                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            挂载文本库
                        </div>
                    </template>
                    {{ this.testJoin(agent.textDbs) }}
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            Agent工具
                        </div>
                    </template>
                    {{ this.testJoin(agent.tools) }}
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Monitor />
                            </el-icon>
                            大模型挂载
                        </div>
                    </template>
                    推理： {{ agent.reasoningLLM }}，观察： {{ agent.observeLLM }}
                </el-descriptions-item>


                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            Agent介绍
                        </div>
                    </template>
                    <el-text type="info" size="small">
                        {{ agent.desc }}
                    </el-text>
                </el-descriptions-item>



            </el-descriptions>

            <el-tabs id="answerDiv" v-model="activeName" class="demo-tabs" @tab-click="handleClick"
                style="border:0px solid red;min-height: 480px;">
                <el-tab-pane label="Agent会话" name="query1">
                    <div style="border:0px solid red;">
                        <el-input v-model="this.query" style="width: 600px;height: 80px;" :rows="3" type="textarea"
                            :placeholder="agent.userInstruction"></el-input>
                        <el-button type="primary" @click="doStream" class="searchButton"
                            :disabled="loading">提问</el-button>
                        <div v-loading="loading" class="searchResult">
                            <div id="query2Result" v-if="!this.isEmpty(answer) || !this.isEmpty(answer)">
                                <el-divider content-position="left" v-show="this.answer != ''">
                                    <el-text class="mx-1" type="primary">大模型回答</el-text>
                                </el-divider>
                                <div  v-html="replaceLnWithBr(this.answer)" class="searchResult" v-show="this.answer != ''">

                                </div>

                                <el-divider content-position="left" v-show="this.logs != ''">
                                    <el-text class="mx-1" type="primary">大模型推理日志</el-text>
                                </el-divider>
                                <div class="agentLogs" v-html="this.replaceLnWithBr(this.logs)" v-show="this.logs!=''">


                                </div>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(answer) && this.isEmpty(logs)"
                                description="暂无大模型回答" />
                        </div>

                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>

    </app-frame>


</template>


<script>
const ReActAgentSession = {
    mounted() {
        this.agent_id = this.$javalin.pathParams["agent_id"];
        if (this.agent_id != null) {
            this.fetchAgentData(this.agent_id);
        }
    },
    data() {
        return {
            activeName: 'query1',
            agent_id: '',
            agent: {
                id: '',
                name: '',
                desc: '',
                userInstruction: '',
                reasonPrompt: '',
                observePrompt: '',
                reasoningLLM: '',
                observeLLM: '',
                textDbs: '',
                tools: '',
                genTime: '',
                ord: 1,
            },
            query: '',
            logs: '',
            answer: '',
            loading: false,
            currentQuery: '',
            tempRAG: '',
        }
    },
    methods: {
        testJoin(arrs) {
            try { return arrs.join("，"); } catch (err) { return "";}
        },
        fetchAgentData(agent_id) {
            let url = "/api/react_agent_detail/" + agent_id;
            axios.get(url).then((response) => {
                this.agent = response.data;
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        },
        isEmpty(value) {
            return JSON.stringify(value) === '{}';
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
        handleClick(tab, event) {
            this.currentQuery = tab.props['name'];
            this.loading = false;
            // console.log(this.currentQuery)
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_react_agent")
        },
        checkQuery(query) {
            // console.log(_MessageBox);
            this.$msgbox(
                {
                    message: 'Agent指令内容不能为空！',
                    title: '警告',
                    confirmButtonText: '确认',
                    type: 'warning',
                }
            );
            // alert('检索的内容不能为空！');
        },

        doStream() {
            if (this.query.trim() == '') {
                this.checkQuery(this.query);
                return;
            }
            // this.currentQuery = 'query3';
            this.loading = true;
            this.logs = "";
            this.answer = "";
            this.tempRAG = "";
            let params = {
                "agentId": this.agent.id,
                "query": this.query,
            }
            let url = "/websocket/react";
            let socket = new WebSocket("ws://" + location.hostname + ":" + location.port + url);
            socket.onopen = function (e) {
                console.log("[open] Connection established");
                console.log("Sending to server");
                let strr = JSON.stringify(params);
                console.log(strr);
                socket.send(strr);
            };
            socket.onmessage = this.wsragmessage;
            socket.onclose = this.wsragclose;
            socket.onerror = this.wserror;
        },
        wsragmessage: function (event) {
            this.loading = false;
            let obj = JSON.parse(event.data)
            // console.log(`[message] Data received from server: ${event.data}`);
            this.ifMultiStep = obj.ifMultiStep;
            let msgType = obj.type;
            let done = obj.ifDone;
            let msg = obj.msg;
            // console.log(msgType+" --> "+msg);
            if (msgType != 'QueryResult') {
                this.logs += msg;
                window.scrollTo(0, document.body.scrollHeight);
            }
            if (msgType == 'QueryResult') {
                if (done) {
                    this.answer = msg;
                    console.log(this.answer);
                }
            }

        },
        wsragclose: function (event) {
            if (event.wasClean) {
            } else {
                // 例如服务器进程被杀死或网络中断
                // 在这种情况下，event.code 通常为 1006
                console.log('[close] Connection died');
            }
            this.scrollToSection('answerDiv');
        },
        wserror: function (error) {
            console.log(`[error] ${error.message}`);
        },

    },
    template: "#react-agent-session"
};

app.component("react-agent-session", ReActAgentSession);
</script>
<style>
.clearfloat {

    clear: both;

}

.agentLogs {
    border: 0px solid red;
    font-size: 9pt;
    color: #4a4a4a;
    padding: 15px 15px 15px 15px;
    background-color: rgb(247, 251, 254);
}

.searchButton {
    height: 75px;
    width: 80px;
    margin: 0px 0px 0px 5px !important;
    display: inline-block;
    vertical-align: top;
    /* 子元素垂直顶端对齐 */
}
</style>
