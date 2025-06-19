<template id="user-frame">

<div style="margin-top: -50px;">

  <el-container style="width: 960px;margin: 0 auto;">
    <el-header style="height: 90px;width:960px;margin-bottom: 0px;">
      <div class="header" style="border: 0px solid green;text-align: left;margin-bottom: -15px;">
        
        <el-link href="/user/" :underline="false">
          <img src="/logo.png" style="height: 60px;" title="回到首页=>" />
        </el-link>

        <div style="height:60px; line-height:60px;  overflow:hidden;margin-top: -60px;padding-left: 200px;">
          <el-tooltip class="item" effect="light" content="易形 寓意通过灵活、丰富的 空间变换，实现最优向量表征、向量索引与向量检索计算。" placement="right-start">
          <el-text type="primary" style="font-size: 24px; font-weight: 500; letter-spacing: 2px; color: #409EFF; transition: all 0.3s ease;">
            向量数据库工作台
            </el-text>
          </el-tooltip>
        </div>
      </div>
      <el-divider />
    </el-header>

    <el-container style="width:960px;">

      <el-container style="width:100%;">
        <slot></slot>
      </el-container>
    </el-container>



    <el-footer>
      <el-divider></el-divider>
      <el-text class="mx-1" type="info" size="small">
        {{ this.copyright.version }} &nbsp; {{ this.copyright.copy }} <br />
        {{ this.copyright.statement }}
      </el-text>
      <br/><br/>
    </el-footer>
  </el-container>


</div>

</template>


<script>

const AppFrame = {
  data() {
    return {
      message: "Hello Element Plus",
      copyright: getCopyrightInfo(),
    };
  },
  methods: {
  },
  template: "#user-frame"
};

app.component("user-frame", AppFrame);
</script>
