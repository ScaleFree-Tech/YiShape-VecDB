<template id="user-file-convert">
    <user-frame>
        <div style="padding-left: 0px; margin: 0 auto;">
            <el-page-header @back="gotoBack()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">文件转换</el-text>
                </template>
            </el-page-header>
            <hr />
            
            <el-descriptions class="margin-top" :column="2" border>
                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Document />
                            </el-icon>
                            文件转换工具
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        支持多种文件格式互相转换。输入格式：PDF、Word、Excel、PPT、Markdown、HTML、TXT；输出格式：Markdown、Word、PDF、HTML、TXT。
                    </el-text>
                </el-descriptions-item>
            </el-descriptions>

            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="文件转换" name="query1">
                    <div class="convert-container">
                        <!-- 上传区域 -->
                        <el-card shadow="hover" class="upload-card">
                            <template #header>
                                <div class="card-header">
                                    <el-icon><Upload /></el-icon>
                                    <span>选择文件</span>
                                </div>
                            </template>
                            <el-upload 
                                class="upload-demo" 
                                drag 
                                action="" 
                                :limit="1" 
                                :accept="accept" 
                                list-type="file"
                                :auto-upload="false" 
                                :on-exceed="handleExceed" 
                                :before-upload="beforeUpload"
                                :on-change="handleChange" 
                                :show-file-list="true" 
                                ref="uploadRef">
                                <el-icon class="el-icon--upload">
                                    <upload-filled />
                                </el-icon>
                                <div class="el-upload__text">
                                    将文件拖拽到这里 或者 <em>点击选择文件</em>
                                </div>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        支持格式：PDF/Word/Excel/PPT/Markdown/HTML/TXT，最大100MB。
                                    </div>
                                </template>
                            </el-upload>
                        </el-card>

                        <!-- 设置和操作区域 -->
                        <el-row :gutter="20" class="operation-row">
                            <el-col :span="16">
                                <el-card shadow="hover" class="settings-card">
                                    <template #header>
                                        <div class="card-header">
                                            <el-icon><Setting /></el-icon>
                                            <span>转换设置</span>
                                        </div>
                                    </template>
                                    <el-form :model="form" label-width="120px" label-position="left">
                                        <el-form-item label="目标格式">
                                            <el-select v-model="extention" placeholder="选择输出格式" style="width: 100%;">
                                                <el-option v-for="item in exts" :key="item.value" :label="item.label" :value="item.value">
                                                    <div class="format-option">
                                                        <el-icon><Document /></el-icon>
                                                        <span>{{ item.label }}</span>
                                                    </div>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                </el-card>
                            </el-col>
                            <el-col :span="8">
                                <el-card shadow="hover" class="action-card">
                                    <template #header>
                                        <div class="card-header">
                                            <el-icon><Magic /></el-icon>
                                            <span>执行转换</span>
                                        </div>
                                    </template>
                                    <div class="action-content">
                                        <el-button 
                                            type="primary" 
                                            @click="doConvert" 
                                            :loading="loading"
                                            :disabled="loading"
                                            size="large"
                                            class="convert-btn">
                                            <el-icon v-if="!loading"><Refresh /></el-icon>
                                            {{ loading ? '转换中...' : '开始转换' }}
                                        </el-button>
                                        <div class="tips-text">
                                            <el-text type="info" size="small">
                                                点击按钮开始文件转换
                                            </el-text>
                                        </div>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                        
                        <!-- 结果显示区域 -->
                        <div v-loading="loading" class="result-container">
                            <el-card v-show="result != ''" shadow="hover" class="result-card success-result">
                                <template #header>
                                    <div class="card-header success-header">
                                        <el-icon><SuccessFilled /></el-icon>
                                        <span>转换完成</span>
                                    </div>
                                </template>
                                <div class="result-content">
                                    <el-alert
                                        title="文件转换成功！"
                                        type="success"
                                        :closable="false"
                                        show-icon
                                        class="success-alert">
                                        <template #default>
                                            您的文件已成功转换，可以点击下方链接下载转换后的文件。
                                        </template>
                                    </el-alert>
                                    <div class="download-section">
                                        <el-link 
                                            :href="'/download_converted_file/' + result" 
                                            target="_blank" 
                                            type="primary"
                                            class="download-link">
                                            <el-icon><Download /></el-icon>
                                            下载文件：{{ result }}
                                        </el-link>
                                    </div>
                                </div>
                            </el-card>
                            
                            <el-empty 
                                v-show="result == '' && !loading" 
                                :image-size="120" 
                                description="请选择文件并配置转换设置"
                                class="empty-state">
                                <template #description>
                                    <el-text type="info">请选择文件并配置转换设置</el-text>
                                </template>
                            </el-empty>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </user-frame>
</template>

<script>
const UserFileConvert = {
    mounted() {
        // 页面初始化完成
    },

    props: {
        accept: {
            type: String,
            default: '.pdf, .md, .docx, .doc, .txt, .xls, .xlsx, .ppt, .pptx, .htm, .html'
        }
    },

    data() {
        return {
            activeName: 'query1',
            extention: '.docx',
            sessionId: 0,
            uploadRef: null,
            currentFile: null,
            iconStyle: {
                width: '16px',
                height: '16px',
                marginRight: '8px'
            },
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
            },
            k: 3,
            selectedFile: null,
            result: '',
            loading: false,
            exts: [
                { value: '.md', label: 'Markdown文档' },
                { value: '.docx', label: 'MS Word文档' },
                { value: '.htm', label: 'HTML网页' },
                { value: '.txt', label: '纯文本文件' },
            ],
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

        handleClick(tab, event) {
            console.log(tab, event);
        },

        gotoBack() {
            location.href = ("/user/user_workspace")
        },

        doConvert(param) {
            let file = null;

            if (this.currentFile) {
                file = this.currentFile;
            } else if (param && param.file) {
                file = param.file;
            } else if (this.$refs.uploadRef) {
                const uploadRef = this.$refs.uploadRef;

                if (uploadRef.uploadFiles && uploadRef.uploadFiles.length > 0) {
                    file = uploadRef.uploadFiles[0].raw;
                } else if (uploadRef.fileList && uploadRef.fileList.length > 0) {
                    file = uploadRef.fileList[0].raw;
                }
            }

            if (file == null) {
                this.$msgbox({
                    message: '请先选择一个文件再进行转换！',
                    title: '提示',
                    confirmButtonText: '确认',
                    type: 'warning',
                });
                return;
            }

            if (file && typeof file === 'object') {
                if (!this.validateFile(file)) {
                    return;
                }
            }

            this.result = '';
            this.loading = true;
            let url = "/api/file_convert";

            const form = new FormData();
            form.append("upload_file", file);
            form.append("target_extention", this.extention);

            axios.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                this.result = response.data;
                console.log(this.result);
                this.loading = false;
                // 显示成功消息
                this.$message.success('文件转换完成！');
            }).catch(error => {
                this.loading = false;
                this.$message.error('转换失败，请检查文件格式后重试');
            });
        },

        formatDistance(distance) {
            return distance.toFixed(4);
        },

        handleExceed(files) {
            if (!files || !files.length) return;
            const file = files[0];
            if (this.$refs.uploadRef) {
                this.$refs.uploadRef.clearFiles();
                this.currentFile = null;
                this.$nextTick(() => {
                    this.$refs.uploadRef.handleStart(file);
                });
            }
        },

        handleChange(file) {
            if (file.status === 'ready') {
                if (!this.validateFile(file.raw)) {
                    if (this.$refs.uploadRef) {
                        this.$refs.uploadRef.clearFiles();
                    }
                    this.currentFile = null;
                    return;
                }

                if (this.$refs.uploadRef && this.$refs.uploadRef.uploadFiles) {
                    const fileList = this.$refs.uploadRef.uploadFiles;
                    if (fileList.length > 1) {
                        this.$refs.uploadRef.uploadFiles = [fileList[fileList.length - 1]];
                    }
                }

                this.currentFile = file.raw;
            }
        },

        beforeUpload(file) {
            const allowedTypes = ['application/pdf', 'text/markdown', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/html'];
            const fileType = file.type.toLowerCase();

            const allowedExtensions = ['.pdf', '.md', '.docx', '.doc', '.txt', '.xls', '.xlsx', '.ppt', '.pptx', '.htm', '.html'];
            const fileName = file.name.toLowerCase();
            const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

            if (!allowedTypes.includes(fileType) || !hasValidExtension) {
                this.$msgbox({
                    message: '只支持 PDF/MD/DOCX/DOC/TXT/XLS/XLSX/PPT/PPTX/HTM/HTML 格式的文件！',
                    title: '文件格式错误',
                    confirmButtonText: '确认',
                    type: 'error',
                });
                return false;
            }

            const maxSize = 100 * 1024 * 1024;  // 100MB
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

        validateFile(file) {
            const allowedTypes = ['application/pdf', 'text/markdown', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/html'];
            const fileType = file.type.toLowerCase();

            const allowedExtensions = ['.pdf', '.md', '.docx', '.doc', '.txt', '.xls', '.xlsx', '.ppt', '.pptx', '.htm', '.html'];
            const fileName = file.name.toLowerCase();
            const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

            if (!allowedTypes.includes(fileType) || !hasValidExtension) {
                this.$msgbox({
                    message: '只支持 PDF/MD/DOCX/DOC/TXT/XLS/XLSX/PPT/PPTX/HTM/HTML 格式的文件！',
                    title: '文件格式错误',
                    confirmButtonText: '确认',
                    type: 'error',
                });
                return false;
            }

            const maxSize = 100 * 1024 * 1024;  // 100MB
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
    },
    template: "#user-file-convert"
};

app.component("user-file-convert", UserFileConvert);
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

.cell-item {
    display: flex;
    align-items: center;
}

/* 新的布局样式 */
.convert-container {
    padding: 0;
}

.upload-card {
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
}

.upload-card :deep(.el-card__header) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e4e7ed;
    padding: 12px 20px;
}

.card-header {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #303133;
}

.card-header .el-icon {
    margin-right: 8px;
    color: #409eff;
}

.upload-demo {
    margin: 0;
}

.upload-demo :deep(.el-upload-dragger) {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    width: 100%;
    height: 180px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
}

.upload-demo :deep(.el-upload-dragger:hover) {
    border-color: #409eff;
}

.operation-row {
    margin-bottom: 20px;
}

.settings-card,
.action-card {
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    height: 100%;
}

.settings-card :deep(.el-card__header),
.action-card :deep(.el-card__header) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e4e7ed;
    padding: 12px 20px;
}

.settings-card :deep(.el-card__body),
.action-card :deep(.el-card__body) {
    padding: 20px;
}

.format-option {
    display: flex;
    align-items: center;
}

.format-option .el-icon {
    margin-right: 8px;
    color: #409eff;
}

.action-content {
    text-align: center;
    padding: 10px 0;
}

.convert-btn {
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
}

.tips-text {
    margin-top: 10px;
}

.result-container {
    margin-top: 20px;
}

.result-card {
    border-radius: 8px;
    border: 1px solid #e4e7ed;
}

.success-result {
    border-color: #67c23a;
}

.success-header {
    color: #67c23a;
}

.success-header .el-icon {
    color: #67c23a;
}

.result-card :deep(.el-card__header) {
    background-color: #f0f9ff;
    border-bottom: 1px solid #e4e7ed;
    padding: 12px 20px;
}

.success-result :deep(.el-card__header) {
    background-color: #f0f9ff;
}

.result-content {
    padding: 0;
}

.success-alert {
    margin-bottom: 20px;
}

.download-section {
    text-align: center;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 6px;
}

.download-link {
    font-size: 16px;
    font-weight: 600;
}

.download-link .el-icon {
    margin-right: 8px;
}

.empty-state {
    margin: 40px 0;
}

.empty-state :deep(.el-empty__description) {
    margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .operation-row .el-col {
        margin-bottom: 15px;
    }
    
    .convert-btn {
        height: 45px;
        font-size: 14px;
    }
    
    .upload-demo :deep(.el-upload-dragger) {
        height: 150px;
    }
}
</style>