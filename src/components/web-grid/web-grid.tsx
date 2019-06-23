import {
  Component,
  Element,
  Prop,
  State,
  Watch,
  h
} from '@stencil/core';
import {
  WebGridColumn,
  WebGridConfig,
  WebGridLoadOptions
} from './web-grid.interface';

@Component({
  tag: 'web-grid',
  styleUrl: 'web-grid.css',
  shadow: false
})
export class WebGrid {
  @Prop() config: WebGridConfig;
  @Element() host: HTMLElement;
  @State() data: any[];
  total: number = 0;
  sortColumn: WebGridColumn;
  sortDir: 'asc' | 'desc';
  page: number = 1;
  pageSize: number = 20;

  @Watch('config')
  dataDidChangeHandler() {
    console.log('config was set');
    if (this.config.data) {
      this.data = this.config.data;
    } else if (this.config.dataSource) {
      this.loadData();
      this.initDrag();
    }
  }

  componentDidLoad() {
    console.log('comp did load');
    if (!this.config) {
      return;
    }
    if (this.config.data) {
      this.data = this.config.data;
    } else if (this.config.dataSource) {
      this.loadData();
      this.initDrag();
    }
  }

  initDrag() {
    // blah
    // let dragging: boolean = false;
    // let startWidth = 0;
    // //let startX = 0;
    //
    // const handles = this.host.shadowRoot.querySelectorAll('.web-grid-column-handle');
    // for (let i = 0; i < handles.length; i++) {
    //   const handle = handles.item(i);
    //   handle.addEventListener('mousedown', () => {
    //     dragging = true;
    //     const columnOne = handle.parentElement;
    //     startWidth = columnOne.clientWidth;
    //     //startX = event.clientX;
    //     const moveListenerFn = (event: MouseEvent) => {
    //       console.log('move: ' + event.movementX);
    //       columnOne.setAttribute('style', 'width: ' + (startWidth + event.movementX) + 'px');
    //       startWidth += event.movementX;
    //     };
    //     document.addEventListener('mousemove', moveListenerFn);
    //     document.addEventListener('mouseup', () => {
    //       dragging = false;
    //       document.removeEventListener('mousemove', moveListenerFn);
    //     });
    //   });
    // }
    //
    // if (dragging) {
    //
    // }

  }

  // initDrag() {
  //   console.log(this.host);
  //   console.log(this.host.shadowRoot.querySelector('.web-grid-header'));
  //
  //   const header = this.host.shadowRoot.querySelector('.web-grid-header');
  //   header.addEventListener('dragover', (event: DragEvent) => {
  //     event.preventDefault();
  //     event.dataTransfer.dropEffect = 'none';
  //   });
  //
  //
  //   const columnOne = this.host.shadowRoot.querySelector('.web-grid-column:first-child');
  //
  //   let startX = 0;
  //   let startWidth = 0;
  //   const handles = this.host.shadowRoot.querySelectorAll('.web-grid-column-handle');
  //   for (let i = 0; i < handles.length; i++) {
  //     const handle = handles.item(i);
  //     handle.addEventListener('dragstart', (event: DragEvent) => {
  //       console.log('drag start');
  //       startWidth = columnOne.clientWidth;
  //       startX = event.clientX;
  //       event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
  //     });
  //
  //     handle.addEventListener('dragend', () => {
  //       console.log('drag end');
  //     });
  //
  //     handle.addEventListener('drag', (event: DragEvent) => {
  //       columnOne.setAttribute('style', 'width: ' + (startWidth + (event.clientX - startX)) + 'px');
  //       console.log('drag');
  //     });
  //   }
  // }

  loadData() {
    this.data = null;
    let options: WebGridLoadOptions = {
      page: this.page,
      pageSize: this.pageSize,
      done: (data: any, total?: number) => {
        this.data = data;
        this.total = total;
      }
    };
    if (this.sortColumn) {
      options.sort = {column: this.sortColumn.name, dir: this.sortDir};
    }
    this.config.dataSource.load(options);
  }

  columnClicked(column: WebGridColumn) {
    if (column === this.sortColumn) {
      if (this.sortDir === 'asc') {
        this.sortDir = 'desc';
      } else {
        this.sortDir = null;
        this.sortColumn = null;
      }
    } else {
      this.sortColumn = column;
      this.sortDir = 'asc';
    }
    this.loadData();
  }

  prevPage() {
    this.page--;
    this.loadData();
  }

  nextPage() {
    this.page++;
    this.loadData();
  }

  goToPage(page: number) {
    this.page = page;
    this.loadData();
  }

  sortIndicator(column: WebGridColumn) {
    if (this.sortColumn === column) {
      if (this.sortDir === 'asc') {
        return (<div class="web-grid-column-sort">^</div>)
      } else {
        return (<div class="web-grid-column-sort web-grid-column-sort-desc">^</div>)
      }
    }
  }

  columnHandle(index: number) {
    if (index < this.config.columns.length - 1) {
      return (
        <div class="web-grid-column-handle"></div>
      )
    }
  }

  columns() {
    return this.config.columns.map((column, index) => {
      return (
        <div class="web-grid-column">
          <div class="web-grid-column-label" onClick={() => this.columnClicked(column)}>
            {column.label}3 {this.sortIndicator(column)}
          </div>
          {
            this.columnHandle(index)
          }
        </div>
      )
    });
  }

  rows() {
    if (this.data) {
      return this.data.map((row) => {
        return (
          <div class="web-grid-row">
            {
              this.cells(row)
            }
          </div>
        )
      });
    } else {

    }
  }

  cells(row: any) {
    return this.config.columns.map((column) => {
      return (
        <div class="web-grid-cell">
          {row[column.name]}
        </div>
      )
    });
  }

  pagerButton(pageNumber: number, icon?: string) {
    const totalPages = Math.ceil(this.total / this.pageSize);
    const disabled = icon && (pageNumber === this.page || pageNumber < 1 || pageNumber > totalPages);
    const active = !icon && pageNumber === this.page;

    return (
      <button class={'web-grid-pager-button' + (active?' active':'')} data-page={pageNumber} disabled={disabled} onClick={this.goToPage.bind(this, pageNumber)}>{icon || pageNumber}</button>
    )
  }

  pagerButtons() {
    const totalPages = Math.ceil(this.total / this.pageSize);
    let minPage = Math.max(this.page - 2, 1);
    let maxPage = minPage + 4;
    if (maxPage > totalPages) {
      maxPage = totalPages;
      minPage = Math.max(maxPage - 4, 1);
    }
    const buttons = [];
    for (let i = minPage; i <= maxPage; i++) {
      buttons.push(this.pagerButton(i));
    }

    return buttons;
  }

  pager() {
    const totalPages = Math.ceil(this.total / this.pageSize);
    return (
      <div class="web-grid-pager">
        {
          this.pagerButton(1, '<<')
        }
        {
          this.pagerButton(this.page - 1, '<')
        }
        {
          this.pagerButtons()
        }
        {
          this.pagerButton(this.page + 1, '>')
        }
        {
          this.pagerButton(totalPages, '>>')
        }
      </div>
    )
  }

  render() {
    if (this.config) {
      if (this.data) {
        return <div class="web-grid">
          <div class="web-grid-table-wrapper">
            <div class="web-grid-table">
              <div class="web-grid-header">
                {
                  this.columns()
                }
              </div>
              <div class="web-grid-content">
                {
                  this.rows()
                }
              </div>
            </div>
          </div>

          {
            this.pager()
          }
        </div>;
      } else {
        return <div class="web-grid">
          <div class="web-grid-table-wrapper">
            <div class="web-grid-table">
              <div class="web-grid-header">
                {this.columns()}
              </div>
            </div>
            <div class="spinner-container">
              <div class="spinner-wrapper">
                <div class="spinner"></div>
              </div>
            </div>
          </div>
          {
            this.pager()
          }
        </div>;
      }

    } else {
      return <div>No Config</div>;
    }
  }
}
