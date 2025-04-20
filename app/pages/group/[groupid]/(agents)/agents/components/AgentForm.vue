<script setup lang="ts">
import { personalData } from '~/mock/knowledge-base'

// 创建副本
const visible = ref(false)
const form = ref({
  name: '',
  dataSource: 0, // 默认选择第一个选项
})

// 添加当前步骤状态
const currentStep = ref(1)

// 数据源选项
const dataSourceOptions = [
  { label: useNuxtApp().$i18n.t('agents.form.data_source_options.current_space'), value: 0 },
  { label: useNuxtApp().$i18n.t('agents.form.data_source_options.llm_native'), value: 1 },
]

// 处理步骤导航
function nextStep() {
  currentStep.value++
}

function prevStep() {
  currentStep.value--
}

// 处理取消操作
function handleCancel() {
  currentStep.value = 1
  visible.value = false
}

// 创建助手
function createAssistant() {
  // 这里添加创建助手的逻辑
  visible.value = false
  currentStep.value = 1
}

// 处理选中节点
const checkedKeys = ref<string[]>([])
function handleCheckChange(_checkedKeys: string[]) {
  checkedKeys.value = _checkedKeys
}

defineExpose({
  open() {
    visible.value = true
    currentStep.value = 1
  },
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="currentStep === 1 ? $t('agents.form.step1_title') : $t('agents.form.step2_title')"
    width="675"
    :show-close="false"
    align-center
  >
    <!-- 第一步：配置智能助手名称和选择数据源 -->
    <div v-if="currentStep === 1" mt-32px>
      <el-form :model="form" size="large">
        <el-form-item label-position="left" label-width="91px">
          <template #label>
            <img w-51px src="@/assets/img/avatar2.png" alt="avatar">
          </template>
          <el-input v-model="form.name" class="h-51px !text-20px" :placeholder="$t('agents.form.enter_name')" />
        </el-form-item>

        <el-form-item :label="$t('agents.form.select_data_source')" label-position="top" class="mb-0 mt-60px">
          <el-radio-group v-model="form.dataSource" class="mt-10px flex gap-100px pl-33px">
            <el-radio v-for="option in dataSourceOptions" :key="option.value" :label="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <!-- 第二步：选择数据范围 -->
    <div v-if="currentStep === 2" h-420px flex>
      <div h-35px w-154px flex items-center whitespace-nowrap rounded-4px bg-primary pl-13px text-white>
        <SvgoFolder2 text-20px />
        <span flex-1 text-center>{{ $t('agents.form.knowledge_base') }}</span>
      </div>

      <el-divider direction="vertical" class="h-full" />

      <div flex-1>
        <div class="pure-doc-tree-container" p="r-20px b-24px l-20px" h-410px w-full overflow-y-auto rounded-4px>
          <div text-16px text-tprimary>
            {{ $t('agents.form.selected_items', { count: checkedKeys.length }) }}
          </div>
          <!-- 使用ClientOnly包裹，解决勾选后，Tree组件被重新渲染的问题 -->
          <ClientOnly>
            <DocTree :data="personalData" :checkable="true" :checkbox-visible="true" @check-change="handleCheckChange" />
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- 对话框底部按钮区域 -->
    <template #footer>
      <div class="dialog-footer">
        <template v-if="currentStep === 1">
          <el-button plain @click="handleCancel">
            {{ $t('knowledge_base.cancel') }}
          </el-button>
          <el-button type="primary" @click="nextStep">
            {{ $t('login.next_step') }}
          </el-button>
        </template>

        <template v-if="currentStep === 2">
          <el-button plain @click="prevStep">
            {{ $t('agents.form.prev_step') }}
          </el-button>
          <el-button type="primary" @click="createAssistant()">
            {{ $t('agents.form.create') }}
          </el-button>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-form) {
  .el-input {
    .el-input__inner {
      color: #000;
    }
  }

  .el-form-item__label {
    font-size: 20px;
  }

  .el-radio {
    .el-radio__input {
      &:not(.is-checked) {
        .el-radio__inner {
          background-color: #c9cdd4;
        }
      }
    }
    .el-radio__inner {
      border: none;
      width: 18px;
      height: 18px;
      &::after {
        display: none;
      }
    }
    .el-radio__label {
      font-size: 20px;
      padding-left: 18px;
    }
  }
}
.knowledge-base-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6a0080;
  color: white;
  border: none;
}

.file-selection {
  flex: 1;
  border-left: 1px solid #eee;
  padding-left: 20px;
}

.selected-count {
  margin-bottom: 15px;
  font-size: 14px;
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

:deep(.el-divider--vertical) {
  height: 100%;
  margin: 0 8px;
}
</style>
