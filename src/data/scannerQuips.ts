const scannerQuips = [
  '请勿敲击仪器。',
  '扫描仪对拍打不敏感。',
  '本仪器不提供人工服务。',
  '检测到用户试图与设备建立情感联系。',
  '再点也不会变准。',
  '仪器运行正常，是现实运行得不太正常。',
  '你正在与一台并不存在的设备互动。',
  '校准无法通过重复点击完成。',
  '检测到轻微焦虑，尚未达到报警阈值。',
  '该操作已被记入仪器日志。',
]

export function getScannerQuip(
  previous: string | null,
): string {
  const pool =
    previous === null
      ? scannerQuips
      : scannerQuips.filter(
          (item) => item !== previous,
        )

  return pool[
    Math.floor(Math.random() * pool.length)
  ]
}
