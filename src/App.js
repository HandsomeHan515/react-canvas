import React, { Component } from 'react';
import img from './images/1.jpg';

class App extends Component {
  constructor(props) {
    super(props);
    this.startTime = 0
    this.current = []
    this.moveMem = []
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.getOffsetTL(this.btn)
  }

  getOffsetTL = obj => {
    var l = 0,
      t = 0;
    while (obj) {
      l = l + obj.offsetLeft + obj.clientLeft;
      t = t + obj.offsetTop + obj.clientTop;
      obj = obj.offsetParent;
    }
    console.log('l: %o, t: %o', l, t);
    return { left: l, t: t };
  }

  getCursorPosition = e => {
    const { top, left } = this.canvas.getBoundingClientRect();
    const x = e.clientX - left, y = e.clientY - top;
    return { x, y }
  }

  //默认画笔事件--start
  onMouseDown = e => {
    e.preventDefault()
    // 清空数组
    this.current.splice(0, this.current.length)
    this.isDrawing = true
    //涂鸦开始的时间
    this.startTime = new Date().getTime()
    const { x, y } = this.getCursorPosition(e)
    let delta = 0
    this.ctx.beginPath()
    this.current = [{ x, y, delta }]
  }

  onMouseMove = e => {
    e.preventDefault()
    if (!this.isDrawing) return
    const { x, y } = this.getCursorPosition(e)
    //鼠标移动距离开始的时间
    const delta = new Date().getTime() - this.startTime
    //画笔画路径
    this.ctx.lineTo(x, y)
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'
    this.ctx.lineWidth = 10
    this.ctx.strokeStyle = 'red'
    this.ctx.stroke()
    const curPos = { x, y, delta }
    this.current.push(curPos)
  }

  onMouseUp = e => {
    e.preventDefault()
    this.ctx.closePath()
    const current = this.current.slice()
    this.moveMem.push(current)
    console.log('this.moveMem', this.moveMem, JSON.stringify(this.moveMem))
    this.isDrawing = false
  }

  drawPoint = (x, y, isBegining = false) => {
    isBegining ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y)
    this.ctx.stroke()
  }

  back = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath()
    this.ctx.lineWidth = 12
    this.ctx.strokeStyle = 'red'
    this.ctx.fillStyle = 'red'

    const start = new Date().getTime()
    let lineIndex = 0
    let pointIndex = 0

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      if (lineIndex === this.moveMem.length) {
        clearInterval(this.timer)
        return false
      }

      if (pointIndex === this.moveMem[lineIndex].length) {
        lineIndex++
        pointIndex = 0
        return false
      }

      const point = this.moveMem[lineIndex][pointIndex]
      if (!point) {
        clearInterval(this.timer)
        return false
      }

      if (new Date().getTime() - start >= point.delta) {
        this.drawPoint(point.x, point.y, pointIndex === 0)
        pointIndex++
      }
    }, 10)
  }

  render() {
    return (
      <div style={{ width: document.body.clientWidth, height: 1000, background: 'url(' + img + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', }}>
        <div ref={btn => this.btn = btn} style={{ display: 'block' }} onClick={this.back}>back</div>
        <canvas
          ref={canvas => this.canvas = canvas}
          width={document.body.clientWidth}
          height="1000"
          style={{ background: '#000', opacity: .3, cursor: 'pointer' }}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseOut={null}
        />
      </div>
    );
  }
}

export default App;
