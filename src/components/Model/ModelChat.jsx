import { Modal, Input } from 'antd';

export default function ModelChat({ chatModalOpen,
  setChatModalOpen,
  chatMessage,
  setChatMessage,
  sendMessage
}) {
  return (
    <Modal
      title="Chat với nhân viên"
      open={chatModalOpen}
      onCancel={() => setChatModalOpen(false)}
      onOk={sendMessage}
      okText="Gửi"
      cancelText="Đóng"
    >
      <Input.TextArea
        rows={4}
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
      />
    </Modal>
  )
}
