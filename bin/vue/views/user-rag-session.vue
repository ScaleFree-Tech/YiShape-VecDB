<template id="user-rag-session">


    <div id="mainWindow" style="margin-top: -68px;">
        <!-- 左侧边栏 -->
        <div class="sidebar">
            <!-- 品牌标题区域 -->
            <div class="brand-section">
                <div class="brand-logo">
                    <img src="/logo2.ico" alt="Logo" class="logo-icon" />
                    <div class="brand-text">
                        <h2 class="brand-title">易形空间</h2>
                        <el-link href="/user/" class="brand-subtitle">
                            <span>向量数据库管理系统</span>
                        </el-link>
                    </div>
                </div>
            </div>

            <!-- 数据库信息区域 -->
            <div class="db-info-container">
                <div class="section-header">
                    <el-icon class="section-icon">
                        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                            <path
                                d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zM192 896V128h640v768H192z" />
                            <path
                                d="M288 328h448c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H288c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM288 508h448c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H288c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM288 688h448c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H288c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z" />
                        </svg>
                    </el-icon>
                    <span class="section-title">数据库信息</span>
                </div>

                <div class="db-info-content">
                    <div class="info-item">
                        <span class="info-label">文本库：</span>
                        <span class="info-value">{{ this.form.name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">文件数量：</span>
                        <span class="info-value">{{ this.form.fileNum }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">文本块数量：</span>
                        <span class="info-value">{{ this.form.chunkNum }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">检索结果返回数：</span>
                        <span class="info-value">{{ this.form.defaultK }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">当前大模型挂载：</span>
                        <span class="info-value">{{ this.form.llmType }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">大模型生成模式：</span>
                        <span class="info-value">{{ this.form.generateType }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">结果重排：</span>
                        <span class="info-value">{{ this.form.ifReRank ? '是' : '否' }}</span>
                    </div>
                </div>
            </div>

            <!-- RAG模式说明区域 -->
            <div class="rag-tip-container">
                <div class="rag-tip-header">
                    <el-icon class="tip-icon">
                        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                            <path
                                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
                        </svg>
                    </el-icon>
                    <span class="tip-title">RAG模式说明</span>
                </div>
                <div class="rag-tip-content">
                    <el-text type="info" size="small">
                        在检索增强生成模式下，系统会基于用户问题进行本地信息检索，然后再将检索结果输入大模型进行重新汇总、编排、补全进行作答，这与纯大模型会话模式显著不同。
                    </el-text>
                </div>
            </div>

            <!-- 版权信息区域 -->
            <div class="footer-section">
                <div class="footer-content">
                    <div class="footer-info">
                        <el-icon class="footer-icon">
                            <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                                <path
                                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                                <path
                                    d="M470.6 673c0 4.4 3.6 8 8 8h66.8c4.4 0 8-3.6 8-8v-61c0-4.4-3.6-8-8-8h-66.8c-4.4 0-8 3.6-8 8v61zm-62.2-219.8c0.8 3.2 3.6 5.4 7 5.4h65.2c5.6 0 9.9-4.9 9.1-10.3-4.4-30.1-3.9-62.2 3.7-91.6 7.4-28.7 22.4-55.5 43.3-77.4 19.6-20.5 45.7-35.8 75.1-44.2 31.4-9 65.3-8.4 96.5 1.4 29.7 9.3 56.3 26.2 76.3 48.5 20.1 22.4 33.1 49.7 37.3 78.6 4.2 28.9 0.9 58.4-9.5 85.2-10.2 26.2-26.6 49.8-47.9 68.2-21.3 18.4-47.4 31.6-75.4 38.4v31.5c0 4.4 3.6 8 8 8h66.8c4.4 0 8-3.6 8-8v-31.5c51.8-12.5 97.4-41.8 129.5-83.2 32.1-41.4 48.9-92.3 47.7-144.7-1.2-52.4-19.6-102.5-52.4-142.4-32.8-39.9-77.9-69.9-128.1-85.3-50.2-15.4-104.3-15.4-154.5 0-50.2 15.4-95.3 45.4-128.1 85.3-32.8 39.9-51.2 90-52.4 142.4-1.2 52.4 15.6 103.3 47.7 144.7 21.5 27.7 49.3 49.7 81.2 64.3z" />
                            </svg>
                        </el-icon>
                        <div class="footer-text">
                            <div class="copyright-line">{{ this.copyright.version }}</div>
                            <div class="copyright-line">{{ this.copyright.copy }}</div>
                            <div class="copyright-line">{{ this.copyright.statement }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-window">
            <div class="chat-header">
                <h4>{{ this.form.llmType }} 检索增强生成会话</h4>
                <div class="right-float">
                    <el-tooltip content="开启新会话" placement="bottom" effect="light">
                        <el-button type="primary" @click="newSession()">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
            <div id="msgsDiv" class="chat-messages">
                <div v-for="(msg, i) in this.messages" :key="msg.id"
                    :class="msg.sender == 'ChatBot' ? 'message' : 'message user'">
                    <img v-if="msg.sender == 'ChatBot' && form.llmType=='YiShape'" src="/images/bot2.webp" />
                    <img v-if="msg.sender == 'ChatBot' && form.llmType=='DeepSeek'" src="/images/deepseek.jpg" />
                    <img v-if="msg.sender == 'ChatBot' && form.llmType=='Ollama'" src="/images/ollama2.png" />
                    <img v-if="msg.sender == 'ChatBot' && form.llmType=='ChatGLM4'" src="/images/chatglm4.png" />

                    <div class="message-content" v-if="msg.sender == 'ChatBot'">
                        <div v-html="this.replaceLnWithBr(msg.content)" class=""></div>

                        <el-select v-model="this.currentIndices" :placeholder="'参考' + msg.items.length + '条信息源'"
                            size="small" style="width: 240px" v-if="msg.items.length > 0"
                            @change="this.selectChange()">
                            <el-option v-for="(item, j) in msg.items" :key="j" :label="extractChunk(item.chunk)"
                                :value="i + ':' + j" />
                        </el-select>
                    </div>

                    <div class="message-content" v-if="msg.sender != 'ChatBot'">
                        <div v-html="this.replaceLnWithBr(msg.content)" class=""></div>
                    </div>
                    <img v-if="msg.sender != 'ChatBot'" src="/images/user.jpg" alt="User Avatar" />


                </div>

                <!-- More messages can be added dynamically -->
            </div>
            <div class="chat-footer">

                <el-input v-model="query" style="height: 75px;" :rows="3" type="textarea" placeholder="请输入要咨询的问题"
                    :disabled="loading"></el-input>
                <el-button type="primary" @click="sendMessage" class="searchButton" :disabled="loading">提问</el-button>

            </div>
        </div>
    </div>


    <el-dialog v-model="this.ifShowPanel" title="参考资料详情" width="600" :before-close="handleClose"
        style="text-align: left;">
        <el-text size="small">
            {{ this.currentChunkInfo.chunk }}
        </el-text>
        <br /><br /><br />
        <el-text type="primary" size="small">
            {{ this.currentChunkInfo.knnType == 'BM25' ? 'BM25得分' : this.currentChunkInfo.disType == 'COS' ? '余弦相似性' : '欧氏距离' }} ：{{ this.currentChunkInfo.distance }}，
        </el-text>&nbsp;&nbsp;&nbsp;
        <el-text type="primary" size="small">文件：</el-text>
        <el-link type="primary" target="_blank" title="点击下载" v-if="form.ifAllowDownload"
            :href="'/download/' + this.db + '/' + this.currentChunkInfo.fileKey" :disabled="!this.form.ifAllowDownload">
            {{ this.currentChunkInfo.filePath }}
        </el-link>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="this.ifShowPanel = false">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>




<script>
const UserRAGSession = {
    mounted() {
        this.db = this.$javalin.pathParams["db"];
        if (this.db != null) {
            this.fetchDbData(this.db);
        }

        // 检查是否需要恢复会话
        let id = this.$javalin.pathParams["sessionId"];
        if (typeof (id) != 'undefined' && id != null) {
            this.sessionId = id;
            this.ifRestore = true;
        } else {
            // 生成唯一性ID
            this.sessionId = generateUUID();
        }

        // 初始化数据库
        this.initDatabase();

        // 动态加载KaTeX
        const loadKaTeX = () => {
            return loadKatexInstance();
        };
        // 加载KaTeX
        loadKaTeX().then(() => {
            this.katexLoaded = true;
            // 对已加载的消息进行渲染
            this.$nextTick(() => {
                renderExistingLatex('.message-content');
            });
        }).catch(error => {
            console.error('KaTeX加载失败:', error);
        });
    },
    data() {
        return {
            db: '',
            query: "",
            llms: getRAGLLMTypes(),
            result: {},
            history: [],
            messages: [ // 消息列表
                { id: 1, sender: 'ChatBot', content: '您好！我可以在文本库检索结果的基础上回答您的问题。请输入您的问题!', items: [] }
            ],
            sessionId: 0,
            ifRestore: false, // 是否恢复会话
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
                ifReRank: true,
            },
            tempRAG: '',
            loading: false,
            copyright: getCopyrightInfo(),
            currentChunkInfo: {},
            currentIndices: '',
            ifShowPanel: false,
            dexieDb: null, // Dexie数据库实例
            katexLoaded: false, // KaTeX是否加载完成
        }
    },
    methods: {
        initDatabase() {
            this.dexieDb = getChatHistoryDB();
            if (this.ifRestore) {
                // 从数据库恢复会话历史
                this.dexieDb.chatHistory
                    .where('id')
                    .equals(this.sessionId)
                    .last()
                    .then(record => {
                        if (record) {
                            // 恢复历史记录和消息
                            // console.log(record);
                            this.history = JSON.parse(record.history) || [];
                            this.messages = JSON.parse(record.messages) || [
                                { id: 1, sender: 'ChatBot', content: '您好！我可以在文本库检索结果的基础上回答您的问题。请输入您的问题！', items: [] }
                            ];
                            // this.scrollToBottom();
                            scrollToBottom(this,'msgsDiv');
                            // console.log(this.messages);
                            // console.log('会话历史已恢复');
                        } else {
                            console.warn('未找到对应的会话历史记录');
                        }
                    })
                    .catch(error => {
                        console.error('恢复会话历史失败:', error);
                    });
            }
        },
        selectChange() {
            this.currentChunkInfo = this.parseChunkInfo(this.currentIndices);
            this.ifShowPanel = true;
        },
        newSession() {
            this.$msgbox(
                {
                    message: '确定要开启新会话吗？这将清除本会话中的所有历史记录！',
                    title: '警告',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                    type: 'warning',
                }
            ).then(() => {
                this.messages = [
                    { id: 1, sender: 'ChatBot', content: '您好！我可以在文本库检索结果的基础上回答您的问题。请输入您的问题！', items: [] }
                ],
                    this.history = [];
                this.sessionId = generateUUID();
            }).catch(() => { });
        },

        sendMessage() {
            if (this.query.trim() == '') {
                this.checkQuery(this.query);
                return;
            }
            // 添加用户消息
            this.messages.push(this.encapsulateMsg(this.query, 'user'));
            this.messages.push(this.encapsulateMsg('', 'ChatBot'));


            this.loading = true;
            this.result = {};
            this.tempRAG = "";

            scrollToBottom(this,'msgsDiv');

            let params = {
                "query": this.query,
                "k": this.form.defaultK,
                "db": this.db,
                "history": JSON.stringify(this.getRecentHistory()),
            }
            let url = "/websocket/rag";
            let socket = new WebSocket("ws://" + location.hostname + ":" + location.port + url);
            socket.onopen = function (e) {
                console.log("[open] Connection established");
                console.log("Sending to server");
                let strr = JSON.stringify(params);
                // console.log(strr);
                socket.send(strr);
            };
            socket.onmessage = this.wsllmmessage;
            socket.onclose = this.wsllmclose;
            socket.onerror = this.wserror;
            
            // 模拟机器人回复
            // setTimeout(() => {
            //     this.messages.push(this.encapsulateMsg('这是机器人的回复','ChatBot'));
            // }, 1000);

            // 清空输入框

        },
        wsllmmessage: function (event) {
            let obj = JSON.parse(event.data)
            // console.log(`[message] Data received from server: ${event.data}`);
            let msgType = obj.type;
            let done = obj.ifDone;
            let msg = obj.msg;
            // console.log(msg);
            let ifMultiStep = obj.ifMultiStep;
            if (msgType == 'Word') {
                this.messages[this.messages.length - 1].content += msg;
                // if (!ifMultiStep) {
                //     this.tempRAG += msg;
                // }
                scrollToBottom(this,'msgsDiv');
            }
            if (msgType == 'QueryResult') {
                if (done) {
                    let result = JSON.parse(msg);
                    console.log(result)
                    // this.result.llmRAG = this.tempRAG;
                    this.messages[this.messages.length - 1].content = result.llmRAG;
                    this.messages[this.messages.length - 1].items = result.items;
                    // this.messages[this.messages.length - 1].chunks = result.chunks;
                    // this.messages[this.messages.length - 1].fileKeys = result.fileKeys;
                    // this.messages[this.messages.length - 1].filePaths = result.filePaths;
                }
            }


        },
        wsllmclose: function (event) {
            if (event.wasClean) {
                this.pushHistory("user", this.query);
                this.pushHistory("assistant", this.messages[this.messages.length - 1].content);
                this.saveDb();
                this.query = '';
            } else {
                // 例如服务器进程被杀死或网络中断
                // 在这种情况下，event.code 通常为 1006
                console.log('[close] Connection died');
            }
            // 清空输入框
            this.query = '';
            this.loading = false;
        },
        wserror: function (error) {
            this.loading = false;
            console.log(`[error] ${error.message}`);
        },


        encapsulateMsg(cnt, who) {
            return { id: this.messages.length + 1, sender: who, content: cnt, items: [] };
            // return { id: this.messages.length + 1, sender: who, content: cnt, chunks: [], fileKeys: [], filePaths: [] };
        },

        pushHistory(role, cnt) {
            this.history.push({ 'sessionId': this.sessionId, 'role': role, 'content': cnt, 'genTime': new Date() });
        },


        saveDb() {
            let saveItem = {
                id: this.sessionId,
                title: this.messages[1].content,
                type: 'RAG',
                db: this.db,
                llmType: this.form.llmType,
                history: JSON.stringify(this.history),
                messages: JSON.stringify(this.messages),
                genTime: new Date(),
            };

            // 保存到Dexie数据库，如果存在相同sessionId则替换
            const newDb = getChatHistoryDB();
            newDb.transaction('rw', newDb.chatHistory, async () => {
                try {
                    const existingRecord = await newDb.chatHistory
                        .where('id')
                        .equals(this.sessionId)
                        .first();

                    if (existingRecord) {
                        await newDb.chatHistory.update(existingRecord.id, saveItem);
                    } else {
                        await newDb.chatHistory.add(saveItem);
                    }
                    console.log('会话历史已保存到数据库');
                } catch (error) {
                    console.error('保存会话历史失败:', error);
                }
            });
        },


        isEmpty(value) {
            return JSON.stringify(value) === '{}';
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
            if (!text) return '';

            // 保护LaTeX公式，避免markdown解析时被影响
            let protectedText = text;

            // 替换思维链标记
            protectedText = protectedText.replace('\<think\>', '\<div class="quoteThink"\>')
            protectedText = protectedText.replace('\</think\>', '\</div\>')

            // 先渲染Markdown
            let result = marked.parse(protectedText);

            // 渲染完成后，如果KaTeX已加载，延迟处理LaTeX
            if (this.katexLoaded) {
                this.$nextTick(() => {
                    renderExistingLatex('.message-content');
                });
            }

            return result;
        },


        fetchDbData() {
            let url = "/api/db_detail/" + this.db;
            axios.get(url).then((response) => {
                this.form = response.data;
                this.k = this.form.defaultK;
            });
        },

        extractFileName(filePath) {
            let p = filePath.lastIndexOf("\\");
            return filePath.substring(p + 1);
        },
        extractChunk(chunk) {
            chunk = chunk.trim();
            let maxLen = 20;
            if (chunk.length > maxLen) {
                let sub = chunk.substring(0, maxLen) + "...";
                return sub;
            }
            return chunk;
        },
        parseChunkInfo(indices) {
            let ij = indices.split(':');
            let i = Number(ij[0]);
            let j = Number(ij[1]);
            let msg = this.messages[i];
            let chunk = msg.items[j].chunk;
            let filePath = msg.items[j].filePath;
            let fileKey = msg.items[j].fileKey;
            let knnType = msg.items[j].knnType; 
            let disType = msg.items[j].disType;
            let distance = msg.items[j].distance;
            // let chunk = msg.chunks[j];
            // let filePath = msg.filePaths[j];
            // let fileKey = msg.fileKeys[j];
            let info = { chunk: chunk, filePath: filePath, fileKey: fileKey, knnType: knnType, disType: disType, distance: distance };
            console.log(info);
            return info;
        },

        getRecentHistory() {
            let num = 100;
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
    template: "#user-rag-session"
};

app.component("user-rag-session", UserRAGSession);
</script>

<style scoped>
/* 主窗口布局样式 */
#mainWindow {
    display: flex;
    height: 100vh;
    margin: 0;
}

/* 左侧边栏样式 */
.sidebar {
    width: 280px;
    background-color: #f5f5f5;
    padding: 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 100vh;
    border-right: 1px solid #e0e0e0;
}

/* 品牌区域样式 */
.brand-section {
    padding: 20px;
    background-color: #409EFF;
    border-bottom: 1px solid #3a8ee6;
    height: 80px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.brand-logo {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-icon {
    width: 36px;
    height: 36px;
    /* background: rgba(255, 255, 255, 0.1); */
    padding: 6px;
    border-radius: 8px;
    object-fit: contain;
}

.brand-text {
    flex: 1;
}

.brand-title {
    margin: 0;
    color: white;
    font-size: 18px;
    font-weight: 600;
}

.brand-subtitle {
    text-decoration: none;
    display: inline-block;
    margin-top: 4px;
}

.brand-subtitle span {
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 400;
}

.brand-subtitle:hover span {
    color: white;
}

/* 数据库信息区域样式 */
.db-info-container {
    margin: 15px;
    background: white;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 15px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
}

.section-icon {
    color: #409EFF;
    font-size: 16px;
}

.section-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.db-info-content {
    padding: 15px;
}

.info-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info-item:last-child {
    margin-bottom: 0;
}

.info-label {
    font-size: 13px;
    color: #666;
    font-weight: normal;
}

.info-value {
    font-size: 13px;
    color: #333;
    font-weight: 500;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
}

/* RAG模式说明区域 */
.rag-tip-container {
    margin: 15px;
    background: white;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.rag-tip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 15px;
    background-color: #f0f8ff;
    border-bottom: 1px solid #b3d9ff;
}

.tip-icon {
    color: #409EFF;
    font-size: 16px;
}

.tip-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.rag-tip-content {
    text-align: left;
    padding: 15px;
}

/* 聊天窗口样式 */
.chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.chat-header {
    background-color: #409EFF;
    color: white;
    padding: 20px;
    text-align: center;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
}

.chat-header h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: white;
}

.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.message {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.message.user {
    justify-content: flex-end;
}

.message img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 10px;
}

.message-content {
    background-color: #f0f0f0;
    padding: 10px 15px;
    border-radius: 10px;
    max-width: 70%;
    word-wrap: break-word;
    text-align: left;
    font-size: 10pt;
}

.message.user .message-content {
    background-color: #409EFF;
    color: white;
}

.chat-footer {
    display: flex;
    padding-top: 10px;
    background-color: #f5f5f5;
}

.chat-input {
    flex: 1;
    margin-right: 10px;
}

/* 底部版权区域样式 */
.footer-section {
    margin-top: auto;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
}

.footer-content {
    padding: 15px;
}

.footer-info {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.footer-icon {
    color: #666;
    font-size: 16px;
    margin-top: 2px;
    flex-shrink: 0;
}

.footer-text {
    flex: 1;
}

.copyright-line {
    color: #666;
    font-size: 11px;
    line-height: 1.4;
    margin-bottom: 2px;
}

.copyright-line:last-child {
    margin-bottom: 0;
}

.searchButton {
    height: 75px;
    width: 80px;
    margin-left: 5px;
}

.right-float {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: auto;
}
</style>
<!-- 添加全局样式以修复KaTeX渲染问题 -->
<style>
/* 修复KaTeX渲染导致的空白问题 */
.katex-display {
    margin: 0.5em 0 !important;
    overflow-x: auto;
    overflow-y: hidden;
}

/* 确保行内公式正确显示 */
.katex {
    font-size: 1.1em !important;
    line-height: 1.2 !important;
}

/* 修复可能的溢出问题 */
.message-content .katex-html {
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}
</style>