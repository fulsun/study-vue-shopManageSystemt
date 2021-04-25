<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="编辑商品信息"
        type="info"
        center
        show-icon
        :closable="true"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab 栏-->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :file-list="imgList"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headers"
              list-type="picture"
              :on-success="handleSuccessUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4" class="introduce">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 编辑按扭 -->
            <el-button type="primary" class="addGoodBtn" @click="add"
              >编辑商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" class="previewPic" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (Number.isInteger(Number(value)) && Number(value) > 0) {
        callback()
      } else {
        callback(new Error('请输入大于0的整数'))
      }
    }
    return {
      id: null,
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格,大于 0 且不能为负数',
            trigger: 'blur',
            validator: validateNum
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量,大于 0 且不能为负数',
            trigger: 'blur',
            validator: validateNum
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量,大于 0 且不能为负数',
            trigger: 'blur',
            validator: validateNum
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类,大于 0 且不能为负数',
            trigger: 'blur'
          }
        ]
      },
      // 商品列表
      cateList: [],
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 文件上传url
      uploadUrl: this.$http.defaults.baseURL + 'upload',
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览地址
      previewPath: '',
      dialogVisible: false,
      imgList: []
    }
  },
  created() {
    const url = this.$route.path.split('/')
    this.id = url[url.length - 1]
    this.getCateList()
    this.getGoodsInfo()
  },
  computed: {
    getCateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品的信息
    async getGoodsInfo() {
      const { data: res } = await this.$http.get('goods/' + this.id)
      const detail = res.data
      // 展示图片
      const tempics = detail.pics
      detail.pics = []
      if (tempics.length > 0) {
        tempics.forEach((item) => {
          this.imgList.push({
            url:
              'http://127.0.0.1:8888/tmp_uploads/' +
              item.pics_big_url.split('/goodspics/big_')[1],
            id: item.goods_id
          })
          detail.pics.push({
            pic: 'tmp_uploads/' + item.pics_big_url.split('/goodspics/big_')[1]
          })
        })
      }
      // 赋值
      this.addForm = { ...detail }
      // 回显分类
      this.addForm.goods_cat = detail.goods_cat
        .split(',')
        .map((item) => parseInt(item))
    },
    // 获取商品分类数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.cateList = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.error('只能选择三级的分类')
      }
    },
    beforeTabLeave(activeName, odlActiveName) {
      // 未选中商品分类阻止Tab标签跳转
      // if (
      //   odlActiveName === '0' &&
      //   (this.addForm.goods_name.trim() === '' ||
      //     this.addForm.goods_price <= 0 ||
      //     this.addForm.goods_weight <= 0 ||
      //     this.addForm.goods_number <= 0)
      // ) {
      //   this.$message.error('请按要求填写数据')
      //   return false
      // }
      if (odlActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // Tab标签被选中时触发
    async tabClicked() {
      // 访问动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览
    async handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    // 处理图片删除事件
    async handleRemove(file, fileList) {
      if (typeof file.response !== 'undefined') {
        const picIndex = this.addForm.pics.findIndex(
          (item) => item.pic === file.response.data.tmp_path
        )
        this.addForm.pics.splice(picIndex, 1)
      } else {
        const picIndex = this.addForm.pics.findIndex(
          (item) =>
            item.pic === 'tmp_uploads/' + file.url.split('/tmp_uploads/')[1]
        )
        this.addForm.pics.splice(picIndex, 1)
      }
    },
    // 监听图片上传成功
    handleSuccessUpload(res) {
      const picInfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    // 编辑商品
    add() {
      this.$refs.addFormRef.validate(async (validate) => {
        // 校验失败
        if (!validate) {
          this.$message.error('请先填写信息后重试!!!')
        } else {
          // 校验成功
          this.manyTableData.forEach((item) => {
            const temp = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(temp)
          })
          this.onlyTableData.forEach((item) => {
            const temp = {
              attr_id: item.attr_id,
              attr_value: item.attr_name
            }
            this.addForm.attrs.push(temp)
          })
          // 深克隆属性
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          // 发起编辑请求
          const { data: res } = await this.$http.put('goods/' + this.id, form)
          if (res.meta.status === 200) {
            this.$router.push('/goods')
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.previewPic {
  width: 100%;
}

.introduce {
  display: flex;
  flex-direction: column;
  align-items: center;

  .addGoodBtn {
    margin-top: 15px;
  }
}
</style>
