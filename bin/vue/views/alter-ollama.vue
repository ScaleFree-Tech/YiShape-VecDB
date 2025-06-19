<template id="alter-o">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">修改OLLAMA配置</el-text>
                </template>
            </el-page-header>
            <hr />

            <div class="infoBox">
                <el-text type="primary">
                    使用Ollama前需要在本地或局域网安装Ollama服务并在其中加载大模型，Ollama官网：
                </el-text>
                <el-link type="warning" href="https://ollama.com/" target="_blank">https://ollama.com/</el-link>
            </div>

            <div style="text-align: center;width:100%;">
                <el-form :model="form" label-width="auto">
                    <el-form-item label="IP地址">
                        <el-input v-model="form.ipAddr" placeholder="请输入OLLAMA服务所在的IP地址"  />
                    </el-form-item>
                    <el-form-item label="端口">
                        <el-input v-model="form.port" placeholder="请输入OLLAMA服务的端口号" />
                    </el-form-item>
                    <el-form-item label="模型名称">
                        <el-input v-model="form.model" placeholder="请输入大模型的名称" />
                    </el-form-item>

                    <el-form-item label="自定义参数">
                        <el-input v-model="form.options" type="textarea" placeholder="每行一组参数，参数名和参数值用英文符号“:”分割"  :rows="6"/>
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">每行一组参数，参数名和参数值用英文符号“:”分割。参数配置参考：</el-text>
                        <el-link size = "small" type="warning" href="https://github.com/ollama/ollama/blob/main/docs/modelfile.md#valid-parameters-and-values" target="_blank">
                            <el-text size="small" >Ollama官网参数说明文档</el-text></el-link>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
                <div class="clearfloat"></div>
            </div>
        </div>

    </app-frame>



</template>
<script>

const AlterOllama = {
    mounted() {
            this.fetchData();
    },
    data() {
        return {
            form: {
                ipAddr: '',
                port: '',
                model: '',
                options: '',
            },
            result:'',
        }
    },
    methods: {
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_db")
            // this.$router.push({ path: '/list_db' })
        },
        onSubmit() {
            let url = "/api/alter_ollama";
            axios.post(url, this.form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.result = response.data;
                console.log(response.data);
                this.$message({
                    title: '修改结果',
                    message: this.result=='ok'?'修改成功！':'修改失败！',
                    type: this.result=='ok'?'success':'error',
                });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchData() {
            let url = "/api/llm_config/ollama"
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.form = response.data;
                // console.log(response.data);
            });
        }
    },
    template: "#alter-o"
};

app.component("alter-ollama", AlterOllama);
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
