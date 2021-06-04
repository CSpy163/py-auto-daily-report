<template>
  <div id="app">
    <el-tooltip
      class="item"
      effect="dark"
      content="查看源码"
      placement="bottom"
    >
      <el-button
        style="position: absolute; right: 20px; top: 20px"
        type="info"
        icon="el-icon-help"
        @click="jumpToGitlab"
        circle
      ></el-button>
    </el-tooltip>
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

        <span style="float: right">{{ currentDate }}</span>
        <div
          style="display: flex; flex-direction: row; justify-content: center"
        >
          <span>《{{ renderedTitle }}.xlsx》</span>
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="titleConfigDialogVisible = true"
            style="color: grey"
            size="mini"
          ></el-button>
        </div>
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
              <el-button type="primary" @click="refreshTodo">待办</el-button>
              <el-button
                type="primary"
                :disabled="onlineData.oldReports.length == 0"
                @click="setHistoryData(0)"
                >往期</el-button
              >
            </el-button-group>
          </div>

          <el-button
            style="width: 80%; margin: 10px 10%"
            type="primary"
            @click="saveReportToOld"
            >保存</el-button
          >
          <el-button
            style="width: 80%; margin: 0 10%"
            type="primary"
            @click="downloadExcel"
            >下载</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 待办列表 -->
    <el-dialog
      title="待办列表"
      :visible.sync="todoDialogVisible"
      width="80%"
      center
    >
      <el-table :data="todoList" style="width: 100%">
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
            <el-button @click="todoInEdit(scope.row)" type="text" size="small"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 往期查看 -->
    <el-dialog
      title="往期查看"
      :visible.sync="historyDialogVisible"
      width="80%"
      center
    >
      <el-table :data="historyTableData" style="width: 100%">
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
      </el-table>
      <el-input
        type="textarea"
        v-model="historyData.bigProblem"
        disabled
      ></el-input>
      <el-input
        type="textarea"
        v-model="historyData.nextDayWork"
        disabled
      ></el-input>
      <div slot="footer" style="display: flex">
        <el-button-group>
          <el-button
            type="primary"
            :disabled="historyIndex <= 0"
            icon="el-icon-arrow-left"
            @click="setHistoryData(-1)"
            >上一个</el-button
          >
          <el-button type="primary" :disabled="atEnd" @click="setHistoryData(1)"
            >下一个<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-button-group>
      </div>
    </el-dialog>

    <!-- Excel 标题配置 -->
    <el-dialog
      title="日报标题配置"
      :visible.sync="titleConfigDialogVisible"
      width="40%"
      center
    >
      <el-form label-width="100px" style="padding-right: 80px">
        <el-form-item label="日报标题">
          <el-input clearable v-model="onlineData.title"></el-input>
        </el-form-item>
        <el-form-item label="格式化">
          <el-switch
            v-model="onlineData.momented"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
          >
          </el-switch>
          <span style="color: grey; float: right"
            >格式化语法具体参考moment.js</span
          >
        </el-form-item>
        <el-form-item label="显示效果">
          <el-input clearable v-model="renderedTitle"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 填写日报弹窗 -->
    <el-dialog title="日报" :visible.sync="logDialogVisible" width="60%" center>
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
// 日期框架
const moment = require("moment");
moment.locale("zh-cn");
// xlsx-style
const xlsxStyle = require("xlsx-style");
// saveAs
import { saveAs } from "file-saver";
// 获取 WorkBook 对象
const getWbObj = require("./utils/report");

// 格式化时间
function formatDate(date) {
  if (!(date instanceof Date)) return "";
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

// 转 bit array
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export default {
  data() {
    return {
      // 待办列表
      todoDialogVisible: false,
      todoList: [],
      // 历史弹窗
      historyDialogVisible: false,
      historyTableData: [],
      historyData: {
        plans: [],
        createDate: "",
        bigProblem: "",
        nextDayWork: "",
      },
      historyIndex: 0,
      // 配置导出文件名弹窗
      titleConfigDialogVisible: false,
      // 任务类型
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
      // 任务完成状态
      states: ["完成", "未完成", "暂停", "即将完成", "遇到问题"],
      // 日报弹窗时间选择控件
      logTimeRange: [],
      // 重大问题
      bigProblem: "",
      // 下个工作日工作
      nextDayWork: "",
      // 记录日志弹窗
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
        // 是否使用 moment 渲染
        momented: false,
        // 往期日报
        oldReports: [
          // {
          //   plans: [
          //     {
          //       beginDate: "",
          //       endDate: "",
          //       name: "",
          //       mainWork: "",
          //       type: "",
          //       state: "",
          //       problem: "",
          //       solution: "",
          //     },
          //   ],
          //   bigProblem: "",
          //   nextDayWork: "",
          //   creatTime: "",
          // },
        ],
      },
      // 本地是否有数据，决定显示登录页还是注册页
      hasData: false,
      // plans 正在编辑的下标
      editing: -1,
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
    // 渲染之后的标题
    renderedTitle() {
      let tmpTitle = this.onlineData.title.replace(
        /\${user}/g,
        this.onlineData.username
      );
      if (this.onlineData.momented) {
        // moment.js 处理过的 title
        return moment().format(tmpTitle);
      } else {
        return tmpTitle;
      }
    },
    currentDate() {
      return moment().format("ll");
    },
    atEnd() {
      if (this.onlineData.oldReports) {
        return this.historyIndex >= this.onlineData.oldReports.length - 1;
      }
      return true;
    },
  },
  watch: {
    // 监听日报选择时间范围
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
    jumpToGitlab() {
      window.open("https://git.cspy.online/cspy/py-auto-daily-report");
    },
    // todo 转 编辑
    todoInEdit(row) {
      this.todoDialogVisible = false;
      setTimeout(() => {
        this.editLog({ row });
      }, 200);
    },
    // 刷新待办
    refreshTodo() {
      this.todoList.splice(0);
      this.onlineData.oldReports.forEach((oldReport) => {
        oldReport.plans.forEach((plan) => {
          if (plan.beginDate || plan.endDate) {
            if (
              (!plan.endDate && moment().isSameOrAfter(plan.beginDate)) ||
              (moment().isSameOrAfter(plan.beginDate) &&
                moment().isSameOrBefore(plan.endDate)) ||
              (!plan.beginDate && moment().isSameOrBefore(plan.endDate))
            ) {
              this.todoList.push(plan);
            }
          }
        });
      });
      this.todoDialogVisible = true;
    },
    // 展示历史数据面板
    setHistoryData(index) {
      this.historyIndex += index;
      if (this.historyIndex < 0) this.historyIndex = 0;
      if (this.historyIndex > this.onlineData.oldReports.length - 1)
        this.historyIndex = this.onlineData.oldReports.length - 1;
      let report = this.onlineData.oldReports[this.historyIndex];
      this.historyTableData.splice(0);
      this.historyTableData.push(...report.plans);
      this.historyData.bigProblem = report.bigProblem;
      this.historyData.nextDayWork = report.nextDayWork;
      this.historyDialogVisible = true;
    },
    // 保存到 localStorage
    saveToLocalData() {
      let localData = {
        username: this.onlineData.username,
        title: this.onlineData.title,
        momented: this.onlineData.momented,
        oldReports: this.onlineData.oldReports,
      };
      // 加密保存
      let localDataAES = CryptoJS.AES.encrypt(
        JSON.stringify(localData),
        this.loginForm.password
      ).toString();
      localStorage.setItem("localData", localDataAES);
      this.$message({
        message: "消息保存至缓存成功。",
        type: "success",
      });
    },
    // 保存当前数据到历史记录
    saveReportToOld() {
      let report = {
        plans: [...this.tableData],
        bigProblem: this.bigProblem,
        nextDayWork: this.nextDayWork,
        creatTime: new Date(),
      };
      this.onlineData.oldReports.push(report);
      // this.historyData.push(report)
      this.saveToLocalData();
    },
    // 下载当前填写的日报
    downloadExcel() {
      let wopts = { bookType: "xlsx", bookSST: false, type: "binary" };
      let wbObj = getWbObj(
        this.onlineData.username,
        moment().format("ll"),
        this.tableData,
        this.bigProblem,
        this.nextDayWork
      );
      let wb = {
        SheetNames: ["工作日志"],
        Sheets: { 工作日志: wbObj },
      };
      let wbout = xlsxStyle.write(wb, wopts);

      /* the saveAs call downloads a file on the local machine */
      saveAs(
        new Blob([s2ab(wbout)], { type: "" }),
        `${this.renderedTitle ? this.renderedTitle : "工作日志"}.xlsx`
      );
    },
    // 删除日报
    deleteLog(index) {
      this.tableData.splice(index, 1);
    },
    // 编辑
    editLog(scope) {
      this.showLogDialog("", scope.row);
      this.editing = scope.$index;
    },
    // 保存日报到表格
    saveLogToTable() {
      // 如果是正在编辑，则删除原有数据
      if (this.editing >= 0) {
        this.tableData.splice(this.editing, 1);
        this.editing = -1;
      }
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
    // 清空日报表单
    clearLogForm() {
      this.logTimeRange = "";
      this.logDialogForm.name = "";
      this.logDialogForm.mainWork = "";
      this.logDialogForm.type = "";
      this.logDialogForm.state = "";
      this.logDialogForm.problem = "";
      this.logDialogForm.solution = "";
    },
    // 弹出日报框
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
        this.onlineData.title = localData.title;
        this.onlineData.momented = localData.momented;
        this.onlineData.oldReports = localData.oldReports;
      } catch (err) {
        this.$message.error("发生错误，请刷新界面重试！");
      }
    },
    // 保存本地数据，第一次注册时
    register() {
      // 设置初始化数据
      let localData = {
        username: this.registerForm.username,
        title: "",
        momented: false,
        oldReports: [],
      };
      // 设置需要用到的数据
      this.onlineData.username = this.registerForm.username;
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
