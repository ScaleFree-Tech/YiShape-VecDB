<template id="user-web-search">

    <user-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
            </el-page-header>
            <hr />


            <el-descriptions class="margin-top" :column="2" border>

                <el-descriptions-item width="150px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            工具名称
                        </div>
                    </template>
                    互联网搜索引擎
                </el-descriptions-item>
                <el-descriptions-item >
                    <template #label>
                        <div class="cell-item" style="width: 130px;">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            参数
                        </div>
                    </template>
                    query: 搜索的语句
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
                    是
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
                        高质量互联网知识召回：基于多个互联网搜索引擎结果进行内容聚合与相关性重排、识别并过滤广告和虚假信息，可用于Agent并辅助大模型进行事实性核查。
                    </el-text>
                </el-descriptions-item>


            </el-descriptions>

            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick"
                style="border:0px solid red;min-height: 480px;">
                <el-tab-pane label="互联网搜索" name="query1">
                    <div style="border:0px solid red;">
                        <el-input v-model="query1" class="searchBox" :rows="5" type="textarea"
                            placeholder="请输入要搜索的问题"></el-input>

                        <el-button type="primary" @click="doSearch" class="searchButton"
                            :disabled="loading">搜索</el-button>

                        <div v-loading="loading" class="userSearchResult">
                            <div id="query1Result" style=" border: 0px solid gray;" v-if="!this.isEmpty(this.result1)">

                                <el-divider content-position="left">
                                    <el-text class="mx-1" type="primary">
                                        检索到的结果，共 {{ result1.items.length }} 条
                                    </el-text>
                                </el-divider>

                                <ul style="margin-left: -20px;">
                                    <li v-for="(item, ind) in result1.items">
                                        <el-link type="primary" :title="item.name" @click="checkSummary(ind)">
                                            {{ item.title }}
                                        </el-link>
                                        <br />
                                        <el-text class="mx-1" type="info">
                                            摘要：{{ item.content }}
                                        </el-text>
                                        <br />
                                        <el-text type="success">
                                            收录时间：{{ item.publishedDate }}
                                        </el-text>
                                    </li>
                                </ul>
                            </div>
                            <el-empty :image-size="200" v-show="this.isEmpty(this.result1)" description="暂无搜索结果" />
                        </div>

                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>


        <el-dialog v-model="dialogVisible" title="搜索结果详情" width="600" :before-close="handleClose"
            style="text-align: left;">
            <h3>{{ this.currentTitle }}</h3>
            <hr/>
            <el-text size="small">
                {{ this.currentSummary }}
            </el-text>
            <br/><br/>
            <el-text type="info" size="small">链接：</el-text>
            <el-link type="primary" target="_blank" :title="this.currentTitle" :href="this.currentUrl">
                {{ this.currentUrl.length>60?this.currentUrl.substring(0,60)+'...':this.currentUrl }}
            </el-link>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>

    </user-frame>


</template>


<script>
const UserWebSearch = {
    mounted() {

    },
    data() {
        return {
            activeName: 'query1',
            dialogVisible: false,
            query1: '',
            result1: {},
            loading: false,
            currentTitle: '',
            currentSummary: '',
            currentUrl: '',
        }
    },
    methods: {
        isEmpty(value) {
            return JSON.stringify(value) === '{}';
        },
        checkSummary(ind){
            let xx = this.result1.items[ind];
            // console.log(xx)
            this.currentTitle = xx.title;
            this.currentSummary = xx.content;
            this.currentUrl = xx.url;
            this.dialogVisible = true;
        },
        replaceLnWithBr(text) {
            tt = text.replace(/(\r\n|\r|\n)/g, '<br/>');
            // tt = tt.replace('&', '&amp;');
            tt = tt.replace('<', '&lt;');
            tt = tt.replace('>', '&gt;');
            tt = tt.replace('</think>', '&lt;/think&gt;');
            return tt;
        },
        handleClick(tab, event) {
            this.currentQuery = tab.props['name'];
            this.loading = false;
            // console.log(this.currentQuery)
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/user/user_workspace")
        },
        checkQuery(query) {
            // console.log(_MessageBox);
            this.$msgbox(
                {
                    message: '搜索的内容不能为空！',
                    title: '警告',
                    confirmButtonText: '确认',
                    type: 'warning',
                }
            );
            // alert('检索的内容不能为空！');
        },

        doSearch() {
            if (this.query1.trim() == '') {
                this.checkQuery(this.query1);
                return;
            }
            // this.currentQuery = 'query1';
            this.loading = true;
            let params = {
                "query": this.query1,
            }
            let url = "/api/web_search";
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


    },
    template: "#user-web-search"
};

app.component("user-web-search", UserWebSearch);
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
