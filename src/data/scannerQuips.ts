const scannerQuips = [
  '仪器已收到你的拍打，正在假装认真工作。',
  '扫描仪对拍打不敏感。',
  '本仪器不提供人工服务。',
  '检测到用户试图与设备建立情感联系。',
  '正在与随机数协商，请勿催促天意。',
  '仪器运行正常，是现实运行得不太正常。',
  '你正在与一台并不存在的设备互动。',
  '校准无法通过重复点击完成。',
  '咖啡因信号良好，科研气场正在缓冲。',
  '该操作已被记入仪器日志。',
]

const nicknameQuips = [
  '二旬老人接入成功，请把保温杯放稳。',
  '论文在逃人员已归位，随机数正在假装没看见。',
  '实验室常驻嘉宾，你的玄学工位已续期。',
]

export function getScannerQuip(
  previous: string | null,
  nicknameEnabled = true,
): string {
  const messages = nicknameEnabled
    ? [...scannerQuips, ...nicknameQuips]
    : scannerQuips

  const pool =
    previous === null
      ? messages
      : messages.filter(
          (item) => item !== previous,
        )

  return pool[
    Math.floor(Math.random() * pool.length)
  ]
}
