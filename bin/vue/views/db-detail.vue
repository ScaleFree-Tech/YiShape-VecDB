<template id="db-detail">

    <app-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ db == null ? '' : '查看文本库详情' }} </el-text>
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
                                <Monitor />
                            </el-icon>
                            大模型挂载
                        </div>
                    </template>
                    {{ form.modelExpr }}
                </el-descriptions-item>

                <el-descriptions-item width="170">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Postcard />
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
                                <Document />
                            </el-icon>
                            文本块数量
                        </div>
                    </template>
                    <el-tag size="small">{{ form.chunkNum }}</el-tag>
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

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <office-building />
                            </el-icon>
                            数据源地址
                        </div>
                    </template>
                    <el-tooltip :content="form.tempDataSourcePath" placement="bottom">
                        <el-text style="max-width: 145px;" truncated type="info">
                            {{ form.tempDataSourcePath }}
                        </el-text>
                    </el-tooltip>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Data-Board />
                            </el-icon>
                            文本块最小长度
                        </div>
                    </template>
                    {{ form.minChunkSize }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Data-Analysis />
                            </el-icon>
                            文本块最大长度
                        </div>
                    </template>
                    {{ form.maxChunkSize }}
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
                                <Position />
                            </el-icon>
                            词句向量转换方法
                        </div>
                    </template>
                    {{ form.wordDocTransMethod }}
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
                                <Position />
                            </el-icon>
                            文本块检索方法
                        </div>
                    </template>
                    {{ form.searchMethod }}
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
                                <Download />
                            </el-icon>
                            是否允许下载源文件
                        </div>
                    </template>
                    {{ form.ifAllowDownload }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <D-Arrow-Left />
                            </el-icon>
                            用户问题解析方法
                        </div>
                    </template>
                    {{ form.questionType }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Download />
                            </el-icon>
                            大模型思维链
                        </div>
                    </template>
                    {{ form.ifUseThinkChain }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Download />
                            </el-icon>
                            大模型流式响应
                        </div>
                    </template>
                    {{ form.ifUseStreaming }}
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
                            是否结果重排
                        </div>
                    </template>
                    {{ form.ifReRank }}
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

                

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Monitor />
                            </el-icon>
                            大模型系统提示模板
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        {{ form.sysPrompt }}
                    </el-text>
                </el-descriptions-item>
                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <User-Filled />
                            </el-icon>
                            大模型用户提示模板
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        {{ form.userPrompt }}
                    </el-text>
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
                <el-steps style="max-width: 700px" :space="200" :active="form.buildingPipeline.currentOrd==4?form.buildingPipeline.currentOrd:form.buildingPipeline.currentOrd-1"
                    finish-status="success" align-center>
                    <el-step title="文本块构建"></el-step>
                    <el-step title="分词及词频统计"></el-step>
                    <el-step title="文本块向量化"></el-step>
                    <el-step title="构建完成"></el-step>
                </el-steps>
            </div>

            <el-divider content-position="left">
                <el-text type="info">词频统计</el-text>
            </el-divider>

            <div id="word_cloud" style="width:700;height: 350px;margin-top:20px;" v-show="form.buildingPipeline.currentOrd >= 3">
            </div>

            <div class="clearfloat"></div>
        </div>

    </app-frame>

</template>



<script>

const DbDetail = {
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
                llmType: '',
                llmPrompt: '',
                vectorIndexType:'HNSW',
                desc: '',
                genTime: '',
                chunkNum: 0,
                questionType:'ORIGIN',
                ifUseThinkChain:false,
                chunkReturnType: 'original',
                buildingPipeline: {
                    currentOrd: 0,
                },
                ifReRank:false,
                embeddingMethod: 'DistillBert',
            },
            wordFreqs: [],
            cloudChart: null,
        }
    },
    methods: {
        gotoSearch(db,llmType,ifStream) {
            // location.href = ("/mag/list_db")
            let url = '/mag/db_search/' + db
            if(ifStream){
                url = '/mag/db_search_stream/' + db
            }
            location.href = url
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_db")
        },
        setupWordCloud() {
            let option = {
                title: { text: "热词词频（TOP50）", left: 'center' },
                tooltip: {},
                series: [{
                    type: 'wordCloud',
                    gridSize: 6,
                    sizeRange: [12, 50],
                    rotationRange: [-90, 90],
                    shape: 'diamond',
                    width: 600,
                    height: 300,
                    drawOutOfBound: true,
                    textStyle: {
                        color: function () {
                            return 'rgb(' + [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(',') + ')';
                        }
                    },
                    emphasis: {
                        textStyle: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    data: this.wordFreqs
                }]
            };
            let chart = echarts.init(document.getElementById("word_cloud"));
            chart.setOption(option);
            chart.showLoading();
            this.cloudChart = chart;
        },
        fetchDbData(db) {
            let url = "/api/text_db_detail/" + db;
            axios.get(url).then((response) => {
                this.form = response.data;
                console.log(this.form);

                if (this.form.buildingPipeline.currentOrd >= 3) {
                    this.fetchWordFreqsData(this.db);
                }
            });
        },
        fetchWordFreqsData(db) {
            let url = "/api/word_freqs/" + db;
            axios.get(url).then((response) => {
                wfs = response.data;
                console.log(wfs);
                this.wordFreqs = wfs.map((wf) => {
                    return {
                        name: wf._1,
                        value: wf._2
                    }
                });
                this.setupWordCloud();
                this.cloudChart.hideLoading();
                this.cloudChart.setOption({
                    series: [{
                        data: this.wordFreqs,
                    }]
                });
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }
    },
    template: "#db-detail"
};


app.component("db-detail", DbDetail);
</script>
<style>
.clearfloat {

    clear: both;

}
</style>
