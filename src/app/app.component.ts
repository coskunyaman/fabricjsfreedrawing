import {Component, OnInit} from '@angular/core';

// @ts-ignore
import * as fromFabric from 'fabric-with-gestures';
import {ComponentGroup} from './componentgroup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  canvas: fromFabric.fabric.Canvas;
  gridSize: number = 10;
  downX: number = 0;
  downY: number = 0;

  upX: number = 0;
  upY: number = 0;
  selected: any;
  title = 'fabricjsfreedrawing';
  canvasHeight = 600;
  canvasWidth = 800;

  ngOnInit() {

    this.canvas = new fromFabric.fabric.Canvas('canvas', {
      // backgroundColor: '#c0ddff'
    });
    this.canvas.setHeight(this.canvasHeight);
    this.canvas.setWidth(this.canvasWidth);

    this.canvas.on('mouse:down', (event: any) => {
      this.downX = event.pointer.x - (event.pointer.x % this.gridSize);
      this.downY = event.pointer.y - (event.pointer.y % this.gridSize);
    });
    this.canvas.on('mouse:up', (event: any) => {
      this.upX = event.pointer.x - (event.pointer.x % this.gridSize);
      this.upY = event.pointer.y - (event.pointer.y % this.gridSize);
      if (!event.target && this.downX > 0 && this.downY > 0 && this.upX > 0 && this.upY > 0 &&
        (this.upX - this.downX) > 0 && (this.upY - this.downY) > 0) {

        const cg = new ComponentGroup();
        cg.type = this.selected;
        cg.left = this.downX;
        cg.top = this.downY;
        cg.width = (this.upX - this.downX);
        cg.height = (this.upY - this.downY);
        cg.text = 'label';
        cg.viewongrid = true;
        this.addComponent(cg);
      }
    });

    this.canvas.on('object:moving', (options: any) => {
      options.target.set({
        left: Math.round(options.target.left / this.gridSize) * this.gridSize,
        top: Math.round(options.target.top / this.gridSize) * this.gridSize
      });
    });
  }

  addComponent(componentGroup: ComponentGroup) {
    if (componentGroup.type === 'rectangle') {
      this.canvas.add(this.getRectangle(componentGroup.left, componentGroup.top, componentGroup.width, componentGroup.height, 3));
    } else if (componentGroup.type === 'circle') {
      this.canvas.add(this.getCircle(componentGroup.left, componentGroup.top, componentGroup.width, componentGroup.height));
    } else if (componentGroup.type === 'line') {
      this.canvas.add(this.getLine(componentGroup.left, componentGroup.top, componentGroup.width, componentGroup.height));
    } else if (componentGroup.type === 'text') {
      this.canvas.add(this.getText(componentGroup.left, componentGroup.top, componentGroup.width, componentGroup.height));
    }
  }

  getRectangle(left: number, top: number, width: number, height: number, radius: number) {
    return new fromFabric.fabric.Rect({
      left: left, top: top, width: width, height: height,
      fill: 'white', stroke: 'black', strokeWidth: 0.2, rx: radius, ry: radius, objectCaching: false,
    });
  }

  getCircle(left: number, top: number, width: number, height: number) {
    return new fromFabric.fabric.Circle({
      radius: width / 2,
      left: left,
      top: top,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 0.2
    });
  }

  getLine(left: number, top: number, width: number, height: number) {
    return new fromFabric.fabric.Line([
      left, top, left + width, top + height
    ], {
      fill: 'white', stroke: 'black', strokeWidth: 0.2,
    });
  }

  getText(left: number, top: number, width: number, height: number) {
    return new fromFabric.fabric.Text('Text', {
      left: left,
      top: top,
      fill: 'black',
      fontSize: 15
    });
  }
}
