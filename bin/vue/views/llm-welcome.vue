<template id="welcome">

    <app-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large"> 测试大模型问答 </el-text>
                </template>
            </el-page-header>
            <hr />



        </div>

    </app-frame>


</template>


<script>
const Welcome = {
    mounted() {

    },
    data() {
        return {
            activeName: 'query3',
            query1: '',
            query2: '',
            query3: '',
            result1: {},
            result2: {},
            result3: {},
            loading: false,
            currentQuery: '',
        }
    },
    methods: {
        isEmpty(value) {
            return JSON.stringify(value) === '{}';
        },
        handleClick(tab, event) {
            this.currentQuery = tab.props['name'];
            this.loading = false;
            // console.log(this.currentQuery)
        },
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_db")
        },
        checkQuery(query) {
            // console.log(_MessageBox);
            this.$msgbox(
                {
                    message: '提问的内容不能为空！',
                    title: '警告',
                    confirmButtonText: '确认',
                    type: 'warning',
                }
            );
            // alert('检索的内容不能为空！');
        },
        doLLM1() {
            if (this.query1.trim() == '') {
                this.checkQuery(this.query1);
                return;
            }
            // this.currentQuery = 'query2';
            this.loading = true;
            let params = {
                "model": 'ChatGLM4',
                "query": this.query1,
            }
            let url = "/llm";
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 600000,
            }).then((response) => {
                this.result1 = response.data;
                this.result1.llmAns = this.result1.llmAns.replace(/(\r\n|\r|\n)/g, '<br/>')
                console.log(this.result1)
                this.loading = false;
            });
        },

    },
    template: "#welcome"
};

app.component("welcome", Welcome);
</script>
<style>
.clearfloat {

    clear: both;

}

.searchResult {
    text-align: left;
    width: 650px;


}

.searchButton {
    height: 80px;
    width: 80px;
    margin-left: 5px;
}
</style>




