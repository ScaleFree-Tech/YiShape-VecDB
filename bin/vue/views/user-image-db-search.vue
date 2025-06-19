<template id="user-image-db-search">

    <user-frame>

        <div style="padding-left: 0px; margin: 0 auto;">

            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ db == null ? '' : '检索图像库' }} </el-text>
                </template>
            </el-page-header>
            <hr />
            <el-descriptions class="margin-top" :column="2" border>

                <el-descriptions-item width="170px">
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


                <el-descriptions-item width="170px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            图像数量
                        </div>
                    </template>
                    <el-tag size="small" type="success">{{ form.fileNum }}</el-tag>
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


            </el-descriptions>

            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="图片检索" name="query1">

                    <div style="border:0px solid red;">
                        <!-- 图片上传组件 -->
                        <el-upload 
                            class="upload-demo" 
                            drag 
                            action="" 
                            :limit="1" 
                            :accept="accept" 
                            list-type="picture"
                            :http-request="doSearch" 
                            :auto-upload="true"
                            :on-exceed="handleExceed"
                            :before-upload="beforeUpload"
                            :on-change="handleChange"
                            :show-file-list="true"
                            ref="uploadRef">
                            <el-icon class="el-icon--upload">
                                <upload-filled />
                            </el-icon>
                            <div class="el-upload__text">
                                将图像扡到这里 或者 <em>点击上传图像</em>
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    支持的图像格式：jpg/png/tiff/bmp/gif。
                                </div>
                            </template>
                        </el-upload>

                        <div v-loading="loading" class="userSearchResult">
                            <div id="query1Result" style=" border: 0px solid gray;" v-if="result && result.items && result.items.length > 0">
                                <el-divider content-position="left">
                                    <el-text class="mx-1" type="primary">
                                        本地库中检索到的结果，共 {{ result.items.length }} 条
                                    </el-text>
                                </el-divider>

                                <!--图片检索结果-->
                                <div class="image-grid">
                                    <el-card v-for="(item, index) in result.items" 
                                            :key="index" 
                                            class="image-card"
                                            :body-style="{ padding: '0px' }">
                                        <div class="image-container">
                                            <el-image 
                                                :src="'/servlet/ShowThumbnail.img?db='+this.db+'&id='+item.hash"    
                                                fit="cover"
                                                :preview-src-list="['/servlet/ShowImage.img?db='+this.db+'&id='+item.hash]"
                                                :initial-index="0"
                                                :preview-teleported="true"
                                                :hide-on-click-modal="false"
                                                class="result-image">
                                                <template #error>
                                                    <div class="image-error">
                                                        <el-icon><picture-filled /></el-icon>
                                                        <span>加载失败</span>
                                                    </div>
                                                </template>
                                            </el-image>
                                        </div>
                                        <div class="image-info">
                                            <el-tooltip
                                                    :content="extractFileName(item.filePath)"
                                                    placement="top">
                                                    <el-text class="filename w-150px mb-2" size="small" type="info"  truncated>
                                                        {{ extractFileName(item.filePath) }}
                                                    </el-text>
                                                </el-tooltip>
                                            <div class="similarity">
                                                <el-tooltip v-if="form.disType == 'EUCLIDEAN'"
                                                    content="欧氏距离：数值越小表示越相似"
                                                    placement="top"
                                                >
                                                    <el-tag 
                                                        :type="getDistanceLevel(item.distance)"
                                                        size="small"
                                                    >
                                                        欧氏距离: {{ formatDistance(item.distance) }}
                                                    </el-tag>
                                                </el-tooltip>
                                                <el-tooltip v-if="form.disType == 'COS'"
                                                    content="余弦相似性：数值越大表示越相似"
                                                    placement="top"
                                                >
                                                    <el-tag 
                                                        :type="getDistanceLevel(item.distance)"
                                                        size="small"
                                                    >
                                                        余弦相似性: {{ formatDistance(item.distance) }}
                                                    </el-tag>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(this.result)" description="暂无检索结果" />
                        </div>

                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>

    </user-frame>


</template>


<script>
const UserImageDbSearch = {
    mounted() {
        this.db = this.$javalin.pathParams["db"];
        if (this.db != null) {
            this.fetchDbData(this.db);
        }
        
    },

    props: {
        accept: { // 文件格式
            type: String,
            default: '.jpg, .jpeg, .png, .gif, .tiff, .bmp'
        }
    },

    data() {
        return {
            activeName: 'query1',
            db: '',
            ifHistory: false,
            history: [],
            sessionId: 0,
            uploadRef: null,
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
            result: {},
            loading: false,
            currentQuery: '',
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
        
        gotoList() {
            console.log("ready goto")
            location.href = ("/user/user_list_image_db")
        },

        fetchDbData() {
            let url = "/api/image_db_detail/" + this.db;
            axios.get(url).then((response) => {
                this.form = response.data;
                this.k = this.form.defaultK;
            });
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
            let url = "/query_image";

            const form = new FormData();
            form.append("upload_image", param.file);
            form.append("db", this.db);

            axios.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                this.result = response.data;
                console.log('Search result:', this.result);
                this.loading = false;
            }).catch(error => {
                console.error('Search error:', error);
                this.loading = false;
                this.$message.error('检索失败，请重试');
            });
        },

        formatDistance(distance) {
            return distance.toFixed(4);
        },

        getDistanceLevel(distance) {
            if (this.form.disType == 'EUCLIDEAN') {
            if (distance < 0.3) return 'success';
                if (distance < 0.6) return 'warning';
                return 'danger';
            }
            if (this.form.disType == 'COS') {
                if (distance > 0.8) return 'success';
                if (distance > 0.6) return 'warning';
                return 'danger';
            }
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
            // 如果是新文件且状态为ready，则进行检索
            if (file.status === 'ready') {
                // 确保只保留最新的文件
                if (this.$refs.uploadRef && this.$refs.uploadRef.uploadFiles) {
                    const fileList = this.$refs.uploadRef.uploadFiles;
                    if (fileList.length > 1) {
                        this.$refs.uploadRef.uploadFiles = [fileList[fileList.length - 1]];
                    }
                }
                // 清空之前的检索结果
                this.result = {};
                this.$nextTick(() => {
                    this.doSearch({ file: file.raw });
                });
            }
        },
        
        beforeUpload(file) {
            return true;
        },

    },
    template: "#user-image-db-search"
};

app.component("user-image-db-search", UserImageDbSearch);
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
</style>