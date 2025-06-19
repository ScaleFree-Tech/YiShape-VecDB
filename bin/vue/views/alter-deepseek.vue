<template id="alter-deepseek">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">修改DeepSeek API配置</el-text>
                </template>
            </el-page-header>
            <hr />
            <div class="infoBox">
                <el-text type="primary">
                    DeepSeek API Key申请地址（第三方，与本软件无关）：
                </el-text>
                <el-link type="warning" href="https://platform.deepseek.com/" target="_blank">DeepSeek开放平台</el-link>
            </div>

            <div style="text-align: center;width:100%;">
                <el-form :model="form" label-width="auto">
                    <el-form-item label="API Key">
                        <el-input v-model="form.apiKey" placeholder="请输入DeepSeek官方所提供的API KEY"  type="password"/>
                    </el-form-item>

                    <el-form-item label="自定义参数">
                        <el-input v-model="form.options" type="textarea" placeholder="DeeKSeek自定义参数，使用默认值时请留空。" rows="6"/>
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">每行一组参数，参数名和参数值用英文符号“:”分割。参数配置参考：</el-text>
                        <el-link size = "small" type="warning" href="https://platform.deepseek.com/" target="_blank">
                            <el-text size="small" >DeepSeek官网参数说明文档</el-text></el-link>
                    </div>

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

const AlterDeepSeek = {
    mounted() {
        this.fetchData();
    },
    data() {
        return {
            form: {
                apiKey: '',
                options: '',
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
            let url = "/api/alter_deepseek";
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
            let url = "/api/llm_config/deepseek"
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.form = response.data;
                // console.log(response.data);
            });
        }
    },
    template: "#alter-deepseek"
};

app.component("alter-deepseek", AlterDeepSeek);
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

.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 80px;
}
</style>
