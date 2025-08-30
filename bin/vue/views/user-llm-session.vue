<!-- 大模型会话组件 - 实现与AI大模型的实时对话交互 -->
<template id="user-llm-session">
    <!-- 主窗口容器 -->
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

            <!-- 模型选择区域 -->
            <div class="model-selection-container">
                <div class="section-header">
                    <el-icon class="section-icon">
                        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                            <path
                                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
                        </svg>
                    </el-icon>
                    <span class="section-title">大语言模型设置</span>
                </div>

                <div class="model-selection-content">
                    <div class="selection-label">
                        <el-text class="label-text">当前挂载模型</el-text>
                    </div>
                    <el-select v-model="this.llmType" placeholder="选择大模型" class="model-select" size="default">
                        <el-option v-for="item in llms" :key="item.modelExpr" :label="item.modelExpr" :value="item.modelExpr" />
                    </el-select>
                </div>
<!--
                <div class="model-selection-content">
                    <div class="selection-label">
                        <el-text class="label-text">生成方式</el-text>
                    </div>
                    <el-select v-model="this.generateType" placeholder="选择生成方式" class="model-select" size="default">
                        <el-option v-for="gt in generateTypes" :key="gt.value" :label="gt.label" :value="gt.value" />
                    </el-select>
                </div>
            -->
                <div class="model-selection-content">
                    <div class="selection-label">
                        <el-text class="label-text">是否开启深度思考</el-text>
                        <el-tooltip content="深度思考功能仅适用于Qwen和DeepSeek模型" placement="top" effect="light">
                            <el-icon class="info-icon">
                                <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
                                </svg>
                            </el-icon>
                        </el-tooltip>
                    </div>
                    <el-switch v-model="this.ifThink" :disabled="!isThinkSupported()" />
                    <div v-if="!isThinkSupported()" class="feature-tip">
                        <el-text type="info" size="small">当前模型不支持深度思考功能</el-text>
                    </div>
                </div>
            </div>

            <!--文件上传组件-->
            <div class="upload-container">
                <div class="upload-header">
                    <el-icon class="upload-icon">
                        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                            <path
                                d="M544 864V672h128L512 480 352 672h128v192H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32H544zm-16-384H416l112-112 112 112H528z" />
                        </svg>
                    </el-icon>
                    <span class="upload-title">文件助手</span>
                </div>

                <el-upload ref="uploadRef" class="upload-component" action="" :limit="2" :auto-upload="false"
                    :http-request="doUpload" :on-change="handleFileChange" multiple :show-file-list="true"
                    :file-list="displayFiles" list-type="text">
                    <template #trigger>
                        <el-button type="primary" plain class="upload-btn">
                            <el-icon>
                                <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                                    <path
                                        d="M928 160H704l-32.4-90.8c-1.3-3.4-4.4-5.2-8.2-5.2H360.6c-3.8 0-6.9 1.8-8.2 5.2L320 160H96c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32zM864 832H160c-17.7 0-32-14.3-32-32V320h768v480c0 17.7-14.3 32-32 32z" />
                                </svg>
                            </el-icon>
                            选择文件
                        </el-button>
                    </template>
                    <div class="upload-buttons">
                        <el-button class="upload-submit-btn" type="primary" @click="submitUpload"
                            :loading="uploadLoading" :disabled="!hasRealFiles()">
                            <el-icon v-if="!uploadLoading">
                                <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                                    <path
                                        d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163.1c-3.8-4.8-11.8-4.8-15.6 0L390.7 304.8c-4.1 5.2-.4 12.9 6.3 12.9z" />
                                    <path
                                        d="M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z" />
                                </svg>
                            </el-icon>
                            <el-icon v-else>
                                <svg class="is-loading" viewBox="0 0 1024 1024" width="1em" height="1em"
                                    fill="currentColor">
                                    <path
                                        d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 84 101.7 109.8 162.7C1010.5 375.8 1024 442.9 1024 512c0 69.1-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.7 84-162.7 109.8C648.2 1010.5 581.1 1024 512 1024z" />
                                </svg>
                            </el-icon>
                            {{ uploadLoading ? '上传中...' : '上传到服务器' }}
                        </el-button>

                    </div>
                </el-upload>

                <!-- 上传状态显示 -->
                <div class="upload-status-container">
                    <div class="status-indicator">
                        <el-icon :class="uploadOK ? 'status-icon success' : 'status-icon pending'">
                            <svg v-if="uploadOK" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                                <path
                                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" />
                            </svg>
                            <svg v-else viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                                <path
                                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 768c-176.4 0-320-143.6-320-320s143.6-320 320-320 320 143.6 320 320-143.6 320-320 320z" />
                                <path
                                    d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.9-11.2z" />
                            </svg>
                        </el-icon>
                        <span class="status-text" :class="uploadOK ? 'success-text' : 'pending-text'">
                            {{ uploadOK ? '上传成功' : '暂未上传' }}
                        </span>
                    </div>
                </div>



                <div class="upload-tip">
                    <el-icon class="tip-icon">
                        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                            <path
                                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
                        </svg>
                    </el-icon>
                    <el-text type="info" size="small">
                        最多支持2个文件，如需上传更多文件请在管理端构建文本库。
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
        <!-- 聊天窗口主体 -->
        <div class="chat-window">
            <div class="chat-header">
                <h4>{{ this.llmType }} 大模型会话</h4>
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
                <div v-for="msg in this.messages" :key="msg.id"
                    :class="msg.sender == 'ChatBot' ? 'message' : 'message user'">
                    <img v-if="msg.sender == 'ChatBot' && llmType.startsWith('YiShape')" src="/images/bot2.webp" />
                    <img v-if="msg.sender == 'ChatBot' && llmType.startsWith('DeepSeek')" src="/images/deepseek.jpg" />
                    <img v-if="msg.sender == 'ChatBot' && llmType.startsWith('Ollama')" src="/images/ollama2.png" />
                    <img v-if="msg.sender == 'ChatBot' && llmType.startsWith('ChatGLM')" src="/images/chatglm4.png" />
                    <img v-if="msg.sender == 'ChatBot' && llmType.startsWith('Qwen')" src="/images/qwen.png" />
                    <img v-if="msg.sender == 'ChatBot' && llmType.startsWith('Kimi')" src="/images/kimi.jfif" />
                    <div v-if="msg.sender == 'ChatBot'" class="message-content"
                        v-html="this.replaceLnWithBr(msg.content)">
                    </div>

                    <div v-if="msg.sender != 'ChatBot'" class="message-content"
                        v-html="this.replaceLnWithBr(msg.content)">
                    </div>
                    <img v-if="msg.sender != 'ChatBot'" src="/images/user.jpg" alt="User" />
                </div>

                <!-- More messages can be added dynamically -->
            </div>
            <div class="chat-footer">

                <el-input v-model="query" style="height: 75px;" :rows="3" type="textarea" placeholder="请输入要咨询的问题"
                    :disabled="loading">
                </el-input>
                <el-button type="primary" @click="sendMessage" class="searchButton" :disabled="loading">提问</el-button>

            </div>
        </div>
    </div>
</template>

<script>
// 定义用户LLM会话组件
const UserLLMSession = {
    // 组件挂载时执行
    mounted() {
        this.loadLLMModels();

        // 获取URL中的LLM类型参数
        let tt = this.$javalin.pathParams["llmType"];
        if (typeof (tt) != 'undefined' && tt != null) {
            this.llmType = tt;
        }
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
    // 组件数据
    data() {
        return {
            ifRestore: false, // 是否恢复会话
            query: "", // 用户输入的查询内容
            llms: [], // 获取可用的LLM模型列表
            llmType: "DeepSeek", // 当前选择的LLM类型
            ifThink:false,// 是否开启思考
            generateType:"Chat",// 生成类型:Chat,Generate
            generateTypes:[{value:"Chat",label:"聊天式"},{value:"Generate",label:"生成式"}],// 生成类型:Chat,Generate
            history: [], // 对话历史记录
            messages: [ // 消息列表
                { id: 1, sender: 'ChatBot', content: '您好！有什么可以帮助您的吗？' }
            ],
            sessionId: 0, // 会话ID
            loading: false, // 加载状态
            uploadLoading: false, // 上传状态
            copyright: getCopyrightInfo(), // 版权信息
            db: null, // Dexie数据库实例
            katexLoaded: false, // KaTeX是否加载完成
            uploadRef: null,
            uploadFiles: [], // 存储待上传的文件列表
            uploadOK: false, // 存储上传结果
            restoredFiles: [], // 临时存储恢复的文件列表
            displayFiles: [], // 用于显示的文件列表（响应式）
        }
    },
    methods: {
        initDatabase() {
            this.db = getChatHistoryDB();
            if (this.ifRestore) {
                // 从数据库恢复会话历史
                this.db.chatHistory
                    .where('id')
                    .equals(this.sessionId)
                    .last()
                    .then(record => {
                        if (record) {
                            console.log(record);
                            // 恢复历史记录和消息
                            this.llmType = record.llmType;
                            this.generateType = record.generateType || "Chat";  
                            this.ifThink = record.ifThink || false;
                            this.history = JSON.parse(record.history) || [];
                            this.messages = JSON.parse(record.messages) || [
                                { id: 1, sender: 'ChatBot', content: '您好！有什么可以帮助您的吗？' }
                            ];
                            
                            // 恢复上传文件信息
                            if (record.uploadFiles) {
                                try {
                                    let uploadFilesInfo = JSON.parse(record.uploadFiles) || [];
                                    console.log('恢复的文件信息:', uploadFilesInfo);
                                    
                                    // 注意：这里只能恢复文件信息，不能恢复实际的File对象
                                    // 因为File对象无法序列化保存到数据库，所以保存文件信息用于显示
                                    this.uploadFiles = uploadFilesInfo;
                                    
                                    console.log('uploadFiles设置为:', this.uploadFiles);
                                    
                                    // 保存恢复的文件信息到组件数据中，稍后设置
                                    this.restoredFiles = uploadFilesInfo.map((fileInfo, index) => ({
                                        name: fileInfo.name,
                                        size: fileInfo.size,
                                        status: 'success',
                                        uid: 'restored_' + index + '_' + Date.now(),
                                        url: null,
                                        percentage: 100,
                                        raw: null // 没有原始文件对象
                                    }));
                                    
                                    // 同时设置响应式显示文件列表（使用Element UI需要的格式）
                                    this.displayFiles = uploadFilesInfo.map((fileInfo, index) => ({
                                        name: fileInfo.name,
                                        size: fileInfo.size,
                                        status: 'success',
                                        uid: 'restored_' + index + '_' + Date.now(),
                                        url: null,
                                        percentage: 100
                                        // 注意：不包含raw属性，因为这是恢复的文件
                                    }));
                                    
                                    console.log('保存的恢复文件列表:', this.restoredFiles);
                                    console.log('设置的显示文件列表（Element UI格式）:', this.displayFiles);
                                    
                                    // 恢复上传状态 - 在这里先设置，确保时机正确
                                    this.uploadOK = record.uploadOK || false;
                                    console.log('uploadOK设置为:', this.uploadOK);
                                    
                                    // 简单的延迟设置
                                    console.log('准备设置恢复文件');
                                    
                                    setTimeout(() => {
                                        console.log('开始设置恢复文件');
                                        this.setRestoredFiles();
                                    }, 200);
                                } catch (error) {
                                    console.error('恢复文件信息时出错:', error);
                                }
                            }
                            
                            // console.log('会话历史已恢复');
                            // this.scrollToBottom();
                            scrollToBottom(this, 'msgsDiv');
                        } else {
                            console.warn('未找到对应的会话历史记录');
                        }
                    })
                    .catch(error => {
                        console.error('恢复会话历史失败:', error);
                    });
            }
        },
        newSession() {//开启新会话
            this.$msgbox(
                {
                    message: '确定要开启新会话吗？这将清除本会话中的所有历史记录和上传的文件！',
                    title: '警告',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                    type: 'warning',
                }
            ).then(() => {
                this.messages = [
                    { id: 1, sender: 'ChatBot', content: '您好！有什么可以帮助您的吗？' }
                ];
                this.history = [];
                this.sessionId = generateUUID();
                // 清空上传文件列表和重置上传状态
                this.uploadFiles = [];
                this.uploadOK = false;
                this.restoredFiles = []; // 清空恢复的文件列表
                this.displayFiles = []; // 清空显示文件列表
                // 清空上传组件的文件列表
                if (this.$refs.uploadRef) {
                    this.$refs.uploadRef.clearFiles();
                }
                // console.log(this.sessionId);
            }).catch(() => { });
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

            // 在DOM更新后滚动到底部
            // this.scrollToBottom();
            scrollToBottom(this, 'msgsDiv');
            // this.$nextTick(() => {
            //     this.scrollToBottom();
            // });

            let params = {
                "session_id": this.sessionId,
                "model": this.llmType,
                "query": this.query,
                "generate_type": this.generateType,
                "if_think": this.ifThink,
                "history": JSON.stringify(this.getRecentHistory()),
            }
            let url = "/websocket/llm";
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
        },
        wsllmmessage: function (event) {
            let obj = JSON.parse(event.data)
            // console.log(`[message] Data received from server: ${event.data}`);
            let msgType = obj.type;
            let done = obj.ifDone;
            let msg = obj.msg;
            let ifMultiStep = obj.ifMultiStep;
            if (msgType = 'Word') {
                this.messages[this.messages.length - 1].content += msg;

                // 使用nextTick确保DOM更新后再滚动
                scrollToBottom(this, 'msgsDiv');

                // this.$nextTick(() => {

                // });

                // 只在消息完成时渲染LaTeX，避免频繁渲染
                // if (this.katexLoaded && done) {
                //     this.$nextTick(() => {
                //         renderExistingLatex('.message-content');
                //         // 渲染完成后再次滚动确保显示最新内容
                //         this.scrollToBottom();
                //     });
                // }
            }
        },
        wsllmclose: function (event) {
            if (event.wasClean) {
                this.pushHistory("user", this.query);
                this.pushHistory("assistant", this.messages[this.messages.length - 1].content);
                this.query = '';
                this.saveDb();
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
            return { id: this.messages.length + 1, sender: who, content: cnt };
        },

        pushHistory(role, cnt) {
            this.history.push({ 'sessionId': this.sessionId, 'role': role, 'content': cnt, 'genTime': new Date() });
        },

        saveDb() {//保存会话历史到数据库
            // 准备上传文件信息
            let uploadFilesInfo = this.uploadFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            }));
            
            console.log('保存的文件信息:', uploadFilesInfo);
            console.log('保存的uploadOK状态:', this.uploadOK);
            
            let saveItem = {
                id: this.sessionId,
                title: this.messages[1].content,
                type: 'LLM',
                llmType: this.llmType,
                db: '',
                generateType: this.generateType,
                ifThink: this.ifThink,
                history: JSON.stringify(this.history),
                messages: JSON.stringify(this.messages),
                uploadFiles: JSON.stringify(uploadFilesInfo), // 保存上传文件信息
                uploadOK: this.uploadOK, // 保存上传状态
                genTime: new Date(),
            };
            // console.log(saveItem);
            // 使用 Dexie 事务 API
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

        handleFileChange(file, fileList) {
            console.log('=== handleFileChange被调用 ===');
            console.log('传入的file:', file);
            console.log('传入的fileList:', fileList);
            
            // 更新文件列表，过滤掉没有raw属性的恢复文件（因为恢复的文件没有raw对象）
            let newFiles = fileList.filter(f => f.raw).map(f => f.raw);
            this.uploadFiles = newFiles;
            
            // 同步更新displayFiles，保持所有文件的显示
            this.displayFiles = [...fileList];
            
            // 只有在真正添加了新文件时才重置上传状态
            if (newFiles.length > 0) {
                this.uploadOK = false;
                console.log('添加了新文件，重置上传状态');
            }
            
            console.log('文件列表变化 - 总文件数:', fileList.length, '新文件数:', newFiles.length);
            console.log('当前uploadOK状态:', this.uploadOK);
            console.log('更新后的displayFiles:', this.displayFiles);
        },

        submitUpload() {
            if (!this.hasRealFiles()) {
                this.$message.warning('请先选择要上传的文件');
                return;
            }
            this.uploadLoading = true;
            this.uploadOK = false; // 重置上传状态
            let url = "/llm_session_file_upload";
            const form = new FormData();

            // 一次性添加所有文件
            this.uploadFiles.forEach((file, index) => {
                form.append(`upload_file_${index}`, file);
            });
            form.append("session_id", this.sessionId);
            form.append("file_count", this.uploadFiles.length);

            axios.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                this.uploadOK = response.data == 'success';
                console.log('Upload result:', response.data);
                if (this.uploadOK) {
                    // this.$message.success('所有文件上传成功');
                    // 上传成功后不清空文件列表，保持显示已上传的文件
                } else {
                    this.$message.error('文件上传失败');
                }
                this.uploadLoading = false;
            }).catch(error => {
                console.error('Upload error:', error);
                this.uploadOK = false; // 上传失败时设置状态为false
                this.$message.error('上传失败，请重试');
                this.uploadLoading = false;
            });
        },

        doUpload(param) {
            // 这个方法现在只用于处理单个文件上传的回调
            console.log('File selected:', param.file.name);
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        hasRealFiles() {
            // 检查是否有真正的File对象（不是恢复的文件信息）
            // 直接检查组件维护的uploadFiles数组，这些都是真正的File对象
            return this.uploadFiles && this.uploadFiles.length > 0;
        },

        setRestoredFiles() {
            console.log('=== setRestoredFiles被调用 ===');
            console.log('displayFiles当前状态:', this.displayFiles.length);
            console.log('displayFiles内容:', this.displayFiles);
            
            if (this.displayFiles.length === 0) {
                console.log('displayFiles为空，无需设置组件');
                return;
            }
            
            // 现在使用:file-list绑定，displayFiles应该自动同步到组件
            console.log('使用:file-list绑定，displayFiles应该已自动同步到上传组件');
            
            // 检查组件状态
            if (this.$refs.uploadRef) {
                console.log('组件存在，检查文件列表显示状态');
                
                setTimeout(() => {
                    const fileItems = this.$refs.uploadRef.$el.querySelectorAll('.el-upload-list__item');
                    console.log('DOM中的文件项数量:', fileItems.length);
                    
                    if (fileItems.length > 0) {
                        console.log('文件列表已正确显示！');
                        fileItems.forEach((item, index) => {
                            console.log(`文件${index + 1}:`, item.textContent.trim());
                        });
                    } else {
                        console.log('文件列表仍未显示，可能需要手动触发更新');
                        // 尝试强制更新
                        this.$forceUpdate();
                    }
                }, 100);
            } else {
                console.log('组件引用不存在');
            }
        },

        isThinkSupported() {
            // 检查当前模型是否支持深度思考功能
            return this.llmType && (this.llmType.includes('Qwen') || this.llmType.includes('DeepSeek'));
        },

    },
    template: "#user-llm-session"
};

app.component("user-llm-session", UserLLMSession);
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

/* 模型选择区域样式 */
.model-selection-container {
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

.model-selection-content {
    padding: 15px;
}

.selection-label {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.label-text {
    font-size: 13px;
    color: #666;
    font-weight: normal;
}

.info-icon {
    color: #909399;
    font-size: 14px;
    cursor: help;
    transition: color 0.2s ease;
}

.info-icon:hover {
    color: #409EFF;
}

.feature-tip {
    margin-top: 6px;
    padding: 4px 8px;
    background-color: #f0f9ff;
    border-radius: 4px;
    border-left: 3px solid #409EFF;
}

.model-select {
    width: 100%;
}

.model-select :deep(.el-input__wrapper) {
    border-radius: 4px;
    border: 1px solid #ddd;
    transition: all 0.2s ease;
}

.model-select :deep(.el-input__wrapper:hover) {
    border-color: #409EFF;
}

.model-select :deep(.el-input__wrapper.is-focus) {
    border-color: #409EFF;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

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

/* 文件上传容器样式 */
.upload-container {
    margin: 15px;
    background: white;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
}

.upload-container:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 上传标题区域 */
.upload-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 15px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
}

.upload-icon {
    color: #409EFF;
    font-size: 16px;
}

.upload-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

/* 上传组件样式 */
.upload-component {
    padding: 15px;
}

/* 上传按钮容器 */
.upload-buttons {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-top: 12px;
}

.upload-btn {
    width: 100%;
    margin-bottom: 8px;
    border-radius: 4px;
    height: 36px;
    font-size: 13px;
    border: 1px dashed #ddd;
    transition: all 0.3s ease;
}

.upload-btn:hover {
    border-color: #409eff;
    background-color: #ecf5ff;
}

.upload-submit-btn {
    flex: 1;
    border-radius: 4px;
    height: 36px;
    font-size: 13px;
    font-weight: normal;
    transition: all 0.3s ease;
}


.upload-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* 状态显示容器 */
.upload-status-container {
    margin: 12px 15px 8px 15px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
}

.status-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
}

.status-icon {
    font-size: 14px;
    margin-right: 6px;
    transition: all 0.3s ease;
}

.status-icon.success {
    color: #67c23a;
}

.status-icon.pending {
    color: #909399;
}

.status-text {
    font-size: 13px;
    font-weight: 500;
}

.success-text {
    color: #67c23a;
}

.pending-text {
    color: #909399;
}

/* 提示信息样式 */
.upload-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 15px;
    background-color: #f0f8ff;
    border-top: 1px solid #b3d9ff;
    margin: 0;
}

.tip-icon {
    color: #409EFF;
    font-size: 14px;
    margin-right: 6px;
}

/* 上传文件列表样式优化 */
.upload-component :deep(.el-upload-list) {
    margin-top: 8px;
    max-height: 80px;
    overflow-y: auto;
}

.upload-component :deep(.el-upload-list__item) {
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    margin-bottom: 4px;
    padding: 4px 8px;
    font-size: 12px;
}

.upload-component :deep(.el-upload-list__item:hover) {
    background-color: #f5f7fa;
}



/* 加载动画样式 */
.is-loading {
    animation: rotating 2s linear infinite;
}

@keyframes rotating {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
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
