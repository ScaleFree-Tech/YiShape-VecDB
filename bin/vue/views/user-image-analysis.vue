<template id="user-image-analysis">

    <user-frame>

        <div style="padding-left: 0px; margin: 0 auto;">

            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">图像分析</el-text>
                </template>
            </el-page-header>
            <hr />
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="图像分析" name="query1">

                    <div style="border:0px solid red;">
                        <el-form-item label="加载示例">
                            <el-select v-model="example" placeholder="选择要加载的示例" @change="handleExampleChange">
                                <el-option v-for="(item, index) in examples" :key="item.name" :label="item.name"
                                    :value="index" />
                            </el-select>
                        </el-form-item>
                        
                        <!-- 上传组件和图片显示区域容器 -->
                        <div class="upload-image-container">
                            <!-- 左侧：图片上传组件 -->
                            <div class="upload-section">
                                <el-upload class="upload-demo" drag action="" :limit="1" :accept="accept" list-type="picture"
                                    :http-request="doSearch" :auto-upload="false" :on-exceed="handleExceed"
                                    :before-upload="beforeUpload" :on-change="handleChange" :show-file-list="false"
                                    ref="uploadRef">
                                    <el-icon class="el-icon--upload">
                                        <upload-filled />
                                    </el-icon>
                                    <div class="el-upload__text">
                                        将图像扡到这里 或者 <em>点击上传图像</em>
                                    </div>
                                    <template #tip>
                                        <div class="el-upload__tip">
                                            支持的图像格式：jpg/png/tiff/bmp/gif，最大100MB。
                                        </div>
                                    </template>
                                </el-upload>
                            </div>
                            
                            <!-- 右侧：图片显示区域 -->
                            <div class="image-display-section">
                                <div v-if="selectedExampleImage || selectedUploadedImage" class="example-image-container">
                                    <el-divider content-position="left">
                                        <el-text class="mx-1" type="primary">
                                            {{ selectedExampleImage ? '示例图片' : '上传图片' }}
                                        </el-text>
                                    </el-divider>
                                    <div class="example-image-wrapper">
                                        <el-image :src="selectedExampleImage || selectedUploadedImage" fit="scale-down"
                                            :preview-src-list="[selectedExampleImage || selectedUploadedImage]" style="width: 240px; height: 240px">
                                        </el-image>
                                        <div class="example-image-info">
                                            <el-text size="small" type="info">
                                                {{ selectedExampleImage ? '当前使用示例图片进行分析' : '当前使用上传图片进行分析' }}
                                            </el-text>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="example-image-container empty-state">
                                    <div class="example-image-wrapper">
                                        <el-icon style="font-size: 48px; color: #c0c4cc; margin-bottom: 16px;">
                                            <picture-filled />
                                        </el-icon>
                                        <el-text size="small" type="info">请选择示例或上传图片</el-text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <el-form-item label="分析模型">
                            <el-select v-model="modelExpr" placeholder="选择分析图像的模型">
                                <el-option v-for="item in llms" :key="item.modelExpr" :label="item.modelExpr"
                                    :value="item.modelExpr" />
                            </el-select>
                        </el-form-item>

                        <el-input v-model="queryLLM" class="searchBox" :rows="searchBoxLines" type="textarea"
                            placeholder="请输入图像分析提示词"></el-input>
                        <el-button type="primary" @click="doLLM" class="searchButton"
                            :disabled="loading">分析图像</el-button>
                        <div v-loading="loading" class="userSearchResult">
                            <div id="queryLLMResult" v-if="!this.isEmpty(this.resultLLM)">
                                <el-divider content-position="left"><el-text class="mx-1"
                                        type="primary">分析结果</el-text></el-divider>
                                <!-- <div v-html="replaceLnWithBr(resultLLM.llmAns)" class="markdown-body myMarkDown">
                                </div> -->
                                <el-text class="mx-1" v-html="replaceLnWithBr(resultLLM.llmAns)"></el-text>
                            </div>
                            <el-empty :image-size="100" v-show="this.isEmpty(this.resultLLM)" description="暂无分析结果" />
                        </div>


                    </div>

                </el-tab-pane>

            </el-tabs>
        </div>

    </user-frame>


</template>


<script>
const UserImageAnalysis = {
    mounted() {
        this.loadLLMModels();
        this.handleExampleChange(0);
        this.example = 0;
    },

    props: {
        accept: { // 文件格式
            type: String,
            default: '.jpg,.jpeg,.png,.tiff,.bmp,.gif'
        }
    },

    data() {
        return {
            activeName: 'query1',
            sessionId: 0,
            uploadRef: null,
            queryLLM: '',
            resultLLM: {},
            searchBoxLines: 5,
            llms: [],
            modelExpr: '',
            selectedFile: null,
            loading: false,
            examples: getImageAnalysisExamples(),
            example: null, // 添加example变量用于存储选中的分析模板索引
            selectedExampleImage: null, // 新增变量用于存储选中的示例图片URL
            selectedUploadedImage: null, // 新增变量用于存储上传的图片URL
        }
    },
    methods: {
        handleExampleChange(value) {
            console.log("handleExampleChange", value);
            if (value !== undefined && value !== null && this.examples[value]) {
                this.queryLLM = this.examples[value].prompt.trim();
                // 如果有示例图片，则显示示例图片
                if (this.examples[value].image) {
                    const exampleImageUrl = this.examples[value].image;
                    console.log("exampleImageUrl", exampleImageUrl);
                    // 清空之前的结果
                    this.resultLLM = {};
                    this.selectedExampleImage = exampleImageUrl; // 设置示例图片URL
                    this.selectedUploadedImage = null; // 清空上传的图片URL
                    this.selectedFile = exampleImageUrl; // 设置selectedFile为示例图片URL，供后续分析使用
                } else {
                    this.selectedExampleImage = null; // 如果没有示例图片，则清空
                    this.selectedUploadedImage = null; // 如果没有示例图片，则清空上传的图片URL
                    this.selectedFile = null;
                }
            }
        },

        isEmpty(value) {
            return JSON.stringify(value) === '{}';
        },
        extractFileName(filePath) {
            let p = filePath.lastIndexOf("\\");
            return filePath.substring(p + 1);
        },
        loadLLMModels() {
            let url = "/llm/get_all/vision";
            axios.get(url).then((response) => {
                this.llms = response.data;
                if (this.llms.length > 0) {
                    this.modelExpr = this.llms[0].modelExpr;
                }
                console.log(this.llms);
            });
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/user/user_workspace")
        },
        replaceLnWithBr(text) {
            tt = text.replace('\<think\>', '\<div class="quoteThink"\>')
            tt = tt.replace('\</think\>', '\</div\>')
            // tt = tt.replace('```markdown', '')
            // tt = tt.replace('```', '')
            tt = marked.parse(tt);
            return tt;
        },

        doSearch(param) { // 图片检索
            if (param.file == null) {
                this.$msgbox(
                    {
                        message: '上传的图像不能为空！',
                        title: '警告',
                        confirmButtonText: '确认',
                        type: 'warning',
                    }
                );
                return;
            }
            this.loading = true;
            let url = "/analyze_image";

            const form = new FormData();

            // 检查是否是示例图片URL
            if (typeof param.file === 'string' && param.file.startsWith('/')) {
                // 如果是示例图片URL，需要先下载图片
                this.processExampleImage(param.file, form);
            } else {
                // 正常的上传文件
                form.append("upload_image", param.file);
                form.append("query", this.queryLLM);
                form.append("modelExpr", this.modelExpr);
                this.submitForm(form);
            }
        },

        // 新增方法：处理示例图片
        async processExampleImage(imageUrl, form) {
            try {
                // 下载示例图片
                const response = await fetch(imageUrl);
                const blob = await response.blob();

                // 创建文件对象
                const file = new File([blob], 'example.jpg', { type: blob.type });

                form.append("upload_image", file);
                form.append("query", this.queryLLM);
                form.append("modelExpr", this.modelExpr);

                this.submitForm(form);
            } catch (error) {
                console.error('下载示例图片失败:', error);
                this.loading = false;
                this.$msgbox({
                    message: '下载示例图片失败！',
                    title: '错误',
                    confirmButtonText: '确认',
                    type: 'error',
                });
            }
        },
        
        // 新增方法：提交表单
        submitForm(form) {
            axios.post("/analyze_image", form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 600000,
            }).then((response) => {
                this.resultLLM = response.data;
                console.log("resultLLM", this.resultLLM);
                this.loading = false;
            }).catch((error) => {
                console.error('分析失败:', error);
                this.loading = false;
                this.$msgbox({
                    message: '图像分析失败！',
                    title: '错误',
                    confirmButtonText: '确认',
                    type: 'error',
                });
            });
        },


        handleExceed(files) {
            if (!files || !files.length) return;
            // 获取第一个新文件
            const file = files[0];
            if (this.$refs.uploadRef) {
                // 清除已有文件并添加新文件
                this.$refs.uploadRef.clearFiles();
                this.$nextTick(() => {
                    this.$refs.uploadRef.handleStart(file);
                });
            }
        },

        handleChange(file) {
            // 如果是新文件且状态为ready，则保存文件但不自动提交
            if (file.status === 'ready') {
                // 验证文件是否为有效的图像文件
                if (!this.validateImageFile(file.raw)) {
                    // 如果验证失败，清除文件
                    if (this.$refs.uploadRef) {
                        this.$refs.uploadRef.clearFiles();
                    }
                    return;
                }
                
                // 确保只保留最新的文件
                if (this.$refs.uploadRef && this.$refs.uploadRef.uploadFiles) {
                    const fileList = this.$refs.uploadRef.uploadFiles;
                    if (fileList.length > 1) {
                        this.$refs.uploadRef.uploadFiles = [fileList[fileList.length - 1]];
                    }
                }
                // 保存选中的文件，但不自动提交
                this.selectedUploadedImage = file.url; // 保存上传的图片URL用于显示
                this.selectedFile = file.raw; // 保存文件对象用于分析
                // 清空之前的分析结果和示例图片
                this.resultLLM = {};
                this.selectedExampleImage = null; // 清空示例图片URL
            }
        },

        beforeUpload(file) {
            // 检查文件类型
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp', 'image/gif'];
            const fileType = file.type.toLowerCase();
            
            // 检查文件扩展名
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.gif'];
            const fileName = file.name.toLowerCase();
            const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
            
            // 双重检查：MIME类型和文件扩展名
            if (!allowedTypes.includes(fileType) || !hasValidExtension) {
                this.$msgbox({
                    message: '只支持 jpg/jpeg/png/tiff/bmp/gif 格式的图片文件！',
                    title: '文件格式错误',
                    confirmButtonText: '确认',
                    type: 'error',
                });
                return false;
            }
            
            // 检查文件大小（可选，限制为100MB）
            const maxSize = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSize) {
                this.$msgbox({
                    message: '文件大小不能超过100MB！',
                    title: '文件过大',
                    confirmButtonText: '确认',
                    type: 'error',
                });
                return false;
            }
            
            return true;
        },

        // 新增：验证文件是否为图像文件
        validateImageFile(file) {
            // 检查文件类型
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp', 'image/gif'];
            const fileType = file.type.toLowerCase();
            
            // 检查文件扩展名
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.gif'];
            const fileName = file.name.toLowerCase();
            const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
            
            // 双重检查：MIME类型和文件扩展名
            if (!allowedTypes.includes(fileType) || !hasValidExtension) {
                this.$msgbox({
                    message: '只支持 jpg/jpeg/png/tiff/bmp/gif 格式的图片文件！',
                    title: '文件格式错误',
                    confirmButtonText: '确认',
                    type: 'error',
                });
                return false;
            }
            
            // 检查文件大小（可选，限制为100MB）
            const maxSize = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSize) {
                this.$msgbox({
                    message: '文件大小不能超过100MB！',
                    title: '文件过大',
                    confirmButtonText: '确认',
                    type: 'error',
                });
                return false;
            }
            
            return true;
        },

        doLLM() {
            // 检查是否有选中的文件
            if (!this.selectedFile && !this.selectedExampleImage) {
                this.$msgbox({
                    message: '请先选择要分析的图像！',
                    title: '警告',
                    confirmButtonText: '确认',
                    type: 'warning',
                });
                return;
            }

            // 如果有上传的文件，再次验证文件类型
            if (this.selectedFile && typeof this.selectedFile === 'object') {
                if (!this.validateImageFile(this.selectedFile)) {
                    return;
                }
            }

            // 检查是否有分析提示词
            if (!this.queryLLM || this.queryLLM.trim() === '') {
                this.$msgbox({
                    message: '请输入图像分析提示词！',
                    title: '警告',
                    confirmButtonText: '确认',
                    type: 'warning',
                });
                return;
            }

            // 调用doSearch方法进行图像分析
            this.doSearch({ file: this.selectedFile });
        },

    },
    template: "#user-image-analysis"
};

app.component("user-image-analysis", UserImageAnalysis);
</script>
<style>
.clearfloat {
    clear: both;
}
.searchBox {
    width: 800px;
    height: 120px;
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

.image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 20px 0;
}

.image-card {
    transition: all 0.3s;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
}

.image-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-container {
    position: relative;
    width: 100%;
    height: 120px;
    overflow: hidden;
}

.result-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-info {
    padding: 12px;
    background: #fff;
}

.filename {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.similarity {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.el-tag {
    font-family: monospace;
}

.image-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #909399;
    font-size: 14px;
}

.image-error .el-icon {
    font-size: 24px;
    margin-bottom: 8px;
}

:deep(.el-image-viewer__wrapper) {
    width: 100vw;
    height: 100vh;
}

:deep(.el-image-viewer__img) {
    max-width: 600px !important;
    max-height: 90vh;
    object-fit: contain;
    width: 600px !important;
}

:deep(.el-image-viewer__preview) {
    width: 600px !important;
    max-width: 600px !important;
}

:deep(.el-image-viewer__canvas) {
    width: 600px !important;
    max-width: 600px !important;
}

.upload-demo {
    margin-bottom: 20px;
}

.el-upload-list {
    max-width: 100%;
}

/* 新增：上传组件和图片显示区域的容器样式 */
.upload-image-container {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    align-items: stretch;
}

.upload-section {
    flex: 1;
    min-width: 0;
}

.image-display-section {
    flex: 1;
    min-width: 0;
}

/* 修改上传组件样式，确保高度一致 */
.upload-section .el-upload {
    width: 100%;
    height: 100%;
}

.upload-section .el-upload-dragger {
    height: 100%;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.example-image-container {
    margin-top: 0;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 8px;
    height: 100%;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.example-image-container.empty-state {
    background-color: #fafafa;
    border: 2px dashed #d9d9d9;
}

.example-image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    flex: 1;
    height: 100%;
}

/* 新增：根据图片宽高比智能调整显示 */
.example-image-wrapper .el-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
}

.example-image-info {
    margin-top: 10px;
    text-align: center;
    color: #606266;
    font-size: 14px;
}
</style>