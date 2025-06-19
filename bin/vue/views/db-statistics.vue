<template id="db-statistics">

    <app-frame>


        <div style="text-align: left;padding-left: 20px;width: 95%;">


            <div id="statisLines" style="width:100%;height:210px;">

            </div>


            <el-divider content-position="left">
                <el-text type="info">大模型增强智能应用</el-text>
            </el-divider>

            <div>
                <el-row :gutter="10" justify="center">
                    <el-col :span="6" v-for="feature in features" :key="feature.title">
                        <el-card shadow="hover" class="feature-card">
                            <div class="card-content">
                                <!--
                                <el-icon :size="50" :class="['feature-icon', feature.iconClass]"></el-icon>
                                -->
                                <img :src="'/images/' + feature.img" style="width:150px;height:50px;"
                                    class="feature-icon" />
                                <h3 class="feature-title">{{ feature.title }}</h3>
                                <p class="feature-description">{{ feature.description }}</p>

                                <div style="text-align: center;width:100%;">
                                    <el-link :href="feature.link" type="info" :alt="feature.title"
                                        :disabled="feature.disabled" target="_blank">
                                        {{ feature.instruct }} >
                                    </el-link>
                                </div>


                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>

            <el-divider content-position="left">
                <el-text type="info">内置特色工具</el-text>
            </el-divider>

            <div class="tool-gallery">
                <el-row :gutter="7">
                    <el-col :span="4" v-for="tool in tools" :key="tool.title">
                        <el-card shadow="hover" class="tool-card" @click="handleClick(tool.name)">
                            <div class="card-content">
                                <img :src="tool.src" style="width:90px;height:90px;margin-top: -10px;"
                                    class="circle-icon" />
                                <h3 class="tool-title">{{ tool.title }}</h3>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>


            <el-card style="width: 100%;margin-top: 20px;" shadow="never">
                <template #header>
                    <div class="card-header">
                        <el-text type="info">
                            支持的文件类型
                        </el-text>
                    </div>
                </template>

                <el-row :gutter="10" justify="center">
                    <el-col :span="3" class="file_cell">
                        <img src="/images/file_exts/txt.png" class="file_logo" title="TXT" />
                    </el-col>
                    <el-col :span="3" class="file_cell">
                        <img src="/images/file_exts/pdf.png" class="file_logo" title="PDF，支持OCR" />
                    </el-col>
                    <el-col :span="3" class="file_cell">
                        <img src="/images/file_exts/docx.png" class="file_logo" title="DOC/DOCX" />
                    </el-col>
                    <el-col :span="3" class="file_cell">
                        <img src="/images/file_exts/html.png" class="file_logo" title="HTM/HTML" />
                    </el-col>
                    <el-col :span="3" class="file_cell">
                        <img src="/images/file_exts/md2.png" class="file_logo" title="MarkDown" />
                    </el-col>
                    <el-col :span="3" class="file_cell">
                        <img src="/images/file_exts/csv2.jpeg" class="file_logo" title="CSV" />
                    </el-col>
                    <el-col :span="3" class="file_cell">
                        <img src="/images/file_exts/xls.png" class="file_logo" title="XLS/XLSX" />
                    </el-col>
                    <el-col :span="3" class="file_cell">
                        <img src="/images/file_exts/ppt.png" class="file_logo" title="PPT/PPTX" />
                    </el-col>
                </el-row>

            </el-card>


        </div>


        <el-dialog v-model="dialogVisible" title="查询结果" width="400" :before-close="handleClose"
            style="text-align: left;">
            <span>{{ message }}</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>


    </app-frame>

</template>
<script>

const DbStatistics = {
    mounted() {
        this.requestData();
        let chartDom = document.getElementById('statisLines');
        this.myChart = echarts.init(chartDom);
        this.myChart.setOption(this.options);
    },
    data() {
        return {

            message: "...",
            dialogVisible: false,
            localTime: '',
            address: {},
            myChart: null,

            features: [
                {
                    title: '大模型交互',
                    description: '支撑Ollama本地大模型部署，集成多种主流商用大模型API。',
                    link: '/user/user_llm_session',
                    img: 'llm2.png',
                    instruct: '马上使用',
                    disabled: false
                },
                {
                    title: '检索增强生成',
                    description: '自主开发向量库，适合海量私有文件检索，补全大模型知识。',
                    link: '/mag/list_db',
                    img: 'rag2.png',
                    instruct: '管理文本库',
                    disabled: false
                },
                {
                    title: 'Agent',
                    description: '提供多种Agent任务策略，集成本地工具，构建智能场景应用。',
                    link: '/mag/list_react_agent',
                    img: 'agent2.png',
                    instruct: '管理ReAct Agent',
                    disabled: false
                },
                {
                    title: '图像检索',
                    description: '支持图像特征提取与检索，针对人脸特别优化，赋能多模态应用。',
                    link: '/mag/list_image_db',
                    img: 'image2.png',
                    instruct: '管理图像库',
                    disabled: false,
                }],

            tools: [
                { name: 'web_search', title: '互联网搜索', src: '/images/tools/search2.png' },
                { name: 'weather', title: '天气预报', src: '/images/tools/weather2.png' },
                { name: 'local_address', title: '地理位置', src: '/images/tools/location2.webp' },
                { name: 'local_time', title: '本地时间', src: '/images/tools/time2.png' },
                { name: 'plots', title: '图表生成', src: '/images/tools/report2.png' },
                { name: 'make_ppt', title: 'PPT制作', src: '/images/tools/ppt_gen2.png' },

            ],

            options: {
                title: {
                    text: '  一周使用统计 ',
                    textStyle: {
                        color: '#909399',
                        fontWeight: 'normal',
                        fontSize: '14px',
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['检索', '大模型', '检索增强生成（RAG）', 'Agent']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '检索',
                        symbolSize: 8,
                        type: 'line',
                        stack: 'Total',
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: '大模型',
                        type: 'line',
                        symbolSize: 8,
                        stack: 'Total',
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: '检索增强生成（RAG）',
                        type: 'line',
                        symbolSize: 8,
                        stack: 'Total',
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Agent',
                        type: 'line',
                        symbolSize: 8,
                        stack: 'Total',
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            },


        };
    },

    methods: {

        requestData() {
            let url = "/api/statistic_log";
            axios.get(url).then((response) => {
                let statis = response.data;
                this.options.series[0].data = statis.Search
                this.options.series[1].data = statis.LLM
                this.options.series[2].data = statis.RAG
                this.options.series[3].data = statis.Agent
                this.options.xAxis.data = statis.days

                this.myChart.setOption(this.options);
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        },
        handleClick(name) {
            if (name == 'local_time') {
                this.testLocalTime();
            } else if (name == 'local_address') {
                this.testAddress();
            } else if (name == 'web_search') {
                window.open("/user/user_web_search", "_blank");
                // location.href = ("/user/user_web_search");
            } else if (name == 'make_ppt') {
                window.open("/user/user_make_ppt", "_blank");
                // location.href = ("/user/user_make_ppt");
            } else {
                this.dialogVisible = true;
                this.message = '正在开发中，敬请期待...';
            }
        },
        gotoAdd() {
            console.log("ready goto")
            location.href = ("/mag/alter_db")
            // this.$router.push({ path: '/alter_db' })
        },
        testAddress() {
            let url = "/api/local_address";
            this.dialogVisible = true;
            axios.get(url).then((response) => {
                this.address = response.data;
                this.message = this.address.address;
                console.log(response.data);
            });
        },

        testLocalTime() {
            let url = "/api/local_time";
            this.dialogVisible = true;
            axios.get(url).then((response) => {
                this.localTime = response.data;
                this.message = this.localTime;
                console.log(response.data);
            });
        },

    },
    template: "#db-statistics"
};

app.component("db-statistics", DbStatistics);
</script>
<style scoped>
.bleft {
    /* justify-content: flex-start;
  display: flex; */
    display: inline-block;
}

.bright {
    /* flex:1;           
  justify-content: flex-end;
  display: flex; */
    float: right;
}

.file_logo {
    width: 50px;
    height: 60px;
    padding: 3px 3px 3px 3px;
}

.file_cell {
    text-align: center;
}

.feature-card {
    text-align: center;
    padding: 0px;
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.feature-icon {
    margin-top: -10px;
    margin-bottom: 0px;
    color: #409eff;
    /* 图标颜色，可以根据设计需求调整 */
}

.feature-title {
    font-size: 12px;
    margin-bottom: 0px;
    color: #333;
}

.feature-description {
    font-size: 12px;
    color: #666;
    margin-bottom: 20px;
    line-height: 20px;
}


.tool-gallery {
    margin-top: 30px;
}

.tool-card {
    text-align: center;
    cursor: pointer;
    padding: 0px;
    transition: transform 0.3s, box-shadow 0.3s;
    border-radius: 15px;
    /* 圆角效果 */
    background-color: #f9f9f9;
    /* 淡灰色背景 */
}

.tool-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tool-icon {
    margin-top: 0px;
    margin-bottom: 0px;
    color: #409eff;
}

.tool-title {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: -10px;
    color: #333;
    margin-top: 10px;
}


.circle-icon {
    width: 100px;
    /* 你可以根据需要调整大小 */
    height: 100px;
    background-color: white;
    /* 图标背景色，可以根据需要更改 */
    border-radius: 50%;
    /* 使图标成为圆形 */
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 添加阴影效果 */
}
</style>
