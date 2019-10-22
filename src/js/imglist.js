import './hilo-standalone.js'
// 引入图片

let getImgList = () => {
  let winHeight = window.innerHeight > 1448 ? 1448 : window.innerHeight
  let delay = {}
  const getAnim = function(y, time) {
    return {
      play: y,
      animations: [
        [
          {
            y: y
          },
          {
            time: time || 1000,
            ease: Hilo.Ease.Quad.EaseOut
          }
        ]
      ]
    }
  }
  // 动画数据
  
  
  
  // 在imgList中加入动画数据
  const imgList = []
  return imgList
}
export { getImgList }
