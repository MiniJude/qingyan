<script setup>
import { ElMessage } from 'element-plus'
import LuckyExcel from 'luckyexcel'
import { useRoute } from 'vue-router'
import AIAssistant from '~/components/chat-bot/AIAssistant.vue'
import FileHeader from '../../components/FileHeader.vue'

const spaceStore = useSpaceStore()

function isFunction(val) {
  return getType(val) === 'Function'
}

function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

const route = useRoute()
const fileId = route.params.id
const isMaskShow = ref(false)
const jsonData = ref({})

// 根据文件ID查找文件信息
async function fetchFileInfo() {
  if (!spaceStore.currentSpace)
    return
  try {
    isMaskShow.value = true
    // 获取知识库数据
    const file = await $api(`/mock-api/knowledge-base/${fileId}`)
    if (file && file.fileUrl) {
      loadExcel(file.fileUrl, file.label)
    }
    else {
      isMaskShow.value = false
      ElMessage.error('找不到指定的Excel文件')
    }
  }
  catch (error) {
    isMaskShow.value = false
    console.error('获取文件信息失败', error)
    ElMessage.error('获取文件信息失败')
  }
}

function loadExcel(fileUrl, fileName) {
  LuckyExcel.transformExcelToLuckyByUrl(fileUrl, fileName, (exportJson, _luckysheetfile) => {
    if (exportJson.sheets === null || exportJson.sheets.length === 0) {
      ElMessage.error('无法读取Excel文件内容，目前不支持xls格式文件！')
      isMaskShow.value = false
      return
    }

    jsonData.value = exportJson
    isMaskShow.value = false

    isFunction(window?.luckysheet?.destroy) && window.luckysheet.destroy()
    window.luckysheet.create({
      container: 'luckysheet', // luckysheet is the container id
      showinfobar: false,
      data: exportJson.sheets,
      title: exportJson.info.name,
      userInfo: exportJson.info.name.creator,
    })
  })
}

// 初始化luckysheet，并在挂载后获取文件信息
onMounted(() => {
  luckysheet.create({
    container: 'luckysheet',
  })
  // 获取文件信息并加载Excel
  fetchFileInfo()
})
</script>

<template>
  <div class="p-30px" relative h-full flex flex-col gap-16px>
    <!-- 顶部区域 -->
    <FileHeader />

    <!-- 内容区域 -->
    <div relative h-full>
      <div id="luckysheet" />
      <div v-show="isMaskShow" id="tip">
        正在加载...
      </div>
    </div>

    <!-- AI助手组件 -->
    <AIAssistant />
  </div>
</template>

<style scoped lang="scss">
#uploadBtn {
  font-size: 16px;
}

#luckysheet {
  height: 100%;
}

#tip {
  position: absolute;
  z-index: 1000000;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
