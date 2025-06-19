<template id="chunk-task-detail">

    <app-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ task_id == null ? '' : '查看文本块迭代任务详情' }} </el-text>
                </template>
            </el-page-header>
            <hr />


            <el-descriptions class="margin-top" :title="task.name" :column="2" border>
                <el-descriptions-item width="170px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            任务名称
                        </div>
                    </template>
                    {{ task.name }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            目标数据库
                        </div>
                    </template>
                    {{ task.dbName }}
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
                    <el-tag size="small" type="success">{{ task.status }}</el-tag>
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
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <office-building />
                            </el-icon>
                            结果输出地址
                        </div>
                    </template>
                    <el-tooltip :content="task.outputPath" placement="bottom">
                        <el-text style="max-width: 145px;" truncated type="info">
                            {{ task.outputPath }}
                        </el-text>
                    </el-tooltip>
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
                    {{ this.formatTime(task.genTime) }}
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
                        {{ task.sysPrompt }}
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
                        {{ task.userPrompt }}
                    </el-text>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            任务介绍
                        </div>
                    </template>
                    <el-text type="info" size="small">
                        {{ task.desc }}
                    </el-text>
                </el-descriptions-item>
            </el-descriptions>

        </div>

    </app-frame>

</template>



<script>

const ChunkTaskDetail = {
    mounted() {
        this.task_id = this.$javalin.pathParams["task_id"];
        if (this.task_id != null) {
            this.fetchTaskData(this.task_id);
        }
    },
    data() {
        return {
            task_id: '',
            task: {
                id: '',
                name: '',
                dbName: '',
                outputPath: '',
                llmType: 'Ollama',
                sysPrompt: '请使用中文回答。',
                userPrompt: '${chunk}。请提取以上内容中的命名实体，并以{实体:实体类别, 实体: 实体类别,}的JSON格式返回。',
                desc: '',
            },
        }
    },
    methods: {
        gotoList() {
            // console.log("ready goto")
            location.href = ("/mag/list_chunk_task")
        },
        fetchTaskData(task_id) {
            let url = "/api/chunk_task_detail/" + task_id;
            axios.get(url).then((response) => {
                this.task = response.data;
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }
    },
    template: "#chunk-task-detail"
};

app.component("chunk-task-detail", ChunkTaskDetail);
</script>
<style></style>
