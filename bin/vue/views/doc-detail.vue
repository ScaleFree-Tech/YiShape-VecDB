<template id="doc-detail">

    <app-frame>
        <div style="text-align: left;padding-left: 20px;width: 95%;">
            <el-space :fill="true" wrap style="width:100%;">
                <div v-html="docCnt" class="markdown-body myMarkDown">
                </div>
            </el-space>
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

const DocDetail = {
    mounted() {
        let tempName = this.$javalin.pathParams["doc_name"];
        console.log("doc name:" + tempName);
        let tempPath = this.$javalin.pathParams["doc_path"];
        console.log("doc path:" + tempPath);
        if (tempName != null) {
            this.docName = tempName;
        }
        if (tempPath != null) {
            this.docName = tempPath + "/" + this.docName;
        }
        this.fetchDbData(this.docName);

        // this.$nextTick(() => {
        //     window.mermaid.init(undefined, '.mermaid');
        //     console.log("try to init mermaid.");
        // });
    },
    data() {
        return {
            docName: "main",
            docPath: '',
            docCnt: "",
            dialogVisible: false,
        };
    },
    methods: {
        renderMarkdownAsHtml(text) {
            let xx2 = {
                renderer: {
                    code: function (code) {
                        if (code.lang == 'mermaid') {
                            return `<pre class="mermaid">${code.text}</pre>`;
                        }
                        else {
                            return `<pre>${code.text}</pre>`;
                        }
                    },
                }
            };

            marked.use(xx2);
            tt = marked.parse(text);
            // console.log(tt);

            return tt;
        },

        fetchDbData() {
            let url = "/docs/" + this.docName + '.md';
            console.log(url);
            axios.get(url).then((response) => {
                let markdown = response.data;
                this.docCnt = this.renderMarkdownAsHtml(markdown);
                this.renderMermaid();
            });
        },
        renderMermaid() {
            this.$nextTick(() => {
                window.mermaid.run(undefined, '.mermaid');
                console.log("try to init mermaid.");
            });
        },

        formatTime(timestamp) {
            return timestampToString(timestamp);
        },


    },
    template: "#doc-detail"
};

app.component("doc-detail", DocDetail);
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

.infoBox {
    margin: 5px 0px 5px 0px;
    padding: 10px 10px 10px 10px;
    background-color: #F2F6FC;
}



.feature-card {
    text-align: center;
    padding: 0px;
    transition: transform 0.3s;
    margin-bottom: 10px;
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
    margin: 10px -5px 20px -5px;
    line-height: 20px;
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

.myMarkDown table {
    font-size: 10pt;
    table-layout: fixed;
    word-wrap: break-word;
    word-break: break-all;
    white-space: nowrap;
}

.myMarkDown {
    width: 680px !important;
    font-size: 11pt;
}

.mdImgDiv{
	background: #f6f8fa; /* GitHub代码块同款背景色 */
	padding: 8px;
	border-radius: 6px;
	border: 1px solid #e1e4e8;
	margin: 1em 0;
	text-align: center;
}
</style>
