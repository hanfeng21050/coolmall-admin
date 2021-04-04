<template>
  <div>
    <el-upload
      action="http://coolmall-oss.oss-cn-hangzhou.aliyuncs.com"
      :data="dataObj"
      list-type="picture-card"
      :multiple="true"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { policy } from './policy'
import { getUUID } from '@/utils'
export default {
  name: 'MultiUpload',
  props: {
    // 图片属性数组
    value: Array,
    // 最大上传图片数量
    maxCount: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: '',
        uuid: ''
      },
      dialogVisible: false,
      dialogImageUrl: null,
      // upload 中的文件列表 fileList不可修改
      fileList: [],
      fileList2: [],
      keys: []
    }
  },
  computed: {
  },
  mounted() {},
  methods: {
    emitInput(fileList2) {
      const urls = fileList2.map((file) => {
        return file.url
      })
      this.$emit('input', urls)
    },
    handleRemove(file, fileList) {
      this.fileList2 = this.fileList2.filter((f) => {
        return f.uid !== file.uid
      })
      this.emitInput(this.fileList2)
    },
    handlePreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    beforeUpload(file) {
      console.log(file)
      const _self = this
      return new Promise((resolve, reject) => {
        policy()
          .then((response) => {
            // eslint-disable-next-line no-template-curly-in-string
            _self.dataObj.policy = response.data.policy
            _self.dataObj.signature = response.data.signature
            _self.dataObj.ossaccessKeyId = response.data.accessid
            // eslint-disable-next-line no-template-curly-in-string
            _self.dataObj.key = response.data.dir + getUUID() + '_${filename}'
            _self.dataObj.dir = response.data.dir
            _self.dataObj.host = response.data.host

            this.keys.push({
              uid: file.uid,
              // eslint-disable-next-line no-template-curly-in-string
              key: _self.dataObj.key
            })
            resolve(true)
          })
          .catch((err) => {
            console.log('出错了...', err)
          })
      })
    },
    handleUploadSuccess(res, file) {
      const key = this.keys[this.keys.findIndex((item) => item.uid === file.uid)].key
      console.log(key)
      this.fileList2.push({
        uid: file.uid,
        name: file.name,
        url:
          this.dataObj.host +
          '/' +
          // eslint-disable-next-line no-template-curly-in-string
          key.replace('${filename}', file.name)
      })
      this.emitInput(this.fileList2)
    },
    handleExceed(files, fileList) {
      this.$message({
        message: '最多只能上传' + this.maxCount + '张图片',
        type: 'warning',
        duration: 1000
      })
    }
  }
}
</script>
<style>
</style>

