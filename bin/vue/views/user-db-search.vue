<template id="user-db-search">

    <user-frame>

        <div style="padding-left: 0px; margin: 0 auto;">

            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ db == null ? '' : '检索文本库' }} </el-text>
                </template>
            </el-page-header>
            <hr />
            <el-descriptions class="margin-top" :column="2" border>

                <el-descriptions-item width="220px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            数据库名
                        </div>
                    </template>
                    {{ form.nickName }}（{{ form.name }}）
                </el-descriptions-item>
                <el-descriptions-item width="240px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            检索返回结果数
                        </div>
                    </template>
                    <el-tag size="small" type="success">{{ form.defaultK }}</el-tag>
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
                                <Download />
                            </el-icon>
                            是否允许下载源文件
                        </div>
                    </template>
                    {{ form.ifAllowDownload }}
                </el-descriptions-item>

                <el-descriptions-item v-show="form.generateType == 'Chat'">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Download />
                            </el-icon>
                            是否记录历史对话信息
                        </div>
                    </template>
                    <el-switch v-model="ifHistory" size="large" active-text="记录历史" inactive-text="单次会话" />
                </el-descriptions-item>


            </el-descriptions>

            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">

                <el-tab-pane label="检索增强生成（RAG）" name="queryRAG">
                    <div style="border:0px solid red;">
                        <el-input v-model="queryRAG" class="searchBox" :rows="searchBoxLines" type="textarea"
                            placeholder="请输入要检索并增强生成的问题"></el-input>
                        <el-button type="primary" @click="doRAG" class="searchButton"
                            :disabled="loading">检索生成</el-button>
                        <div v-loading="loading" class="userSearchResult">
                            <div id="queryRAGResult" v-if="!this.isEmpty(this.resultRAG)">
                                <el-divider content-position="left">
                                    <el-text class="mx-1" type="primary">
                                        大模型检索增强生成结果
                                    </el-text>
                                </el-divider>
                                <el-text class="mx-1" v-html="replaceLnWithBr(resultRAG.llmRAG)"></el-text>
                                <el-divider content-position="left">
                                    <el-text class="mx-1" type="primary">
                                        本地库中检索到的结果{{ form.ifReRank ? '（结果已重排）' : '' }}，共 {{ resultRAG.items.length }} 条
                                    </el-text>
                                </el-divider>
                                <ul>
                                    <li v-for="(item, ind) in resultRAG.items" :key="ind">
                                        <el-text class="mx-1" type="info" v-html="replaceLnWithBr(item.chunk)">
                                        </el-text>
                                        <br />
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
                            <el-empty :image-size="200" v-show="this.isEmpty(this.resultRAG)" description="暂无生成结果" />
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="大模型问答" name="queryLLM">
                    <div style="border:0px solid red;">
                        <el-input v-model="queryLLM" class="searchBox" :rows="searchBoxLines" type="textarea"
                            placeholder="请输入要咨询的问题"></el-input>
                        <el-button type="primary" @click="doLLM" class="searchButton" :disabled="loading">提问</el-button>
                        <div v-loading="loading" class="userSearchResult">
                            <div id="queryLLMResult" v-if="!this.isEmpty(this.resultLLM)">
                                <el-divider content-position="left"><el-text class="mx-1"
                                        type="primary">大模型回答</el-text></el-divider>
                                <el-text class="mx-1" v-html="replaceLnWithBr(resultLLM.llmAns)"></el-text>
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
                                <el-divider content-position="left">
                                    <el-text class="mx-1" type="primary">
                                        本地库中检索到的结果{{ form.ifReRank ? '（结果已重排）' : '' }}，共 {{ result1.items.length }} 条
                                    </el-text>
                                </el-divider>
                                <ul>
                                    <li v-for="(item, ind) in result1.items">
                                        <el-text class="mx-1" type="info" v-html="replaceLnWithBr(item.chunk)">
                                        </el-text>
                                        <br />
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
const UserDbSearch = {
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
                renderExistingLatex('.userSearchResult');
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
            let url = "/api/text_db_detail/" + this.db;
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
        doLLM() {
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
            let params = {
                "model": this.form.llmType,
                "query": this.queryLLM,
                "db": this.db,
                "history": JSON.stringify(this.history),
            }
            let url = "/llm";
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 600000,
            }).then((response) => {
                this.resultLLM = response.data;
                this.pushHistory("User", this.queryLLM);
                this.pushHistory("Assistant", this.resultLLM.llmAns);
                this.resultLLM.llmAns = this.resultLLM.llmAns.replace(/(\r\n|\r|\n)/g, '<br/>')
                this.loading = false;
            });
        },
        doRAG() {
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
            let params = {
                "query": this.queryRAG,
                "k": this.k,
                "db": this.db,
                "history": JSON.stringify(this.history),
            }
            let url = "/rag";
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 600000,
            }).then((response) => {
                this.resultRAG = response.data;
                this.pushHistory("User", this.queryRAG);
                this.pushHistory("Assistant", this.resultRAG.llmRAG);
                // this.resultRAG.llmRAG = this.resultRAG.llmRAG.replace(/(\r\n|\r|\n)/g, '<br/>')
                this.loading = false;
            });
        },

    },
    template: "#user-db-search"
};

app.component("user-db-search", UserDbSearch);
</script>
<style>
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
    width: 800px;
    height: 120px;
}
</style>
