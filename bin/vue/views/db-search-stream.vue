<template id="db-search-streamx">

    <app-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ db == null ? '' : '检索文本库' }} </el-text>
                </template>
            </el-page-header>
            <hr />


            <el-descriptions class="margin-top" :title="form.nickName + '（' + form.name + '）'" :column="2" border>

                <el-descriptions-item width="170px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            文件数量
                        </div>
                    </template>
                    <el-tag size="small" type="success">{{ form.fileNum }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item width="170px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            文本块数量
                        </div>
                    </template>
                    <el-tag size="small" type="success">{{ form.chunkNum }}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Timer />
                            </el-icon>
                            大模型类型
                        </div>
                    </template>
                    {{ form.llmType }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Histogram />
                            </el-icon>
                            大模型生成模式
                        </div>
                    </template>
                    {{ form.generateType }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Histogram />
                            </el-icon>
                            返回文本块类型
                        </div>
                    </template>
                    {{ form.chunkReturnType }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Download />
                            </el-icon>
                            用户问题解析方法
                        </div>
                    </template>
                    {{ form.questionType }}
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            数据库介绍
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        {{ form.desc }}
                    </el-text>
                </el-descriptions-item>

                <el-descriptions-item v-show="form.generateType == 'Chat'">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Download />
                            </el-icon>
                            是否记录历史对话
                        </div>
                    </template>

                    <el-row>
                        <el-col :span="12">
                            <div class="">
                                <el-switch v-model="ifHistory" size="large" active-text="记录历史" inactive-text="单次会话" />
                            </div>
                        </el-col>

                        <el-col :span="12">
                            <div style="margin-top:5px;">
                                <el-link type="primary" :href="'/user/user_rag_session/' + this.db" target="_blank"
                                    title="打开交互式会话窗口">打开会话窗口</el-link>
                            </div>
                        </el-col>
                    </el-row>

                </el-descriptions-item>

            </el-descriptions>

            <el-tabs id="query3Div" v-model="activeName" class="demo-tabs" @tab-click="handleClick"
                style="border:0px solid red;min-height: 480px;">
                <el-tab-pane label="本地检索" name="query1">
                    <div style="border:0px solid red;">
                        <el-input v-model="query1" style="width: 600px;height: 80px;" :rows="3" type="textarea"
                            placeholder="请输入要检索的问题"></el-input>

                        <el-button type="primary" @click="doSearch" class="searchButton"
                            :disabled="loading">检索</el-button>

                        <div v-loading="loading" class="searchResult">
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
                                            {{ item.knnType == 'BM25' ? 'BM25得分' : item.disType == 'COS' ? '余弦相似性' : '欧氏距离' }} ：{{
                                                item.distance
                                            }}，
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
                <el-tab-pane label="大模型问答" name="query2">
                    <div style="border:0px solid red;">
                        <el-input v-model="query2" style="width: 600px;height: 80px;" :rows="3" type="textarea"
                            placeholder="请输入要咨询的问题"></el-input>
                        <el-button type="primary" @click="doStreamLLM" class="searchButton"
                            :disabled="loading">提问</el-button>
                        <div v-loading="loading" class="searchResult">
                            <div id="query2Result" v-if="!this.isEmpty(this.result2)">
                                <el-divider content-position="left" v-show="result2.llmAns != ''">
                                    <el-text class="mx-1" type="primary">大模型回答</el-text>
                                </el-divider>
                                <el-text class="mx-1 llmAnswer" style="font-size: 10pt;"
                                    v-html="replaceLnWithBr(result2.llmAns)"></el-text>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(this.result2)" description="暂无大模型回答" />
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="检索增强生成（RAG）" name="query3">
                    <div style="border:0px solid red;">
                        <el-input v-model="query3" style="width: 600px;height: 80px;" :rows="3" type="textarea"
                            placeholder="请输入要检索并增强生成的问题"></el-input>

                        <el-button type="primary" @click="doStreamRAG" class="searchButton"
                            :disabled="loading">检索生成</el-button>
                        <div v-loading="loading" class="searchResult">
                            <div id="query3Result" v-if="!this.isEmpty(this.result3)">
                                <el-divider content-position="left" v-show="result3.llmRAG != ''">
                                    <el-text class="mx-1" type="primary">大模型检索增强生成（RAG）结果</el-text>
                                </el-divider>
                                <el-text class="mx-1 llmAnswer" style="font-size: 10pt;"
                                    v-html="replaceLnWithBr(result3.llmRAG)"></el-text>
                                <hr v-show="result3.words != null" />
                                <ul v-show="result3.words != null">
                                    <li>
                                        <el-text class="mx-1" type="success">
                                            分词结果：
                                        </el-text>
                                        <el-text class="mx-1" type="info">
                                            {{ result3.words }}
                                        </el-text>

                                    </li>
                                </ul>
                                <ul v-if="result3.questions != null">
                                    <li>
                                        <el-text class="mx-1" type="success">
                                            本地检索问题：
                                        </el-text>
                                        <el-text class="mx-1" type="info">
                                            {{ result3.questions }}
                                        </el-text>

                                    </li>
                                </ul>
                                <el-divider content-position="left" v-if="result3.items != null">
                                    <el-text class="mx-1" type="primary">
                                        本地库检索结果{{ form.ifReRank ? '（结果已重排）' : '' }}，共 {{ result3.items.length }} 条
                                    </el-text>
                                </el-divider>
                                <ul v-if="result3.items != null">
                                    <li v-for="(item, ind) in result3.items" :key="ind">
                                        <el-text class="mx-1" type="info" v-html="replaceLnWithBr(item.chunk)">
                                        </el-text>
                                        <el-text class="mx-1" type="success">
                                            {{ item.knnType == 'BM25' ? 'BM25得分' : item.disType == 'COS' ? '余弦相似性' : '欧氏距离' }} ：{{
                                                item.distance
                                            }}，
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
                            <el-empty :image-size="200" v-show="this.isEmpty(this.result3)" description="暂无生成结果" />

                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

    </app-frame>


</template>


<script>
const DbSearchStreamX = {
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
            activeName: 'query1',
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
                ifAllowDownload: true,
                disType: 'COS',
                ifReRank: true,
            },
            k: 3,
            query1: '',
            query2: '',
            query3: '',
            result1: {},
            result2: {},
            result3: {},
            loading: false,
            currentQuery: '',
            tempRAG: '',
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
            location.href = ("/mag/list_db")
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

        loadHistory() {
            return this.history;
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
                "db": this.db
            }
            let url = "/query";
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.result1 = response.data;
                console.log(this.result1)
                this.loading = false;
            });
        },

        doStreamLLM() {
            if (this.query2.trim() == '') {
                this.checkQuery(this.query2);
                return;
            }
            // this.currentQuery = 'query2';
            this.loading = true;
            if (!this.ifHistory) {
                this.history = [];
            }
            console.log(JSON.stringify(this.history))
            this.result2 = {};
            let params = {
                "model": this.form.llmType,
                "query": this.query2,
                "db": this.db,
                "history": JSON.stringify(this.getRecentHistory()),
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
                if (typeof (this.result2.llmAns) == 'undefined' || this.result2.llmAns == null) {
                    this.result2.llmAns = "";
                }
                this.result2.llmAns += msg;
                // console.log(msg);
                window.scrollTo(0, document.body.scrollHeight);
                // scrollToBottom(this, 'query2Result');
            }

        },
        wsllmclose: function (event) {
            if (event.wasClean) {
                this.pushHistory("user", this.query2);
                this.pushHistory("assistant", this.result2.llmAns);
            } else {
                // 例如服务器进程被杀死或网络中断
                // 在这种情况下，event.code 通常为 1006
                console.log('[close] Connection died');
            }
            this.scrollToSection('query3Div');
            this.loading = false;
        },
        wserror: function (error) {
            this.loading = false;
            console.log(`[error] ${error.message}`);
        },

        doStreamRAG() {
            if (this.query3.trim() == '') {
                this.checkQuery(this.query3);
                return;
            }
            // this.currentQuery = 'query3';
            this.loading = true;
            if (!this.ifHistory) {
                this.history = [];
            }
            console.log(JSON.stringify(this.history))
            this.result3 = {};
            this.tempRAG = "";
            let params = {
                "query": this.query3,
                "k": this.k,
                "db": this.db,
                "history": JSON.stringify(this.getRecentHistory()),
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
                if (typeof (this.result3.llmRAG) == 'undefined' || this.result3.llmRAG == null) {
                    this.result3.llmRAG = "";
                }
                this.result3.llmRAG += msg;
                // if (!ifMultiStep) {
                //     this.tempRAG += msg;
                // }
                window.scrollTo(0, document.body.scrollHeight);
                // scrollToBottom(this, 'query3Result');
            }
            if (msgType == 'QueryResult') {
                if (done) {
                    this.result3 = JSON.parse(msg);
                    // this.result3.llmRAG = this.tempRAG;
                }
            }

        },
        wsragclose: function (event) {
            if (event.wasClean) {
                this.pushHistory("user", this.query3);
                this.pushHistory("assistant", this.result3.llmRAG);
            } else {
                // 例如服务器进程被杀死或网络中断
                // 在这种情况下，event.code 通常为 1006
                console.log('[close] Connection died');
            }
            this.loading = false;
            this.scrollToSection('query3Div');
        },

        getRecentHistory() {
            let num = 10;
            let length = this.history.length;
            if (length > num) {
                // 如果数组长度大于10，取最后10位
                return this.history.slice(-num);
            } else {
                // 否则，取全部元素
                return this.history;
            }
        },

    },
    template: "#db-search-streamx"
};

app.component("db-search-streamx", DbSearchStreamX);
</script>
<style>
.clearfloat {
    clear: both;
}

.searchButton {
    height: 75px;
    width: 80px;
    margin: 0px 0px 0px 5px !important;
    display: inline-block;
    vertical-align: top;
    /* 子元素垂直顶端对齐 */
}

.llmAnswer {
 width: 100%;
}

</style>