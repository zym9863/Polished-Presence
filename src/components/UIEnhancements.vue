<template>
  <!-- 这个文件包含一些通用的UI增强组件 -->
  <div></div>
</template>

<script setup lang="ts">
// 通用UI增强组件
</script>

<style>
/* 全局UI增强样式 */

/* Element Plus 组件美化 */
.el-card {
  border: 1px solid var(--border-light) !important;
  box-shadow: var(--shadow-md) !important;
  transition: all var(--transition-normal) !important;
  border-radius: var(--radius-lg) !important;
  overflow: hidden;
  position: relative;
}

.el-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform var(--transition-normal);
  z-index: 1;
}

.el-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: var(--shadow-xl) !important;
  border-color: var(--primary-color) !important;
}

.el-card:hover::before {
  transform: scaleX(1);
}

.el-card__header {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%) !important;
  border-bottom: 1px solid var(--border-light) !important;
  padding: var(--space-lg) !important;
  position: relative;
  z-index: 2;
}

.el-card__body {
  padding: var(--space-lg) !important;
  position: relative;
  z-index: 2;
}

/* 按钮增强 */
.el-button {
  border-radius: var(--radius-md) !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: all var(--transition-normal) !important;
  position: relative;
  overflow: hidden;
  border: none !important;
}

.el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-slow);
}

.el-button:hover::before {
  left: 100%;
}

.el-button--primary {
  background: var(--primary-gradient) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

.el-button--primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
}

.el-button--success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.3) !important;
}

.el-button--success:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(67, 233, 123, 0.4) !important;
}

.el-button.is-text {
  background: transparent !important;
  color: var(--primary-color) !important;
  font-weight: 600 !important;
}

.el-button.is-text:hover {
  background: rgba(102, 126, 234, 0.1) !important;
  color: var(--primary-dark) !important;
}

/* 输入框增强 */
.el-input__wrapper {
  border-radius: var(--radius-md) !important;
  transition: all var(--transition-normal) !important;
  box-shadow: var(--shadow-sm) !important;
  border: 1px solid var(--border-color) !important;
}

.el-input__wrapper:hover {
  box-shadow: var(--shadow-md) !important;
  border-color: var(--primary-color) !important;
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  border-color: var(--primary-color) !important;
}

/* 选择框增强 */
.el-select-dropdown {
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-xl) !important;
  border: 1px solid var(--border-light) !important;
}

.el-select-dropdown__item {
  transition: all var(--transition-fast) !important;
  border-radius: var(--radius-sm) !important;
  margin: 2px var(--space-xs) !important;
}

.el-select-dropdown__item:hover {
  background: rgba(102, 126, 234, 0.1) !important;
  color: var(--primary-color) !important;
}

.el-select-dropdown__item.is-selected {
  background: var(--primary-gradient) !important;
  color: white !important;
}

/* 复选框和单选框增强 */
.el-checkbox__input.is-checked .el-checkbox__inner {
  background: var(--primary-gradient) !important;
  border-color: var(--primary-color) !important;
}

.el-radio__input.is-checked .el-radio__inner {
  background: var(--primary-gradient) !important;
  border-color: var(--primary-color) !important;
}

.el-radio__input.is-checked .el-radio__inner::after {
  background: white !important;
}

.el-checkbox__label,
.el-radio__label {
  font-weight: 500 !important;
  color: var(--text-secondary) !important;
}

.el-checkbox__input.is-checked + .el-checkbox__label,
.el-radio__input.is-checked + .el-radio__label {
  color: var(--primary-color) !important;
  font-weight: 600 !important;
}

/* 标签增强 */
.el-tag {
  border-radius: var(--radius-lg) !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  border: 1px solid !important;
  transition: all var(--transition-normal) !important;
}

.el-tag--success {
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%) !important;
  border-color: #43e97b !important;
  color: #22543d !important;
}

.el-tag--warning {
  background: linear-gradient(135deg, rgba(246, 173, 85, 0.1) 0%, rgba(237, 137, 54, 0.1) 100%) !important;
  border-color: #f6ad55 !important;
  color: #744210 !important;
}

/* 头像增强 */
.el-avatar {
  box-shadow: var(--shadow-md) !important;
  transition: all var(--transition-normal) !important;
  border: 2px solid var(--border-light) !important;
}

.el-avatar:hover {
  transform: scale(1.05) !important;
  box-shadow: var(--shadow-lg) !important;
  border-color: var(--primary-color) !important;
}

/* 菜单增强 */
.el-menu {
  border: none !important;
}

.el-menu-item {
  border-radius: var(--radius-md) !important;
  margin: var(--space-xs) var(--space-md) !important;
  transition: all var(--transition-normal) !important;
  font-weight: 500 !important;
  position: relative !important;
  overflow: hidden !important;
}

.el-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-slow);
}

.el-menu-item:hover::before {
  left: 100%;
}

.el-menu-item:hover {
  background: rgba(102, 126, 234, 0.1) !important;
  color: var(--primary-color) !important;
  transform: translateX(4px) !important;
}

.el-menu-item.is-active {
  background: var(--primary-gradient) !important;
  color: white !important;
  transform: translateX(8px) !important;
  box-shadow: var(--shadow-md) !important;
}

/* 进度条增强 */
.el-progress-bar__outer {
  border-radius: var(--radius-lg) !important;
  background: var(--bg-tertiary) !important;
}

.el-progress-bar__inner {
  border-radius: var(--radius-lg) !important;
  background: var(--primary-gradient) !important;
}

.el-progress-circle__track {
  stroke: var(--border-light) !important;
}

/* 消息增强 */
.el-message {
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-lg) !important;
  border: 1px solid !important;
  backdrop-filter: blur(10px) !important;
}

.el-message--success {
  background: rgba(67, 233, 123, 0.95) !important;
  border-color: #43e97b !important;
  color: white !important;
}

.el-message--warning {
  background: rgba(246, 173, 85, 0.95) !important;
  border-color: #f6ad55 !important;
  color: white !important;
}

.el-message--error {
  background: rgba(245, 101, 101, 0.95) !important;
  border-color: #f56565 !important;
  color: white !important;
}

.el-message--info {
  background: rgba(79, 172, 254, 0.95) !important;
  border-color: #4facfe !important;
  color: white !important;
}
</style>
