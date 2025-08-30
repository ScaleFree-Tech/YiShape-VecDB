<template id="app-frame">



  <el-container style="border: 0px solid yellow;margin-top: -50px;width: 960px;">
    <el-header style="height: 90px;width:960px;margin-bottom: 0px;">
      <div class="header" style="text-align: left;margin-bottom: -15px;">

        <el-link href="/mag/" :underline="false">
          <img src="/logo.png" style="height: 60px;" title="回到首页=>" />
        </el-link>

        <div style="height:60px; line-height:60px;  overflow:hidden;margin-top: -60px;padding-left: 200px;border: 0px solid red;;">

          <el-tooltip class="item" effect="light" content="易形 寓意通过灵活、丰富的 空间变换，实现最优向量表征、向量索引与向量检索计算。"
            placement="right-start">
            <el-text type="primary" style="font-size: 20px;">
              向量数据库管理系统
            </el-text>
          </el-tooltip>
          <div style="float: right;border:0px solid green;height: 50px;padding-top: 35px;line-height: 30px;">
            <el-text style="vertical-align: bottom;;" size="small">管理员：</el-text>
            <el-text :type="ifLogin ? 'primary' : 'warning'" size="small">{{ admin.nickName }}（{{ admin.username }}）</el-text>
            &nbsp;&nbsp;
            <el-link href="/admin_logout" type="primary" title="退出登录" v-if="ifLogin">
              <el-text type="primary" size="small">
                退出登录
              </el-text>
            </el-link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-text style="vertical-align: bottom;;" size="small">当前计算设备：</el-text>
            <el-text :type="ifGPU ? 'success' : 'warning'" tag="b" size="small">{{ ifGPU ? 'GPU' : 'CPU' }}</el-text>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-link href="/user" target="_blank" type="primary" title="打开用户工作台">
              <el-text type="primary" size="small">
                YiShape Studio
              </el-text>
            </el-link>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </div>
      <el-divider />
    </el-header>

    <el-container style="width:960px;">
      <el-aside width="200px">
        <el-menu class="aside" :default-active="activeIndex" default-openeds="" :unique-opened="true">
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <Grid />
              </el-icon>
              <span>文本型向量库</span>
            </template>
            <el-menu-item index="text_db_introduce" onclick="location.href ='/mag/doc_detail/text_db_introduce'">文本库介绍</el-menu-item>
            <el-menu-item index="list_db" onclick="location.href ='/mag/list_db'">文本库列表</el-menu-item>

            <el-menu-item index="list_domainword_task2"
              onclick="location.href ='/mag/list_domainword_task2'">领域词汇识别</el-menu-item>
            <el-menu-item index="list_glove_task" onclick="location.href ='/mag/list_glove_task'">词向量训练</el-menu-item>
            <el-menu-item index="list_nlp_tool" onclick="location.href ='#'">NLP工具箱</el-menu-item>


          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <Bicycle />
              </el-icon>
              <span>自动化任务</span>
            </template>
            <el-menu-item index="list_chunk_task" onclick="location.href ='/mag/list_chunk_task'">文本块迭代任务</el-menu-item>
            <el-menu-item index="list_file_task" onclick="location.href = '/mag/list_file_task'">文件迭代任务</el-menu-item>

            <!--
            <el-menu-item index="function_call" onclick="location.href ='#'">Function Call</el-menu-item>
            -->
            <el-menu-item index="list_react_agent" onclick="location.href ='/mag/list_react_agent'">ReAct Agent</el-menu-item>
            <!--
            <el-menu-item index="plan_execute" onclick="location.href = '#'">Plan & Execute</el-menu-item>
            -->
            <el-menu-item index="list_agent_tool" onclick="location.href = '/mag/list_agent_tool'">Agent工具箱</el-menu-item>
          </el-sub-menu>


          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <Postcard />
              </el-icon>
              <span>图像&语音向量库</span>
            </template>
            <el-menu-item index="list_image_db" onclick="location.href ='/mag/list_image_db'">图像库列表</el-menu-item>
            <el-menu-item index="list_audio_db" onclick="location.href ='#'">音频库（开发中）</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <Coin />
              </el-icon>
              <span>自定义向量库</span>
            </template>
            <el-menu-item index="list_customized_db" onclick="location.href ='#'">向量库列表（开发中）</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="5">
            <template #title>
              <el-icon>
                <Histogram />
              </el-icon>
              <span>大模型配置</span>
            </template>
            <!--
            <el-menu-item index="21">YiShape</el-menu-item>
            -->
            <el-menu-item index="alter_ollama" onclick="location.href ='/mag/alter_ollama'">Ollama</el-menu-item>
            <el-menu-item index="alter_deepseek" onclick="location.href ='/mag/alter_deepseek'">DeepSeek</el-menu-item>
            <el-menu-item index="alter_qwen" onclick="location.href ='/mag/alter_qwen'">Qwen</el-menu-item>
            <el-menu-item index="alter_kimi" onclick="location.href ='/mag/alter_kimi'">Kimi</el-menu-item>
            <el-menu-item index="alter_chat_glm" onclick="location.href ='/mag/alter_chat_glm'">ChatGLM</el-menu-item>


            <el-menu-item index="llm_test" onclick="location.href ='/mag/llm_test'">大模型测试</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="6">
            <template #title>
              <el-icon>
                <Avatar />
              </el-icon>
              <span>API & App</span>
            </template>
            <!--
            <el-menu-item index="31">向量字典</el-menu-item>
            -->
            <el-menu-item index="alter_api_key" onclick="location.href ='/mag/alter_api_key'">API KEY</el-menu-item>
            <el-menu-item index="api_doc" onclick="location.href ='/mag/doc_detail/api/api_doc'">API调用</el-menu-item>
            <el-menu-item index="mobile_app" onclick="location.href ='#'">移动App（开发中）</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="7">
            <template #title>
              <el-icon>
                <Setting />
              </el-icon>
              <span>系统及其它</span>
            </template>
            <!--
            <el-menu-item index="31">向量字典</el-menu-item>
            -->
            <el-menu-item index="alter_admin_config" onclick="location.href ='/mag/alter_admin_config'">管理员设置</el-menu-item>
            <el-menu-item index="alter_config" onclick="location.href ='/mag/alter_config'">系统设置</el-menu-item>
            <el-menu-item index="doc_detail" onclick="location.href ='/mag/doc_detail/main'">使用文档</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container style="">
        <slot></slot>
      </el-container>

    </el-container>



    <el-footer>
      <el-divider></el-divider>
      <el-text class="mx-1" type="info" size="small">
        {{ this.copyright.version }} &nbsp; {{ this.copyright.copy }} <br />
        {{ this.copyright.statement }}
      </el-text>
      <br /><br />
    </el-footer>

  </el-container>




</template>


<script>

const AppFrame = {
  mounted() {
        this.requestData();
    },
  data() {
    return {
      message: "Hello Element Plus",
      activeIndex: this.getActive(),
      copyright: getCopyrightInfo(),
      ifGPU: false,
      admin: {username: 'admin', nickName: '管理员'},
      ifLogin: false,
    };
  },
  methods: {
    getActive() {
      let url = window.location.href;
      let ai = parseActiveIndex(url);
      // console.log(ai)
      return ai;
    },
    requestData() {
            let url = "/api/device";
            axios.get(url).then((response) => {
                let info = response.data;
                this.ifGPU = info.gpuNum>0;
                // console.log(this.ifGPU);
            });
            let url2 = "/api/get_login_admin";
            axios.get(url2).then((response) => {
                let as = response.data;
                this.admin = as.admin;
                this.ifLogin = as.ifLogin;
            });
        },
  },
  template: "#app-frame"
};

app.component("app-frame", AppFrame);
</script>

<style scoped></style>