<template id="alter-chatglm4">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">修改ChatGLM4配置</el-text>
                </template>
            </el-page-header>
            <hr />
            <div class="infoBox">
                <el-text type="primary">
                    ChatGLM4 API Key申请地址（第三方，与本软件无关）：
                </el-text>
                <el-link type="warning" href="https://open.bigmodel.cn/" target="_blank">智谱AI开放平台</el-link>
            </div>

            <div style="text-align: center;width:100%;">
                <el-form :model="form" label-width="auto">
                    <el-form-item label="API Key">
                        <el-input v-model="form.apiKey" placeholder="请输入ChatGLM4官方所提供的API KEY" type="password"/>
                    </el-form-item>
                    <el-form-item label="模型名称">
                        <el-input v-model="form.model" placeholder="智普开放平台上发布的模型名称" />
                    </el-form-item>
                    <el-form-item label="是否启用" prop="ifInUse">
                        <el-switch 
                            v-model="form.ifInUse" 
                            active-text="启用" 
                            inactive-text="禁用"
                            :active-value="true"
                            :inactive-value="false"
                        />
                        <div style="margin-top: 5px;">
                            <el-text size="small" type="info">启用后该模型配置将可用于LLM服务</el-text>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
                <div class="clearfloat"></div>
            </div>
            <div class="clearfloat"></div>
        </div>

    </app-frame>



</template>
<script>

const AlterChatGlm4 = {
    mounted() {
        this.fetchData();
    },
    data() {
        return {
            form: {
                apiKey: '',
                requestIdTemplate: '',
                model: '',
                ifInUse: true,
            },
            result: '',
        }
    },
    methods: {
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_db")
            // this.$router.push({ path: '/list_db' })
        },
        onSubmit() {
            let url = "/api/alter_chat_glm4";
            axios.post(url, this.form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.result = response.data;
                console.log(response.data);
                this.$message({
                    title: '修改结果',
                    message: this.result == 'ok' ? '修改成功！' : '修改失败！',
                    type: this.result == 'ok' ? 'success' : 'error',
                });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchData() {
            let url = "/api/llm_config/chat_glm4"
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.form = response.data;
                // console.log(response.data);
            });
        }
    },
    template: "#alter-chatglm4"
};

app.component("alter-chatglm4", AlterChatGlm4);
</script>
<style>
.clearfloat {

    clear: both;

}

.infoBox {
    text-align: left;
    margin: 5px 0px 5px 0px;
    padding: 10px 10px 10px 10px;
    background-color: #F2F6FC;
}
</style>
