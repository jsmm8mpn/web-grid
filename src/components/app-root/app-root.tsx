import { Component, h } from '@stencil/core';
import {
  WebGridConfig,
  WebGridLoadOptions
} from '../web-grid/web-grid.interface';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false
})
export class AppRoot {

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

  // render() {
  //   return (
  //     <div>
  //       <header>
  //         <h1>Web components</h1>
  //       </header>
  //
  //       <main>
  //         <stencil-router>
  //           <stencil-route-switch scrollTopOffset={0}>
  //             <stencil-route url='/' component='app-home' exact={true} />
  //             <stencil-route url='/profile' component='app-profile' />
  //           </stencil-route-switch>
  //         </stencil-router>
  //       </main>
  //     </div>
  //   );
  // }

  render() {
    console.log('render app-root');
    return (<div class="web-grid-container">
        <web-grid config={this.gridConfig}></web-grid>
      </div>);


  }
}
