import { ref, computed } from 'vue'
import { type ModalType } from '@/shared/ui/modal/type/type'

interface UseNoteModalsParams {
  onDelete: () => Promise<void>
  onSaveRestore: () => Promise<void>
  onRejectRestore: () => Promise<void>
  onConfirmCancel: () => Promise<void>
  onConfirmEmptyDelete?: () => Promise<void>
}

export function useTodoModals({
  onDelete,
  onSaveRestore,
  onRejectRestore,
  onConfirmCancel,
  onConfirmEmptyDelete,
}: UseNoteModalsParams) {
  const activeModal = ref<ModalType>(null)

  const isModalOpen = computed({
    get: () => activeModal.value !== null,
    set: (val) => {
      if (!val) activeModal.value = null
    },
  })

  const modalConfig = computed(() => {
    switch (activeModal.value) {
      case 'delete':
        return {
          title: 'Удаление заметки',
          text: 'Вы действительно хотите удалить эту заметку? Это действие нельзя будет отменить.',
          cancelText: 'Отмена',
          confirmText: 'Да, удалить',
          action: onDelete,
          cancelAction: null,
        }
      case 'empty':
        return {
          title: 'Заметка пуста',
          text: 'Вы ничего не заполнили. При выходе эта пустая заметка будет удалена.',
          cancelText: 'Продолжить создание',
          confirmText: 'Удалить и выйти',
          action: onConfirmEmptyDelete ?? onDelete,
          cancelAction: null,
        }
      case 'cancel':
        return {
          title: 'Отменить редактирование?',
          text: 'У вас есть несохранённые изменения. Вы действительно хотите выйти без сохранения?',
          cancelText: 'Продолжить редактирование',
          confirmText: 'Выйти без сохранения',
          action: onConfirmCancel,
          cancelAction: null,
        }
      case 'restore':
        return {
          title: 'Несохранённые изменения',
          text: 'Найдены несохранённые данные с прошлого сеанса редактирования. Хотите сохранить их или сбросить?',
          cancelText: 'Сбросить изменения',
          confirmText: 'Сохранить изменения',
          action: onSaveRestore,
          cancelAction: onRejectRestore,
        }
      default:
        return null
    }
  })

  async function handleConfirm() {
    if (modalConfig.value?.action) {
      await modalConfig.value.action()
    }
    activeModal.value = null
  }

  async function handleCancel() {
    if (modalConfig.value?.cancelAction) {
      await modalConfig.value.cancelAction()
    }
    activeModal.value = null
  }

  return {
    activeModal,
    isModalOpen,
    modalConfig,
    handleConfirm,
    handleCancel,
  }
}
