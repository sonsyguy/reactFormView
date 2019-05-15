
import styles from './index.css';
import { Progress } from 'antd';

export default function() {
  return (
    <div className={styles.normal}>
       <div>
        <Progress percent={30} />
        <Progress percent={50} status="active" />
        <Progress percent={70} status="exception" />
        <Progress percent={100} />
        <Progress percent={50} showInfo={false} />
      </div>,
    </div>
  );
}
