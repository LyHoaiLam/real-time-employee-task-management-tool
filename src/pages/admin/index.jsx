import { useState } from 'react';
import { Menu } from 'antd';
import ManageEmployee from '../../components/ManageEmployee/ManageEmployee';

const items = [
  { key: '1', label: 'Manage Employee' },
  { key: '2', label: 'Manage Task' },
  { key: '3', label: 'Message' },
]

export default function Admin() {
  const [selectedKey, setSelectedKey] = useState('1')

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  }

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <ManageEmployee />;
      case '2':
        return <div>Manage Task</div>;
      case '3':
        return <div>Message</div>
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Menu
        onClick={handleMenuClick}
        selectedKeys={[selectedKey]}
        mode="inline"
        theme="light"
        items={items}
        style={{ width: 256, textAlign: 'left' }}
      />
      <div style={{ padding: '16px', flex: 1 }}>
        {renderContent()}
      </div>
    </div>
  )
}
