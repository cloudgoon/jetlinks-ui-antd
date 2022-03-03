import { Gauge } from '@ant-design/charts';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import WebsocketTopic from '@/utils/topic';
import { useEffect, useState } from 'react';
import type { WebsocketPayload } from '@/hooks/websocket/typings';

const CPU = () => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const [value, setValue] = useState<number>(0);
  useEffect(() => {
    const cpuRealTime = subscribeTopic?.(
      WebsocketTopic.CPURealTime.id,
      WebsocketTopic.CPURealTime.topic,
      { params: { history: 1 } },
    )?.subscribe((data: WebsocketPayload) => {
      // +0.01为了解决0.00图表异常
      setValue(((data.payload.value as number) + 0.01) / 100);
    });
    return () => cpuRealTime?.unsubscribe();
  }, []);
  const config = {
    width: 200,
    height: 200,

    range: {
      ticks: [0, 1 / 3, 2 / 3, 1],
      color: ['#F4664A', '#FAAD14', '#30BF78'],
    },
    indicator: {
      pointer: { style: { stroke: '#D0D0D0' } },
      pin: { style: { stroke: '#D0D0D0' } },
    },
    statistic: {
      content: {
        style: {
          fontSize: '36px',
          lineHeight: '36px',
        },
      },
    },
  };
  return <Gauge {...config} percent={value} />;
};

export default CPU;