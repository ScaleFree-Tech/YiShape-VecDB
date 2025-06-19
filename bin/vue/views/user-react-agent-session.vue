<template id="user-react-agent-session">
    <user-frame>
        <div style="padding-left: 0px; margin: 0 auto;width:95%;">


            <el-page-header @back="gotoList()" class="page-header">
                <template #content>
                    <el-text class="page-title" size="large">{{ agent_id == null ? '' : 'ReAct Agent会话' }} </el-text>
                </template>
            </el-page-header>

            <!--Agent信息-->
            <el-descriptions class="agent-info-card" :column="2" border>


                <el-descriptions-item>
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <Timer />
                            </el-icon>
                            Agent名称
                        </div>
                    </template>
                    <span class="llm-type">{{ agent.name }}</span>
                </el-descriptions-item>


                <el-descriptions-item width="240px">
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            最大迭代次数
                        </div>
                    </template>
                    <div class="info-content">
                        <el-tag size="large" effect="light" class="stat-tag" type="info">{{ agent.maxRound }}</el-tag>
                    </div>
                </el-descriptions-item>


                <el-descriptions-item span="2">
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            挂载文本库
                        </div>
                    </template>
                    <div class="model-info">{{ this.testJoin(agent.textDbs) }}</div>
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            Agent工具
                        </div>
                    </template>
                    <div class="model-info">{{ this.testJoin(agent.tools) }}</div>
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <Monitor />
                            </el-icon>
                            大模型挂载
                        </div>
                    </template>
                    <div class="model-info">
                        <span class="llm-type">推理：</span>{{ agent.reasoningLLM }}
                        <span class="llm-type">观察：</span>{{ agent.observeLLM }}
                    </div>
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            Agent介绍
                        </div>
                    </template>
                    <div class="agent-desc">{{ agent.desc }}</div>
                </el-descriptions-item>
            </el-descriptions>

            <el-tabs id="answerDiv" v-model="activeName" class="demo-tabs" @tab-click="handleClick"
                style="border:0px solid red;min-height: 480px;">
                <el-tab-pane label="Agent会话" name="query1">
                    <div style="border:0px solid red;">
                        <el-input v-model="this.query" class="searchBox" rows="5" type="textarea"
                            :placeholder="agent.userInstruction"></el-input>
                        <el-button type="primary" @click="doStream" class="searchButton"
                            :disabled="loading">提问</el-button>
                        <div v-loading="loading" class="userSearchResult">
                            <div id="query2Result" v-if="!this.isEmpty(answer) || !this.isEmpty(answer)">
                                <el-divider content-position="left" v-show="this.answer != ''" style="width: 920px;">
                                    <el-text class="mx-1" type="primary">大模型回答</el-text>
                                </el-divider>
                                <div v-html="replaceLnWithBr(this.answer)" class="mx-1" v-show="this.answer != ''">

                                </div>

                                <el-divider content-position="left" v-show="this.logs != ''">
                                    <el-text class="mx-1" type="primary">大模型推理日志</el-text>
                                </el-divider>
                                <div class="agentLogs" v-html="this.replaceLnWithBr(this.logs)"
                                    v-show="this.logs != ''">


                                </div>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(answer) && this.isEmpty(logs)"
                                description="暂无大模型回答" />
                        </div>

                    </div>
                </el-tab-pane>

            </el-tabs>


        </div>
    </user-frame>
</template>




<script>

const UserReActAgentSession = {
    mounted() {
        this.agent_id = this.$javalin.pathParams["agent_id"];
        if (this.agent_id != null) {
            this.fetchAgentData(this.agent_id);
        }
        // 动态加载KaTeX
        const loadKaTeX = () => {
            return loadKatexInstance();
        };

        // 加载KaTeX
        loadKaTeX().then(() => {
            this.katexLoaded = true;
            // 对已加载的消息进行渲染
            this.$nextTick(() => {
                renderExistingLatex('.userSearchResult');
            });
        }).catch(error => {
            console.error('KaTeX加载失败:', error);
        });
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
            try { return arrs.join("，"); } catch (err) { return ""; }
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
            return JSON.stringify(value) === '';
        },
        replaceLnWithBr(text) {
            tt = text.replace('\<think\>', '\<div class="quoteThink"\>')
            tt = tt.replace('\</think\>', '\</div\>')
            tt = marked.parse(tt);
            // 渲染完成后，如果KaTeX已加载，延迟处理LaTeX
            if (this.katexLoaded) {
                this.$nextTick(() => {
                    renderExistingLatex('.userSearchResult');
                });
            }
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
            location.href = ("/user/user_list_react_agent")
        },
        checkQuery(query) {
            // console.log(_MessageBox);
            this.$msgbox(
                {
                    message: 'Agent指令的内容不能为空！',
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
    template: "#user-react-agent-session"
};

app.component("user-react-agent-session", UserReActAgentSession);
</script>


<style>
.page-header {
    margin-bottom: 24px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
}

.agent-info-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin: 24px 0;
    overflow: hidden;
}

.agent-info-card :deep(.el-descriptions__body) {
    background: #ffffff;
}

.agent-info-card :deep(.el-descriptions__label) {
    background: #f8fafc;
    padding: 16px;
}

.agent-info-card :deep(.el-descriptions__title) {
    margin: 16px 20px;
    font-size: 20px;
    font-weight: 600;
    color: #1a56db;
}

.info-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    font-weight: 500;
}

.info-content {
    padding: 8px 0;
}

.model-info {
    color: #334155;
    font-weight: 500;
    padding: 8px 0;
    line-height: 1.6;
}

.stat-tag {
    font-size: 1.1em;
    padding: 8px 16px;
    border-radius: 6px;
}

.llm-type {
    color: #1a56db;
    font-weight: 600;
    margin-right: 4px;
    margin-left: 16px;
}

.llm-type:first-child {
    margin-left: 0;
}

.agent-desc {
    color: #334155;
    line-height: 1.6;
    padding: 8px 0;
}

:deep(.el-descriptions__cell) {
    padding: 16px;
}

.searchBox {
    width: 785px;
    height: 120px;
}

.searchButton {
    height: 120px;
    width: 120px;
    margin-left: 5px;
}

.userSearchResult {
    text-align: left;
    width: 920px;
    margin: 0 auto;
}

.agentLogs {
    margin-top: 20px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}
</style>
