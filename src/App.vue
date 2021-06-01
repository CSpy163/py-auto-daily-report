<template>
  <div id="app">
    <el-card v-show="onlineData.username == ''" class="hello-panel">
      <div slot="header">
        {{ hasData ? "你好，欢迎回来！" : "注册" }}
      </div>
      <el-form
        v-show="!hasData"
        :model="registerForm"
        label-width="100px"
        style="padding-right: 80px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input clearable v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="registerForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            show-password
            v-model="registerForm.confirmPassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%"
            type="primary"
            :disabled="
              !registerForm.username ||
              !registerForm.password ||
              registerForm.password != registerForm.confirmPassword
            "
            @click="register"
            >创建账号</el-button
          >
        </el-form-item>
      </el-form>
      <el-form
        v-show="hasData"
        :model="loginForm"
        label-width="100px"
        style="padding-right: 80px"
      >
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%"
            type="primary"
            :disabled="!loginForm.password"
            @click="loadData"
            >登录</el-button
          >
          <el-button
            style="float: right; color: red"
            type="text"
            @click="removeLocalData"
            >删除数据</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-show="onlineData.username != ''" class="work-panel">
      <div slot="header">
        <span>你好：「 {{ onlineData.username }} 」</span>

        <span style="float: right">{{ currentDateTime }}</span>
        <span style="display: block; text-align: center"
          >《{{
            onlineData.momented ? onlineData.title : momentedTitle
          }}》</span
        >
      </div>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column
              fixed
              type="index"
              label="序号"
              width="40"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="项目名称"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="beginDate"
              label="起始日期"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="endDate"
              label="终止日期"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="mainWork"
              label="主要工作内容"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="工作性质"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="state"
              label="任务完成情况"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="problem"
              label="问题点"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="solution"
              label="预想对策"
              width="200"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="editLog(scope)" type="text" size="small"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="deleteLog(scope.index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="重大问题说明"
            v-model="bigProblem"
          >
          </el-input>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="下一个工作日计划"
            v-model="nextDayWork"
          >
          </el-input>
          <div style="display: flex; margin-top: 10px">
            <el-button-group style="margin: auto">
              <el-button @click="showLogDialog" type="primary">添加</el-button>
              <el-button type="primary">待办</el-button>
              <el-button type="primary">往期</el-button>
            </el-button-group>
          </div>

          <el-button style="width: 80%; margin: 10px 10%" type="primary"
            >保存并下载</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 填写日志弹窗 -->
    <el-dialog title="日志" :visible.sync="logDialogVisible" width="60%" center>
      <el-form
        :model="logDialogForm"
        label-width="100px"
        style="padding-right: 80px"
      >
        <el-form-item label="日期选择" style="display: flex">
          <el-date-picker
            v-model="logTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="起始日期"
            end-placeholder="终止日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input clearable v-model="logDialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="主要工作内容" prop="mainWork">
          <el-input clearable v-model="logDialogForm.mainWork"></el-input>
        </el-form-item>
        <el-form-item label="工作性质" prop="type">
          <el-select
            v-model="logDialogForm.type"
            filterable
            allow-create
            default-first-option
            placeholder="选择工作性质"
          >
            <el-option
              v-for="item in types"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务完成情况" prop="state">
          <el-select
            v-model="logDialogForm.state"
            filterable
            allow-create
            default-first-option
            placeholder="选择任务完成情况"
          >
            <el-option
              v-for="item in states"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题点" prop="problem">
          <el-input clearable v-model="logDialogForm.problem"></el-input>
        </el-form-item>
        <el-form-item label="预想对策" prop="solution">
          <el-input clearable v-model="logDialogForm.solution"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="logDialogVisible = false">取消</el-button>
        <el-button @click="clearLogForm">清空</el-button>
        <el-button type="primary" @click="saveLogToTable">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 加密框架
const CryptoJS = require("crypto-js");
const moment = require("moment");
moment.locale("zh-cn");

// 格式化时间
function formatDate(date) {
  if (!(date instanceof Date)) return "";
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export default {
  data() {
    return {
      types: [
        "文档编写",
        "技术预研",
        "代码编写",
        "指导工作",
        "日常工作",
        "测试",
        "重构",
        "微调",
      ],
      states: ["完成", "未完成", "暂停", "即将完成", "遇到问题"],
      // 日志弹窗时间选择控件
      logTimeRange: [],
      bigProblem: "",
      nextDayWork: "",
      logDialogVisible: false,
      logDialogForm: {
        beginDate: "",
        endDate: "",
        name: "",
        mainWork: "",
        type: "",
        state: "",
        problem: "",
        solution: "",
      },
      // 在线数据
      onlineData: {
        username: "",
        title: "",
        momented: false,
        // 当前
        // plans: [
        //   {
        //     beginDate: "",
        //     endDate: "",
        //     name: "",
        //     mainWork: "",
        //     type: "",
        //     state: "",
        //     problem: "",
        //     solution: "",
        //   },
        // ],
        // 往期日报
        oldReports: [
          {
            plans: [
              {
                beginDate: "",
                endDate: "",
                name: "",
                mainWork: "",
                type: "",
                state: "",
                problem: "",
                solution: "",
              },
            ],
            bigProblem: "",
            nextDayWork: "",
            creatTime: "",
          },
        ],
      },
      // 本地是否有数据，决定显示登录页还是注册页
      hasData: false,
      // 注册表单
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
      },
      // 登录表单
      loginForm: {
        password: "",
      },
      // 表格数据
      tableData: [],
    };
  },
  computed: {
    // moment.js 处理过的 title
    momentedTitle() {
      let tmpTitle = this.onlineData.title.replace(
        "${user}",
        this.onlineData.username
      );
      return moment().format(tmpTitle ? tmpTitle : "ll");
    },
    // 返回当前年月日
    currentDateTime() {
      let date = new Date();
      return `${date.getFullYear()}年${
        date.getMonth() + 1
      }月${date.getDate()}日`;
    },
  },
  watch: {
    // 监听日志选择时间范围
    logTimeRange(newVal) {
      if (newVal) {
        this.logDialogForm.beginDate = newVal[0];
        this.logDialogForm.endDate = newVal[1];
      } else {
        this.logDialogForm.beginDate = "";
        this.logDialogForm.endDate = "";
      }
    },
  },
  methods: {
    // 删除日志
    deleteLog(index) {
      this.tableData.splice(index, 1);
    },
    // 编辑
    editLog(scope) {
      this.showLogDialog("", scope.row);
      this.tableData.splice(scope.index, 1)
    },
    // 保存日志到表格
    saveLogToTable() {
      this.tableData.push({
        name: this.logDialogForm.name,
        mainWork: this.logDialogForm.mainWork,
        type: this.logDialogForm.type,
        state: this.logDialogForm.state,
        problem: this.logDialogForm.problem,
        solution: this.logDialogForm.solution,
        beginDate: formatDate(this.logDialogForm.beginDate),
        endDate: formatDate(this.logDialogForm.endDate),
      });
      this.logDialogVisible = false;
      this.clearLogForm();
    },
    // 清空日志表单
    clearLogForm() {
      this.logTimeRange = "";
      this.logDialogForm.name = "";
      this.logDialogForm.mainWork = "";
      this.logDialogForm.type = "";
      this.logDialogForm.state = "";
      this.logDialogForm.problem = "";
      this.logDialogForm.solution = "";
    },
    // 弹出日志框
    showLogDialog(event, row) {
      if (row) {
        this.logTimeRange = [new Date(row.beginDate), new Date(row.endDate)];

        this.logDialogForm.name = row.name;
        this.logDialogForm.mainWork = row.mainWork;
        this.logDialogForm.type = row.type;
        this.logDialogForm.state = row.state;
        this.logDialogForm.problem = row.problem;
        this.logDialogForm.solution = row.solution;
      }
      this.logDialogVisible = true;
    },
    // 加载数据
    loadData() {
      try {
        let result = CryptoJS.AES.decrypt(
          localStorage.getItem("localData"),
          this.loginForm.password
        );
        let localData = JSON.parse(result.toString(CryptoJS.enc.Utf8));

        // 开始展示功能
        this.onlineData.username = localData.username;
      } catch (err) {
        this.$message.error("发生错误，请刷新界面重试！");
      }
    },
    // 保存本地数据，第一次注册时
    register() {
      // 设置初始化数据
      let localData = {
        username: this.registerForm.username,
        titleRegex: "",
        plans: [],
        oldReports: [],
      };
      // 设置需要用到的数据
      this.onlineData.username = this.registerForm.username;
      // this.onlineData.plans.splice(0);
      this.loginForm.password = this.registerForm.password;

      // 加密保存
      let localDataAES = CryptoJS.AES.encrypt(
        JSON.stringify(localData),
        this.registerForm.password
      ).toString();
      localStorage.setItem("localData", localDataAES);
      this.loadData();
    },
    // 删除本地数据
    removeLocalData() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.setItem("localData", "");
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          location.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    // 先读取本地存储
    const localData = localStorage.getItem("localData");
    this.hasData = localData ? true : false;
  },
};
</script>

<style>
#app {
  height: 100vh;
  display: flex;
}

.hello-panel {
  margin: auto;
  width: 40%;
}
.work-panel {
  margin: auto;
  width: 80%;
  height: 80%;
}
</style>
