<template id="list-chunk-task">

    <app-frame>



        <div style="text-align: left;padding-left: 20px;width: 95%;">
            <div>

                <el-button class="button" @click="gotoAdd()" type="primary">
                    <el-icon class="el-icon--left">
                        <Plus />
                    </el-icon>
                    添加新任务</el-button>
            </div>

            <div class="infoBox">
                <el-text type="info"  size="small">
                    *文本块迭代任务使用大模型按照提示词分析指定数据库中所有的文本块内容。
                    由于每个文本块都较小，不会导致大模型输入溢出，非常适合处理针对数据库中全部文本的分析任务，如批量翻译、命名实体识别、实体关系抽取、情感分析等。
                </el-text><br />
                <el-text type="warning" size="small">
                    *迭代任务会产生海量的大模型调用，如果您使用的收费的大模型（如DeepSeek API、ChatGLM4），请谨慎使用。
                </el-text>
            </div>

            <el-space :fill="true" wrap style="width:100%;">
                <el-card v-for="(task,index) in tasks" class="box-card" :key="task.id">
                    <template #header>
                        <div class="card-header">
                            <el-link class="bleft" :href="'/mag/chunk_task_detail/' + task.id" type="primary" title="查看任务详情"
                                style="font-size: 16pt;;">
                                <el-icon>
                                    <trend-charts />
                                </el-icon>
                                {{ task.name }}
                            </el-link>

                            <el-button-group class="ml-4 bright">
                                <el-button type="primary" @click="gotoAlter(task.id)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                                <el-button type="primary" @click="testDelete(task.id)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon></el-button>
                            </el-button-group>
                        </div>
                    </template>


                    <el-descriptions class="margin-top" :column="2" :size="size" border>
                        <el-descriptions-item width="160px">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Coin />
                                    </el-icon>
                                    任务数据库
                                </div>
                            </template>
                            <el-tag size="small" type="success">{{ task.dbName }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item width="160px">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <trend-charts />
                                    </el-icon>
                                    状态
                                </div>
                            </template>
                            <el-tag size="small" :type="task.status == 'FINISHED' ? 'success' : 'warning'">{{ task.status }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item width="160px">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Timer />
                                    </el-icon>
                                    创建时间
                                </div>
                            </template>
                            {{ this.formatTime(task.genTime) }}
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
                            {{ task.llmType }}
                        </el-descriptions-item>
                        <el-descriptions-item span="2">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <office-building />
                                    </el-icon>
                                    原始JSON
                                </div>
                            </template>
                            &nbsp;
                            <el-link :href="'/download2?type=chunk_task&id=' + task.id" target="_blank"
                                :disabled="task.status != 'FINISHED'" type="success">
                                <el-text  type="success">
                                    下载原始结果
                                </el-text>
                            </el-link>
                        </el-descriptions-item>

                        <el-descriptions-item span="2">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <office-building />
                                    </el-icon>
                                    可读文件
                                </div>
                            </template>
                            <el-checkbox v-model="task.ifOutputChunk" >输出原文</el-checkbox>&nbsp;&nbsp;
                            <el-button type="primary" text bg title="生成Markdown文件" :disabled="task.status != 'FINISHED'"
                                @click="makeMd(task.ifOutputChunk,index)">
                                <el-text  type="primary">
                                    生成可读文件
                                </el-text>
                            </el-button>
                            &nbsp;&nbsp;
                            <el-text v-show="task.loading" type="warning">
                                生成中...
                            </el-text>
                            <el-link :href="'/download2?type=chunk_markdown&id=' + task.id" target="_blank"
                                v-show="task.markDownFile != null" type="success">
                                <el-text  type="success">
                                    下载Markdown文件
                                </el-text>
                            </el-link>
                        </el-descriptions-item>

                    </el-descriptions>

                </el-card>

            </el-space>
        </div>

    </app-frame>



</template>
<script>

const ListChunkTask = {
    mounted() {
        this.requestData();
    },
    data() {
        return {
            message: "Hello Element Plus",
            tasks: {
            },
            
        };
    },
    methods: {
        gotoAdd() {
            location.href = ("/mag/alter_chunk_task")
            // this.$router.push({ path: '/alter_db' })
        },
        gotoAlter(task) {
            location.href = ("/mag/alter_chunk_task/" + task)
            // this.$router.push({ path: '/alter_db/' + db })
        },
        testDelete(task) {
            this.$msgbox(
                {
                    message: '确定要删除本任务吗？这将删除关联的挖掘结果数据！',
                    title: '警告',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                    type: 'warning',
                }
            ).then(() => {
                console.log("deleting..." + task)
                this.doDelete(task);
            }).catch(() => { });
        },
        doDelete(task) {
            let url = "/api/delete_chunk_task";
            params = { "task_id": task };
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data);
                location.href = ("/mag/list_chunk_task")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });
        },
        requestData() {
            let url = "/api/list_chunk_task";
            axios.get(url).then((response) => {
                this.tasks = response.data;
                for (let i = 0; i < this.tasks.length; i++) {
                    this.tasks[i].ifOutputChunk = true;
                }
                console.log(response.data);
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        },
        makeMd(ifOutputChunk,taskIndex) {
            let url = "/api/make_chunk_task_md";
            let taskId = this.tasks[taskIndex].id;
            this.tasks[taskIndex].loading = true;
            params = { 
                "task_id": taskId ,
                "if_output_chunk": ifOutputChunk
            };
            console.log(params);
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data);
                this.tasks[taskIndex].markDownFile = response.data;
                this.tasks[taskIndex].loading = false;
            }).catch((error) => {
                console.log(error);
                this.tasks[taskIndex].loading = false;
            });
        },
    },
    template: "#list-chunk-task"
};

app.component("list-chunk-task", ListChunkTask);
</script>
<style>
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

.infoBox{
    margin: 5px 0px 5px 0px;
    padding: 10px 10px 10px 10px;
    background-color: #F2F6FC;
}
</style>


