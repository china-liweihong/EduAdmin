<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <question-type-nav :id="subjectId"></question-type-nav>
      <div class="flex_1 m-t-20">
        <el-table :data="taskExamList" border style="width: 100%" ref="refElTabel" height="100%">
          <el-table-column prop="Id" label="ID" width="80"></el-table-column>
          <el-table-column prop="Label" label="组卷名称"></el-table-column>
          <el-table-column prop="Examtime" label="考试时间(分)" width="120"></el-table-column>
          <el-table-column prop="State" label="组卷状态" width="100">
            <template slot-scope="scope">
              <el-tag v-show="scope.row.State==1">上架</el-tag>
              <el-tag type="info" v-show="scope.row.State==0">下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="editTaskExam(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="warning"
                @click="openExamQuestionListDialog(scope.$index, scope.row)"
              >关联考题</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-15">
        <div>
          <el-button type="primary" @click="addTaskExam">新增作业组卷</el-button>
        </div>
        <el-pagination
          background
          @current-change="currentPageChange"
          :current-page.sync="nowPage"
          :page-size="rows"
          layout="total,prev, pager, next, jumper"
          :total="allRows"
        ></el-pagination>
      </div>
    </div>

    <div>
      <!-- 修改编辑 -->
      <exam-form ref="refExamForm" @subClick="updateExamData"></exam-form>
      <!-- 关联题库弹窗 -->
      <my-dialog
        :visible.sync="examRelevantQuestionDialog"
        
        
        :title="currentTaskExamRow.Label"
      >
        <div slot="right_content">
          <related-questions ref="refRelatedQuestions" @subClick="updateExamRow"></related-questions>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import questionTypeNav from "@/views/course/question/component/questionTypeNav";
import relatedQuestions from "@/views/course/question/component/relatedQuestions";
import examForm from "@/views/course/question/component/examForm";
import { getExerciseByBookChapter} from "@/api/exercise";
export default {
  name: "mockExam",
  components: {
    myDialog,
    relatedQuestions,
    questionTypeNav,
    examForm
  },
  data() {
    return {
      // 科目ID
      subjectId: "",
      // 组卷-数据总条数
      allRows: 0,
      // 组卷-当前页数
      nowPage: 1,
      // 组卷-每页数据的总条
      rows: 10,
      // 作业组卷的数据
      taskExamList: [],
      // 单条作业组卷数据
      currentTaskExamRow: {},
      // 当前编辑作业组卷的索引
      currentTaskExamIndex: null,
      // 关联题库模态框
      examRelevantQuestionDialog: false
    };
  },
  methods: {
    // 获取具体章节的组卷
    async getExerciseByTaskExam() {
      let urlParams = this.subjectId + "/" + 5;
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getExerciseByBookChapter(urlParams, {
        limit: this.rows,
        offset: offsetRow
      });
      if (res.code == 200) {
        this.taskExamList = res.data ? res.data : [];
        this.allRows = res.title;
      }
    },
    // 编辑作业组卷数据
    editTaskExam(index, row) {
      this.currentTaskExamRow = {};
      this.currentTaskExamRow = { ...row };
      this.currentTaskExamIndex = index;
      this.$refs.refExamForm.getFormData(row, "编辑作业组卷");
    },
    //添加作业组卷数据
    addTaskExam() {
      this.$refs.refExamForm.getFormData(
        {
          Id: 0,
          ExamKind: 5,
          ChapterId: this.subjectId.toString(),
          State: 1
        },
        "新增作业组卷"
      );
    },
    // 打开关联题库的模态框
    openExamQuestionListDialog(index, row) {
      this.currentTaskExamRow = { ...row };
      this.currentTaskExamIndex = index;
      this.$refs.refRelatedQuestions.getRow(row, this.subjectId);
      this.examRelevantQuestionDialog = true;
    },
    // 关联题库后更新数据
    updateExamRow(rowDate) {
      this.$set(this.taskExamList, this.currentTaskExamIndex, rowDate);
    },
    // 新增或编辑之后更新table列表,type=1新增，type=0编辑
    updateExamData(type, rowDate) {
      if (type == 0) {
        this.$set(this.taskExamList, this.currentTaskExamIndex, rowDate);
      } else if (type == 1) {
        this.taskExamList.unshift(rowDate);
      }
    },
    // 作业组卷-分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getExerciseByTaskExam();
    }
  },
  mounted() {
    this.subjectId = this.$route.query.Id;
    this.getExerciseByTaskExam();
    setTimeout(() => {
      this.$refs.refElTabel.doLayout();
    }, 2000);
  }
};
</script>
<style scope >
</style>