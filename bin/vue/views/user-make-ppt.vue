<template id="user-make-ppt">

    <user-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ db == null ? '' : '检索文本库' }} </el-text>
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
                            工具名称
                        </div>
                    </template>
                    自动生成PPT
                </el-descriptions-item>
                <el-descriptions-item width="170px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            参数
                        </div>
                    </template>
                    cnt: 要生成PPT的内容
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Timer />
                            </el-icon>
                            是否联网
                        </div>
                    </template>
                    否
                </el-descriptions-item>


                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <User-Filled />
                            </el-icon>
                            功能介绍
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        自动生成PPT的工具
                    </el-text>
                </el-descriptions-item>
            </el-descriptions>

            <el-tabs id="query3Div" v-model="activeName" class="demo-tabs" 
                style="border:0px solid red;min-height: 480px;">
                <el-tab-pane label="PPT生成" name="query1">
                    <div style="border:0px solid red;">
                        <el-input v-model="cnt" class="searchBox" :rows="5" type="textarea"
                            placeholder="请输入要生成PPT的源内容，大模型将自动生成大纲，系统根据大纲制作PPT"></el-input>

                        <el-button type="primary" @click="doStreamMakePPT" class="searchButton"
                            :disabled="loading">生成PPT</el-button>

                            <div style="font-size: 10pt;text-align: left;">
                            <el-text>大模型挂载：</el-text>
                            <el-select v-model="this.llmType" placeholder="选择辅助生成的大模型" style="width:400px;">
                                <el-option v-for="item in this.llmTypes" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>

                        <div v-loading="loading" class="userSearchResult">
                            <div style=" border: 0px solid gray;" v-show="!this.isEmpty(this.tempPPT)">

                                <el-divider content-position="left">
                                    <el-text class="mx-1" type="primary">
                                        PPT生成结果
                                    </el-text>
                                </el-divider>


                                <el-text class="mx-1" type="info" v-if="this.resultPPT.success==true">
                                    PPT文件下载：
                                </el-text>

                                <el-link :href="'/download2?type=ppt_task&id=' + resultPPT.id" target="_blank"
                                    :disabled="!resultPPT.success" type="primary"  v-if="this.resultPPT.success==true">
                                    <el-text type="primary">
                                        生成的PPT文件
                                    </el-text>
                                </el-link>

                                <hr v-if="this.resultPPT.success==true" />

                                <div class="userSearchResult" style="border:0px solid #ccc;margin-top: 30px;">
                                    <el-text class="mx-1" v-html="replaceLnWithBr(this.tempPPT)"></el-text>
                                </div>

                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(this.tempPPT)" description="暂无PPT生成结果" />
                        </div>

                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>
    </user-frame>

</template>


<script>
const UserMakePpt = {
    mounted() {

    },
    data() {
        return {
            activeName: 'query1',
            dialogVisible: false,
            cnt: '',
            loading: false,
            resultPPT: {
                success: false,
                id: '',
            },
            tempPPT: "",
            llmType: "DeepSeek",
            llmTypes: getRAGLLMTypes(),
        }
    },
    methods: {
        isEmpty(value) {
            return value === '';
        },

        replaceLnWithBr(text) {
            tt = text.replaceAll('\<think\>', '\<div class="quoteThink"\>')
            tt = tt.replaceAll('\</think\>', '\</div\>')
            tt = marked.parse(tt);
            // 渲染完成后，如果KaTeX已加载，延迟处理LaTeX
            if (this.katexLoaded) {
                this.$nextTick(() => {
                    renderExistingLatex('.userSearchResult');
                });
            }
            return tt;
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/user/user_workspace")
        },
        checkQuery(query) {
            // console.log(_MessageBox);
            this.$msgbox(
                {
                    message: '制作PPT的内容不能为空！',
                    title: '警告',
                    confirmButtonText: '确认',
                    type: 'warning',
                }
            );
            // alert('检索的内容不能为空！');
        },

        doMakePpt() {
            if (this.cnt.trim() == '') {
                this.checkQuery(this.cnt);
                return;
            }
            // this.currentQuery = 'query1';
            this.loading = true;
            let params = {
                "cnt": this.cnt,
            }
            let url = "/api/make_ppt";
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.result1 = response.data;
                // console.log(this.result1)
                this.loading = false;
            });
        },

        doStreamMakePPT() {
            if (this.cnt.trim() == '') {
                this.checkQuery(this.cnt);
                return;
            }
            // this.currentQuery = 'query3';
            this.loading = true;
            this.tempPPT = "";
            this.resultPPT.sucess = false;
            this.resultPPT.id = ''; 
            let params = {
                "cnt": this.cnt,
                "llmType": this.llmType,
            }
            let url = "/websocket/make_ppt";
            let socket = new WebSocket("ws://" + location.hostname + ":" + location.port + url);
            socket.onopen = function (e) {
                console.log("[open] Connection established");
                console.log("Sending to server");
                let strr = JSON.stringify(params);
                // console.log(strr);
                socket.send(strr);
            };
            socket.onmessage = this.wsmessage;
            socket.onclose = this.wsclose;
            socket.onerror = this.wserror;
        },
        wsmessage: function (event) {
            this.loading = false;
            let obj = JSON.parse(event.data)
            // console.log(`[message] Data received from server: ${event.data}`);
            let msgType = obj.type;
            let done = obj.ifDone;
            let msg = obj.msg;
            // console.log(msg);
            let ifMultiStep = obj.ifMultiStep;
            if (msgType == 'Word') {
                if (typeof (this.tempPPT) == 'undefined' || this.tempPPT == null) {
                    this.tempPPT = "";
                }
                this.tempPPT += msg;
                window.scrollTo(0, document.body.scrollHeight);
            }
            if (msgType == 'PPTResult') {
                console.log(obj);
                this.resultPPT.success = obj.success;
                this.resultPPT.id = obj.id;
                console.log(this.resultPPT.success);
                console.log(this.resultPPT.id);
            }

        },
        wsclose: function (event) {
            if (event.wasClean) {
            } else {
                // 例如服务器进程被杀死或网络中断
                // 在这种情况下，event.code 通常为 1006
                console.log('[close] Connection died');
            }
            this.scrollToSection('query3Div');
            this.loading = false;
        },
        wserror: function (error) {
            this.loading = false;
            console.log(`[error] ${error.message}`);
        },
        scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动
            }
        },


    },
    template: "#user-make-ppt"
};

app.component("user-make-ppt",  UserMakePpt);
</script>

<style>
.clearfloat {
    clear: both;
}

.userSearchResult {
    text-align: left;
    width: 920px;
    margin: 0 auto;
    font-size: 9pt;
}

.searchButton {
    height: 120px;
    width: 120px;
    margin-left: 5px;
}

.searchBox {
    width: 800px;
    height: 120px;
}


</style>
