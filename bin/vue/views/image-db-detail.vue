<template id="image-db-detail">

    <app-frame>

        <div style="padding-left: 20px; width: 100%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ db == null ? '' : '查看图像库详情' }} </el-text>
                </template>
            </el-page-header>
            <hr />


            <el-descriptions class="margin-top" :title="form.nickName" :column="2" border>
                <template #extra>
                    <el-button type="primary" @click="gotoSearch(form.name,form.llmType,form.ifUseStreaming)">检索本库</el-button>
                </template>
                <el-descriptions-item width="170px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            数据库标识
                        </div>
                    </template>
                    {{ form.name }}
                </el-descriptions-item>

                

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            状态
                        </div>
                    </template>
                    <el-tag size="small" type="success">{{ form.status }}</el-tag>
                </el-descriptions-item>


                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Files />
                            </el-icon>
                            文件数量
                        </div>
                    </template>
                    <el-tag size="small">{{ form.fileNum }}</el-tag>
                </el-descriptions-item>




                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Histogram />
                            </el-icon>
                            向量化方法
                        </div>
                    </template>
                    {{ form.embeddingMethod }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Timer />
                            </el-icon>
                            向量索引方法
                        </div>
                    </template>
                    {{ form.vectorIndexType }}
                </el-descriptions-item>

                
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <D-Arrow-Left />
                            </el-icon>
                            检索返回结果数
                        </div>
                    </template>
                    {{ form.defaultK }}
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
                    {{ this.formatTime(form.genTime) }}
                </el-descriptions-item>

                
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Position />
                            </el-icon>
                            数据源地址类型
                        </div>
                    </template>
                    {{ form.pathType }}
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <office-building />
                            </el-icon>
                            数据源地址
                        </div>
                    </template>
                    <el-tooltip :content="form.tempDataSourcePath" placement="bottom">
                        <el-text style="" truncated type="info">
                            {{ form.tempDataSourcePath }}
                        </el-text>
                    </el-tooltip>
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
                    <el-tooltip :content="form.desc" placement="bottom">
                        <el-text style="max-width: 500px;" truncated type="info">
                            {{ form.desc }}
                        </el-text>
                    </el-tooltip>
                </el-descriptions-item>
            </el-descriptions>



            <el-divider content-position="left">
                <el-text type="info">数据库构建进度</el-text>
            </el-divider>

            <div style="">
                <el-steps style="max-width: 700px" :space="200" :active="form.buildingPipeline.currentOrd==2?form.buildingPipeline.currentOrd:form.buildingPipeline.currentOrd-1"
                    finish-status="success" align-center>
                    <el-step title="文件读取"></el-step>
                    <el-step title="图像向量化"></el-step>
                    <el-step title="构建完成"></el-step>
                </el-steps>
            </div>


            <div class="clearfloat"></div>
        </div>

    </app-frame>

</template>



<script>

const ImageDbDetail = {
    mounted() {
        this.db = this.$javalin.pathParams["db"];
        if (this.db != null) {
            this.fetchDbData(this.db);
        }
        
    },
    data() {
        return {
            db: '',
            form: {
                name: '',
                status: '',
                type: '',
                tempDataSourcePath: '',
                vectorIndexType:'HNSW',
                desc: '',
                buildingPipeline: {
                    currentOrd: 0,
                },
                ifReRank:false,
                embeddingMethod: 'DistillBert',
            },
            cloudChart: null,
        }
    },
    methods: {
        gotoSearch(db,llmType,ifStream) {
            // location.href = ("/mag/list_db")
            let url = '/mag/image_db_search/' + db
            location.href = url
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_image_db")
        },
        
        fetchDbData(db) {
            let url = "/api/image_db_detail/" + db;
            axios.get(url).then((response) => {
                this.form = response.data;
                console.log(this.form);

                if (this.form.buildingPipeline.currentOrd >= 3) {
                    this.fetchWordFreqsData(this.db);
                }
            });
        },
        
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }
    },
    template: "#image-db-detail"
};


app.component("image-db-detail", ImageDbDetail);
</script>
<style>
.clearfloat {

    clear: both;

}
.margin-top{
    margin-top: 20px;
    width: 100%;
}



</style>
