<template id="user-db-search-stream">

    <user-frame>

        <div class="container">


            <el-page-header @back="gotoList()" class="page-header">
                <template #content>
                    <el-text class="page-title" size="large">{{ db == null ? '' : '检索文本库' }}</el-text>
                </template>
            </el-page-header>

            <!-- 数据库信息 -->
            <el-descriptions class="db-info-card" :column="2" border>
                <el-descriptions-item width="220px">
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            数据库
                        </div>
                    </template>
                    <div class="info-content">
                        <span class="db-name">{{ form.nickName }}</span>
                        <span class="db-id">({{ form.name }})</span>
                    </div>
                </el-descriptions-item>
                <el-descriptions-item width="240px">
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            文本块总数
                        </div>
                    </template>
                    <el-tag size="large" effect="light" class="stat-tag" type="success">{{ form.chunkNum }}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <Timer />
                            </el-icon>
                            大模型类型
                        </div>
                    </template>
                    <div class="model-info">{{ form.llmType }}</div>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <Histogram />
                            </el-icon>
                            大模型生成模式
                        </div>
                    </template>
                    <div class="model-info">{{ form.generateType }}</div>
                </el-descriptions-item>

                <el-descriptions-item v-show="form.generateType == 'Chat'" class="chat-settings">
                    <template #label>
                        <div class="info-label">
                            <el-icon :style="iconStyle">
                                <Download />
                            </el-icon>
                            是否记录历史对话
                        </div>
                    </template>

                    <el-row class="chat-controls">
                        <el-col :span="12">
                            <div class="switch-wrapper">
                                <el-switch v-model="ifHistory" size="large" active-text="记录历史" inactive-text="单次会话" />
                            </div>
                        </el-col>

                        <el-col :span="12">
                            <div class="chat-link">
                                <el-link type="primary" :href="'/user/user_rag_session/' + this.db" target="_blank"
                                    title="打开交互式会话窗口">打开会话窗口</el-link>
                            </div>
                        </el-col>
                    </el-row>
                </el-descriptions-item>
            </el-descriptions>

            <el-tabs id="query3Div" v-model="activeName" class="demo-tabs" @tab-click="handleClick"
                style="border:0px solid red;min-height: 480px;">

                <el-tab-pane label="检索增强生成（RAG）" name="queryRAG">
                    <div style="border:0px solid red;">
                        <el-input v-model="queryRAG" class="searchBox" :rows="searchBoxLines" type="textarea"
                            placeholder="请输入要检索并增强生成的问题"></el-input>
                        <el-button type="primary" @click="doStreamRAG" class="searchButton"
                            :disabled="loading">检索生成</el-button>
                        <div v-loading="loading" class="userSearchResult">
                            <div id="queryRAGResult" v-if="!this.isEmpty(this.resultRAG)">
                                <el-divider content-position="left"><el-text class="mx-1"
                                        type="primary">大模型检索增强生成结果</el-text></el-divider>
                                <el-text class="mx-1 llmAnswer" v-html="replaceLnWithBr(resultRAG.llmRAG)"></el-text>

                                <hr v-if="resultRAG.words != null" />
                                <ul v-if="resultRAG.words != null">
                                    <li>
                                        <el-text class="mx-1" type="success">
                                            分词结果：
                                        </el-text>
                                        <el-text class="mx-1" type="info">
                                            {{ resultRAG.words }}
                                        </el-text>

                                    </li>
                                </ul>
                                <ul v-if="resultRAG.questions != null">
                                    <li>
                                        <el-text class="mx-1" type="success">
                                            本地检索问题：
                                        </el-text>
                                        <el-text class="mx-1" type="info">
                                            {{ resultRAG.questions }}
                                        </el-text>

                                    </li>
                                </ul>


                                <el-divider content-position="left" v-if="this.resultRAG.items != null">
                                    <el-text class="mx-1" type="primary">
                                        本地库中检索到的结果{{ form.ifReRank ? '（结果已重排）' : '' }}，共 {{ resultRAG.items.length }} 条
                                    </el-text>
                                </el-divider>
                                <ul v-if="this.resultRAG.items != null">
                                    <li v-for="(item, ind) in resultRAG.items" :key="ind">
                                        <el-text class="mx-1" type="info" v-html="replaceLnWithBr(item.chunk)">
                                        </el-text>
                                        <el-text class="mx-1" type="success">
                                            {{ item.knnType == 'BM25' ? 'BM25得分' : item.disType == 'COS' ? '余弦相似性' : '欧氏距离' }} ：{{ item.distance }}，文件：
                                        </el-text>
                                        <el-link type="success" target="_blank" title="点击下载" v-if="form.ifAllowDownload"
                                            :href="'/download/' + form.name + '/' + item.fileKeys">
                                            文件：{{ extractFileName(item.filePath) }}
                                        </el-link>
                                        <el-text type="success" v-if="!form.ifAllowDownload">
                                            文件：{{ extractFileName(item.filePath) }}
                                        </el-text>
                                    </li>
                                </ul>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(this.resultRAG)" description="暂无生成结果" />
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="大模型问答" name="queryLLM">
                    <div style="border:0px solid red;">
                        <el-input v-model="queryLLM" class="searchBox" :rows="searchBoxLines" type="textarea"
                            placeholder="请输入要咨询的问题"></el-input>
                        <el-button type="primary" @click="doStreamLLM" class="searchButton"
                            :disabled="loading">提问</el-button>
                        <div v-loading="loading" class="userSearchResult">
                            <div id="queryLLMResult" v-if="!this.isEmpty(this.resultLLM)">
                                <el-divider content-position="left"><el-text class="mx-1"
                                        type="primary">大模型回答</el-text></el-divider>
                                <el-text class="mx-1 llmAnswer" v-html="replaceLnWithBr(resultLLM.llmAns)"></el-text>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(this.resultLLM)" description="暂无大模型回答" />
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="检索" name="query1">
                    <div style="border:0px solid red;">
                        <el-input v-model="query1" class="searchBox" :rows="searchBoxLines" type="textarea"
                            placeholder="请输入要检索的问题"></el-input>

                        <el-button type="primary" @click="doSearch" class="searchButton"
                            :disabled="loading">检索</el-button>

                        <div v-loading="loading" class="userSearchResult">
                            <div id="query1Result" style=" border: 0px solid gray;" v-if="!this.isEmpty(this.result1)">

                                <ul>
                                    <li>
                                        <el-text class="mx-1" type="success">
                                            分词结果：
                                        </el-text>
                                        <el-text class="mx-1" type="info">
                                            {{ result1.words }}
                                        </el-text>

                                    </li>
                                </ul>
                                <el-divider content-position="left">
                                    <el-text class="mx-1" type="primary">
                                        本地库中检索到的结果{{ form.ifReRank ? '（结果已重排）' : '' }}，共 {{ result1.items.length }} 条
                                    </el-text>
                                </el-divider>
                                <ul>
                                    <li v-for="(item, ind) in result1.items">
                                        <el-text class="mx-1" type="info" v-html="replaceLnWithBr(item.chunk)">
                                        </el-text>
                                        <el-text class="mx-1" type="success">
                                            {{ item.knnType == 'BM25' ? 'BM25得分' : item.disType == 'COS' ? '余弦相似性' : '欧氏距离' }} ：{{ item.distance }}，文件：
                                        </el-text>
                                        <el-link type="success" target="_blank" title="点击下载" v-if="form.ifAllowDownload"
                                            :href="'/download/' + form.name + '/' + item.fileKey">
                                            文件：{{ extractFileName(item.filePath) }}
                                        </el-link>
                                        <el-text type="success" v-if="!form.ifAllowDownload">
                                            文件：{{ extractFileName(item.filePath) }}
                                        </el-text>
                                    </li>
                                </ul>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(this.result1)" description="暂无检索结果" />
                        </div>

                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>

    </user-frame>


</template>


<script>
const UserDbSearchStream = {
    mounted() {
        this.db = this.$javalin.pathParams["db"];
        if (this.db != null) {
            this.fetchDbData(this.db);
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
                renderExistingLatex('.llmAnswer');
            });
        }).catch(error => {
            console.error('KaTeX加载失败:', error);
        });
    },
    data() {
        return {
            searchBoxLines: 5,
            activeName: 'queryRAG',
            db: '',
            ifHistory: false,
            history: [],
            sessionId: 0,
            form: {
                name: '',
                status: '',
                type: '',
                tempDataSourcePath: '',
                llmType: '',
                llmPrompt: '',
                desc: '',
                genTime: '',
                chunkNum: 0,
                defaultK: 5,
                ifReRank: true,
            },
            k: 3,
            query1: '',
            queryLLM: '',
            queryRAG: '',
            result1: {},
            resultLLM: {},
            resultRAG: {},
            loading: false,
            currentQuery: '',
            katexLoaded: false, // KaTeX是否加载完成
        }
    },
    methods: {
        isEmpty(value) {
            return JSON.stringify(value) === '{}';
        },
        extractFileName(filePath) {
            let p = filePath.lastIndexOf("\\");
            return filePath.substring(p + 1);
        },
        replaceLnWithBr(text) {
            tt = text.replaceAll('\<think\>', '\<div class="quoteThink"\>')
            tt = tt.replaceAll('\</think\>', '\</div\>')
            tt = marked.parse(tt);
            // 渲染完成后，如果KaTeX已加载，延迟处理LaTeX
            if (this.katexLoaded) {
                this.$nextTick(() => {
                    renderExistingLatex('.llmAnswer');
                });
            }
            return tt;
        },
        handleClick(tab, event) {
            this.currentQuery = tab.props['name'];
            this.loading = false;
            // console.log(this.currentQuery)
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/user/user_list_db")
        },
        fetchDbData() {
            let url = "/api/db_detail/" + this.db;
            axios.get(url).then((response) => {
                this.form = response.data;
                this.k = this.form.defaultK;
            });
        },
        checkQuery(query) {
            // console.log(_MessageBox);
            this.$msgbox(
                {
                    message: '检索的内容不能为空！',
                    title: '警告',
                    confirmButtonText: '确认',
                    type: 'warning',
                }
            );
            // alert('检索的内容不能为空！');
        },

        scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动
            }
        },

        pushHistory(role, cnt) {
            this.history.push({ 'sessionId': this.sessionId, 'role': role, 'content': cnt, 'genTime': new Date() });
        },

        doSearch() {
            if (this.query1.trim() == '') {
                this.checkQuery(this.query1);
                return;
            }
            // this.currentQuery = 'query1';
            this.loading = true;
            let params = {
                "query": this.query1,
                "k": this.k,
                "db": this.db,
            }
            let url = "/query";
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then((response) => {
                this.result1 = response.data;
                console.log(this.result1)
                this.loading = false;
            });
        },

        doStreamLLM() {
            if (this.queryLLM.trim() == '') {
                this.checkQuery(this.queryLLM);
                return;
            }
            // this.currentQuery = 'query2';
            this.loading = true;
            if (!this.ifHistory) {
                this.history = [];
            }
            console.log(JSON.stringify(this.history))
            this.resultLLM = {};
            let params = {
                "model": this.form.llmType,
                "query": this.queryLLM,
                "db": this.db,
                "history": JSON.stringify(this.history),
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
            let ifMultiStep = obj.ifMultiStep;
            if (msgType = 'Word') {
                if (typeof (this.resultLLM.llmAns) == 'undefined' || this.resultLLM.llmAns == null) {
                    this.resultLLM.llmAns = "";
                }
                this.resultLLM.llmAns += msg;
                // console.log(msg);
                // scrollToBottom(this, 'queryLLMResult');
                window.scrollTo(0, document.body.scrollHeight);
            }

        },
        wsllmclose: function (event) {
            if (event.wasClean) {
                this.pushHistory("user", this.queryLLM);
                this.pushHistory("assistant", this.resultLLM.llmAns);
            } else {
                // 例如服务器进程被杀死或网络中断
                // 在这种情况下，event.code 通常为 1006
                console.log('[close] Connection died');
            }
            this.loading = false;
            this.scrollToSection('query3Div');
        },
        wserror: function (error) {
            this.loading = false;
            console.log(`[error] ${error.message}`);
        },

        doStreamRAG() {
            if (this.queryRAG.trim() == '') {
                this.checkQuery(this.queryRAG);
                return;
            }
            // this.currentQuery = 'query3';
            this.loading = true;
            if (!this.ifHistory) {
                this.history = [];
            }
            console.log(JSON.stringify(this.history))
            this.resultRAG = {};
            this.tempRAG = "";
            let params = {
                "query": this.queryRAG,
                "k": this.k,
                "db": this.db,
                "history": JSON.stringify(this.history),
            }
            let url = "/websocket/rag";
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
            let msgType = obj.type;
            let done = obj.ifDone;
            let msg = obj.msg;
            // console.log(msg);
            let ifMultiStep = obj.ifMultiStep;
            if (msgType == 'Word') {
                if (typeof (this.resultRAG.llmRAG) == 'undefined' || this.resultRAG.llmRAG == null) {
                    this.resultRAG.llmRAG = "";
                }
                this.resultRAG.llmRAG += msg;
                // if (!ifMultiStep) {
                //     this.tempRAG += msg;
                // }
                window.scrollTo(0, document.body.scrollHeight);
                // scrollToBottom(this, 'queryRAGResult');
            }
            if (msgType == 'QueryResult') {
                if (done) {
                    this.resultRAG = JSON.parse(msg);
                    // this.resultRAG.llmRAG = this.tempRAG;
                }
            }

        },
        wsragclose: function (event) {
            if (event.wasClean) {
                this.pushHistory("User", this.queryRAG);
                this.pushHistory("Assistant", this.resultRAG.llmRAG);
            } else {
                // 例如服务器进程被杀死或网络中断
                // 在这种情况下，event.code 通常为 1006
                console.log('[close] Connection died');
            }
            this.scrollToSection('query3Div');
            this.loading = false;
        },


    },
    template: "#user-db-search-stream"
};

app.component("user-db-search-stream", UserDbSearchStream);
</script>
<style>
.container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

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

.clearfloat {

    clear: both;

}

.userSearchResult {
    text-align: left;
    width: 920px;
    margin: 0 auto;

}

.searchButton {
    height: 120px;
    width: 120px;
    margin-left: 5px;
}

.searchBox {
    width: 790px;
    height: 120px;
}

.db-info-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin: 24px 0;
    overflow: hidden;
}

.db-info-card :deep(.el-descriptions__body) {
    background: #ffffff;
}

.db-info-card :deep(.el-descriptions__label) {
    background: #f8fafc;
    padding: 16px;
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

.db-name {
    font-weight: 600;
    color: #1a56db;
    margin-right: 8px;
}

.db-id {
    color: #64748b;
    font-size: 0.9em;
}

.stat-tag {
    font-size: 1.1em;
    padding: 8px 16px;
    border-radius: 6px;
}

.model-info {
    color: #334155;
    font-weight: 500;
    padding: 8px 0;
}

.chat-settings {
    background: #f8fafc;
}

.chat-controls {
    display: flex;
    align-items: center;
    padding: 8px 0;
}

.switch-wrapper {
    display: flex;
    align-items: center;
}

.chat-link {
    padding-left: 16px;
}

:deep(.el-descriptions__cell) {
    padding: 16px;
}

.llmAnswer {
 width: 100%;
}
</style>
