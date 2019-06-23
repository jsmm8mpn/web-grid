import { Component, h } from '@stencil/core';
import {
  WebGridConfig,
  WebGridLoadOptions
} from '../web-grid/web-grid.interface';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: false
})
export class AppHome {

  gridConfig: WebGridConfig = {
    columns: [{
      label: 'One',
      name: 'one'
    },{
      label: 'Two',
      name: 'two'
    }, {
      label: 'Three',
      name: 'three'
    }],
    dataSource: {
      load: (options) => {
        setTimeout(() => {
          options.done(this.getData(options), 83);
        }, 500);
      }
    },
    listeners: {
      load: () => {
        // do something
      }
    }
  };

  getData(options: WebGridLoadOptions) {
    var data = [];
    for (let i = 0; i < 83; i++) {
      data.push({
        one: 'value ' + i,
        two: new Date().toISOString(),
        three: Math.floor(Math.pow(Math.random() * 10, Math.random() * 10))
      });
    }

    if (options.sort) {
      console.log('has sort');
      var dir = options.sort.dir;
      var field = options.sort.column;
      if (dir === 'asc') {
        data.sort(function (a, b) {
          if (typeof a[field] == "number") {
            return (a[field] - b[field]);
          } else {
            return ((a[field] < b[field]) ? -1 : ((a[field] > b[field]) ? 1 : 0));
          }
        });
      } else {
        data.sort(function (a, b) {
          if (typeof a[field] == "number") {
            return (b[field] - a[field]);
          } else {
            return ((b[field] < a[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0));
          }
        });
      }
    }
    return data.slice((options.page-1) * options.pageSize, (options.page * options.pageSize));
  }

  render() {
    // return (
    //   <div class="web-grid-container">
    //     <web-grid config={this.gridConfig}></web-grid>
    //   </div>
    // );
    return (

      <div><my-component first="matt" last="nienow"></my-component></div>
    );

    // return (
    //   <div>Hello world2</div>
    // );
  }
}
